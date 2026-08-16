USE db_sports_ticket;


-- =========================================================
-- 1. CITY
-- =========================================================

INSERT INTO City (cityId, cityName, province) VALUES
(1, 'Tehran', 'Tehran'),
(2, 'Mashhad', 'Razavi Khorasan'),
(3, 'Isfahan', 'Isfahan'),
(4, 'Shiraz', 'Fars'),
(5, 'Tabriz', 'East Azerbaijan'),
(6, 'Ahvaz', 'Khuzestan'),
(7, 'Karaj', 'Alborz'),
(8, 'Rasht', 'Gilan'),
(9, 'Qom', 'Qom'),
(10, 'Yazd', 'Yazd');


-- =========================================================
-- 2. SPORT
-- =========================================================

INSERT INTO Sport (sportId, sportName) VALUES
(1, 'Football'),
(2, 'Volleyball'),
(3, 'Basketball');


-- =========================================================
-- 3. STADIUM
-- =========================================================

INSERT INTO Stadium (
    stadiumId,
    stadiumName,
    cityId,
    capacity
) VALUES
(1, 'Azadi Stadium', 1, 78116),
(2, 'Imam Reza Stadium', 2, 27900),
(3, 'Naghsh-e Jahan Stadium', 3, 75000),
(4, 'Hafezieh Stadium', 4, 20000),
(5, 'Yadegar-e Emam Stadium', 5, 66833),
(6, 'Ghadir Stadium', 6, 38000),
(7, 'Enghelab Stadium', 7, 15000),
(8, 'Dr. Azodi Stadium', 8, 11000),
(9, 'Shahid Beheshti Stadium', 9, 15000),
(10, 'Shahid Nasiri Stadium', 10, 17000),
(11, 'Shahid Shiroudi Stadium', 1, 30000),
(12, 'Takhti Stadium', 5, 25000);


-- =========================================================
-- 4. LEAGUE
-- =========================================================

INSERT INTO League (
    leagueId,
    leagueName,
    sportId
) VALUES
(1, 'Iranian Pro League', 1),
(2, 'Azadegan League', 1),
(3, 'Premier League', 1),
(4, 'La Liga', 1),
(5, 'Bundesliga', 1),
(6, 'Serie A', 1),
(7, 'Iran Volleyball Super League', 2),
(8, 'CEV Champions League', 2),
(9, 'Iran Basketball Super League', 3),
(10, 'NBA', 3);


-- =========================================================
-- 5. TOURNAMENT
-- =========================================================

INSERT INTO Tournament (
    tournamentId,
    tournamentName,
    sportId
) VALUES
(1, 'AFC Champions League', 1),
(2, 'Hazfi Cup', 1),
(3, 'FIFA Club World Cup', 1),
(4, 'UEFA Champions League', 1),
(5, 'UEFA Europa League', 1),
(6, 'Volleyball Nations League', 2),
(7, 'Asian Volleyball Championship', 2),
(8, 'FIBA World Cup', 3),
(9, 'Asian Basketball Championship', 3),
(10, 'Olympic Basketball Tournament', 3);


-- =========================================================
-- 6. TEAM
-- =========================================================

INSERT INTO Team (
    teamId,
    teamName,
    sportId
) VALUES
(1, 'Persepolis', 1),
(2, 'Esteghlal', 1),
(3, 'Sepahan', 1),
(4, 'Tractor', 1),
(5, 'Foolad', 1),
(6, 'Zob Ahan', 1),
(7, 'Shahr Khodro', 1),
(8, 'Paykan Volleyball', 2),
(9, 'Shahrdari Urmia Volleyball', 2),
(10, 'Saipa Volleyball', 2),
(11, 'Petrochimi Basketball', 3),
(12, 'Shahrdari Gorgan Basketball', 3),
(13, 'Mahram Basketball', 3),
(14, 'Sanat Mes Basketball', 3),
(15, 'Zob Ahan Basketball', 3);


