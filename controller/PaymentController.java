package com.example.sportTicket.controller;

import com.example.sportTicket.dto.request.CompletePaymentRequest;
import com.example.sportTicket.service.PaymentService;
import com.example.sportTicket.service.UserService;
import com.stripe.exception.StripeException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;

    public PaymentController(PaymentService paymentService, UserService userService) {
        this.paymentService = paymentService;
        this.userService = userService;
    }

    @PostMapping("/create-intent/{reservationId}")
    public Map<String, String> createIntent(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long reservationId) throws StripeException {

        Long userId = userService.getUserIdByEmail(jwt.getSubject());
        String clientSecret = paymentService.createPaymentIntent(reservationId, userId);
        return Map.of("client_secret", clientSecret);
    }

    @PutMapping("/complete/{reservationId}")
    public Map<String, Boolean> completePayment(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long reservationId,
            @RequestBody CompletePaymentRequest request) throws Exception {

        Long userId = userService.getUserIdByEmail(jwt.getSubject());
        boolean result = paymentService.completePayment(reservationId, userId, request.getPaymentIntentId());
        return Map.of("success", result);
    }
}