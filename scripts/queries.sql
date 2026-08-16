-- 1
SELECT 
    u.firstName,
    u.lastName
FROM User u
LEFT JOIN Reservation r 
    ON u.userId = r.userId
WHERE r.reservationId IS NULL;


-- 2
SELECT DISTINCT
    u.firstName,
    u.lastName
FROM User u
JOIN Reservation r
    ON u.userId = r.userId
JOIN Payment p
    ON r.reservationId = p.reservationId
WHERE p.status = 'success';


-- 3
SELECT
    u.userId,
    u.firstName,
    u.lastName,
    YEAR(p.paymentDate) AS paymentYear,
    MONTH(p.paymentDate) AS paymentMonth,
    SUM(p.amount) AS totalPayment
FROM User u
JOIN Reservation r
    ON u.userId = r.userId
JOIN Payment p
    ON r.reservationId = p.reservationId
WHERE p.status = 'success'
GROUP BY
    u.userId,
    u.firstName,
    u.lastName,
    YEAR(p.paymentDate),
    MONTH(p.paymentDate)
ORDER BY
    paymentYear,
    paymentMonth,
    u.userId;


-- 4
SELECT
    u.userId,
    u.firstName,
    u.lastName,
    c.cityName,
    COUNT(r.reservationId) AS purchaseCount
FROM User u
JOIN City c
    ON u.cityId = c.cityId
JOIN Reservation r
    ON u.userId = r.userId
JOIN Payment p
    ON r.reservationId = p.reservationId
WHERE p.status = 'success'
GROUP BY
    u.userId,
    u.firstName,
    u.lastName,
    c.cityName
HAVING COUNT(r.reservationId) = 1;


-- 5
SELECT
    u.*
FROM User u
JOIN Reservation r
    ON u.userId = r.userId
JOIN Payment p
    ON r.reservationId = p.reservationId
WHERE p.status = 'success'
ORDER BY p.paymentDate DESC
LIMIT 1;


-- 6
SELECT
    u.userId,
    u.email,
    u.phoneNumber,
    SUM(p.amount) AS totalPayment
FROM User u
JOIN Reservation r
    ON u.userId = r.userId
JOIN Payment p
    ON r.reservationId = p.reservationId
WHERE p.status = 'success'
GROUP BY
    u.userId,
    u.email,
    u.phoneNumber
HAVING SUM(p.amount) > (
    SELECT AVG(userTotal)
    FROM (
        SELECT
            r.userId,
            SUM(p.amount) AS userTotal
        FROM Reservation r
        JOIN Payment p
            ON r.reservationId = p.reservationId
        WHERE p.status = 'success'
        GROUP BY r.userId
    ) AS userPayments
);


-- 7
SELECT
    s.sportName,
    COUNT(r.reservationId) AS soldTickets
FROM Sport s
JOIN MatchTable m
    ON s.sportId = m.sportId
JOIN Ticket t
    ON m.matchId = t.matchId
JOIN Reservation r
    ON t.ticketId = r.ticketId
JOIN Payment p
    ON r.reservationId = p.reservationId
WHERE p.status = 'success'
GROUP BY
    s.sportId,
    s.sportName
ORDER BY soldTickets DESC;


-- 8
SELECT
    u.userId,
    u.firstName,
    u.lastName,
    COUNT(r.reservationId) AS purchaseCount
FROM User u
JOIN Reservation r
    ON u.userId = r.userId
JOIN Payment p
    ON r.reservationId = p.reservationId
WHERE p.status = 'success'
  AND p.paymentDate >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY
    u.userId,
    u.firstName,
    u.lastName
ORDER BY purchaseCount DESC
LIMIT 3;


-- 9
SELECT
    c.cityName,
    COUNT(r.reservationId) AS soldTickets
FROM City c
JOIN Stadium st
    ON c.cityId = st.cityId
JOIN MatchTable m
    ON st.stadiumId = m.stadiumId
JOIN Ticket t
    ON m.matchId = t.matchId
JOIN Reservation r
    ON t.ticketId = r.ticketId
JOIN Payment p
    ON r.reservationId = p.reservationId
WHERE c.province = 'Tehran'
  AND p.status = 'success'
GROUP BY
    c.cityId,
    c.cityName
