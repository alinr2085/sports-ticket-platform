package com.example.sportTicket.dao;

import com.example.sportTicket.dto.response.MatchResponse;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MatchDao {

    private final JdbcTemplate jdbcTemplate;

    public MatchDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<MatchResponse> findByStadiumId(Long stadiumId, int offset, int limit) {

        String sql = """
                select
                    m.matchId,
                    sp.sportName,
                    th.teamName as homeTeamName,
                    ta.teamName as awayTeamName,
                    s.stadiumName,
                    coalesce(l.leagueName, t.tournamentName) as leagueOrTournamentName,
                    m.matchDate,
                    m.status
                from matchTable m
                join team th on m.homeTeamId = th.teamId
                join team ta on m.awayTeamId = ta.teamId
                join stadium s on m.stadiumId = s.stadiumId
                left join league l on m.leagueId = l.leagueId
                left join tournament t on m.tournamentId = t.tournamentId
                join sport sp on m.sportId = sp.sportId
                where m.stadiumId = ?
                order by m.matchDate desc 
                """;

        return jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(MatchResponse.class),
                stadiumId
        );
    }

    public List<MatchResponse> findAll(int offset, int limit) {

        String sql = """
                select
                    m.matchId,
                    sp.sportName,
                    th.teamName as homeTeamName,
                    ta.teamName as awayTeamName,
                    s.stadiumName,
                    coalesce(l.leagueName, t.tournamentName) as leagueOrTournamentName,
                    m.matchDate,
                    m.status
                from matchTable m
                join team th on m.homeTeamId = th.teamId
                join team ta on m.awayTeamId = ta.teamId
                join stadium s on m.stadiumId = s.stadiumId
                left join league l on m.leagueId = l.leagueId
                left join tournament t on m.tournamentId = t.tournamentId
                join sport sp on m.sportId = sp.sportId
                order by m.matchDate desc
                limit ? offset ?;
                """;

        return jdbcTemplate.query(
                sql,
                new BeanPropertyRowMapper<>(MatchResponse.class), limit, offset
        );
    }

    public long countAll() {
        String sql = "select count(*) from matchTable";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }
}