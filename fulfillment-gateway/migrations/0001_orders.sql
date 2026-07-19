CREATE TABLE IF NOT EXISTS orders (
  sale_id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  source TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  resend_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  queued_at TEXT,
  processing_started_at TEXT,
  prompted_at TEXT,
  anthropic_at TEXT,
  resend_at TEXT,
  delivered_at TEXT,
  failed_at TEXT,
  last_error_code TEXT,
  last_error_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_source ON orders(source);
