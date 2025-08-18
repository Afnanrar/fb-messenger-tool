# 🚀 Quick Reference - Facebook Messenger SaaS Tool

## 🔑 **Essential Commands**

### **Development**
```bash
npm run dev          # Start dev server
npm run build        # Test build
npm run lint         # Check code quality
```

### **Git Operations**
```bash
git add . && git commit -m "message"
git push
git pull
```

### **Deployment**
```bash
vercel --prod        # Deploy to production
vercel               # Deploy to preview
```

## 🌐 **Key URLs**

- **Production**: https://myaimmydream-f80y83ebt-ranaafnan795-6094s-projects.vercel.app
- **GitHub**: https://github.com/Afnanrar/fb-messenger-tool
- **Vercel Dashboard**: https://vercel.com/ranaafnan795-6094s-projects/myaimmydream

## 🔧 **Environment Variables**

```env
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_WEBHOOK_VERIFY_TOKEN=your_token
NEXT_PUBLIC_APP_URL=https://myaimmydream.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXTAUTH_SECRET=your_secret
```

## 📱 **Facebook App Settings**

- **OAuth Redirect**: `/api/auth/facebook/callback`
- **Webhook URL**: `/api/webhook`
- **Required Permissions**: `pages_show_list`, `pages_read_engagement`, `pages_messaging`

## 🗄️ **Database Tables**

- users, pages, conversations, messages, broadcasts, broadcast_recipients, user_settings

## 📁 **Key File Locations**

- **API Routes**: `app/api/`
- **Components**: `components/`
- **Database**: `lib/supabase/`
- **Facebook**: `lib/facebook/`
- **Migrations**: `lib/supabase/migrations/001_initial_schema.sql`
