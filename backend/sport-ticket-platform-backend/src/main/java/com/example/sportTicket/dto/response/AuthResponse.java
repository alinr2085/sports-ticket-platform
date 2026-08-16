package com.example.sportTicket.dto.response;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String firstName;
    private String lastName;
    private String role;
}
