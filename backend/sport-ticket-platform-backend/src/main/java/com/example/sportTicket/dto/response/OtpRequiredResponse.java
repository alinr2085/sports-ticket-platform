package com.example.sportTicket.dto.response;

import lombok.Data;

@Data
public class OtpRequiredResponse {
    private String email;
    private String operation;
    private String code;
    private boolean otpSent;
    private long remainingSeconds;
}