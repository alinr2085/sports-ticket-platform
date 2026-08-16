package com.example.sportTicket.service;

import com.example.sportTicket.dto.response.TicketResponse;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class TicketCacheService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final Duration TICKETS_TTL = Duration.ofMinutes(5);
    private static final String KEY_PREFIX = "tickets:";

    public TicketCacheService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String buildAllKey(int page, int size) {
        return KEY_PREFIX + "all:" + page + ":" + size;
    }

    public String buildSearchKey(String option, String value, int page, int size) {
        return KEY_PREFIX + "search:" + option + ":" + value + ":" + page + ":" + size;
    }

    @SuppressWarnings("unchecked")
    public List<TicketResponse> getCachedList(String key) {
        return (List<TicketResponse>) redisTemplate.opsForValue().get(key);
    }

    public void cacheList(String key, List<TicketResponse> tickets) {
        redisTemplate.opsForValue().set(key, tickets, TICKETS_TTL);
    }

    public void evictAllTicketCaches() {
        var keys = redisTemplate.keys(KEY_PREFIX + "*");
        if (keys != null && !keys.isEmpty()) {
            redisTemplate.delete(keys);
        }
    }
}