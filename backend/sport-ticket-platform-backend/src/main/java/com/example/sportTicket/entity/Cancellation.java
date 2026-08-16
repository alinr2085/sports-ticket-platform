package com.example.sportTicket.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class Cancellation {

    private Long cancellationId;
    private Long userId;
    private Long ticketId;

    private double originalPrice;
    private double penaltyPercent;
    private double refundAmount;

    private String status;
    private LocalDateTime requestDate;
    private LocalDateTime reviewedAt;
    private Long reviewedByAdminId;
}