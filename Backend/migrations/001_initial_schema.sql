-- Migration 001: Initial Schema
-- Full schema for clients, links, clicks, profile_views, and integrations

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  username VARCHAR(50) UNIQUE DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  avatar VARCHAR(512) DEFAULT NULL,
  banner_url VARCHAR(512) DEFAULT NULL,
  theme VARCHAR(50) DEFAULT 'Obsidian',
  accent_color VARCHAR(30) DEFAULT '#c6f035',
  surface_color VARCHAR(30) DEFAULT '#11120F',
  font_heading VARCHAR(50) DEFAULT 'Manrope / Semibold',
  font_labels VARCHAR(50) DEFAULT 'IBM Plex Mono / Medium',
  show_verified_badge TINYINT(1) DEFAULT 1,
  show_social_row TINYINT(1) DEFAULT 1,
  show_in_search TINYINT(1) DEFAULT 1,
  show_audience_totals TINYINT(1) DEFAULT 1,
  usage_summaries TINYINT(1) DEFAULT 1,
  custom_domain VARCHAR(255) DEFAULT NULL,
  background_type VARCHAR(20) DEFAULT 'gradient',
  background_value VARCHAR(255) DEFAULT NULL,
  youtubeId VARCHAR(100) DEFAULT NULL,
  githubUser VARCHAR(100) DEFAULT NULL,
  telegramUser VARCHAR(100) DEFAULT NULL,
  instagram VARCHAR(100) DEFAULT NULL,
  twitter VARCHAR(100) DEFAULT NULL,
  linkedin VARCHAR(100) DEFAULT NULL,
  tiktok VARCHAR(100) DEFAULT NULL,
  reset_token VARCHAR(255) DEFAULT NULL,
  reset_token_expires DATETIME DEFAULT NULL,
  session_version INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(512) NOT NULL,
  platform VARCHAR(50) DEFAULT NULL,
  username VARCHAR(100) DEFAULT NULL,
  profileData JSON DEFAULT NULL,
  avatar_url VARCHAR(512) DEFAULT NULL,
  icon VARCHAR(100) DEFAULT NULL,
  display_mode VARCHAR(20) DEFAULT 'link',
  position INT DEFAULT 0,
  is_visible TINYINT(1) DEFAULT 1,
  scheduled_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_links_user_position (user_id, position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS clicks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  link_id INT NOT NULL,
  user_id INT NOT NULL,
  ip VARCHAR(64) DEFAULT NULL,
  device VARCHAR(20) DEFAULT 'desktop',
  referrer VARCHAR(512) DEFAULT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_clicks_user_timestamp (user_id, timestamp),
  INDEX idx_clicks_link_timestamp (link_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profile_views (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  ip VARCHAR(64) DEFAULT NULL,
  device VARCHAR(20) DEFAULT 'desktop',
  referrer VARCHAR(512) DEFAULT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_views_user_timestamp (user_id, timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS integrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  provider VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'connected',
  config JSON DEFAULT NULL,
  last_synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_provider (user_id, provider),
  FOREIGN KEY (user_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
