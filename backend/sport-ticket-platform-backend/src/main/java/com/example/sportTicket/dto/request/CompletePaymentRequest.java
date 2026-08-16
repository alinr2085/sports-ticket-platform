package com.example.sportTicket.dto.request;

import lombok.Data;

@Data
public class CompletePaymentRequest {
    private String paymentIntentId;
}