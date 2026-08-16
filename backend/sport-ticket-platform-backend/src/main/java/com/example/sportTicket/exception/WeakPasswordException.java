package com.example.sportTicket.exception;

import com.example.sportTicket.exception.ApiException;
import org.springframework.http.HttpStatus;

public class WeakPasswordException extends ApiException {
    public WeakPasswordException() {
        super("Password is not strong enough", HttpStatus.BAD_REQUEST); // 400
    }
}
