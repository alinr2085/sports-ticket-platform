package com.example.sportTicket.exception;


import org.springframework.http.HttpStatus;
import com.example.sportTicket.exception.ApiException;


public class InvalidOtpException extends ApiException {
    public InvalidOtpException() {
        super("OTP is incorrect or expired", HttpStatus.BAD_REQUEST); // 400
    }
}
