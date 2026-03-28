-- Migration 001: Knowledge Base Schema (Neon / standalone Postgres)
-- pgvector must exist before VECTOR columns
CREATE EXTENSION IF NOT EXISTS vector;

-- Organizations & Users (no Supabase auth.users — NextAuth owns identity)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_customer_id TEXT UNIQUE,
  plan TEXT DEFAULT 'free',
  default_province TEXT DEFAULT 'ON',
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  password_hash TEXT,
  name TEXT,
  role TEXT DEFAULT 'member',
  preferred_province TEXT DEFAULT 'ON',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Base Tables
CREATE TABLE knowledge_sources (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  province TEXT NOT NULL,
  source_type TEXT NOT NULL,
  last_verified TIMESTAMPTZ,
  version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE knowledge_chunks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  source_id BIGINT REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  section_title TEXT,
  article_number TEXT,
  province TEXT NOT NULL,
  topic_tags TEXT[],
  chunk_index INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW index for fast similarity search
CREATE INDEX ON knowledge_chunks USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Row-level security: public read on knowledge tables (server enforces user auth)
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON knowledge_chunks FOR SELECT USING (TRUE);

ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON knowledge_sources FOR SELECT USING (TRUE);
