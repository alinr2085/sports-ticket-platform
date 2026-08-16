package com.example.sportTicket.service;

import com.example.sportTicket.dao.StadiumDao;
import com.example.sportTicket.entity.City;
import com.example.sportTicket.entity.Stadium;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StadiumService {

    private final StadiumDao stadiumDao;

    public StadiumService(final StadiumDao stadiumDao) {
        this.stadiumDao = stadiumDao;
    }

    public Page<Stadium> getStadiums(Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<Stadium> stadiums = stadiumDao.findAll(offset, pageable.getPageSize());
        long total = stadiumDao.countAll();
        return new PageImpl<>(stadiums, pageable, total);
    }

    public Page<Stadium> getCityStadiums(Long cityId, Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<Stadium> stadiums = stadiumDao.findByCity(cityId, offset, pageable.getPageSize());
        long total = stadiumDao.countAll();
        return new PageImpl<>(stadiums, pageable, total);
    }

    public Stadium getStadium(Long id) throws Exception {
        try {
            return stadiumDao.findById(id);
        } catch (Exception e) {
            throw new Exception("Stadium Not Found");
        }
    }

}
