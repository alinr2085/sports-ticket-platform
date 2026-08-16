package com.example.sportTicket.exception;

import org.springframework.http.HttpStatus;
import com.example.sportTicket.exception.ApiException;

public class UserNotFoundException extends ApiException {
    public UserNotFoundException() {
        super("User not found", HttpStatus.NOT_FOUND); // 404
    }
}
