-- Initial database schema for Facebook Messenger SaaS Tool

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facebook_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pages table
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  facebook_page_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  access_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  facebook_conversation_id TEXT NOT NULL,
  participant_id TEXT NOT NULL,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  facebook_message_id TEXT,
  sender_id TEXT NOT NULL,
  message TEXT NOT NULL,
  is_from_page BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broadcasts table
CREATE TABLE broadcasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  message_template TEXT NOT NULL,
  recipient_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Broadcast recipients table
CREATE TABLE broadcast_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broadcast_id UUID REFERENCES broadcasts(id) ON DELETE CASCADE,
  recipient_id TEXT NOT NULL,
  message_sent TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- User settings table
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  auto_reply_enabled BOOLEAN DEFAULT FALSE,
  auto_reply_message TEXT,
  rate_limit_messages INTEGER DEFAULT 100,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_pages_user_id ON pages(user_id);
CREATE INDEX idx_conversations_page_id ON conversations(page_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_broadcasts_page_id ON broadcasts(page_id);
CREATE INDEX idx_broadcast_recipients_broadcast_id ON broadcast_recipients(broadcast_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own pages" ON pages
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own pages" ON pages
  FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view conversations from own pages" ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pages 
      WHERE pages.id = conversations.page_id 
      AND pages.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage conversations from own pages" ON conversations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM pages 
      WHERE pages.id = conversations.page_id 
      AND pages.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can view messages from own conversations" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations 
      JOIN pages ON conversations.page_id = pages.id
      WHERE conversations.id = messages.conversation_id 
      AND pages.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage messages from own conversations" ON messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM conversations 
      JOIN pages ON conversations.page_id = pages.id
      WHERE conversations.id = messages.conversation_id 
      AND pages.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can view broadcasts from own pages" ON broadcasts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pages 
      WHERE pages.id = broadcasts.page_id 
      AND pages.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage broadcasts from own pages" ON broadcasts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM pages 
      WHERE pages.id = broadcasts.page_id 
      AND pages.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can view broadcast recipients from own broadcasts" ON broadcast_recipients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM broadcasts 
      JOIN pages ON broadcasts.page_id = pages.id
      WHERE broadcasts.id = broadcast_recipients.broadcast_id 
      AND pages.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can manage broadcast recipients from own broadcasts" ON broadcast_recipients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM broadcasts 
      JOIN pages ON broadcasts.page_id = pages.id
      WHERE broadcasts.id = broadcast_recipients.broadcast_id 
      AND pages.user_id::text = auth.uid()::text
    )
  );

CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid()::text = user_id::text);