-- =========================================================
-- 7. MATCH TABLE
-- =========================================================

INSERT INTO MatchTable (
    matchId,
    sportId,
    matchDate,
    status,
    homeTeamId,
    awayTeamId,
    stadiumId,
    tournamentId,
    leagueId
) VALUES

(1, 1, '2026-08-20 18:00:00', 'scheduled',
 1, 2, 1, NULL, 1),

(2, 1, '2026-08-21 20:00:00', 'scheduled',
 3, 4, 3, NULL, 1),

(3, 1, '2026-08-22 19:00:00', 'scheduled',
 5, 6, 6, NULL, 2),

(4, 1, '2026-08-23 17:30:00', 'scheduled',
 2, 3, 1, NULL, 1),

(5, 1, '2026-08-24 21:00:00', 'scheduled',
 4, 5, 5, NULL, 3),

(6, 1, '2026-08-25 20:30:00', 'scheduled',
 1, 3, 1, 1, NULL),

(7, 1, '2026-08-26 18:30:00', 'scheduled',
 2, 4, 1, 2, NULL),

(8, 2, '2026-08-27 18:00:00', 'scheduled',
 8, 9, 7, NULL, 7),

(9, 2, '2026-08-28 20:00:00', 'scheduled',
 9, 10, 8, NULL, 7),

(10, 3, '2026-08-29 18:00:00', 'scheduled',
 11, 12, 9, NULL, 9),

(11, 3, '2026-08-30 20:00:00', 'scheduled',
 13, 14, 10, NULL, 9),

(12, 1, '2026-07-10 18:00:00', 'finished',
 1, 2, 1, NULL, 1),

(13, 1, '2026-07-12 20:00:00', 'finished',
 3, 4, 3, NULL, 1),

(14, 2, '2026-07-15 18:00:00', 'finished',
 8, 9, 7, NULL, 7),

(15, 3, '2026-07-18 20:00:00', 'finished',
 11, 12, 9, NULL, 9);


-- =========================================================
-- 8. TICKET CATEGORY
-- =========================================================

INSERT INTO TicketCategory (
    ticketCategoryId,
    ticketCategoryName,
    price,
    remainingCapacity,
    matchId
) VALUES
(1, 'Standard', 5000000, 500, 1),
(2, 'VIP', 12000000, 100, 2),
(3, 'Standard', 4500000, 400, 3),
(4, 'VIP', 10000000, 80, 4),
(5, 'Standard', 5500000, 350, 5),
(6, 'VIP', 15000000, 75, 6),
(7, 'Standard', 4000000, 450, 7),
(8, 'VIP', 9000000, 90, 8),
(9, 'Standard', 3500000, 300, 9),
(10, 'VIP', 8000000, 60, 10),
(11, 'Standard', 3000000, 250, 11),
(12, 'VIP', 7500000, 70, 12),
(13, 'Standard', 6000000, 200, 13),
(14, 'VIP', 11000000, 50, 14),
(15, 'Standard', 2500000, 300, 15);


-- =========================================================
-- 9. USER
-- =========================================================

INSERT INTO User (
    userId,
    firstName,
    lastName,
    email,
    phoneNumber,
    hashedPassword,
    cityId,
    dateOfBirth,
    registrationDate,
    accountStatus,
    role
) VALUES
(1, 'Ali', 'Ahmadi', 'ali.ahmadi@example.com',
 '09120000001', 'hash_0001', 1,
 '1995-03-15', '2026-07-01', 'ACTIVE', 'user'),

(2, 'Reza', 'Mohammadi', 'reza.mohammadi@example.com',
 '09120000002', 'hash_0002', 2,
 '1998-07-22', '2026-07-02', 'ACTIVE', 'user'),

(3, 'Amir', 'Hosseini', 'amir.hosseini@example.com',
 '09120000003', 'hash_0003', 3,
 '1992-11-10', '2026-07-03', 'ACTIVE', 'user'),

