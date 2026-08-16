package com.example.sportTicket.controller;

import com.example.sportTicket.dto.request.TicketFilterRequest;
import com.example.sportTicket.dto.response.TicketResponse;
import com.example.sportTicket.entity.Ticket;
import com.example.sportTicket.entity.TicketDetails;
import com.example.sportTicket.service.TicketService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketService ticketService;


    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public Page<TicketResponse> getTickets(@RequestParam(required = false) Long matchId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return matchId == null ? ticketService.getAllTickets(pageable) : ticketService.getMatchTickets(pageable, matchId);
    }

    @GetMapping("/user")
    public List<TicketResponse> getUserTickets(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getSubject();
        return ticketService.getUserTickets(email);
    }

    @GetMapping("/search/{option}")
    public Page<TicketResponse> searchTickets(@PathVariable String option,@RequestParam String value,  @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ticketService.searchTickets(option,value, pageable);
    }

    @PostMapping("/filter")
    public Page<TicketResponse> filteredTickets(@RequestBody TicketFilterRequest ticketFilterRequest, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ticketService.getFilteredTickets(pageable, ticketFilterRequest);
    }


    @GetMapping("/details")
    public TicketResponse getTicketDetails(@RequestParam Long ticketId) {
        return ticketService.getTicketDetails(ticketId);
    }
}
