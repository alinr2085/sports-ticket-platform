package com.example.sportTicket.entity;

import java.time.LocalDateTime;
import java.util.Date;
import lombok.Data;

@Data
public class Report {

    private Long reportId;
    private Long userId;
    private Long reservationId;
    private Long supportId;
    private String category;
    private String title;
    private String content;
    private String response;
    private LocalDateTime createTime;
    private LocalDateTime respondedAt;
    private String status;
}
