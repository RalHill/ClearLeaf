-- Migration 002: Chat Messages & Usage
CREATE TABLE chat_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  province TEXT NOT NULL,
  source_citations JSONB,
  confidence_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE usage_records (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  province TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- App-layer auth (NextAuth + server routes). Open policies — DB not exposed publicly.
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_all" ON chat_messages FOR ALL USING (TRUE) WITH CHECK (TRUE);

ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usage_all" ON usage_records FOR ALL USING (TRUE) WITH CHECK (TRUE);
