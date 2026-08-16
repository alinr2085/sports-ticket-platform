# Sport Ticket Platform — Phase 2

**Authors:** Amir Reza Safari, Ali Neshastegir

## Overview

Phase 2 builds on the Phase 1 schema (`db_sports_ticket`) by populating it with realistic sample data and adding the SQL layer needed to query and manipulate that data: analytical `SELECT` queries, transactional `UPDATE`/`DELETE` operations, and reusable stored procedures.

This phase contains three files:

| File | Purpose |
|---|---|
| `inserts.sql` | Populates all tables with consistent, cross-referenced sample data |
| `queries.sql` | 22 analytical and data-manipulation queries answering business questions |
| `procedure.sql` | 8 stored procedures for common, parameterized lookups |

## 1. Sample Data (`inserts.sql`)

Run against the `db_sports_ticket` schema. Data is inserted in dependency order so foreign keys resolve correctly:

1. **Reference data:** `City`, `Sport`, `Stadium`, `League`, `Tournament`, `Team`
2. **Matches:** `MatchTable` — a mix of `scheduled` and `finished` football matches across multiple leagues/tournaments, plus a later block adding **volleyball** and **basketball** matches (new stadiums: Ahoy Arena, Mediolanum Forum; new teams for both sports)
3. **Ticketing:** `TicketCategory` (Standard/VIP pricing per match), `Ticket` (individual seats, mostly `available`, some `unavailable`), `TicketDetails` (denormalized display info — tournament/league/stadium name, facilities)
4. **Users:** `User` — 12 sample users, 10 with `role = 'user'` and 2 with `role = 'support'`, each tied to a city
5. **Transactions:** `Reservation` (paid and cancelled reservations), `Payment` (successful payments matching paid reservations), `Cancellation` (refund records for cancelled tickets), `Report` (support tickets raised by users, some `reviewed`, some `pending`)

**Coverage notes:**
- All three sports (Football, Volleyball, Basketball) have at least one match, ticket category, and ticket.
- Reservation/Payment data is intentionally consistent — every `paid` reservation has a matching `success` payment, and every `cancelled` reservation has a matching `Cancellation` record.
- Report data includes both resolved (`reviewed`) and open (`pending`) support tickets, referencing the two support users as handlers.

## 2. Analytical Queries (`queries.sql`)

22 numbered queries covering common product/business questions, grouped roughly as follows:

**User behavior & segmentation**
- Users with no reservations at all (`LEFT JOIN ... IS NULL`)
- Users with at least one successful purchase
- Monthly spending totals per user
- Users with exactly one purchase in their city
- Most recent paying customer
- Users whose total spend is above the average user spend (subquery)
- Top 3 most active buyers in the last 7 days
- Users who bought tickets for all three sports (`HAVING COUNT(DISTINCT sportName) = 3`)
- Same-day ticket purchases

**Sport & venue analytics**
- Tickets sold per sport, ranked
- Tickets sold in a specific province (Tehran) by city
- Cities of the earliest-registered user who purchased successfully
- Second-most-sold ticket category (`LIMIT 1 OFFSET 1`)

**Support & admin**
- List of all support-role users
- Support staff with the highest share of reviewed cancellations
- Most-reported ticket

**Data manipulation (DML)**
- `UPDATE` renaming the user with the most cancellations to `'Reddington'`
- Two `START TRANSACTION ... COMMIT` blocks that cascade-delete all cancelled-ticket-related records (Report → Payment → TicketDetails → Cancellation → Reservation → Ticket), demonstrating referential cleanup in dependency order
- `UPDATE` applying a 10% discount to all ticket categories tied to matches played at a specific stadium on a specific date

## 3. Stored Procedures (`procedure.sql`)

All procedures are created in `db_sports_ticket` using `DELIMITER $$`:

| # | Procedure | Parameters | Purpose |
|---|---|---|---|
| 1 | `GetUserPurchases` | `p_email`, `p_phone` | Full purchase history for a user, found by email or phone |
| 2 | `GetUsersWithCancelledReservations` | — | All users with at least one cancelled reservation |
| 3 | `GetPurchasedTicketsByCity` | `p_cityName` | Successful ticket purchases filtered by user's city |
| 4 | `SearchUsers` | `p_search` | Fuzzy search across name, email, and phone number |
| 5 | `GetSameCityUsers` | `p_userId` | Other users living in the same city as a given user |
| 6 | `GetTopNUsers` | `p_startDate`, `p_limit` | Top N buyers (by purchase count, then spend) since a given date |
| 7 | `GetCancelledTicketsBySport` | `p_sportName` | Cancelled tickets/reservations for a given sport, with cancellation details |
| 8 | `GetUsersWithMostReportsBySubject` | `p_category` | Users ranked by number of support reports in a given category |

## How to Run

1. Ensure the Phase 1 schema is already created (`phase1_schema.sql`) and selected: `USE db_sports_ticket;`
2. Execute `inserts.sql` to load sample data.
3. Execute `procedure.sql` to create the stored procedures (uses `DELIMITER $$` — run as a full script, not statement-by-statement, in tools like DataGrip).
4. Run individual statements from `queries.sql` to test analytics and DML behavior, or call procedures directly, e.g.:
   ```sql
   CALL GetUserPurchases('ali.cc2085@gmail.com', NULL);
   CALL GetTopNUsers('2026-08-01', 3);
   ```


---

*Part of a university database course final project — Phase 2 (Sample Data, Queries & Stored Procedures). Supervised by Dr. Pishgo (TA: Alireza Ghorbani).*
