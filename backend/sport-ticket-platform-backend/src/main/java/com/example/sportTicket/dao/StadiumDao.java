package com.example.sportTicket.dao;

import com.example.sportTicket.entity.Stadium;
import org.springframework.data.domain.Page;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StadiumDao {

    private final JdbcTemplate jdbcTemplate;


    public StadiumDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Stadium> findAll(int offset, int limit) {
        String sql = "select * from stadium limit ? offset ?";

        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Stadium.class), limit, offset);
    }

    public List<Stadium> findByCity(Long cityId, int offset, int limit) {
        String sql = "select * from stadium where cityId = ?  limit ? offset ?";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Stadium.class), cityId, limit, offset);
    }

    public Stadium findById(Long id) {
        String sql = "select * from stadium where id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Stadium.class), id);
    }

    public long countAll() {
        String sql = "select count(*) from stadium";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

}
