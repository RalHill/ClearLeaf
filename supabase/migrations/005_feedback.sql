-- Migration 005: Feedback Table
CREATE TABLE feedback (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_message_id BIGINT REFERENCES chat_messages(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL,
  province TEXT,
  notes TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-level security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own" ON feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own" ON feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins_read_all" ON feedback FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- Index for feedback lookup
CREATE INDEX idx_feedback_type ON feedback(feedback_type);
CREATE INDEX idx_feedback_province ON feedback(province);
