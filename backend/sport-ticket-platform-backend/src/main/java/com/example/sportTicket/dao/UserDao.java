package com.example.sportTicket.dao;

import com.example.sportTicket.entity.User;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.Objects;
import java.util.Optional;

@Repository
public class UserDao {

    private final JdbcTemplate jdbcTemplate;
    private final BeanPropertyRowMapper<User> rowMapper = new BeanPropertyRowMapper<>(User.class);


    public UserDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    public void save(User user) {
        String sql = """
                insert into `user` (
                    firstname,
                    lastname,
                    email,
                    phonenumber,
                    hashedPassword,
                    cityId,
                    dateOfBirth,
                    registrationDate,
                    accountStatus,
                    role
                )
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, user.getFirstName());
            ps.setString(2, user.getLastName());
            ps.setString(3, user.getEmail());
            ps.setString(4, user.getPhoneNumber());
            ps.setString(5, user.getHashedPassword());
            if (user.getCityId() != null) {
                ps.setObject(6, user.getCityId());
            } else {
                ps.setNull(6, java.sql.Types.BIGINT);
            }

            if (user.getDateOfBirth() != null) {
                ps.setObject(7, user.getDateOfBirth());
            } else {
                ps.setNull(7, java.sql.Types.DATE);
            }
            ps.setObject(8, user.getRegistrationDate());
            ps.setString(9, user.getAccountStatus());
            ps.setString(
                    10,
                    user.getRole() != null ? user.getRole() : "VIEWER"
            );
            return ps;
        }, keyHolder);

        Objects.requireNonNull(keyHolder.getKey()).longValue();
    }

    public void update(User user) {
        String sql = "update user set firstname = ? , lastname = ?, email=?, phonenumber=?, hashedPassword=?, cityId=? where userId = ?";
        jdbcTemplate.update(sql, user.getFirstName(), user.getLastName(), user.getEmail(), user.getPhoneNumber(), user.getHashedPassword(), user.getCityId(), user.getUserId());
    }

    public void updateStatus(Long userId, String status) {
        String sql = "update `user` set accountStatus = ? where userId = ?";
        jdbcTemplate.update(sql, status, userId);
    }

    public Optional<User> findByEmail(String email) {
        String sql = "select * from `user` where email = ?";
        try {
            User user = jdbcTemplate.queryForObject(sql, rowMapper, email);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public void deleteByExpiry(int expiryMinutes) {
        String sql = "delete from user where accountStatus = 'PENDING' and registrationDate < ?";

        jdbcTemplate.update(sql, LocalDate.now().minusMonths(expiryMinutes));
    }

    public void deleteByEmail(String email) {
        String sql = "delete from user where email = ?";
        jdbcTemplate.update(sql, email);
    }
}
