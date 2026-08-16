package com.example.sportTicket.dao;

import com.example.sportTicket.entity.City;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.OptionalLong;

@Repository
public class CityDao {

    private final JdbcTemplate jdbcTemplate;

    public CityDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public City findById(Long id) {
        String sql = "select * from city where id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(City.class), id);
    }

    public List<City> findAll(int offset, int limit) {
        String sql = "select * from city limit ? offset ?";

        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(City.class), limit, offset);
    }

    public long countAll() {
        String sql = "select count(*) from city";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    public Optional<Long> findByCityName(String cityName) {
        String sql = "select cityId from city where cityName = ?";
        try {
            Long cityId = jdbcTemplate.queryForObject(
                    sql,
                    Long.class,
                    cityName
            );
            return Optional.of(cityId);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
    public void save(City city) {
        String sql = "insert into city (cityName) values (?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, city.getCityName());
            return ps;
        }, keyHolder);

        city.setCityId(Objects.requireNonNull(keyHolder.getKey()).longValue());
    }
}

