package com.example.sportTicket.entity;

import lombok.Data;

@Data
public class Ticket {
    private Long ticketId;
    private Long userId;
    private int sectionNumber;
    private String status;
    private Long ticketCategoryId;
    private Long matchId;
}