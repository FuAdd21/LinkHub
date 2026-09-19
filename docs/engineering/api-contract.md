# LinkHub API Contract

## Response Format

All API endpoints follow a standardized response format.

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "LINK_NOT_FOUND",
    "message": "Link not found"
  }
}
```

### Validation Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": [
      { "field": "title", "message": "Title is required" },
      { "field": "url", "message": "Invalid URL format" }
    ]
  }
}
```

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST that creates a resource |
| 400 | Bad Request | Validation error, malformed input |
| 401 | Unauthorized | No token, expired token, invalid token |
| 403 | Forbidden | Valid token but insufficient permissions, CSRF failure |
| 404 | Not Found | Resource doesn't exist or doesn't belong to user |
| 409 | Conflict | Duplicate resource (email, username) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unhandled server error |

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `NO_TOKEN` | 401 | No authentication token provided |
| `TOKEN_EXPIRED` | 401 | JWT has expired |
| `TOKEN_INVALID` | 403 | JWT signature invalid |
| `SESSION_REVOKED` | 401 | Session version mismatch (password changed) |
| `CSRF_INVALID` | 403 | CSRF token validation failed |
| `USER_NOT_FOUND` | 401 | Token references non-existent user |
| `UNAUTHORIZED` | 401 | Generic authentication failure |
| `FORBIDDEN` | 403 | Authenticated but not authorized |
| `NOT_FOUND` | 404 | Resource not found |
| `LINK_NOT_FOUND` | 404 | Link doesn't exist or doesn't belong to user |
| `DUPLICATE_EMAIL` | 409 | Email already registered |
| `DUPLICATE_USERNAME` | 409 | Username already taken |
| `RESERVED_USERNAME` | 400 | Username is reserved |
| `LINK_LIMIT_REACHED` | 400 | Maximum links per user exceeded |
| `INVALID_RESET_TOKEN` | 400 | Reset token invalid or expired |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unhandled server error |

## Authentication

### Cookie-Based (Primary)

All authenticated requests include:
- `token` cookie (HttpOnly, Secure in prod, SameSite=Lax) — contains JWT
- `csrf_token` cookie (non-HttpOnly) — CSRF protection

State-modifying requests (POST, PUT, PATCH, DELETE) must include:
- `X-CSRF-Token` header — must match `csrf_token` cookie value

### Session Versioning

- Each user has a `session_version` counter
- JWT includes `sessionVersion` claim
- On password change: `session_version` increments → all existing JWTs invalidated
- Middleware checks `sessionVersion` match on every authenticated request

## Endpoint Overview

### Auth (`/`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Create account |
| POST | `/login` | No | Login, set cookies |
| POST | `/logout` | Yes | Clear cookies |
| POST | `/forgot-password` | No | Request password reset |
| POST | `/reset-password` | No | Reset password with token |

### Users (`/api/users`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/users/me` | Yes | Get current user profile |
| PUT | `/api/users/me` | Yes | Update current user |
| POST | `/api/users/avatar` | Yes | Upload avatar |

### Links (`/api`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/links` | Yes | Get user's links |
| POST | `/api/links` | Yes | Create link |
| PUT | `/api/links/:linkId` | Yes | Update link |
| DELETE | `/api/links/:linkId` | Yes | Delete link |
| PATCH | `/api/links/reorder` | Yes | Reorder links |
| PATCH | `/api/links/:linkId/visibility` | Yes | Toggle visibility |
| PATCH | `/api/links/:linkId/display-mode` | Yes | Change display mode |

### Profile (`/api`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/profile/:username` | No | Public profile data |
| PUT | `/api/profile` | Yes | Update profile settings |
| PUT | `/api/profile/username` | Yes | Set/change username |
| GET | `/api/profile/check/:username` | No | Check username availability |

### Analytics (`/api`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/analytics` | Yes | Dashboard analytics |
| POST | `/api/analytics/click/:linkId` | No | Track link click |
| POST | `/api/analytics/view/:username` | No | Track profile view |

### Integrations (`/api/integrations`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/integrations` | Yes | Get user's integrations |
| POST | `/api/integrations/connect` | Yes | Connect a platform |
| POST | `/api/integrations/disconnect` | Yes | Disconnect a platform |
| POST | `/api/integrations/:provider/sync` | Yes | Re-sync platform data |

### Redirect (`/r`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/r/:linkId` | No | Redirect to link destination + track click |

### Health
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Basic health check |
