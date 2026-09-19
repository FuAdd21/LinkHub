-- Migration 003: Daily analytics aggregates table
-- Pre-aggregates daily metrics for high-scale performance

CREATE TABLE IF NOT EXISTS analytics_daily_rollups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_date DATE NOT NULL,
  event_type ENUM('view', 'click', 'cta', 'social') NOT NULL,
  target_id INT DEFAULT NULL,
  count INT NOT NULL DEFAULT 1,
  unique_visitors INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_rollup (user_id, event_date, event_type, target_id),
  FOREIGN KEY (user_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_rollups_user_date (user_id, event_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
