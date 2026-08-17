# Sport Ticket Platform — Phase 4 (Frontend)

**Authors:** Amir Reza Safari, Ali Neshastegir

## Overview

Phase 4 delivers the client-side application for the Sport Ticket Platform. It is a **React + TypeScript** single-page app (built with **Vite**) that consumes the Phase 3 backend REST API to let users browse matches, tickets, cities, and stadiums, authenticate, reserve and pay for tickets with Stripe, and manage their profile and reservations.

## Tech Stack

- **React 18** with **TypeScript**, built via **Vite**
- **React Router** (`react-router-dom`) for client-side routing
- **Bootstrap** + **Bootstrap Icons** for base styling and UI components
- **Stripe** (`@stripe/react-stripe-js`, `@stripe/stripe-js`) — embedded `Elements` provider and `CardElement` for in-app card payments
- **Context API** — global auth state (`AuthContext`) and toast notifications (`ToastContext`)
- Plain `fetch` calls to the backend (no dedicated HTTP client library)

## Project Structure

```
src/
├── api/                  # Fetch-based API service functions (e.g. AuthService)
├── assets/                # Static SVG/PNG assets: sport, team, league/tournament logos
├── auth/                  # Login/Signup/OTP UI, ProtectedRoute, AuthContext
├── layouts/
│   ├── HomePage/           # Landing page — city & stadium exploration
│   ├── CityPage/           # Browse by city
│   ├── StadiumPage/        # Browse by stadium
│   ├── MatchPage/          # Paginated match listing + match detail view
│   ├── TicketPage/         # Ticket search/filter, ticket detail, purchased tickets
│   ├── ReservationPage/    # User's reservations
│   ├── Payment/            # Stripe-powered checkout flow
│   ├── ProfilePage/        # Profile info, security (password change), reports
│   ├── NavbarAndFooter/    # Shared navbar & footer
│   ├── Notifications/      # Toast notification system
│   └── Utils/               # Pagination, spinner, icon-mapping helpers
├── models/                # TypeScript interfaces mirroring backend response/request DTOs
├── lib/                   # Stripe client initialization
├── App.tsx                # Route definitions
└── main.tsx               # App bootstrap: Router, Toast, Auth, and Stripe providers
```

## Key Features

- **Authentication** — login, two-step signup, and OTP-based forgot-password flow, backed by JWT tokens stored in `localStorage` and exposed app-wide via `AuthContext`. `ProtectedRoute` guards authenticated (and optionally role-restricted) routes.
- **Browsing** — home page with city and stadium exploration, dedicated pages for cities, stadiums, and paginated matches, each pulling live data from the backend.
- **Ticketing** — searchable and filterable ticket listing (by team, city, or stadium, plus sport/date/price filters), ticket detail view, and a purchased-tickets view for logged-in users.
- **Reservations & Payment** — users can view their reservations and complete checkout through a Stripe-embedded card form (`CardElement`) styled to match the app's dark theme.
- **Profile Management** — tabbed profile page (Profile / Security / Reports) for updating personal info, changing password, and submitting/viewing support reports.
- **Notifications** — a global toast system for success/error feedback across the app.

## Data Models

TypeScript interfaces under `src/models/` mirror the backend's response/request DTOs, including `MatchResponseModel`, `TicketResponseModel`, `ReservationResponseModel`, `UserProfileModel`, `CityModel`, `StadiumModel`, `TicketFilterRequestModel`, and `CancellationPenaltyModel` (used to preview refund/penalty amounts before cancelling a ticket).

## Backend Integration

The frontend expects the Phase 3 backend to be running locally at:

```
http://localhost:8082
```

Key endpoints consumed include `/user/auth/login`, `/user/auth/signup`, `/user/auth/verify`, `/user/auth/resend-otp`, `/user/profile`, `/matches`, `/reservations`, and ticket/payment-related routes. Authenticated requests attach the JWT as a `Bearer` token in the `Authorization` header.

## Getting Started

### Prerequisites

- Node.js and npm (or a compatible package manager)
- The Phase 3 backend running locally on port `8082`

### Install & Run

```bash
npm install
npm run dev
```

The app will be served by Vite's dev server (default `http://localhost:5173`).

> Note: this bundle does not include `package.json` — regenerate it (or restore it from the project's Git history) with the dependencies listed above (`react`, `react-dom`, `react-router-dom`, `@stripe/react-stripe-js`, `@stripe/stripe-js`, `bootstrap`, `bootstrap-icons`, TypeScript, and Vite) before installing.

## Notes

- Stripe is currently initialized with a **publishable test key** hardcoded in `src/lib/StripePromise.ts` — move this to an environment variable before any production use.
- API base URLs (e.g. `http://localhost:8082/...`) are hardcoded per-file rather than centralized in a config/env file; consolidating them would simplify switching between local and deployed backends.

---

*Part of a university database course final project — Phase 4 (Frontend). Supervised by Dr. Pishgo (TA: Alireza Ghorbani).*
