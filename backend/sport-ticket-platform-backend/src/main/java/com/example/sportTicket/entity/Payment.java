package com.example.sportTicket.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.stripe.model.PaymentMethod;
import lombok.Data;

@Data
public class Payment {

    private Long paymentId;
    private Long userId;
    private Long reservationId;
    private double amount;
    private String currency;
    private String method;
    private String status;
    private String transactionId;
    private LocalDateTime paymentDate;
    private LocalDateTime completedAt;
}