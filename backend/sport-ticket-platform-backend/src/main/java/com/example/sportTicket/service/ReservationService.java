package com.example.sportTicket.service;

import com.example.sportTicket.dao.ReservationDao;
import com.example.sportTicket.dto.response.ReservationResponse;
import com.example.sportTicket.entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ReservationService {

    private final ReservationDao reservationDao;
    private final UserService userService;
    private final TicketService ticketService;
    private final TicketCacheService ticketCacheService;

    public ReservationService(ReservationDao reservationDao, UserService userService,
                              TicketService ticketService, TicketCacheService ticketCacheService) {
        this.reservationDao = reservationDao;
        this.userService = userService;
        this.ticketService = ticketService;
        this.ticketCacheService = ticketCacheService;
    }

    @Transactional
    public boolean createReservation(String email, Long ticketId) {
        Long userId = userService.getUserIdByEmail(email);
        boolean saved = reservationDao.save(ticketId, userId);
        if (saved) {
            ticketService.updateStatus(ticketId, "reserved");
            ticketCacheService.evictAllTicketCaches();
        }
        return saved;
    }

    public Page<ReservationResponse> getReservationsByUserId(String email, Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        Long userId = userService.getUserIdByEmail(email);
        List<ReservationResponse> reservations = reservationDao.findByUserId(userId, offset, pageable.getPageSize());
        long total = reservationDao.countByUserId(userId);
        return new PageImpl<>(reservations, pageable, total);
    }

    public Page<ReservationResponse> getReservationsForAdmin(Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<ReservationResponse> reservations = reservationDao.findAll(offset, pageable.getPageSize());
        long total = reservationDao.countAll();
        return new PageImpl<>(reservations, pageable, total);
    }

    @Transactional
    public void cancelReservation(Long reservationId, String email, boolean isSupport) throws Exception {
        Reservation reservation = reservationDao.findById(reservationId);
        Long requesterId = userService.getUserIdByEmail(email);

        if (reservation == null) {
            throw new NoSuchElementException("Reservation not found: " + reservationId);
        }
        if (!isSupport && !reservation.getUserId().equals(requesterId)) {
            throw new Exception("You can only cancel your own reservations.");
        }
        if (!isSupport && !"reserved".equalsIgnoreCase(reservation.getStatus())) {
            throw new IllegalStateException("This reservation cannot be cancelled.");
        }
        doCancel(reservationId, reservation.getTicketId());
    }

    @Transactional
    protected void doCancel(Long reservationId, Long ticketId) {
        reservationDao.updateStatus(reservationId, "cancelled");
        ticketService.releaseTicket(ticketId);
    }

    public void extendReservation(Long reservationId, int minutes) {
        LocalDateTime currentExpiresAt = reservationDao.getExpiresAt(reservationId);
        LocalDateTime newExpiresAt =  currentExpiresAt.plusMinutes(minutes);
        reservationDao.updateExpiresAt(
                reservationId,
                newExpiresAt
        );
    }



    @Transactional
    public boolean confirmReservationWithoutPayment(Long reservationId) {
        Reservation reservation = reservationDao.findById(reservationId);
        if (reservation == null) {
            throw new NoSuchElementException("Reservation not found: " + reservationId);
        }
        if (!"pending".equalsIgnoreCase(reservation.getStatus()) && !"reserved".equalsIgnoreCase(reservation.getStatus())) {
            throw new IllegalStateException("Only pending reservations can be confirmed");
        }
        reservationDao.updateStatus(reservationId, "confirmed");
        ticketService.issueTicketForReservation(reservation);
        return true;
    }

    public ReservationResponse getReservationById(Long reservationId, String email, boolean isSupport) throws Exception {
        ReservationResponse reservation = reservationDao.findResponseById(reservationId);
        if (reservation == null) {
            throw new NoSuchElementException("Reservation not found: " + reservationId);
        }
        if (!isSupport && !reservation.getUserEmail().equalsIgnoreCase(email)) {
            throw new Exception("You can only view your own reservation.");
        }
        return reservation;
    }
}