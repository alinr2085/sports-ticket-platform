package com.example.sportTicket.entity;

import lombok.Data;

@Data
public class Tournament {
    private Long tournamentId;
    private String tournamentName;
    private Long sportId;
}
