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