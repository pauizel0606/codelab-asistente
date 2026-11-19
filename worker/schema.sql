-- Base de datos del Asistente IA de Codelab (Cloudflare D1)

CREATE TABLE IF NOT EXISTS businesses (
  id          TEXT PRIMARY KEY,          -- identificador corto, p. ej. "clinica-lumen"
  name        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#1546d6',
  greeting_es TEXT NOT NULL DEFAULT '',
  greeting_ca TEXT NOT NULL DEFAULT '',
  greeting_en TEXT NOT NULL DEFAULT '',
  chips_es    TEXT NOT NULL DEFAULT '[]',  -- sugerencias (JSON)
  chips_ca    TEXT NOT NULL DEFAULT '[]',
  chips_en    TEXT NOT NULL DEFAULT '[]',
  knowledge   TEXT NOT NULL DEFAULT '',    -- toda la información del negocio
  demo        INTEGER NOT NULL DEFAULT 0,  -- 1 = negocio de demostración (se limpia cada día)
  active      INTEGER NOT NULL DEFAULT 1,
  created     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS conversations (
  id          TEXT PRIMARY KEY,            -- id de sesión del visitante
  business_id TEXT NOT NULL,
  messages    TEXT NOT NULL DEFAULT '[]',  -- JSON [{role, content, t}]
  lang        TEXT,
  page        TEXT,
  created     TEXT NOT NULL DEFAULT (datetime('now')),
  updated     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS conv_business ON conversations (business_id, updated);

CREATE TABLE IF NOT EXISTS leads (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id     TEXT NOT NULL,
  conversation_id TEXT,
  name            TEXT,
  phone           TEXT,
  reason          TEXT,
  status          TEXT NOT NULL DEFAULT 'nuevo',   -- nuevo | contactado | cerrado
  created         TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS leads_business ON leads (business_id, created);
