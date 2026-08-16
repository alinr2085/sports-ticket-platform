package com.example.sportTicket.dao;

import com.example.sportTicket.dto.response.ReservationResponse;
import com.example.sportTicket.entity.Reservation;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;

@Repository
public class ReservationDao {

    private final JdbcTemplate jdbcTemplate;

    private static final String RESERVATION_SELECT =
            "SELECT " +
                    "  r.reservationId AS reservationId, " +
                    "  r.status AS status, " +
                    "  r.reservationDate AS reservationDate, " +
                    "  r.expiresAt AS expiresAt, " +
                    "  r.ticketId AS ticketId, " +
                    "  sp.sportName AS sportName, " +
                    "  th.teamName AS homeTeamName, " +
                    "  tg.teamName AS awayTeamName, " +
                    "  s.stadiumName AS stadiumName, " +
                    "  c.cityName AS cityName, " +
                    "  m.matchDate AS matchDate, " +
                    "  tc.ticketCategoryName AS ticketCategoryName, " +
                    "  tc.price AS ticketPrice, " +
                    "  t.sectionNumber AS sectionNumber, " +
                    "  r.userId AS userId, " +
                    "  u.email AS userEmail, " +
                    "  p.paymentId AS paymentId, " +
                    "  p.status AS paymentStatus, " +
                    "  p.amount AS paymentAmount " +
                    "FROM Reservation r " +
                    "JOIN Ticket t ON r.ticketId = t.ticketId " +
                    "JOIN MatchTable m ON t.matchId = m.matchId " +
                    "JOIN Stadium s ON m.stadiumId = s.stadiumId " +
                    "JOIN City c ON s.cityId = c.cityId " +
                    "JOIN Team th ON m.homeTeamId = th.teamId " +
                    "JOIN Team tg ON m.awayTeamId = tg.teamId " +
                    "JOIN Sport sp ON m.sportId = sp.sportId " +
                    "JOIN TicketCategory tc ON t.ticketCategoryId = tc.ticketCategoryId " +
                    "JOIN User u ON r.userId = u.userId " +
                    "LEFT JOIN Payment p ON p.reservationId = r.reservationId ";

    private static final String RESERVATION_COUNT =
            "SELECT COUNT(*) " +
                    "FROM Reservation r " +
                    "JOIN Ticket t ON r.ticketId = t.ticketId " +
                    "JOIN MatchTable m ON t.matchId = m.matchId " +
                    "JOIN Stadium s ON m.stadiumId = s.stadiumId " +
                    "JOIN City c ON s.cityId = c.cityId " +
                    "JOIN Team th ON m.homeTeamId = th.teamId " +
                    "JOIN Team tg ON m.awayTeamId = tg.teamId " +
                    "JOIN Sport sp ON m.sportId = sp.sportId " +
                    "JOIN TicketCategory tc ON t.ticketCategoryId = tc.ticketCategoryId " +
                    "JOIN User u ON r.userId = u.userId " +
                    "LEFT JOIN Payment p ON p.reservationId = r.reservationId ";

    public ReservationDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean save(Long ticketId, Long userId) {
        String sql = "INSERT INTO Reservation " +
                "(userId, ticketId, status, reservationDate, expiresAt) " +
                "VALUES (?, ?, ?, ?, ?)";

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(5);

        int result = jdbcTemplate.update(sql, userId, ticketId, "reserved", now, expiresAt);
        System.out.println(result);
        return result == 1;
    }

    public Reservation findById(Long reservationId) {
        String sql = "SELECT * FROM Reservation WHERE reservationId = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Reservation.class), reservationId);
    }

    public List<ReservationResponse> findByUserId(Long userId, int offset, int limit) {
        String sql = RESERVATION_SELECT + " WHERE r.userId = ? ORDER BY r.reservationDate DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ReservationResponse.class), userId, limit, offset);
    }

    public long countByUserId(Long userId) {
        String sql = RESERVATION_COUNT + " WHERE r.userId = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, userId);
    }

    public List<ReservationResponse> findAll(int offset, int limit) {
        String sql = RESERVATION_SELECT + " ORDER BY r.reservationDate DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ReservationResponse.class), limit, offset);
    }

    public Long countAll() {
        return jdbcTemplate.queryForObject(RESERVATION_COUNT, Long.class);
    }

    public void updateStatus(Long reservationId, String status) {
        String sql = "UPDATE Reservation r SET r.status = ? WHERE r.reservationId = ?";
        jdbcTemplate.update(sql, status, reservationId);
    }

    public void updateExpiresAt(Long reservationId, LocalDateTime expiresAt) {
        String sql = "UPDATE Reservation SET expiresAt = ? WHERE reservationId = ?";
        int rows = jdbcTemplate.update(sql, expiresAt, reservationId);
        System.out.println("Updated rows: " + rows);
    }

    public Long getTicketId(Long reservationId) {
        String sql = "SELECT ticketId FROM Reservation WHERE reservationId = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, reservationId);
    }

    public List<Long> findExpiredReservationIds() {
        String sql = "SELECT reservationId FROM Reservation " +
                "WHERE status = 'reserved' AND expiresAt < ?";
        return jdbcTemplate.queryForList(sql, Long.class, LocalDateTime.now());
    }

    public void expireReservation(Long reservationId) {
        String sql = "UPDATE Reservation SET status = 'cancelled' WHERE reservationId = ?";
        jdbcTemplate.update(sql, reservationId);
    }

    public void update(Reservation reservation) {
        String sql = "update reservation set status = ? where reservationId = ?";
        jdbcTemplate.update(sql, reservation.getStatus(), reservation.getReservationId());
    }
    public long getTicketPriceInCents(Long reservationId) {
        String sql = "SELECT tc.price FROM Reservation r " +
                "JOIN Ticket t ON r.ticketId = t.ticketId " +
                "JOIN TicketCategory tc ON t.ticketCategoryId = tc.ticketCategoryId " +
                "WHERE r.reservationId = ?";
        Double price = jdbcTemplate.queryForObject(sql, Double.class, reservationId);
        return Math.round(price * 100);
    }

    public double getTicketPrice(Long reservationId) {
        String sql = "SELECT tc.price FROM Reservation r " +
                "JOIN Ticket t ON r.ticketId = t.ticketId " +
                "JOIN TicketCategory tc ON t.ticketCategoryId = tc.ticketCategoryId " +
                "WHERE r.reservationId = ?";
        Double price = jdbcTemplate.queryForObject(sql, Double.class, reservationId);
        return price != null ? price : 0.0;
    }

    public Reservation findByTicketId(Long ticketId) {
        String sql = "SELECT * FROM Reservation WHERE ticketId = ? ORDER BY reservationDate DESC LIMIT 1";
        List<Reservation> results = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Reservation.class), ticketId);
        return results.isEmpty() ? null : results.get(0);
    }

    public ReservationResponse findResponseById(Long reservationId) {
        String sql = RESERVATION_SELECT + " WHERE r.reservationId = ?";
        List<ReservationResponse> results = jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ReservationResponse.class), reservationId);
        return results.isEmpty() ? null : results.get(0);
    }

    public LocalDateTime getExpiresAt(Long reservationId) {
        String sql = "SELECT expiresAt FROM Reservation WHERE reservationId = ?";

        return jdbcTemplate.queryForObject(
                sql,
                LocalDateTime.class,
                reservationId
        );
    }

}