CREATE DATABASE db_sports_ticket;
USE db_sports_ticket;

CREATE TABLE City (
    cityId INT AUTO_INCREMENT PRIMARY KEY,
    cityName VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL
);

CREATE TABLE Sport (
    sportId INT AUTO_INCREMENT PRIMARY KEY,
    sportName VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Stadium (
    stadiumId INT AUTO_INCREMENT PRIMARY KEY,
    stadiumName VARCHAR(255) NOT NULL,
    cityId INT NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),

    FOREIGN KEY (cityId)
        REFERENCES City(cityId)
);

CREATE TABLE League (
    leagueId INT AUTO_INCREMENT PRIMARY KEY,
    leagueName VARCHAR(255) NOT NULL,
    sportId INT NOT NULL,

    FOREIGN KEY (sportId)
        REFERENCES Sport(sportId)
);

CREATE TABLE Tournament (
    tournamentId INT AUTO_INCREMENT PRIMARY KEY,
    tournamentName VARCHAR(255) NOT NULL,
    sportId INT NOT NULL,

    FOREIGN KEY (sportId)
        REFERENCES Sport(sportId)
);

CREATE TABLE Team (
    teamId INT AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(255) NOT NULL,
    sportId INT NOT NULL,

    FOREIGN KEY (sportId)
        REFERENCES Sport(sportId),

    UNIQUE (teamName, sportId)
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
    FOREIGN KEY (sportId)
        REFERENCES Sport(sportId),
    FOREIGN KEY (homeTeamId)
        REFERENCES Team(teamId),
    FOREIGN KEY (awayTeamId)
        REFERENCES Team(teamId),
    FOREIGN KEY (stadiumId)
        REFERENCES Stadium(stadiumId),
    FOREIGN KEY (leagueId)
        REFERENCES League(leagueId),
    FOREIGN KEY (tournamentId)
        REFERENCES Tournament(tournamentId),
    CHECK (
        (leagueId IS NOT NULL AND tournamentId IS NULL)
        OR
        (leagueId IS NULL AND tournamentId IS NOT NULL)
    ),

    CHECK (homeTeamId <> awayTeamId)
);

CREATE TABLE TicketCategory (
    ticketCategoryId INT AUTO_INCREMENT PRIMARY KEY,
    ticketCategoryName VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL
        CHECK (price >= 0),
    remainingCapacity INT NOT NULL
        CHECK (remainingCapacity >= 0),
    matchId INT NOT NULL,
    FOREIGN KEY (matchId)
        REFERENCES MatchTable(matchId)
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
    registrationDate DATE NOT NULL
        DEFAULT (CURRENT_DATE),
    accountStatus VARCHAR(50) NOT NULL
        DEFAULT 'ACTIVE',
    role VARCHAR(20) NOT NULL
        DEFAULT 'user',
    FOREIGN KEY (cityId)
        REFERENCES City(cityId),

    CHECK (
        email IS NOT NULL
        OR
        phoneNumber IS NOT NULL
    ),
    CHECK (
        role IN ('user', 'support')
    )
);

CREATE TABLE Ticket (
    ticketId INT AUTO_INCREMENT PRIMARY KEY,
    sectionNumber INT,
    status VARCHAR(50) NOT NULL
        DEFAULT 'available',
    ticketCategoryId INT NOT NULL,
    matchId INT NOT NULL,
    FOREIGN KEY (ticketCategoryId)
        REFERENCES TicketCategory(ticketCategoryId),
    FOREIGN KEY (matchId)
        REFERENCES MatchTable(matchId)
);

CREATE TABLE TicketDetails (
    ticketId INT PRIMARY KEY,
    facilities VARCHAR(2047),
    FOREIGN KEY (ticketId)
        REFERENCES Ticket(ticketId)
);

CREATE TABLE Reservation (
    reservationId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    ticketId INT NOT NULL,
    status VARCHAR(50) NOT NULL
        DEFAULT 'reserved',
    reservationDate DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    expiresAt DATETIME NOT NULL,
    FOREIGN KEY (userId)
        REFERENCES User(userId),
    FOREIGN KEY (ticketId)
        REFERENCES Ticket(ticketId),
    CHECK (expiresAt >= reservationDate)
);

CREATE TABLE Payment (
    paymentId INT AUTO_INCREMENT PRIMARY KEY,
    reservationId INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL
        CHECK (amount >= 0),
    currency VARCHAR(10) NOT NULL
        DEFAULT 'IRR',
    method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL
        DEFAULT 'pending',
    transactionId VARCHAR(255),
    paymentDate DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    completedAt DATETIME NULL,
    FOREIGN KEY (reservationId)
        REFERENCES Reservation(reservationId),
    UNIQUE (transactionId)
);

CREATE TABLE Cancellation (
    cancellationId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    ticketId INT NOT NULL,
    originalPrice DECIMAL(10,2) NOT NULL
        DEFAULT 0
        CHECK (originalPrice >= 0),
    penaltyPercent DECIMAL(5,2) NOT NULL
        DEFAULT 0
        CHECK (
            penaltyPercent >= 0
            AND penaltyPercent <= 100
        ),
    refundAmount DECIMAL(10,2) NOT NULL
        DEFAULT 0
        CHECK (refundAmount >= 0),
    status VARCHAR(50) NOT NULL
        DEFAULT 'requested',
    requestDate DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    reviewedAt DATETIME NULL,
    reviewedByAdminId INT NULL,
    FOREIGN KEY (userId)
        REFERENCES User(userId),
    FOREIGN KEY (ticketId)
        REFERENCES Ticket(ticketId),
    FOREIGN KEY (reviewedByAdminId)
        REFERENCES User(userId)
);

CREATE TABLE Report (
    reportId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    reservationId INT NULL,
    supportId INT NULL,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255),
    content VARCHAR(2047),
    response VARCHAR(2047),
    status VARCHAR(50) NOT NULL
        DEFAULT 'pending',
    createTime DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP,
    respondedAt DATETIME NULL,
    FOREIGN KEY (userId)
        REFERENCES User(userId),
    FOREIGN KEY (reservationId)
        REFERENCES Reservation(reservationId),
    FOREIGN KEY (supportId)
        REFERENCES User(userId)
);

CREATE INDEX idx_match_status_date ON MatchTable(status, matchDate);
CREATE INDEX idx_match_sport_date  ON MatchTable(sportId, matchDate);

CREATE INDEX idx_ticket_match_status ON Ticket(matchId, status);

CREATE INDEX idx_ticketcat_match_price ON TicketCategory(matchId, price);

CREATE INDEX idx_reservation_status_expiry ON Reservation(status, expiresAt);

CREATE INDEX idx_payment_status_date ON Payment(status, paymentDate);

CREATE INDEX idx_cancellation_status ON Cancellation(status);
CREATE INDEX idx_report_status_category ON Report(status, category);

CREATE INDEX idx_user_city ON User(cityId);

CREATE INDEX idx_user_regdate ON User(registrationDate);