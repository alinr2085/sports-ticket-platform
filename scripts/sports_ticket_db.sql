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


CREATE TABLE TicketCategory (
    ticketCategoryId INT AUTO_INCREMENT PRIMARY KEY,
    ticketCategoryName VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    remainingCapacity INT NOT NULL,
    matchId INT NOT NULL,
    FOREIGN KEY (matchId) REFERENCES MatchTable(matchId)
);

CREATE TABLE User (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phoneNumber VARCHAR(20) UNIQUE,
    hashedPassword VARCHAR(255) NOT NULL,
    cityId INT,
    dateOfBirth DATE,
    registrationDate DATE NOT NULL DEFAULT (CURRENT_DATE),
    accountStatus VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    FOREIGN KEY (cityId) REFERENCES City(cityId),
    CHECK (email IS NOT NULL OR phoneNumber IS NOT NULL),
    CHECK (role IN ('user', 'support'))
);

CREATE TABLE Ticket (
    ticketId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    sectionNumber INT,
    status VARCHAR(50) NOT NULL DEFAULT 'available',
    ticketCategoryId INT NOT NULL,
    matchId INT NOT NULL,
    FOREIGN KEY (ticketCategoryId) REFERENCES TicketCategory(ticketCategoryId),
    FOREIGN KEY (matchId) REFERENCES MatchTable(matchId),
  FOREIGN KEY (userId) REFERENCES User(userId)

);

CREATE TABLE TicketDetails (
    ticketId INT PRIMARY KEY,
    tournamentName VARCHAR(255),
    leagueName VARCHAR(255),
    stadiumName VARCHAR(255),
    facilities VARCHAR(2047),
    FOREIGN KEY (ticketId) REFERENCES Ticket(ticketId)
);

