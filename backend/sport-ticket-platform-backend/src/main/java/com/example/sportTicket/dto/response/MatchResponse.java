package com.example.sportTicket.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MatchResponse {
    private Long matchId;
    private String sportName;
    private String homeTeamName;
    private String awayTeamName;
    private String stadiumName;
    private String leagueOrTournamentName;
    private LocalDateTime matchDate;
    private String status;
}
