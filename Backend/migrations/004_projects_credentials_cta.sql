-- Migration 004: Projects, credentials, and primary CTA for professional portfolio differentiation

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  url VARCHAR(512),
  image_url VARCHAR(512),
  role VARCHAR(100),
  technologies JSON,
  featured TINYINT(1) DEFAULT 0,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_projects_user_pos (user_id, position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS credentials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  issuer VARCHAR(200),
  year SMALLINT,
  url VARCHAR(512),
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_credentials_user_pos (user_id, position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Safely add primary CTA columns to clients
ALTER TABLE clients ADD COLUMN primary_cta_type VARCHAR(50) DEFAULT NULL;
ALTER TABLE clients ADD COLUMN primary_cta_label VARCHAR(100) DEFAULT NULL;
ALTER TABLE clients ADD COLUMN primary_cta_url VARCHAR(512) DEFAULT NULL;
