-- Migration 002: Integrity constraints and query optimization indexes

-- Index for public profile queries: finding visible links by user ordered by position
CREATE INDEX idx_links_user_visible_pos ON links (user_id, is_visible, position);

-- Index for username lookup
CREATE INDEX idx_clients_username ON clients (username);

-- Index for integrations lookup by user and status
CREATE INDEX idx_integrations_user_status ON integrations (user_id, status);
