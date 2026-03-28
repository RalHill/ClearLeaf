-- Migration 005: Feedback Table
CREATE TABLE feedback (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  chat_message_id BIGINT REFERENCES chat_messages(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL,
  province TEXT,
  notes TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedback_all" ON feedback FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE INDEX idx_feedback_type ON feedback(feedback_type);
CREATE INDEX idx_feedback_province ON feedback(province);
