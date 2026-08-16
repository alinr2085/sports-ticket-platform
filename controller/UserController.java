package com.example.sportTicket.controller;

import jakarta.validation.Valid;

import com.example.sportTicket.dto.request.LoginRequest;
import com.example.sportTicket.dto.request.SignUpRequest;
import com.example.sportTicket.dto.response.AuthResponse;
import com.example.sportTicket.dto.response.OtpRequiredResponse;
import com.example.sportTicket.dto.response.UserProfile;
import com.example.sportTicket.service.OTPService;
import com.example.sportTicket.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final OTPService otpService;

    @Autowired
    public UserController(UserService userService, OTPService otpService) {
        this.userService = userService;
        this.otpService = otpService;
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<OtpRequiredResponse> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        return ResponseEntity.ok(userService.signUp(signUpRequest));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.login(loginRequest));
    }

    @PostMapping("/auth/login/forget-password/{email}")
    public ResponseEntity<OtpRequiredResponse> loginForgetPassword(@PathVariable String email) {
        return ResponseEntity.ok(userService.loginWithOtp(email));
    }

    @PostMapping("/auth/verify")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestBody OtpRequiredResponse otpRequiredResponse) {
        return ResponseEntity.ok(userService.verifyOtp(otpRequiredResponse));
    }

    @PostMapping("/auth/resend-otp")
    public ResponseEntity<OtpRequiredResponse> resendOtp(@RequestParam String email, @RequestParam String operation) {
        boolean sent = otpService.generateAndSendOTP(email);
        long remaining = otpService.getRemainingSeconds(email);

        OtpRequiredResponse response = new OtpRequiredResponse();
        response.setEmail(email);
        response.setOperation(operation);
        response.setOtpSent(sent);
        response.setRemainingSeconds(remaining);
        if (!sent) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public UserProfile getProfile(@AuthenticationPrincipal Jwt jwt) throws Exception {
        String email = jwt.getSubject();
        return userService.getUserProfile(email);
    }

    @PostMapping("/profile/update")
    public void updateProfile(@AuthenticationPrincipal Jwt jwt, @RequestBody UserProfile userProfile, String newPassword, String oldPassword) {
        String email = jwt.getSubject();
        userService.updateUserProfile(email, userProfile, newPassword, oldPassword);
    }
}