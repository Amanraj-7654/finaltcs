# Database Schema

The SQL schema below is derived from the JPA models in the backend.

-- Users
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50),
  reset_token VARCHAR(255),
  reset_token_expiry DATETIME,
  created_at DATETIME
);

-- Questions
CREATE TABLE questions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  difficulty VARCHAR(50),
  type VARCHAR(100),
  test_cases TEXT,
  hidden_test_cases LONGTEXT,
  constraints TEXT,
  input_format TEXT,
  output_format TEXT,
  time_limit INT DEFAULT 2,
  memory_limit INT DEFAULT 256,
  tags VARCHAR(255),
  boilerplates LONGTEXT,
  driver_code LONGTEXT,
  link VARCHAR(255)
);

-- Test cases
CREATE TABLE test_cases (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  question_id BIGINT NOT NULL,
  input LONGTEXT,
  expected_output LONGTEXT,
  hidden BOOLEAN NOT NULL DEFAULT FALSE,
  explanation TEXT,
  CONSTRAINT fk_testcase_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Contests
CREATE TABLE contests (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  start_time DATETIME,
  end_time DATETIME,
  duration_minutes INT,
  is_published BOOLEAN DEFAULT TRUE
);

-- Join table: contests <-> questions (many-to-many)
CREATE TABLE contest_questions (
  contest_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  PRIMARY KEY (contest_id, question_id),
  CONSTRAINT fk_cq_contest FOREIGN KEY (contest_id) REFERENCES contests(id) ON DELETE CASCADE,
  CONSTRAINT fk_cq_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Submissions
CREATE TABLE submissions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT,
  question_id BIGINT,
  code TEXT,
  language VARCHAR(50),
  status VARCHAR(50),
  verdict VARCHAR(50),
  runtime VARCHAR(50),
  memory INT,
  passed_count INT,
  total_count INT,
  contest_id BIGINT,
  submitted_at DATETIME,
  CONSTRAINT fk_submission_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_submission_question FOREIGN KEY (question_id) REFERENCES questions(id),
  CONSTRAINT fk_submission_contest FOREIGN KEY (contest_id) REFERENCES contests(id)
);

-- Roadmaps
CREATE TABLE roadmaps (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  pdf_path VARCHAR(255)
);

-- Notes:
-- - Fields like `test_cases`, `hidden_test_cases`, `boilerplates`, and `driver_code` are stored as TEXT/LONGTEXT and may contain JSON.
-- - `contest_id` in `submissions` is nullable for standalone practice submissions.
-- - Add indexes (e.g., on `user_id`, `question_id`, `tags`) as needed for performance.
