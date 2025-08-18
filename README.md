# Facebook Messenger SaaS Tool

A comprehensive SaaS tool for managing Facebook Messenger conversations and broadcasts with advanced features like spintax support, webhook handling, and multi-page management.

## Features

- 🔐 **Facebook OAuth Integration** - Secure authentication with Facebook Graph API
- 💬 **Conversation Management** - View and respond to messages in real-time
- 📢 **Broadcast Messaging** - Send messages to multiple users with spintax support
- 🔄 **Webhook Support** - Real-time message updates via Facebook webhooks
- 📱 **Multi-Page Support** - Manage multiple Facebook pages from one dashboard
- 🎨 **Modern UI** - Beautiful, responsive interface built with Next.js and Tailwind CSS
- 🚀 **TypeScript** - Full type safety and better development experience

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Facebook OAuth
- **External APIs**: Facebook Graph API

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Facebook Developer Account
- Supabase Account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd fb-messenger-tool
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Facebook App
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 3. Facebook App Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add Facebook Login product
4. Configure OAuth redirect URIs:
   - `http://localhost:3000/api/auth/facebook/callback` (development)
   - `https://yourdomain.com/api/auth/facebook/callback` (production)
5. Add required permissions:
   - `pages_show_list`
   - `pages_messaging`
   - `pages_read_engagement`
   - `pages_manage_messages`
6. Set up webhook for page messaging events

### 4. Supabase Setup

1. Create a new Supabase project
2. Run the following SQL to create required tables:

```sql
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
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication
1. Click "Continue with Facebook" on the login page
2. Grant necessary permissions to your Facebook app
3. You'll be redirected to the dashboard

### Managing Conversations
1. Select a Facebook page from the dropdown
2. Navigate to the Inbox section
3. Click on any conversation to view messages
4. Type and send replies

### Broadcasting Messages
1. Go to the Broadcast section
2. Select a page
3. Write your message (use `{option1|option2}` for spintax)
4. Click "Send Broadcast"

### Settings
- Configure notifications
- Set up auto-replies
- Adjust rate limiting
- Set timezone preferences

## API Endpoints

- `POST /api/auth/facebook` - Initiate Facebook OAuth
- `GET /api/auth/facebook/callback` - OAuth callback handler
- `POST /api/webhook` - Facebook webhook endpoint
- `GET /api/pages` - Get user's Facebook pages
- `POST /api/pages` - Sync Facebook pages
- `GET /api/conversations` - Get conversations
- `GET /api/messages` - Get messages for a conversation
- `POST /api/messages` - Send a message
- `POST /api/messages/broadcast` - Send broadcast message
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Security Considerations

- All API routes are protected with authentication
- Facebook access tokens are stored securely in HTTP-only cookies
- Webhook verification prevents unauthorized requests
- Rate limiting prevents abuse
- Input validation on all endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## Roadmap

- [ ] Message templates
- [ ] Advanced analytics
- [ ] Team collaboration features
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced automation rules
# Last updated: Mon Aug 18 21:15:22 PKT 2025
