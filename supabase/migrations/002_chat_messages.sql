-- Migration 002: Chat Messages & Usage
CREATE TABLE chat_messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  province TEXT NOT NULL,
  source_citations JSONB,
  confidence_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE usage_records (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  province TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-level security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own" ON usage_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own" ON usage_records FOR INSERT WITH CHECK (auth.uid() = user_id);
