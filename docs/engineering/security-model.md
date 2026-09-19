# LinkHub Security Model

## Authentication

### Strategy: JWT in HttpOnly Cookie

LinkHub uses JSON Web Tokens stored in HTTP-only cookies for authentication.

```
Login
  → Server generates JWT with { id, email, sessionVersion }
  → Server sets HttpOnly cookie "token" (secure in prod, sameSite=lax)
  → Server generates random CSRF token
  → Server sets non-HttpOnly cookie "csrf_token"
  → Client receives userId, name, username in response body
```

### Why JWT-in-Cookie (not localStorage)

- **HttpOnly**: JavaScript cannot read the token → XSS cannot steal sessions
- **Secure flag**: Cookie only sent over HTTPS in production
- **SameSite=Lax**: Prevents CSRF on most cross-origin requests
- **Automatic**: Browser sends cookies automatically — no manual header management

### Session Versioning

```
clients.session_version INT DEFAULT 1
```

- JWT includes `sessionVersion` claim
- On each authenticated request, middleware checks token's `sessionVersion` against DB
- On password change: `session_version` increments → all existing JWTs rejected
- Provides "logout everywhere" capability without server-side session storage

### CSRF Protection

State-modifying requests (POST, PUT, PATCH, DELETE) via cookie auth require:

1. `csrf_token` cookie (set by server on login, readable by JavaScript)
2. `X-CSRF-Token` request header (set by client, must match cookie)

The server compares the header value against the cookie value. An attacker on a different origin cannot read the cookie, so they cannot forge the header.

## Authorization

### Ownership Model

All user data is isolated by `user_id`:

```sql
-- Every query for user data includes the ownership check
WHERE user_id = ? AND id = ?
```

A user can only:
- Read/modify their own links
- Read/modify their own profile
- Read their own analytics
- Manage their own integrations

Public profile endpoints return only non-sensitive data (never email, password hash, internal IDs).

## Input Validation

### Server-Side (Zod)

All input is validated server-side using Zod schemas before reaching business logic:

- Email format validation
- URL validation (http/https only)
- Password strength requirements (8+ chars, uppercase, number)
- String length limits
- Enum validation (display modes, background types, etc.)
- Integer range validation

### Client-Side

Client-side validation exists for UX but is **never trusted**. All validation is duplicated server-side.

## Rate Limiting

| Endpoint Group | Window | Max Requests | Purpose |
|---------------|--------|-------------|---------|
| Auth (login/register) | 15 min | 20 per IP | Prevent brute force |
| Social fetch | 15 min | 100 per IP | Prevent API abuse |
| Analytics tracking | 1 min | 60 per IP | Prevent inflated metrics |
| Public profile | TBD | TBD | Prevent scraping |

Rate limits are relaxed for localhost in development.

## Data Protection

### Passwords
- Hashed with bcrypt (cost factor 10)
- Never logged, never returned in API responses
- Password strength enforced: 8+ chars, uppercase letter, number

### IP Addresses
- Hashed with SHA-256 + salt before storage
- Raw IPs are never persisted
- Salt configured via `IP_SALT` environment variable
- In production, missing `IP_SALT` throws a startup error

### Password Reset Tokens
- Generated with `crypto.randomBytes(32)`
- Hashed with SHA-256 before storage
- Raw token sent via email, hash stored in DB
- Expires after 1 hour
- Single-use (cleared after successful reset)
- Session version incremented on reset → invalidates all existing sessions

### Uploaded Files
- Filenames sanitized with random UUIDs
- File type validated by extension (magic byte validation planned)
- Size limits enforced
- Served from static directory, not from database

## Security Headers (Helmet)

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN (via frame-ancestors)
X-XSS-Protection: 0 (deprecated, CSP preferred)
Strict-Transport-Security: max-age=... (in production)
Referrer-Policy: strict-origin-when-cross-origin
Cross-Origin-Resource-Policy: cross-origin (for uploads)
```

## CORS

```
Allowed Origins:
  - FRONTEND_URL (production)
  - http://localhost:5173 (development)
  - http://127.0.0.1:5173 (development)

Credentials: true
Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Allowed Headers: Content-Type, Authorization, X-CSRF-Token
```

## SQL Injection Prevention

All database queries use parameterized queries via mysql2:

```js
// CORRECT — parameterized
await db.query("SELECT * FROM clients WHERE email = ?", [email]);

// NEVER — string interpolation
await db.query(`SELECT * FROM clients WHERE email = '${email}'`);
```

## Environment Variables

### Required in Production
- `JWT_SECRET`: Must be a strong random secret
- `IP_SALT`: Salt for IP address hashing
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Database credentials
- `FRONTEND_URL`: Production frontend URL for CORS

### Sensitive — Never Expose
- `JWT_SECRET`
- `DB_PASSWORD`
- `SMTP_PASS`
- `YOUTUBE_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `IP_SALT`

### Frontend (VITE_*) — Publicly Visible
Only non-sensitive configuration:
- `VITE_API_BASE_URL`: Backend API URL

**Never put secrets in `VITE_*` variables.**

## Known Risks & Mitigations

| Risk | Status | Mitigation |
|------|--------|------------|
| XSS via bio/title | Mitigated | React auto-escapes, server validates length |
| SSRF via social fetch | Partial | URL validation exists, dedicated HTTP client planned |
| Session fixation | Mitigated | New JWT issued on every login |
| Timing attacks on auth | Partial | bcrypt is constant-time, but email enumeration prevention incomplete |
| File upload attacks | Partial | UUID filenames, size limits; magic byte validation planned |
