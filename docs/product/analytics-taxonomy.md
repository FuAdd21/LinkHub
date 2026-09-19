# LinkHub Analytics Event Taxonomy

## Purpose

LinkHub provides creator-focused analytics designed to measure audience engagement and conversion, rather than raw vanity impressions. This document defines the event taxonomy, payload contracts, deduplication rules, and calculation methods.

---

## Tracked Events

| Event Name | Description | Trigger | Target Entity |
|---|---|---|---|
| `profile_view` | Visitor navigated to a public profile page | Profile load (`GET /:username` / `POST /api/analytics/view/:username`) | User (`user_id`) |
| `link_click` | Visitor clicked a link card, pill, or external link | Server redirect (`/r/:linkId`) or API dispatch (`POST /api/analytics/click/:linkId`) | Link (`link_id`) |
| `social_row_click` | Visitor clicked an integrated social profile icon | Social row interaction on public profile | Social Account (`provider`) |
| `cta_click` | Visitor engaged with a primary profile call-to-action button | CTA action (contact, book, hire, project) | CTA / Action Target |
| `qr_scan` | Visitor accessed a profile via scanned QR code | Public profile URL with `?src=qr` referrer parameter | User Profile |

---

## Event Payload Contract

Every analytics ingestion record contains:

```typescript
interface AnalyticsEvent {
  eventType: "profile_view" | "link_click" | "social_row_click" | "cta_click";
  userId: number;
  targetId?: number | string; // link_id for link_click, provider for social
  timestamp: string; // ISO 8601 UTC
  ipHash: string; // SHA-256(client_ip + IP_SALT) truncated to 32 chars
  device: "desktop" | "mobile" | "tablet";
  referrer: string | null; // e.g. "https://instagram.com", "direct"
}
```

---

## Privacy & IP Hashing

To strictly protect visitor privacy and comply with privacy regulations:
1. **Raw IPs are never stored**: Plaintext IP addresses are never written to disk or the database.
2. **One-way salted hashing**: `ipHash = sha256(ip + IP_SALT).slice(0, 32)`.
3. **Dedicated Salt**: `IP_SALT` is configured as a secret environment variable and enforced in production.

---

## Deduplication Rules

To eliminate bot bursts, accidental double clicks, and refresh spamming:
- A sliding window of **5 minutes** is applied per `(target_id, ip_hash)`.
- If an identical `ip_hash` triggers an event for the same target within 5 minutes, subsequent triggers are dropped from persistent event writes.

---

## Conversion Metrics

- **Total Views**: Total deduplicated `profile_views` within the selected time window.
- **Total Clicks**: Total deduplicated `link_clicks` within the selected time window.
- **Click-Through Rate (CTR)**:
  $$\text{CTR} = \begin{cases} \left(\frac{\text{Total Clicks}}{\text{Total Views}}\right) \times 100\% & \text{if Total Views} > 0 \\ 100.0\% & \text{if Total Views} = 0 \text{ and Total Clicks} > 0 \\ 0.0\% & \text{otherwise} \end{cases}$$
- **Unique Visitors**: Count of distinct `ip_hash` instances observed across views and clicks within the time window.
