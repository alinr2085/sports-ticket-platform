package com.example.sportTicket.dao;

import com.example.sportTicket.entity.Cancellation;
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
public class CancellationDao {

    private final JdbcTemplate jdbcTemplate;

    public CancellationDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Long insert(Cancellation c) {
        String sql = "INSERT INTO Cancellation " +
                "(userId, ticketId, originalPrice, penaltyPercent, refundAmount, status, requestDate, reviewedAt, reviewedByAdminId) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, c.getUserId());
            ps.setLong(2, c.getTicketId());
            ps.setDouble(3, c.getOriginalPrice());
            ps.setDouble(4, c.getPenaltyPercent());
            ps.setDouble(5, c.getRefundAmount());
            ps.setString(6, c.getStatus());
            ps.setObject(7, c.getRequestDate() != null ? c.getRequestDate() : LocalDateTime.now());
            if (c.getReviewedAt() != null) {
                ps.setObject(8, c.getReviewedAt());
            } else {
                ps.setNull(8, java.sql.Types.TIMESTAMP);
            }
            if (c.getReviewedByAdminId() != null) {
                ps.setLong(9, c.getReviewedByAdminId());
            } else {
                ps.setNull(9, java.sql.Types.BIGINT);
            }
            return ps;
        }, keyHolder);

        return Objects.requireNonNull(keyHolder.getKey()).longValue();
    }

    public Optional<Cancellation> findById(Long cancellationId) {
        String sql = "SELECT * FROM Cancellation WHERE cancellationId = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Cancellation.class), cancellationId)
                .stream()
                .findFirst();
    }

    public Optional<Cancellation> findPendingByTicketId(Long ticketId) {
        String sql = "SELECT * FROM Cancellation WHERE ticketId = ? AND status = 'pending' ORDER BY requestDate DESC LIMIT 1";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Cancellation.class), ticketId)
                .stream()
                .findFirst();
    }

    public void updateReview(Long cancellationId, String status, Long reviewedByAdminId) {
        String sql = "UPDATE Cancellation SET status = ?, reviewedAt = ?, reviewedByAdminId = ? WHERE cancellationId = ?";
        jdbcTemplate.update(sql, status, LocalDateTime.now(), reviewedByAdminId, cancellationId);
    }
}