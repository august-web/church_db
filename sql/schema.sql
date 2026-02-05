CREATE DATABASE IF NOT EXISTS church_db;
USE church_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(25) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'member') NOT NULL DEFAULT 'member',
  department VARCHAR(100),
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contributions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('tithe', 'offering', 'donation') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  recorded_by INT NOT NULL,
  sms_sent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_contributions_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_contributions_recorded_by FOREIGN KEY (recorded_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS welfare (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  request_reason TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  approved_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_welfare_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_welfare_approved_by FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Optional default admin password hash is placeholder. Replace before production use.
-- Example hash for password "Admin@123":
-- $2b$10$XzStIx4GjP8wKWZqotSP8uAYAxD6xxEe7dBDEuDfSUdifYEYVplp6
INSERT INTO users (full_name, email, phone, password, role, department, status)
SELECT 'System Admin', 'admin@church.local', '+10000000000',
       '$2b$10$XzStIx4GjP8wKWZqotSP8uAYAxD6xxEe7dBDEuDfSUdifYEYVplp6',
       'admin', 'Administration', 'active'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@church.local'
);
