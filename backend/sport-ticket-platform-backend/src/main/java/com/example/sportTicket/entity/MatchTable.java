package com.example.sportTicket.entity;

import java.time.LocalDateTime;
import java.util.Date;

import lombok.Data;

@Data
public class MatchTable {
    private Long matchId;
    private Long sportId;
    private LocalDateTime matchDate;
    private String status;
    private Long homeTeamId;
    private Long awayTeamId;
    private Long stadiumId;
    private Long tournamentId;
    private Long leagueId;
}
