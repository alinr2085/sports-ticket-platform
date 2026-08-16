package com.example.sportTicket.dao;

import com.example.sportTicket.dto.request.TicketFilterRequest;
import com.example.sportTicket.dto.response.TicketResponse;
import com.example.sportTicket.enums.TicketStatus;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class TicketDao {

    private final JdbcTemplate jdbcTemplate;

    private static final String BASE_SELECT =
            "SELECT " +
                    "  t.ticketId AS ticketId, " +
                    "  t.userId AS userId, " +
                    "  t.sectionNumber AS sectionNumber, " +
                    "  t.status AS status, " +
                    "  sp.sportName AS sportName, " +
                    "  th.teamName AS homeTeamName, " +
                    "  tg.teamName AS awayTeamName, " +
                    "  s.stadiumName AS stadiumName, " +
                    "  c.cityName AS cityName, " +
                    "  m.matchDate AS matchDate, " +
                    "  tc.ticketCategoryName AS ticketCategoryName, " +
                    "  tc.price AS price, " +
                    "  tc.remainingCapacity AS remainingCapacity " +
                    "FROM Ticket t " +
                    "JOIN MatchTable m ON t.matchId = m.matchId " +
                    "JOIN Stadium s ON m.stadiumId = s.stadiumId " +
                    "JOIN City c ON s.cityId = c.cityId " +
                    "JOIN Team th ON m.homeTeamId = th.teamId " +
                    "JOIN Team tg ON m.awayTeamId = tg.teamId " +
                    "JOIN Sport sp ON m.sportId = sp.sportId " +
                    "JOIN TicketCategory tc ON t.ticketCategoryId = tc.ticketCategoryId ";

    private static final String BASE_COUNT =
            "SELECT COUNT(*) FROM Ticket t " +
                    "JOIN MatchTable m ON t.matchId = m.matchId " +
                    "JOIN Stadium s ON m.stadiumId = s.stadiumId " +
                    "JOIN City c ON s.cityId = c.cityId " +
                    "JOIN Team th ON m.homeTeamId = th.teamId " +
                    "JOIN Team tg ON m.awayTeamId = tg.teamId " +
                    "JOIN Sport sp ON m.sportId = sp.sportId " +
                    "JOIN TicketCategory tc ON t.ticketCategoryId = tc.ticketCategoryId ";

    public TicketDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<TicketResponse> findAll(int offset, int limit) {
        String sql = BASE_SELECT + " LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TicketResponse.class), limit, offset);
    }

    public List<TicketResponse> findByUserId(Long userId) {
        String sql = BASE_SELECT + " WHERE t.userId = ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TicketResponse.class), userId);
    }

    public List<TicketResponse> findByMatchId(Long matchId, int offset, int limit) {
        String sql = BASE_SELECT + " WHERE t.matchId = ? LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TicketResponse.class), matchId, limit, offset);
    }

    public TicketResponse getTicketDetails(Long ticketId) {
        String sql = BASE_SELECT + " WHERE t.ticketId = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(TicketResponse.class), ticketId);
    }

    public void reserveTicket(Long ticketId) {
        String sql = "insert into ticket (userId, matchId, ticket) values (?, ?, ?)";
        jdbcTemplate.update(sql, ticketId, ticketId, ticketId);
    }

    private String buildWhereClause(String option) {
        return switch (option) {
            case "Cities" -> "c.cityName LIKE ?";
            case "Stadiums" -> "s.stadiumName LIKE ?";
            case "Teams" -> "(th.teamName LIKE ? OR tg.teamName LIKE ?)";
            default -> throw new IllegalArgumentException("Invalid search option: " + option);
        };
    }

    private Object[] buildLikeParams(String option, String value) {
        String pattern = "%" + value + "%";
        if ("Teams".equals(option)) {
            return new Object[]{pattern, pattern};
        }
        return new Object[]{pattern};
    }

    public List<TicketResponse> search(String option, String value, int offset, int limit) {
        String where = buildWhereClause(option);
        Object[] likeParams = buildLikeParams(option, value);

        String sql = BASE_SELECT + " WHERE " + where + " LIMIT ? OFFSET ?";

        Object[] params = new Object[likeParams.length + 2];
        System.arraycopy(likeParams, 0, params, 0, likeParams.length);
        params[likeParams.length] = limit;
        params[likeParams.length + 1] = offset;

        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TicketResponse.class), params);
    }

    public long countSearch(String option, String value) {
        String where = buildWhereClause(option);
        Object[] likeParams = buildLikeParams(option, value);

        String sql = BASE_COUNT + " WHERE " + where;

        return jdbcTemplate.queryForObject(sql, Long.class, likeParams);
    }

    private record FilterClause(String where, List<Object> params) {}

    private FilterClause buildFilterClause(TicketFilterRequest filterRequest) {
        StringBuilder where = new StringBuilder(" WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if (filterRequest.getTicketType() != null && !filterRequest.getTicketType().isBlank()) {
            where.append(" AND tc.ticketCategoryName = ? ");
            params.add(filterRequest.getTicketType());
        }

        if (filterRequest.getSportType() != null && !filterRequest.getSportType().isBlank()) {
            where.append(" AND sp.sportName = ? ");
            params.add(filterRequest.getSportType());
        }

        if (filterRequest.getStartDate() != null && filterRequest.getEndDate() != null) {
            LocalDate startDate = parseDate(filterRequest.getStartDate(), "startDate");
            LocalDate endDate = parseDate(filterRequest.getEndDate(), "endDate");
            where.append(" AND m.matchDate BETWEEN ? AND ? ");
            params.add(startDate);
            params.add(endDate);
        }

        if (filterRequest.getMinPrice() != null && filterRequest.getMaxPrice() != null) {
            BigDecimal minPrice = parsePrice(filterRequest.getMinPrice(), "minPrice");
            BigDecimal maxPrice = parsePrice(filterRequest.getMaxPrice(), "maxPrice");
            where.append(" AND tc.price BETWEEN ? AND ? ");
            params.add(minPrice);
            params.add(maxPrice);
        }

        return new FilterClause(where.toString(), params);
    }

    private LocalDate parseDate(String value, String fieldName) {
        try {
            return LocalDate.parse(value.trim());
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException(
                    "Invalid date format for " + fieldName + ": '" + value + "'. Expected format: YYYY-MM-DD"
            );
        }
    }

    private BigDecimal parsePrice(String value, String fieldName) {
        try {
            return new BigDecimal(value.trim());
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(
                    "Invalid number format for " + fieldName + ": '" + value + "'"
            );
        }
    }

    public List<TicketResponse> filteredSearch(TicketFilterRequest filterRequest, int offset, int limit) {
        FilterClause clause = buildFilterClause(filterRequest);
        String sql = BASE_SELECT + clause.where() + " LIMIT ? OFFSET ?";

        List<Object> params = new ArrayList<>(clause.params());
        params.add(limit);
        params.add(offset);

        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(TicketResponse.class), params.toArray());
    }

    public long countFilteredSearch(TicketFilterRequest filterRequest) {
        FilterClause clause = buildFilterClause(filterRequest);
        String sql = BASE_COUNT + clause.where();
        return jdbcTemplate.queryForObject(sql, Long.class, clause.params().toArray());
    }

    public long countAll() {
        String sql = "select count(*) from Ticket";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    public void updateStatus(Long ticketId, String status) {
        String sql = "update Ticket set status = ? where ticketId = ?";
        jdbcTemplate.update(sql, status, ticketId);
    }

    public void assignToUser(Long ticketId, Long userId, String status) {
        String sql = "UPDATE Ticket SET userId = ?, status = ? WHERE ticketId = ?";
        jdbcTemplate.update(sql, userId, status, ticketId);
    }

    public void releaseTicket(Long ticketId) {
        String sql = "UPDATE Ticket SET status = 'available', userId = NULL WHERE ticketId = ?";
        jdbcTemplate.update(sql, ticketId);
    }
}