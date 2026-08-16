package com.example.sportTicket.service;

import com.example.sportTicket.dao.TicketDao;
import com.example.sportTicket.dto.request.TicketFilterRequest;
import com.example.sportTicket.dto.response.TicketResponse;
import com.example.sportTicket.entity.Reservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {
    private final TicketDao ticketDao;
    private final TicketCacheService ticketCacheService;
    private final UserService userService;

    public TicketService(TicketDao ticketDao, TicketCacheService ticketCacheService, UserService userService) {
        this.ticketDao = ticketDao;
        this.ticketCacheService = ticketCacheService;
        this.userService = userService;
    }

    public Page<TicketResponse> getAllTickets(Pageable pageable) {
        String cacheKey = ticketCacheService.buildAllKey(pageable.getPageNumber(), pageable.getPageSize());
        List<TicketResponse> cached = ticketCacheService.getCachedList(cacheKey);
        long total = ticketDao.countAll();
        if (cached != null) {
            return new PageImpl<>(cached, pageable, total);
        }
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<TicketResponse> tickets = ticketDao.findAll(offset, pageable.getPageSize());
        ticketCacheService.cacheList(cacheKey, tickets);
        return new PageImpl<>(tickets, pageable, total);
    }

    public Page<TicketResponse> getMatchTickets(Pageable pageable, Long matchId) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<TicketResponse> tickets = ticketDao.findByMatchId(matchId, offset, pageable.getPageSize());
        long total = ticketDao.countAll();
        return new PageImpl<>(tickets, pageable, total);
    }

    public List<TicketResponse> getUserTickets(String email) {
        Long userId = userService.getUserIdByEmail(email);
        return ticketDao.findByUserId(userId);
    }

    public void releaseTicket(Long ticketId) {
        ticketDao.releaseTicket(ticketId);
        ticketCacheService.evictAllTicketCaches();
    }

    public Page<TicketResponse> searchTickets(String option, String value, Pageable pageable) {
        String cacheKey = ticketCacheService.buildSearchKey(
                option, value, pageable.getPageNumber(), pageable.getPageSize());
        List<TicketResponse> cached = ticketCacheService.getCachedList(cacheKey);
        long total = ticketDao.countSearch(option, value);
        if (cached != null) {
            return new PageImpl<>(cached, pageable, total);
        }
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<TicketResponse> tickets = ticketDao.search(option, value, offset, pageable.getPageSize());
        ticketCacheService.cacheList(cacheKey, tickets);
        return new PageImpl<>(tickets, pageable, total);
    }

    public TicketResponse getTicketDetails(Long ticketId) {
        return ticketDao.getTicketDetails(ticketId);
    }

    public Page<TicketResponse> getFilteredTickets(Pageable pageable, TicketFilterRequest ticketFilterRequest) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<TicketResponse> tickets = ticketDao.filteredSearch(ticketFilterRequest, offset, pageable.getPageSize());
        long total = ticketDao.countFilteredSearch(ticketFilterRequest);
        return new PageImpl<>(tickets, pageable, total);
    }

    public void updateStatus(Long ticketId, String status) {
        ticketDao.updateStatus(ticketId, status);
    }

    public void issueTicketForReservation(Reservation reservation) {
        ticketDao.assignToUser(reservation.getTicketId(), reservation.getUserId(), "sold");
        ticketCacheService.evictAllTicketCaches();
    }
}