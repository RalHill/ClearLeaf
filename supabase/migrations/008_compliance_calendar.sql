-- Compliance Calendar: deadlines table
CREATE TABLE IF NOT EXISTS compliance_deadlines (
  id            BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title         TEXT NOT NULL,
  deadline_type TEXT NOT NULL,  -- 'tax' | 'hr_policy' | 'statutory' | 'remittance' | 'wsib'
  description   TEXT NOT NULL,
  due_date      DATE NOT NULL,
  recurrence    TEXT NOT NULL DEFAULT 'annual',  -- 'annual' | 'monthly' | 'quarterly' | 'one_time'
  provinces     TEXT[] NOT NULL,
  consequence   TEXT NOT NULL,
  action_items  TEXT[] NOT NULL DEFAULT '{}',
  authority     TEXT NOT NULL,
  source_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cd_due_date  ON compliance_deadlines(due_date);
CREATE INDEX IF NOT EXISTS idx_cd_provinces ON compliance_deadlines USING GIN(provinces);
CREATE INDEX IF NOT EXISTS idx_cd_type      ON compliance_deadlines(deadline_type);
