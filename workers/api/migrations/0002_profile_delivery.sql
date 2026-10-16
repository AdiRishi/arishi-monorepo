ALTER TABLE artifacts ADD COLUMN dispatched_at TEXT;

CREATE INDEX artifacts_pending_delivery ON artifacts (created_at)
WHERE dispatched_at IS NULL AND status = 'queued';
