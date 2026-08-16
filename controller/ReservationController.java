package com.example.sportTicket.controller;


import com.example.sportTicket.dto.response.ReservationResponse;
import com.example.sportTicket.entity.Reservation;
import com.example.sportTicket.service.CancellationService;
import com.example.sportTicket.service.ReservationService;
import com.example.sportTicket.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final UserService userService;
    private final CancellationService cancellationService;

    @Autowired
    public ReservationController(ReservationService reservationService, UserService userService, CancellationService cancellationService) {
        this.reservationService = reservationService;
        this.userService = userService;
        this.cancellationService = cancellationService;
    }

    @PostMapping("/new")
    public ResponseEntity<Boolean> createReservation(@AuthenticationPrincipal Jwt jwt, @RequestParam Long ticketId) {
        String email = jwt.getSubject();
        return ResponseEntity.ok(reservationService.createReservation(email, ticketId));
    }

    @GetMapping
    public Page<ReservationResponse> getReservations(@AuthenticationPrincipal Jwt jwt, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) throws Exception{
        Pageable pageable = PageRequest.of(page, size);
        String role = jwt.getClaim("role");
        String email = jwt.getSubject();
        return "support".equalsIgnoreCase(role) ? reservationService.getReservationsForAdmin(pageable) :  reservationService.getReservationsByUserId(email, pageable);
    }

    @PostMapping("/{reservationId}/cancel")
    public ResponseEntity<Map<String, String>> cancelReservation(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long reservationId) throws Exception {

        String email = jwt.getSubject();
        String role = jwt.getClaim("role");
        boolean isSupport = "support".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(role);

        Long userId = userService.getUserIdByEmail(email);
        String result = cancellationService.cancel(reservationId, userId, isSupport);

        return ResponseEntity.ok(Map.of("result", result));
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<ReservationResponse> getReservationById(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long reservationId) throws Exception {

        String email = jwt.getSubject();
        String role = jwt.getClaim("role");
        boolean isSupport = "support".equalsIgnoreCase(role);

        ReservationResponse reservation = reservationService.getReservationById(reservationId, email, isSupport);
        return ResponseEntity.ok(reservation);
    }

    @PostMapping("/{reservationId}/extend")
    public void extendReservation(@AuthenticationPrincipal Jwt jwt,@PathVariable Long reservationId, @RequestParam int minutes) throws Exception {
        String role = jwt.getClaim("role");
        if (!"support".equalsIgnoreCase(role)) {
            throw new Exception("Only support staff can access all reservations.");
        }
        reservationService.extendReservation(reservationId, minutes);
    }

    @PostMapping("/{reservationId}/confirm")
    public ResponseEntity<Boolean> confirmReservation(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long reservationId) throws Exception {

        if (!"support".equalsIgnoreCase(jwt.getClaim("role"))) {
            throw new Exception("Only support staff can access all reservations.");
        }
        boolean confirmed = reservationService.confirmReservationWithoutPayment(reservationId);
        return ResponseEntity.ok(confirmed);
    }

    @PostMapping("/by-ticket/{ticketId}/cancel")
    public ResponseEntity<Map<String, String>> cancelReservationByTicketId(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long ticketId) throws Exception {

        String email = jwt.getSubject();
        String role = jwt.getClaim("role");
        boolean isSupport = "support".equalsIgnoreCase(role) || "admin".equalsIgnoreCase(role);

        Long userId = userService.getUserIdByEmail(email);
        String result = cancellationService.cancelByTicketId(ticketId, userId, isSupport);

        return ResponseEntity.ok(Map.of("result", result));
    }

}
