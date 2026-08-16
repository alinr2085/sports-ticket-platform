package com.example.sportTicket.dto.request;

import lombok.Data;

@Data
public class TicketFilterRequest {
    private Long ticketId;
    private String ticketType;
    private String sportType;
    private String startDate;
    private String endDate;
    private String minPrice;
    private String maxPrice;
}
