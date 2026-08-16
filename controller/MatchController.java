package com.example.sportTicket.controller;

import com.example.sportTicket.dto.response.MatchResponse;
import com.example.sportTicket.entity.MatchTable;
import com.example.sportTicket.service.MatchService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping
    public Page<MatchResponse> getMatches(@RequestParam(required = false) Long stadiumId,@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return stadiumId == null  ? matchService.getMatches(pageable) : matchService.getMatchesByStadiumId(stadiumId, pageable);
    }


}
