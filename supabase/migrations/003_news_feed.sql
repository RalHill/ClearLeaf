-- Migration 003: News Feed
CREATE TABLE news_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  headline TEXT NOT NULL,
  summary TEXT NOT NULL,
  provinces TEXT[],
  topic_tags TEXT[],
  original_url TEXT UNIQUE,
  source_name TEXT NOT NULL,
  source_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-level security
ALTER TABLE news_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON news_items FOR SELECT USING (TRUE);

-- Indexes
CREATE INDEX idx_news_published ON news_items(published_at DESC);
CREATE INDEX idx_news_provinces ON news_items USING GIN(provinces);
CREATE INDEX idx_news_topics ON news_items USING GIN(topic_tags);
