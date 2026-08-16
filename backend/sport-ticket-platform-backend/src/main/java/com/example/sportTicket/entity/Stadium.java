package com.example.sportTicket.entity;

import lombok.Data;

@Data
public class Stadium {
    private Long stadiumId;
    private String stadiumName;
    private Long cityId;
    private int capacity;
}
