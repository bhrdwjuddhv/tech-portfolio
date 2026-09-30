CREATE TABLE blogs (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  slug           TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  description    TEXT,
  content        TEXT NOT NULL,              -- markdown
  tags           TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
  date           TEXT NOT NULL DEFAULT (date('now')),
  cover_image    TEXT,                       -- URL (Cloudinary or a frontend /public path)
  cover_image_id TEXT,                       -- Cloudinary public_id, so the image can be deleted
  created_at     TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_blogs_date ON blogs (date DESC);

CREATE TABLE contact_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  interested TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
