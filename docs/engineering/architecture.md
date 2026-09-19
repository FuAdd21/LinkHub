# LinkHub Architecture

## Overview

LinkHub is a professional identity platform with a Node.js/Express backend, MySQL database, and React (Vite) frontend.

## Current Architecture

```
┌──────────────────────────────────────────────────┐
│                    Frontend                       │
│              React + Vite (SPA)                   │
│                                                   │
│   Components ─→ API Client ─→ Backend API        │
│   Context (Auth)                                  │
│   Pages (Dashboard, PublicProfile, Onboarding)    │
└──────────────┬───────────────────────────────────┘
               │ HTTP (Axios, withCredentials)
               │
┌──────────────▼───────────────────────────────────┐
│                    Backend                        │
│              Express.js (ES Modules)              │
│                                                   │
│   Routes ─→ Controllers ─→ Database (direct)     │
│   Middleware (Auth, CSRF, Rate Limit, Helmet)     │
│   Services (Social providers)                     │
└──────────────┬───────────────────────────────────┘
               │ mysql2/promise
               │
┌──────────────▼───────────────────────────────────┐
│                    Database                       │
│                    MySQL                          │
│                                                   │
│   clients, links, clicks, profile_views,         │
│   integrations                                    │
└──────────────────────────────────────────────────┘
```

## Target Architecture

```
┌──────────────────────────────────────────────────┐
│                    Frontend                       │
│              React + Vite (SPA)                   │
│                                                   │
│   Pages ─→ Hooks ─→ API Modules ─→ API Client   │
│   Context (Auth)                                  │
│   Components (ui/, profile/, links/, analytics/)  │
└──────────────┬───────────────────────────────────┘
               │ HTTP (Axios, withCredentials)
               │
┌──────────────▼───────────────────────────────────┐
│                    Backend                        │
│              Express.js (ES Modules)              │
│                                                   │
│   Routes                                          │
│     ↓ (validation middleware — Zod)              │
│   Controllers (thin — validate/respond)           │
│     ↓                                            │
│   Services (business rules)                       │
│     ↓                                            │
│   Repositories (database access)                  │
│     ↓                                            │
│   Database (mysql2/promise pool)                  │
│                                                   │
│   Cross-cutting:                                  │
│     Config (env.js, db.js, logger.js)            │
│     Errors (AppError, errorHandler)               │
│     Middleware (auth, csrf, rate limit, helmet)    │
│     Utils (cache, httpClient, security)           │
└──────────────┬───────────────────────────────────┘
               │ mysql2/promise
               │
┌──────────────▼───────────────────────────────────┐
│                    Database                       │
│                    MySQL                          │
│                                                   │
│   clients, links, clicks, profile_views,         │
│   integrations, projects, credentials,           │
│   _migrations                                     │
│                                                   │
│   Schema managed by file-based migrations        │
└──────────────────────────────────────────────────┘
```

## Backend Directory Structure (Target)

```
Backend/
├── src/
│   ├── app.js                    # Express app setup
│   ├── config/
│   │   ├── env.js                # Centralized env config
│   │   ├── db.js                 # MySQL pool
│   │   └── logger.js             # Structured logging
│   ├── controllers/              # Thin HTTP handlers
│   ├── services/                 # Business logic
│   │   └── social/
│   │       ├── socialService.js  # Unified social interface
│   │       └── providers/        # Per-platform adapters
│   ├── repositories/             # Database access
│   ├── schemas/                  # Zod validation schemas
│   ├── middleware/               # Express middleware
│   ├── errors/                   # Error classes and handler
│   └── utils/                    # Shared utilities
├── migrations/                   # SQL migration files
├── tests/
│   ├── unit/
│   └── integration/
├── server.js                     # Server lifecycle only
└── package.json
```

## Frontend Directory Structure (Target)

```
link-sharing-frontend/src/
├── api/
│   ├── client.js                 # Shared Axios instance
│   ├── authApi.js
│   ├── linksApi.js
│   ├── profileApi.js
│   ├── projectsApi.js
│   ├── analyticsApi.js
│   └── integrationsApi.js
├── components/
│   ├── ui/                       # Generic UI components
│   ├── auth/
│   ├── profile/
│   ├── links/
│   ├── projects/
│   ├── socials/
│   └── analytics/
├── pages/
│   ├── PublicProfile.jsx
│   ├── Onboarding.jsx
│   └── dashboard/
├── hooks/
├── context/
├── utils/
└── main.jsx
```

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Runtime | Node.js (ES Modules) | Already in use, modern syntax |
| Framework | Express 4 | Already in use, stable |
| Database | MySQL (mysql2/promise) | Already in use, relational data |
| Auth | JWT in HttpOnly cookie + CSRF | Already implemented, secure |
| Validation | Zod | Type-safe, composable schemas |
| Frontend | React + Vite | Already in use, fast dev experience |
| HTTP Client | Axios | Already in use, interceptors |
| Testing | Node test runner | Built-in, no extra dependency |

## Key Patterns

### Request Flow
```
Client Request
  → CORS
  → Helmet (security headers)
  → Cookie Parser
  → Body Parser
  → Rate Limiter (per-route)
  → Auth Middleware (if protected)
  → Validation Middleware (Zod)
  → Controller
  → Service
  → Repository
  → MySQL
  → Response
```

### Error Flow
```
Any layer throws AppError
  → Caught by global error handler
  → Logged (without sensitive data)
  → Standardized JSON response to client
```

### Auth Flow
```
Login → JWT in HttpOnly cookie + CSRF cookie
  → Each request: cookie sent automatically
  → State-modifying requests: CSRF header validated
  → JWT decoded → session_version checked against DB
  → req.user populated
```
