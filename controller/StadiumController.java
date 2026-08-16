package com.example.sportTicket.controller;

import com.example.sportTicket.entity.Stadium;
import com.example.sportTicket.service.StadiumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stadiums")
public class StadiumController {

    private final StadiumService stadiumService;

    @Autowired
    public StadiumController(StadiumService stadiumService) {
        this.stadiumService = stadiumService;
    }

    @GetMapping
    public Page<Stadium> getStadiums(@RequestParam(required = false) Long cityId,
                                     @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return cityId == null ? stadiumService.getStadiums(pageable) : stadiumService.getCityStadiums(cityId, pageable);
    }

    @GetMapping("/stadium")
    public Stadium getStadiumById(@RequestParam Long id) throws Exception {
        return stadiumService.getStadium(id);
    }


}
