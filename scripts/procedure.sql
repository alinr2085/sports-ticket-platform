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

DELIMITER ;