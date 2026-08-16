package com.example.sportTicket.entity;

import java.time.LocalDate;
import java.util.Date;
import lombok.Data;
import org.springframework.cglib.core.Local;

@Data
public class User {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String hashedPassword;
    private Long cityId;
    private LocalDate dateOfBirth;
    private LocalDate registrationDate;
    private String accountStatus;
    private String role;
}
