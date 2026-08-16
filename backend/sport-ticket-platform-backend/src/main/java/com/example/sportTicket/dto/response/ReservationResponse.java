package com.example.sportTicket.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ReservationResponse {

    private Long reservationId;
    private String status;
    private LocalDateTime reservationDate;
    private LocalDateTime expiresAt;

    private Long ticketId;
    private String sportName;
    private String homeTeamName;
    private String awayTeamName;
    private String stadiumName;
    private LocalDateTime matchDate;
    private String ticketCategoryName;
    private double ticketPrice;
    private int sectionNumber;

    private Long userId;
    private String userEmail;
    private Long paymentId;
    private String paymentStatus;
    private Double paymentAmount;
}