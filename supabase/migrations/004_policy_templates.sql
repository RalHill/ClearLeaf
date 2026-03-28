-- Migration 004: Policy Templates & Saved Items
CREATE TABLE policy_templates (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  provinces TEXT[],
  min_plan TEXT DEFAULT 'free',
  file_path TEXT NOT NULL,
  last_reviewed TIMESTAMPTZ,
  version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE saved_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE policy_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON policy_templates FOR SELECT USING (TRUE);

ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "saved_all" ON saved_items FOR ALL USING (TRUE) WITH CHECK (TRUE);