(4, 'Mohammad', 'Karimi', 'mohammad.karimi@example.com',
 '09120000004', 'hash_0004', 4,
 '2000-01-18', '2026-07-04', 'ACTIVE', 'user'),

(5, 'Sina', 'Rahimi', 'sina.rahimi@example.com',
 '09120000005', 'hash_0005', 5,
 '1996-09-05', '2026-07-05', 'ACTIVE', 'user'),

(6, 'Arman', 'Moradi', 'arman.moradi@example.com',
 '09120000006', 'hash_0006', 6,
 '1999-04-27', '2026-07-06', 'ACTIVE', 'user'),

(7, 'Mehdi', 'Ebrahimi', 'mehdi.ebrahimi@example.com',
 '09120000007', 'hash_0007', 7,
 '1993-12-14', '2026-07-07', 'ACTIVE', 'user'),

(8, 'Pouya', 'Karimi', 'pouya.karimi@example.com',
 '09120000008', 'hash_0008', 8,
 '2001-06-30', '2026-07-08', 'ACTIVE', 'user'),

(9, 'Nima', 'Jafari', 'nima.jafari@example.com',
 '09120000009', 'hash_0009', 9,
 '1997-08-19', '2026-07-09', 'ACTIVE', 'user'),

(10, 'Saman', 'Safari', 'saman.safari@example.com',
 '09120000010', 'hash_0010', 10,
 '1994-02-25', '2026-07-10', 'ACTIVE', 'user'),

(11, 'Sara', 'Ahmadi', 'sara.ahmadi@example.com',
 '09120000011', 'hash_0011', 1,
 '1990-05-12', '2026-07-11', 'ACTIVE', 'support'),

(12, 'Mina', 'Karimi', 'mina.karimi@example.com',
 '09120000012', 'hash_0012', 2,
 '1991-10-08', '2026-07-12', 'ACTIVE', 'support');


-- =========================================================
-- 10. TICKET
-- =========================================================

INSERT INTO Ticket (
    ticketId,
    sectionNumber,
    status,
    ticketCategoryId,
    matchId
) VALUES
(1, 101, 'sold', 1, 1),
(2, 102, 'sold', 2, 2),
(3, 103, 'sold', 3, 3),
(4, 104, 'sold', 4, 4),
(5, 105, 'sold', 5, 5),
(6, 106, 'sold', 6, 6),
(7, 107, 'sold', 7, 7),
(8, 108, 'sold', 8, 8),
(9, 109, 'sold', 9, 9),
(10, 110, 'sold', 10, 10),

(11, 201, 'cancelled', 11, 11),
(12, 202, 'cancelled', 12, 12),
(13, 203, 'cancelled', 13, 13),
(14, 204, 'cancelled', 14, 14),
(15, 205, 'cancelled', 15, 15),

(16, 206, 'available', 1, 1),
(17, 207, 'available', 2, 2),
(18, 208, 'available', 3, 3),
(19, 209, 'available', 4, 4),
(20, 210, 'available', 5, 5);


-- =========================================================
-- 11. TICKET DETAILS
-- =========================================================

INSERT INTO TicketDetails (
    ticketId,
    facilities
) VALUES
(1, 'Standard seat, entrance access'),
(2, 'VIP seat, lounge access, refreshments'),
(3, 'Standard seat, entrance access'),
(4, 'VIP seat, lounge access'),
(5, 'Standard seat, parking access'),
(6, 'VIP seat, refreshments, parking'),
(7, 'Standard seat, entrance access'),
(8, 'VIP seat, lounge access'),
(9, 'Standard seat, entrance access'),
(10, 'VIP seat, refreshments'),
(11, 'Standard seat, entrance access'),
(12, 'VIP seat, lounge access'),
(13, 'Standard seat, entrance access'),
(14, 'VIP seat, refreshments'),
(15, 'Standard seat, entrance access'),
(16, 'Standard seat, entrance access'),
(17, 'VIP seat, lounge access'),
(18, 'Standard seat, entrance access'),
(19, 'VIP seat, refreshments'),
(20, 'Standard seat, parking access');


