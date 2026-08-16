package com.example.sportTicket.controller;

import com.example.sportTicket.service.CancellationService;
import com.example.sportTicket.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cancellations")
public class CancellationController {

    private final CancellationService cancellationService;
    private final UserService userService;

    public CancellationController(CancellationService cancellationService, UserService userService) {
        this.cancellationService = cancellationService;
        this.userService = userService;
    }

    @PostMapping("/{cancellationId}/review")
    public void review(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long cancellationId,
            @RequestParam boolean approve) {

        Long adminId = userService.getUserIdByEmail(jwt.getSubject());
        cancellationService.reviewCancellation(cancellationId, adminId, approve);
    }
}