package com.example.sportTicket.exception;

import org.springframework.http.HttpStatus;
import com.example.sportTicket.exception.ApiException;

public class DuplicatedEmailException extends ApiException {
    public DuplicatedEmailException(String email) {
        super("Email already exists: " + email, HttpStatus.CONFLICT);
    }
}