-- =========================================================
-- 12. RESERVATION
-- =========================================================

INSERT INTO Reservation (
    reservationId,
    userId,
    ticketId,
    status,
    reservationDate,
    expiresAt
) VALUES
(1, 1, 1, 'paid',
 '2026-08-01 10:00:00',
 '2026-08-01 11:00:00'),

(2, 2, 2, 'paid',
 '2026-08-01 11:00:00',
 '2026-08-01 12:00:00'),

(3, 3, 3, 'paid',
 '2026-08-02 10:00:00',
 '2026-08-02 11:00:00'),

(4, 4, 4, 'paid',
 '2026-08-02 12:00:00',
 '2026-08-02 13:00:00'),

(5, 5, 5, 'paid',
 '2026-08-03 09:00:00',
 '2026-08-03 10:00:00'),

(6, 6, 6, 'paid',
 '2026-08-03 13:00:00',
 '2026-08-03 14:00:00'),

(7, 7, 7, 'paid',
 '2026-08-04 10:00:00',
 '2026-08-04 11:00:00'),

(8, 8, 8, 'paid',
 '2026-08-04 14:00:00',
 '2026-08-04 15:00:00'),

(9, 9, 9, 'paid',
 '2026-08-05 11:00:00',
 '2026-08-05 12:00:00'),

(10, 10, 10, 'paid',
 '2026-08-05 15:00:00',
 '2026-08-05 16:00:00'),

(11, 1, 11, 'cancelled',
 '2026-08-06 10:00:00',
 '2026-08-06 11:00:00'),

(12, 2, 12, 'cancelled',
 '2026-08-06 12:00:00',
 '2026-08-06 13:00:00'),

(13, 3, 13, 'cancelled',
 '2026-08-07 10:00:00',
 '2026-08-07 11:00:00'),

(14, 4, 14, 'cancelled',
 '2026-08-07 14:00:00',
 '2026-08-07 15:00:00'),

(15, 5, 15, 'cancelled',
 '2026-08-08 11:00:00',
 '2026-08-08 12:00:00');


-- =========================================================
-- 13. PAYMENT
-- =========================================================

INSERT INTO Payment (
    paymentId,
    reservationId,
    amount,
    currency,
    method,
    status,
    transactionId,
    paymentDate,
    completedAt
) VALUES
(1, 1, 5000000, 'IRR', 'card', 'success',
 'TXN-0001', '2026-08-01 10:20:00', '2026-08-01 10:20:30'),

(2, 2, 12000000, 'IRR', 'card', 'success',
 'TXN-0002', '2026-08-01 11:20:00', '2026-08-01 11:20:30'),

(3, 3, 4500000, 'IRR', 'wallet', 'success',
 'TXN-0003', '2026-08-02 10:20:00', '2026-08-02 10:20:30'),

(4, 4, 10000000, 'IRR', 'card', 'success',
 'TXN-0004', '2026-08-02 12:20:00', '2026-08-02 12:20:30'),

(5, 5, 5500000, 'IRR', 'card', 'success',
 'TXN-0005', '2026-08-03 09:20:00', '2026-08-03 09:20:30'),

(6, 6, 15000000, 'IRR', 'wallet', 'success',
 'TXN-0006', '2026-08-03 13:20:00', '2026-08-03 13:20:30'),

(7, 7, 4000000, 'IRR', 'card', 'success',
 'TXN-0007', '2026-08-04 10:20:00', '2026-08-04 10:20:30'),

(8, 8, 9000000, 'IRR', 'card', 'success',
 'TXN-0008', '2026-08-04 14:20:00', '2026-08-04 14:20:30'),

