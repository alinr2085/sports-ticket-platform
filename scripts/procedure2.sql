USE db_sports_ticket;

DELIMITER $$

-- =========================================================
-- 1
-- =========================================================
CREATE PROCEDURE GetUserPurchases(
    IN p_email VARCHAR(255),
    IN p_phone VARCHAR(30)
)
BEGIN
    SELECT
        u.userId,
        u.firstName,
        u.lastName,
        u.email,
        u.phoneNumber,
        t.ticketId,
        s.sportName,
        m.matchDate,
        tc.ticketCategoryName,
        tc.price,
        p.amount,
        p.paymentDate,
        p.status AS paymentStatus
    FROM User u
    JOIN Reservation r
        ON u.userId = r.userId
    JOIN Ticket t
        ON r.ticketId = t.ticketId
    JOIN MatchTable m
        ON t.matchId = m.matchId
    JOIN Sport s
        ON m.sportId = s.sportId
    JOIN TicketCategory tc
        ON t.ticketCategoryId = tc.ticketCategoryId
    JOIN Payment p
        ON r.reservationId = p.reservationId
    WHERE
        (
            (p_email IS NOT NULL AND u.email = p_email)
            OR
            (p_phone IS NOT NULL AND u.phoneNumber = p_phone)
        )
        AND p.status = 'success'
    ORDER BY p.paymentDate DESC;
END$$

-- =========================================================
-- 2
-- =========================================================
CREATE PROCEDURE GetUsersWithCancelledReservations()
BEGIN
    SELECT DISTINCT
        u.userId,
        u.firstName,
        u.lastName,
        u.email,
        u.phoneNumber,
        r.reservationId,
        r.status AS reservationStatus,
        r.reservationDate,
        r.expiresAt
    FROM User u
    JOIN Reservation r
        ON u.userId = r.userId
    WHERE r.status = 'cancelled'
    ORDER BY r.reservationDate DESC;
END$$

-- =========================================================
-- 3
-- =========================================================
CREATE PROCEDURE GetPurchasedTicketsByCity(
    IN p_cityName VARCHAR(100)
)
BEGIN
    SELECT
        t.ticketId,
        u.userId,
        u.firstName,
        u.lastName,
        c.cityName,
        s.sportName,
        m.matchDate,
        tc.ticketCategoryName,
        tc.price,
        p.amount,
        p.paymentDate
    FROM User u
    JOIN City c
        ON u.cityId = c.cityId
    JOIN Reservation r
        ON u.userId = r.userId
    JOIN Ticket t
        ON r.ticketId = t.ticketId
    JOIN MatchTable m
        ON t.matchId = m.matchId
    JOIN Sport s
        ON m.sportId = s.sportId
    JOIN TicketCategory tc
        ON t.ticketCategoryId = tc.ticketCategoryId
    JOIN Payment p
        ON r.reservationId = p.reservationId
    WHERE c.cityName = p_cityName
      AND p.status = 'success'
    ORDER BY p.paymentDate DESC;
END$$

-- =========================================================
-- 4
-- =========================================================
CREATE PROCEDURE SearchUsers(
    IN p_search VARCHAR(255)
)
BEGIN
    SELECT
        userId,
        firstName,
        lastName,
        email,
        phoneNumber,
        role,
        accountStatus,
        registrationDate
    FROM User
    WHERE
        firstName LIKE CONCAT('%', p_search, '%')
        OR lastName LIKE CONCAT('%', p_search, '%')
        OR email LIKE CONCAT('%', p_search, '%')
        OR phoneNumber LIKE CONCAT('%', p_search, '%')
    ORDER BY firstName, lastName;
END$$

-- =========================================================
-- 5
-- =========================================================
CREATE PROCEDURE GetSameCityUsers(
    IN p_userId INT
)
BEGIN
    SELECT
        u2.userId,
        u2.firstName,
        u2.lastName,
        u2.email,
        u2.phoneNumber,
        c.cityName
    FROM User u1
    JOIN User u2
        ON u1.cityId = u2.cityId
    JOIN City c
        ON u2.cityId = c.cityId
    WHERE u1.userId = p_userId
      AND u2.userId <> p_userId
    ORDER BY u2.firstName, u2.lastName;
END$$

-- =========================================================
-- 6
-- =========================================================
CREATE PROCEDURE GetTopNUsers(
    IN p_startDate DATE,
    IN p_limit INT
)
BEGIN
    SELECT
        u.userId,
        u.firstName,
        u.lastName,
        u.email,
        COUNT(r.reservationId) AS purchaseCount,
        SUM(p.amount) AS totalPayment
    FROM User u
    JOIN Reservation r
        ON u.userId = r.userId
    JOIN Payment p
        ON r.reservationId = p.reservationId
    WHERE p.status = 'success'
      AND DATE(p.paymentDate) >= p_startDate
    GROUP BY
        u.userId,
        u.firstName,
        u.lastName,
        u.email
    ORDER BY
        purchaseCount DESC,
        totalPayment DESC
    LIMIT p_limit;
END$$

-- =========================================================
-- 7
-- =========================================================
CREATE PROCEDURE GetCancelledTicketsBySport(
    IN p_sportName VARCHAR(100)
)
BEGIN
    SELECT
        t.ticketId,
        u.userId,
        u.firstName,
        u.lastName,
        s.sportName,
        m.matchDate,
        tc.ticketCategoryName,
        tc.price,
        r.reservationId,
        r.status AS reservationStatus,
        c.cancellationId,
        c.requestDate,
        c.refundAmount,
        c.status AS cancellationStatus
    FROM Ticket t
    JOIN MatchTable m
        ON t.matchId = m.matchId
    JOIN Sport s
        ON m.sportId = s.sportId
    JOIN TicketCategory tc
        ON t.ticketCategoryId = tc.ticketCategoryId
    JOIN Reservation r
        ON t.ticketId = r.ticketId
    JOIN User u
        ON r.userId = u.userId
    LEFT JOIN Cancellation c
        ON t.ticketId = c.ticketId
    WHERE s.sportName = p_sportName
      AND (
          t.status = 'cancelled'
          OR r.status = 'cancelled'
          OR c.status = 'cancelled'
      )
    ORDER BY m.matchDate DESC;
END$$

-- =========================================================
-- 8
-- =========================================================
CREATE PROCEDURE GetUsersWithMostReportsBySubject(
    IN p_category VARCHAR(100)
)
BEGIN
    SELECT
        u.userId,
        u.firstName,
        u.lastName,
        u.email,
        COUNT(r.reportId) AS reportCount
    FROM User u
    JOIN Report r
        ON u.userId = r.userId
    WHERE r.category = p_category
    GROUP BY
        u.userId,
        u.firstName,
        u.lastName,
        u.email
    ORDER BY reportCount DESC;
END$$


DELIMITER ;