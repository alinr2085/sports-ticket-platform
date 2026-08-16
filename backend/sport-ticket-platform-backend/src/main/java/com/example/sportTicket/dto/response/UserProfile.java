package com.example.sportTicket.dto.response;

import com.example.sportTicket.entity.City;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserProfile {

    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private City city;
}
