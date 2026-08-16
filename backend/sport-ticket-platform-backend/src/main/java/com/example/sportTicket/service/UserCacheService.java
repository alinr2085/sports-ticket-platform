package com.example.sportTicket.service;

import com.example.sportTicket.dto.response.UserProfile;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Duration;

@Service
public class UserCacheService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final Duration PROFILE_TTL = Duration.ofMinutes(30);
    private static final String KEY_PREFIX = "user:profile:";

    public UserCacheService(
            RedisTemplate<String, Object> redisTemplate,
            ObjectMapper objectMapper
    ) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    private String buildKey(String email) {
        return KEY_PREFIX + email;
    }

    public UserProfile getCachedProfile(String email) {
        Object cached = redisTemplate.opsForValue().get(buildKey(email));

        if (cached == null) {
            return null;
        }

        return objectMapper.convertValue(cached, UserProfile.class);
    }

    public void cacheProfile(String email, UserProfile profile) {
        redisTemplate.opsForValue().set(
                buildKey(email),
                profile,
                PROFILE_TTL
        );
    }

    public void evictProfile(String email) {
        redisTemplate.delete(buildKey(email));
    }
}