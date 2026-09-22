const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const filename = process.env.DATABASE_PATH || "./data/education.sqlite";
const resolved = path.resolve(filename);
fs.mkdirSync(path.dirname(resolved), { recursive: true });
const db = new DatabaseSync(resolved);
db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT,
    google_id TEXT UNIQUE,
    role TEXT NOT NULL DEFAULT 'student',
    branch TEXT,
    semester TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS enrollments (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    target_score REAL NOT NULL DEFAULT 80 CHECK(target_score BETWEEN 0 AND 100),
    PRIMARY KEY(user_id, subject_id)
  );
  CREATE TABLE IF NOT EXISTS assessments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT,
    topic TEXT,
    score REAL NOT NULL CHECK(score BETWEEN 0 AND 100),
    max_score REAL NOT NULL CHECK(max_score > 0),
    assessed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS attendance_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK(status IN ('present', 'absent')),
    recorded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS assignments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    instructions TEXT,
    due_at TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK(status IN ('not_started', 'in_progress', 'submitted', 'complete')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS study_plans (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_start TEXT NOT NULL,
    available_hours REAL NOT NULL,
    plan_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, week_start)
  );
  CREATE INDEX IF NOT EXISTS assessments_user_subject_idx ON assessments(user_id, subject_id);
  CREATE INDEX IF NOT EXISTS attendance_user_subject_idx ON attendance_records(user_id, subject_id);
  CREATE INDEX IF NOT EXISTS assignments_user_due_idx ON assignments(user_id, due_at);
`);

function addColumn(table, column, definition) {
  const existing = db.prepare(`PRAGMA table_info(${table})`).all().map((item) => item.name);
  if (!existing.includes(column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

// Keep databases created by the earlier backend version compatible without a manual reset.
addColumn("users", "role", "TEXT NOT NULL DEFAULT 'student'");
addColumn("users", "branch", "TEXT");
addColumn("users", "semester", "TEXT");
addColumn("assessments", "title", "TEXT");
addColumn("assessments", "topic", "TEXT");

module.exports = db;