ORDER BY soldTickets DESC;


-- 10
SELECT DISTINCT
    c.cityName
FROM User u
JOIN City c
    ON u.cityId = c.cityId
JOIN Reservation r
    ON u.userId = r.userId
JOIN Payment p
    ON r.reservationId = p.reservationId
WHERE p.status = 'success'
  AND u.registrationDate = (
      SELECT MIN(registrationDate)
      FROM User
  );


-- 11
SELECT
    userId,
    firstName,
    lastName,
    email,
    phoneNumber
FROM User
WHERE role = 'support';


-- 12
SELECT
    u.userId,
    u.firstName,
    u.lastName,
    COUNT(r.reservationId) AS purchaseCount
FROM User u
JOIN Reservation r
    ON u.userId = r.userId
JOIN Payment p
    ON r.reservationId = p.reservationId
WHERE p.status = 'success'
GROUP BY
    u.userId,
    u.firstName,
    u.lastName
HAVING COUNT(r.reservationId) >= 2;


-- 13
SELECT
    u.userId,
    u.firstName,
    u.lastName,
    s.sportName,
    COUNT(r.reservationId) AS purchaseCount
FROM User u
JOIN Reservation r
    ON u.userId = r.userId
JOIN Payment p
    ON r.reservationId = p.reservationId
JOIN Ticket t
    ON r.ticketId = t.ticketId
JOIN MatchTable m
    ON t.matchId = m.matchId
JOIN Sport s
    ON m.sportId = s.sportId
WHERE p.status = 'success'
  AND s.sportName = 'Football'
GROUP BY
    u.userId,
    u.firstName,
    u.lastName,
    s.sportName
HAVING COUNT(r.reservationId) <= 2;


-- 14
SELECT
    u.userId,
    u.email,
    u.phoneNumber
FROM User u
JOIN Reservation r
    ON u.userId = r.userId
JOIN Payment p
    ON r.reservationId = p.reservationId
JOIN Ticket t
    ON r.ticketId = t.ticketId
JOIN MatchTable m
    ON t.matchId = m.matchId
JOIN Sport s
    ON m.sportId = s.sportId
WHERE p.status = 'success'
  AND s.sportName IN ('Football', 'Volleyball', 'Basketball')
GROUP BY
    u.userId,
    u.email,
    u.phoneNumber
HAVING COUNT(DISTINCT s.sportName) = 3;


-- 15
SELECT
    t.ticketId,
    u.firstName,
    u.lastName,
    s.sportName,
    p.amount,
    p.paymentDate
FROM Payment p
JOIN Reservation r
    ON p.reservationId = r.reservationId
JOIN Ticket t
    ON r.ticketId = t.ticketId
JOIN User u
    ON r.userId = u.userId
JOIN MatchTable m
    ON t.matchId = m.matchId
JOIN Sport s
    ON m.sportId = s.sportId
WHERE p.status = 'success'
  AND DATE(p.paymentDate) = CURDATE()
ORDER BY p.paymentDate ASC;


-- 16
SELECT
    tc.ticketCategoryId,
    tc.ticketCategoryName,
    tc.matchId,
    COUNT(r.reservationId) AS soldCount
FROM TicketCategory tc
JOIN Ticket t
    ON tc.ticketCategoryId = t.ticketCategoryId
JOIN Reservation r
    ON t.ticketId = r.ticketId
JOIN Payment p
    ON r.reservationId = p.reservationId
WHERE p.status = 'success'
GROUP BY
    tc.ticketCategoryId,
    tc.ticketCategoryName,
    tc.matchId
ORDER BY soldCount DESC
LIMIT 1 OFFSET 1;


-- 17
SELECT
    u.userId,
    u.firstName,
    u.lastName,
    COUNT(c.cancellationId) AS cancellationCount,
    ROUND(
        COUNT(c.cancellationId) * 100.0 /
        (SELECT COUNT(*) FROM Cancellation),
        2
    ) AS cancellationPercentage
FROM User u
JOIN Cancellation c
    ON u.userId = c.reviewedByAdminId
WHERE u.role = 'support'
GROUP BY
    u.userId,
    u.firstName,
    u.lastName
ORDER BY cancellationCount DESC
LIMIT 1;


