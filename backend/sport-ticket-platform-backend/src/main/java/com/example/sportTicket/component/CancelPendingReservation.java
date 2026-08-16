package com.example.sportTicket.component;

import com.example.sportTicket.dao.ReservationDao;
import com.example.sportTicket.dao.TicketDao;
import com.example.sportTicket.service.TicketCacheService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Component
public class CancelPendingReservation {

    private final ReservationDao reservationDao;
    private final TicketDao ticketDao;
    private final TicketCacheService ticketCacheService;

    public CancelPendingReservation(ReservationDao reservationDao, TicketDao ticketDao, TicketCacheService ticketCacheService) {
        this.reservationDao = reservationDao;
        this.ticketDao = ticketDao;
        this.ticketCacheService = ticketCacheService;
    }

    @Scheduled(fixedRate = 30 * 1000)
    public void cleanupExpiredReservations() {
        List<Long> expiredReservationIds = reservationDao.findExpiredReservationIds();

        for (Long reservationId : expiredReservationIds) {
            expireOne(reservationId);
        }

        if (!expiredReservationIds.isEmpty()) {
            ticketCacheService.evictAllTicketCaches();
        }
    }

    @Transactional
    public void expireOne(Long reservationId) {
        Long ticketId = reservationDao.getTicketId(reservationId);
        reservationDao.expireReservation(reservationId);
        ticketDao.updateStatus(ticketId, "available");
    }
}