-- Create database schema for ContentHub
-- Users table (extends the existing users_sync table)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password_hash TEXT,
  membership_type TEXT DEFAULT 'free' CHECK (membership_type IN ('free', 'paket_a', 'paket_b', 'paket_c')),
  membership_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail TEXT,
  author_id TEXT REFERENCES users(id),
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  author_id TEXT REFERENCES users(id),
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User content access tracking
CREATE TABLE IF NOT EXISTS user_content_access (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video')),
  content_id INTEGER NOT NULL,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_videos_author ON videos(author_id);
CREATE INDEX IF NOT EXISTS idx_user_content_access_user ON user_content_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_content_access_content ON user_content_access(content_type, content_id);
