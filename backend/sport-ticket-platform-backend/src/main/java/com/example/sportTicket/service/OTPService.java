package com.example.sportTicket.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class OTPService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final JavaMailSender mailSender;

    private static final Duration OTP_TTL = Duration.ofSeconds(120);
    private static final String KEY_PREFIX = "otp:";

    @Value("${spring.mail.username}")
    private String fromEmail;

    public OTPService(RedisTemplate<String, Object> redisTemplate, JavaMailSender mailSender) {
        this.redisTemplate = redisTemplate;
        this.mailSender = mailSender;
    }

    public boolean generateAndSendOTP(String email) {
        String key = KEY_PREFIX + email;

        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            return false;
        }

        String otp = generateCode();
        redisTemplate.opsForValue().set(key, otp, OTP_TTL.getSeconds(), TimeUnit.SECONDS);

        sendEmail(email, otp);
        return true;
    }

    public long getRemainingSeconds(String email) {
        String key = KEY_PREFIX + email;
        Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
        return ttl > 0 ? ttl : 0;
    }

    private String generateCode() {
        return String.valueOf(new Random().nextInt(900000) + 100000);
    }

    public boolean verifyOTP(String email, String sentOtp) {
        String key = KEY_PREFIX + email;
        Object storedOtp = redisTemplate.opsForValue().get(key);

        if (storedOtp == null || sentOtp == null) {
            return false;
        }

        boolean verified = storedOtp.toString().equals(sentOtp);

        if (verified) {
            redisTemplate.delete(key);
        }

        return verified;
    }

    private void sendEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("OTP verification for sport ticket platform");
        message.setText("your verification code: " + otp);
        mailSender.send(message);
    }
}