-- 18
UPDATE User
SET lastName = 'Reddington'
WHERE userId = (
    SELECT userId
    FROM (
        SELECT
            r.userId,
            COUNT(*) AS cancelledCount
        FROM Reservation r
        WHERE r.status = 'cancelled'
        GROUP BY r.userId
        ORDER BY cancelledCount DESC
        LIMIT 1
    ) AS topCancelledUser
);


-- 19
START TRANSACTION;

DELETE r
FROM Report r
JOIN Reservation res
    ON r.reservationId = res.reservationId
JOIN User u
    ON res.userId = u.userId
JOIN Ticket t
    ON res.ticketId = t.ticketId
WHERE u.lastName = 'Reddington'
  AND t.status = 'cancelled';

DELETE p
FROM Payment p
JOIN Reservation r
    ON p.reservationId = r.reservationId
JOIN User u
    ON r.userId = u.userId
JOIN Ticket t
    ON r.ticketId = t.ticketId
WHERE u.lastName = 'Reddington'
  AND t.status = 'cancelled';

DELETE td
FROM TicketDetails td
JOIN Ticket t
    ON td.ticketId = t.ticketId
JOIN Reservation r
    ON t.ticketId = r.ticketId
JOIN User u
    ON r.userId = u.userId
WHERE u.lastName = 'Reddington'
  AND t.status = 'cancelled';

DELETE c
FROM Cancellation c
JOIN Ticket t
    ON c.ticketId = t.ticketId
JOIN User u
    ON c.userId = u.userId
WHERE u.lastName = 'Reddington'
  AND t.status = 'cancelled';

DELETE r
FROM Reservation r
JOIN Ticket t
    ON r.ticketId = t.ticketId
JOIN User u
    ON r.userId = u.userId
WHERE u.lastName = 'Reddington'
  AND t.status = 'cancelled';

DELETE t
FROM Ticket t
JOIN (
    SELECT DISTINCT r.ticketId
    FROM Reservation r
    JOIN User u
        ON r.userId = u.userId
    WHERE u.lastName = 'Reddington'
) x
    ON t.ticketId = x.ticketId
WHERE t.status = 'cancelled';

COMMIT;


-- 20
START TRANSACTION;

DELETE r
FROM Report r
JOIN Reservation res
    ON r.reservationId = res.reservationId
JOIN Ticket t
    ON res.ticketId = t.ticketId
WHERE t.status = 'cancelled';

DELETE p
FROM Payment p
JOIN Reservation r
    ON p.reservationId = r.reservationId
JOIN Ticket t
    ON r.ticketId = t.ticketId
WHERE t.status = 'cancelled';

DELETE FROM Cancellation
WHERE ticketId IN (
    SELECT ticketId
    FROM (
        SELECT ticketId
        FROM Ticket
        WHERE status = 'cancelled'
    ) AS cancelledTickets
);

DELETE FROM TicketDetails
WHERE ticketId IN (
    SELECT ticketId
    FROM (
        SELECT ticketId
        FROM Ticket
        WHERE status = 'cancelled'
    ) AS cancelledTickets
);

DELETE FROM Reservation
WHERE ticketId IN (
    SELECT ticketId
    FROM (
        SELECT ticketId
        FROM Ticket
        WHERE status = 'cancelled'
    ) AS cancelledTickets
);

DELETE FROM Ticket
WHERE status = 'cancelled';

COMMIT;


-- 21
UPDATE TicketCategory tc
SET tc.price = tc.price * 0.90
WHERE tc.ticketCategoryId IN (
    SELECT DISTINCT t.ticketCategoryId
    FROM Ticket t
    JOIN MatchTable m
        ON t.matchId = m.matchId
    JOIN Stadium st
        ON m.stadiumId = st.stadiumId
    JOIN Reservation r
        ON t.ticketId = r.ticketId
    JOIN Payment p
        ON r.reservationId = p.reservationId
    WHERE st.stadiumName = 'Azadi Stadium'
      AND p.status = 'success'
      AND DATE(p.paymentDate) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
);


-- 22
SELECT
    res.ticketId,
    COUNT(r.reportId) AS reportCount
FROM Report r
JOIN Reservation res
    ON r.reservationId = res.reservationId
GROUP BY res.ticketId
ORDER BY reportCount DESC
LIMIT 1;