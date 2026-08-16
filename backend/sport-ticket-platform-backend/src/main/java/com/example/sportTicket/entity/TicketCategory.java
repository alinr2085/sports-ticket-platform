package com.example.sportTicket.entity;
import lombok.Data;

@Data
public class TicketCategory {
    private Long ticketCategoryId;
    private String ticketCategoryName;
    private Double price;
    private int remainingCapacity;
    private Long matchId;
}
