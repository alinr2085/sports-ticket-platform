package com.example.sportTicket.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TicketResponse {
    private Long ticketId;
    private Long userId;
    private int sectionNumber;
    private String sportName;
    private String homeTeamName;
    private String awayTeamName;
    private String stadiumName;
    private String cityName;
    private LocalDateTime matchDate;
    private String status;
    private String ticketCategoryName;
    private Double price;
    private int remainingCapacity;
}
