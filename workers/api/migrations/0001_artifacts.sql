CREATE TABLE artifacts (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  object_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL,
  byte_size INTEGER NOT NULL CHECK (byte_size > 0),
  status TEXT NOT NULL CHECK (status IN ('queued', 'processing', 'complete', 'failed')),
  created_at TEXT NOT NULL,
  completed_at TEXT,
  profile_json TEXT,
  error_message TEXT,
  CHECK (
    (status IN ('queued', 'processing') AND completed_at IS NULL AND profile_json IS NULL AND error_message IS NULL)
    OR (status = 'complete' AND completed_at IS NOT NULL AND profile_json IS NOT NULL AND error_message IS NULL)
    OR (status = 'failed' AND completed_at IS NOT NULL AND profile_json IS NULL AND error_message IS NOT NULL)
  )
);

CREATE INDEX artifacts_created_at ON artifacts (created_at DESC);
