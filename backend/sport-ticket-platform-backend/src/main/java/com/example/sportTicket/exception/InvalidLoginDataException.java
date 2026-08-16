package com.example.sportTicket.exception;

import org.springframework.http.HttpStatus;


public class InvalidLoginDataException  extends ApiException {
    public InvalidLoginDataException() {
        super("Email or password is wrong", HttpStatus.UNAUTHORIZED); // 401
    }
}
