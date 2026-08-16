package com.example.sportTicket.entity;

import java.time.LocalDateTime;
import java.util.Date;
import lombok.Data;

@Data
public class Reservation {

    private Long reservationId;
    private Long userId;
    private Long ticketId;
    private LocalDateTime reservationDate;
    private LocalDateTime expiresAt;
    private String status;
}
