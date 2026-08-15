CREATE DATABASE db_sports_ticket;
USE db_sports_ticket;

CREATE TABLE City (
    cityId INT AUTO_INCREMENT PRIMARY KEY,
    cityName VARCHAR(100) NOT NULL
);

CREATE TABLE Sport (
    sportId INT AUTO_INCREMENT PRIMARY KEY,
    sportName VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Stadium (
    stadiumId INT AUTO_INCREMENT PRIMARY KEY,
    stadiumName VARCHAR(255) NOT NULL,
    cityId INT NOT NULL,
    capacity INT NOT NULL,
    FOREIGN KEY (cityId) REFERENCES City(cityId)
);

CREATE TABLE League (
    leagueId INT AUTO_INCREMENT PRIMARY KEY,
    leagueName VARCHAR(255) NOT NULL,
    sportId INT NOT NULL,
    FOREIGN KEY (sportId) REFERENCES Sport(sportId)
);

CREATE TABLE Tournament (
    tournamentId INT AUTO_INCREMENT PRIMARY KEY,
    tournamentName VARCHAR(255) NOT NULL,
    sportId INT NOT NULL,
    FOREIGN KEY (sportId) REFERENCES Sport(sportId)
);

CREATE TABLE Team (
    teamId INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL
);

CREATE TABLE MatchTable (
    matchId INT AUTO_INCREMENT PRIMARY KEY,
    sportId INT NOT NULL,
    matchDate DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    homeTeamId INT NOT NULL,
    awayTeamId INT NOT NULL,
    stadiumId INT NOT NULL,
    tournamentId INT NULL,
    leagueId INT NULL,
    FOREIGN KEY (sportId) REFERENCES Sport(sportId),
    FOREIGN KEY (homeTeamId) REFERENCES Team(teamId),
    FOREIGN KEY (awayTeamId) REFERENCES Team(teamId),
    FOREIGN KEY (stadiumId) REFERENCES Stadium(stadiumId),
    FOREIGN KEY (leagueId) REFERENCES League(leagueId),
    FOREIGN KEY (tournamentId) REFERENCES Tournament(tournamentId),
    CHECK (
        (leagueId IS NOT NULL AND tournamentId IS NULL)
        OR
        (leagueId IS NULL AND tournamentId IS NOT NULL)
    )
);