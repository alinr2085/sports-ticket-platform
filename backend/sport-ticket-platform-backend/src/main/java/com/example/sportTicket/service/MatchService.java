package com.example.sportTicket.service;

import com.example.sportTicket.dao.MatchDao;
import com.example.sportTicket.dto.response.MatchResponse;
import com.example.sportTicket.entity.MatchTable;
import com.example.sportTicket.entity.Stadium;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatchService {

    private final MatchDao matchDao;

    public MatchService(MatchDao matchDao) {
        this.matchDao = matchDao;
    }

    public Page<MatchResponse> getMatches(Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<MatchResponse> matches = matchDao.findAll(offset, pageable.getPageSize());
        long total = matchDao.countAll();
        return new PageImpl<>(matches, pageable, total);
    }

    public Page<MatchResponse> getMatchesByStadiumId(Long stadiumId, Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<MatchResponse> matches = matchDao.findByStadiumId(stadiumId, offset, pageable.getPageSize());
        long total = matchDao.countAll();
        return new PageImpl<>(matches, pageable, total);
    }


}