(9, 9, 3500000, 'IRR', 'wallet', 'success',
 'TXN-0009', '2026-08-05 11:20:00', '2026-08-05 11:20:30'),

(10, 10, 8000000, 'IRR', 'card', 'success',
 'TXN-0010', '2026-08-05 15:20:00', '2026-08-05 15:20:30');


-- =========================================================
-- 14. CANCELLATION
-- =========================================================

INSERT INTO Cancellation (
    cancellationId,
    userId,
    ticketId,
    originalPrice,
    penaltyPercent,
    refundAmount,
    status,
    requestDate,
    reviewedAt,
    reviewedByAdminId
) VALUES
(1, 1, 11, 3000000, 10, 2700000,
 'approved', '2026-08-06 11:00:00',
 '2026-08-06 12:00:00', 11),

(2, 2, 12, 7500000, 10, 6750000,
 'approved', '2026-08-06 13:00:00',
 '2026-08-06 14:00:00', 12),

(3, 3, 13, 6000000, 15, 5100000,
 'approved', '2026-08-07 11:00:00',
 '2026-08-07 12:00:00', 11),

(4, 4, 14, 11000000, 20, 8800000,
 'approved', '2026-08-07 15:00:00',
 '2026-08-07 16:00:00', 12),

(5, 5, 15, 2500000, 10, 2250000,
 'approved', '2026-08-08 12:00:00',
 '2026-08-08 13:00:00', 11);


-- =========================================================
-- 15. REPORT
-- =========================================================

INSERT INTO Report (
    reportId,
    userId,
    reservationId,
    supportId,
    category,
    title,
    content,
    response,
    status,
    createTime,
    respondedAt
) VALUES

(1, 1, 1, 11,
 'payment',
 'Payment issue',
 'The payment was successful but the ticket was not displayed immediately.',
 'The payment was verified and the ticket is active.',
 'resolved',
 '2026-08-02 09:00:00',
 '2026-08-02 10:00:00'),

(2, 2, 2, 12,
 'reservation',
 'Reservation problem',
 'I had a problem during reservation.',
 'The reservation was checked successfully.',
 'resolved',
 '2026-08-02 11:00:00',
 '2026-08-02 12:00:00'),

(3, 3, 3, 11,
 'ticket',
 'Ticket information',
 'I need more information about my ticket.',
 'Ticket information was provided.',
 'resolved',
 '2026-08-03 09:00:00',
 '2026-08-03 10:00:00'),

(4, 4, 4, NULL,
 'refund',
 'Refund request',
 'I would like to know the refund status.',
 NULL,
 'pending',
 '2026-08-04 10:00:00',
 NULL),

(5, 5, 5, 12,
 'payment',
 'Payment verification',
 'Please verify my payment.',
 'Payment was successfully verified.',
 'resolved',
 '2026-08-04 11:00:00',
 '2026-08-04 12:00:00'),

(6, 6, 6, 11,
 'ticket',
 'Ticket issue',
 'There was a problem with the ticket information.',
 'The ticket information was corrected.',
 'resolved',
 '2026-08-05 09:00:00',
 '2026-08-05 10:00:00'),

(7, 7, 7, NULL,
 'reservation',
 'Reservation cancellation',
 'I want to cancel my reservation.',
 NULL,
 'pending',
 '2026-08-06 09:00:00',
 NULL),

(8, 8, 8, 12,
 'payment',
 'Payment status',
 'Please check my payment status.',
 'Your payment was successful.',
 'resolved',
 '2026-08-06 10:00:00',
 '2026-08-06 11:00:00'),

(9, 9, 9, 11,
 'ticket',
 'Ticket access',
 'I could not access my ticket.',
 'The ticket was made available.',
 'resolved',
 '2026-08-07 09:00:00',
 '2026-08-07 10:00:00'),

(10, 10, 10, NULL,
 'other',
 'General question',
 'I have a question about the ticket system.',
 NULL,
 'pending',
 '2026-08-08 10:00:00',
 NULL);