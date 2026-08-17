# Sport Ticket Platform — Backend

**Authors:** Amir Reza Safari, Ali Neshaste Gir

## Overview

This is the backend service for the Sport Ticket Platform, a reservation system for football, volleyball, and basketball matches. It is built with **Spring Boot 3.2.5** and **Java 17**, and exposes a REST API consumed by the platform's frontend.

## Tech Stack

- **Spring Boot** — Web, Validation, Data REST, JDBC
- **MySQL** — primary relational database (via `mysql-connector-j`)
- **Redis** (`spring-boot-starter-data-redis`) — used for OTP storage with TTL (signup verification and forgot-password flows)
- **JWT** (`io.jsonwebtoken` / jjwt) — stateless authentication, with user role embedded directly in the token
- **Spring Security OAuth2 Resource Server** — validates and processes incoming JWTs
- **Lombok** — reduces boilerplate in models and services
- **Postman** — used for manual and collection-based testing of the REST API endpoints

## Email Service

The backend integrates **Spring Boot Mail** (`spring-boot-starter-mail`) to handle transactional emails, including:

- Sending One-Time Passwords (OTPs) for account signup verification
- Sending OTPs for the forgot-password flow
- General account notification emails

OTP codes are generated on request, emailed to the user, and stored temporarily in Redis with a TTL so they automatically expire after a short window.

## Payments — Stripe

Payment processing is handled via the official **Stripe Java SDK** (`stripe-java`). Stripe is used to:

- Securely process ticket purchase payments
- Confirm and finalize reservations once payment succeeds
- Handle payment-related transaction records shown in the user's account (Transactions section)

No card data is stored directly by the backend — all sensitive payment handling is delegated to Stripe.

## Redis

Redis is used as an in-memory store for short-lived data, primarily:

- OTP codes generated during signup verification and the forgot-password flow
- Each OTP is stored with a TTL, so it automatically expires and cannot be reused after the window closes

A running Redis instance is required for these authentication flows to work correctly.

## API Testing — Postman

The REST API is tested using **Postman**. A collection covering the main endpoints (authentication, OTP flows, match browsing, ticket reservation, and payment) is used to:

- Manually verify endpoint behavior during development
- Check JWT-protected routes by attaching bearer tokens issued after login
- Validate request/response payloads against the expected models before wiring up the frontend

## Project Structure Notes

- A single `role` field on the base user entity distinguishes between regular users and support staff, rather than separate child tables.
- The `Data REST` starter is used instead of `Data JPA` in the current configuration (see commented-out dependency in `pom.xml`).

## Getting Started

### Prerequisites

- Java 17
- Maven
- MySQL instance (schema from Phase 1/2 of the project)
- Redis instance
- Stripe account (API keys for test/live mode)
- SMTP credentials for the email service

### Build & Run

```bash
mvn clean install
mvn spring-boot:run
```

### Configuration

Set the following properties (e.g. in `application.properties` / `application.yml` or environment variables):

- MySQL connection URL, username, password
- Redis host/port
- JWT signing secret
- Stripe secret key
- SMTP host, port, username, password

## Sports Covered

- Football
- Volleyball
- Basketball

## Roles

- **Regular User** — browses matches, purchases tickets, manages their account
- **Support Staff** — handles system support duties

---

*This backend is part of a university database course final project, supervised by Dr. Pishgo (TA: Alireza Ghorbani).*
