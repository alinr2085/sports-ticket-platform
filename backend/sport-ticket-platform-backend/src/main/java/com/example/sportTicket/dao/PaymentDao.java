package com.example.sportTicket.dao;

import com.example.sportTicket.entity.Payment;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@Repository
public class PaymentDao {

    private final JdbcTemplate jdbcTemplate;

    public PaymentDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Long insert(Payment payment) {
        String sql = "INSERT INTO Payment " +
                "(reservationId, userId, amount, currency, method, status, transactionId, paymentDate) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, payment.getReservationId());
            ps.setLong(2, payment.getUserId());
            ps.setDouble(3, payment.getAmount());
            ps.setString(4, payment.getCurrency());
            ps.setString(5, payment.getMethod());
            ps.setString(6, payment.getStatus());
            ps.setString(7, payment.getTransactionId());
            ps.setObject(8, payment.getPaymentDate() != null ? payment.getPaymentDate() : LocalDateTime.now());
            return ps;
        }, keyHolder);

        return Objects.requireNonNull(keyHolder.getKey()).longValue();
    }

    public Optional<Payment> findByTransactionId(String transactionId) {
        String sql = "SELECT * FROM Payment WHERE transactionId = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Payment.class), transactionId)
                .stream()
                .findFirst();
    }

    public Optional<Payment> findByReservationId(Long reservationId) {
        String sql = "SELECT * FROM Payment WHERE reservationId = ? ORDER BY paymentDate DESC LIMIT 1";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Payment.class), reservationId)
                .stream()
                .findFirst();
    }

    public void updateStatusByTransactionId(String transactionId, String status) {
        String sql = "UPDATE Payment SET status = ?, completedAt = ? WHERE transactionId = ?";
        jdbcTemplate.update(sql, status, LocalDateTime.now(), transactionId);
    }
}