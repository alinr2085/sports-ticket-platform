package com.example.sportTicket.entity;

import com.example.sportTicket.enums.TypeOfSport;
import lombok.Data;

@Data
public class TicketDetails {
    private Long ticketId;
    private String tournamentName;
    private String leagueName;
    private String stadiumName;
    private String facilities;
}
