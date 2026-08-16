package com.example.sportTicket.service;

import com.example.sportTicket.dao.CancellationDao;
import com.example.sportTicket.dao.ReservationDao;
import com.example.sportTicket.entity.Cancellation;
import com.example.sportTicket.entity.Reservation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class CancellationService {

    private static final double PAID_CANCELLATION_PENALTY_PERCENT = 20.0;

    private final CancellationDao cancellationDao;
    private final ReservationDao reservationDao;
    private final TicketService ticketService;
    private final TicketCacheService ticketCacheService;

    public CancellationService(CancellationDao cancellationDao, ReservationDao reservationDao,
                               TicketService ticketService, TicketCacheService ticketCacheService) {
        this.cancellationDao = cancellationDao;
        this.reservationDao = reservationDao;
        this.ticketService = ticketService;
        this.ticketCacheService = ticketCacheService;
    }

    @Transactional
    public String cancel(Long reservationId, Long requesterId, boolean isSupport) throws Exception {
        Reservation reservation = reservationDao.findById(reservationId);
        if (reservation == null) {
            throw new NoSuchElementException("Reservation not found: " + reservationId);
        }
        if (!isSupport && !reservation.getUserId().equals(requesterId)) {
            throw new Exception("You can only cancel your own reservations.");
        }

        String status = reservation.getStatus();
        double price = reservationDao.getTicketPrice(reservationId);

        if (isSupport) {
            return doApprovedCancellation(reservation, price, 0.0, requesterId, "cancelled by support");
        }

        if ("reserved".equalsIgnoreCase(status)) {
            return doApprovedCancellation(reservation, price, 0.0, null, "cancelled before payment");
        }

        if ("confirmed".equalsIgnoreCase(status)) {
            Optional<Cancellation> existing = cancellationDao.findPendingByTicketId(reservation.getTicketId());
            if (existing.isPresent()) {
                throw new IllegalStateException("A cancellation request is already pending for this ticket.");
            }

            double refund = price * (1 - PAID_CANCELLATION_PENALTY_PERCENT / 100.0);

            Cancellation cancellation = new Cancellation();
            cancellation.setUserId(reservation.getUserId());
            cancellation.setTicketId(reservation.getTicketId());
            cancellation.setOriginalPrice(price);
            cancellation.setPenaltyPercent(PAID_CANCELLATION_PENALTY_PERCENT);
            cancellation.setRefundAmount(refund);
            cancellation.setStatus("pending");
            cancellation.setRequestDate(LocalDateTime.now());
            cancellationDao.insert(cancellation);

            return "pending_review";
        }

        throw new IllegalStateException("This reservation cannot be cancelled (status: " + status + ").");
    }

    @Transactional
    public void reviewCancellation(Long cancellationId, Long adminId, boolean approve) {
        Cancellation cancellation = cancellationDao.findById(cancellationId)
                .orElseThrow(() -> new NoSuchElementException("Cancellation request not found: " + cancellationId));

        if (!"pending".equalsIgnoreCase(cancellation.getStatus())) {
            throw new IllegalStateException("This request has already been reviewed.");
        }

        if (approve) {
            Reservation reservation = reservationDao.findByTicketId(cancellation.getTicketId());
            if (reservation != null) {
                reservationDao.updateStatus(reservation.getReservationId(), "cancelled");
            }
            ticketService.releaseTicket(cancellation.getTicketId());
            cancellationDao.updateReview(cancellationId, "approved", adminId);
        } else {
            cancellationDao.updateReview(cancellationId, "rejected", adminId);
        }
    }

    private String doApprovedCancellation(Reservation reservation, double price, double penaltyPercent,
                                          Long adminId, String note) {
        reservationDao.updateStatus(reservation.getReservationId(), "cancelled");
        ticketService.releaseTicket(reservation.getTicketId());

        Cancellation cancellation = new Cancellation();
        cancellation.setUserId(reservation.getUserId());
        cancellation.setTicketId(reservation.getTicketId());
        cancellation.setOriginalPrice(price);
        cancellation.setPenaltyPercent(penaltyPercent);
        cancellation.setRefundAmount(price * (1 - penaltyPercent / 100.0));
        cancellation.setStatus("approved");
        cancellation.setRequestDate(LocalDateTime.now());
        cancellation.setReviewedAt(LocalDateTime.now());
        cancellation.setReviewedByAdminId(adminId);
        cancellationDao.insert(cancellation);

        return "cancelled";
    }

    @Transactional
    public String cancelByTicketId(Long ticketId, Long requesterId, boolean isSupport) throws Exception {
        Reservation reservation = reservationDao.findByTicketId(ticketId);
        if (reservation == null) {
            throw new NoSuchElementException("No reservation found for ticket: " + ticketId);
        }
        return cancel(reservation.getReservationId(), requesterId, isSupport);
    }
}