CREATE UNIQUE INDEX IF NOT EXISTS idx_robots_name ON robots (LOWER(name));
CREATE INDEX IF NOT EXISTS idx_robots_year ON robots (year);
