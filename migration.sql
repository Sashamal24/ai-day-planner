-- Запусти в Neon Dashboard → SQL Editor (або psql)

CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  password_hash TEXT,           -- NULL для Google OAuth-юзерів
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'inbox'
               CHECK (status IN ('inbox', 'today', 'done')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);

-- AI fields (run once if table already exists)
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS priority     TEXT CHECK (priority IN ('high', 'medium', 'low')),
  ADD COLUMN IF NOT EXISTS estimate_min INTEGER,
  ADD COLUMN IF NOT EXISTS deadline     DATE;
