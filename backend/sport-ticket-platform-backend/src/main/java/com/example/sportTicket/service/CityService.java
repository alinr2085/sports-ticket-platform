package com.example.sportTicket.service;

import com.example.sportTicket.dao.CityDao;
import com.example.sportTicket.entity.City;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CityService {

    private final CityDao cityDao;

    public CityService(CityDao cityDoa) {
        this.cityDao = cityDoa;
    }

    public Page<City> getCities(Pageable pageable) {
        int offset = pageable.getPageNumber() * pageable.getPageSize();
        List<City> cities = cityDao.findAll(offset, pageable.getPageSize());
        long total = cityDao.countAll();

        return new PageImpl<>(cities, pageable, total);
    }

    public Long findOrCreateCity(String cityName) {
        Optional<Long> cityId = cityDao.findByCityName(cityName);
        if (cityId.isPresent()) {
            return cityId.get();
        }

        City city = new City();
        city.setCityName(cityName);
        cityDao.save(city);
        return city.getCityId();
    }

    public City findCityById(Long cityId) throws Exception {
        try {
            return cityDao.findById(cityId);
        } catch (Exception e) {
            throw new Exception("City Not Found");
        }
    }
}
