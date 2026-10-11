CREATE DATABASE IF NOT EXISTS careertrack;
USE careertrack;

-- Spring Boot can create/update the tables automatically with ddl-auto=update.
-- This schema is provided for reference and for manual inspection.
CREATE TABLE IF NOT EXISTS job_applications (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  company VARCHAR(120) NOT NULL,
  role VARCHAR(160) NOT NULL,
  location VARCHAR(120),
  package_lpa DECIMAL(8,2),
  status VARCHAR(30) NOT NULL DEFAULT 'APPLIED',
  applied_date DATE,
  interview_date DATE,
  job_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
