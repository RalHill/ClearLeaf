-- Migration 006: Core Function - Match Knowledge Chunks
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  query_embedding VECTOR(1536),
  filter_province TEXT,
  match_threshold FLOAT DEFAULT 0.45,
  match_count INT DEFAULT 6
) RETURNS TABLE (
  id BIGINT,
  content TEXT,
  section_title TEXT,
  article_number TEXT,
  source_title TEXT,
  province TEXT,
  topic_tags TEXT[],
  similarity FLOAT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.content,
    kc.section_title,
    kc.article_number,
    ks.title,
    kc.province,
    kc.topic_tags,
    (1 - (kc.embedding <=> query_embedding))::FLOAT as similarity
  FROM knowledge_chunks kc
  JOIN knowledge_sources ks ON kc.source_id = ks.id
  WHERE (
    kc.province = filter_province
    OR kc.province = 'All'
    OR kc.province = 'Federal'
  )
  AND (1 - (kc.embedding <=> query_embedding)) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
END; $$;

-- Function to get monthly chat count for a user
CREATE OR REPLACE FUNCTION get_monthly_chat_count(user_id UUID)
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
  count INT;
BEGIN
  SELECT COUNT(*) INTO count
  FROM usage_records
  WHERE usage_records.user_id = get_monthly_chat_count.user_id
  AND action_type = 'chat_query'
  AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW());
  RETURN count;
END; $$;

-- Function to increment usage
CREATE OR REPLACE FUNCTION increment_usage(user_id UUID, action TEXT, province TEXT DEFAULT NULL)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO usage_records (user_id, action_type, province)
  VALUES (increment_usage.user_id, action, province);
END; $$;
