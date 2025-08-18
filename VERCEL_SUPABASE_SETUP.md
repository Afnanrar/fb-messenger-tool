# 🚀 Vercel + Supabase Deployment Guide

## Step 1: GitHub Repository Setup

### Create GitHub Repository
1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `fb-messenger-tool`
3. Description: `Facebook Messenger SaaS Tool - Complete Implementation`
4. Make it Public or Private (your choice)
5. **DO NOT** initialize with README (we already have one)
6. Click 'Create repository'

### Push Code to GitHub
```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/fb-messenger-tool.git
git branch -M main
git push -u origin main
```

## Step 2: Supabase Setup

### Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose your organization
5. Project name: `fb-messenger-tool`
6. Database password: Create a strong password
7. Region: Choose closest to your users
8. Click "Create new project"

### Database Setup
1. Wait for project to be ready (2-3 minutes)
2. Go to SQL Editor in your project
3. Copy the entire content from `lib/supabase/migrations/001_initial_schema.sql`
4. Paste and run the SQL
5. Verify tables are created in Table Editor

### Get Supabase Credentials
1. Go to Settings → API
2. Copy these values:
   - Project URL
   - anon/public key
   - service_role key (keep this secret!)

## Step 3: Facebook App Setup

### Create Facebook App
1. Go to [https://developers.facebook.com](https://developers.facebook.com)
2. Create App → Consumer
3. App name: `Messenger Tool`
4. Contact email: Your email

### Configure Facebook Login
1. Add Facebook Login product
2. Settings → Valid OAuth Redirect URIs:
   - Development: `http://localhost:3000/api/auth/facebook/callback`
   - Production: `https://yourdomain.vercel.app/api/auth/facebook/callback`
3. Save changes

### Configure App Permissions
1. App Review → Permissions and Features
2. Request these permissions:
   - `pages_show_list`
   - `pages_messaging`
   - `pages_read_engagement`
   - `pages_manage_messages`
3. Submit for review (may take 1-2 days)

### Get App Credentials
1. Settings → Basic
2. Copy App ID and App Secret

## Step 4: Vercel Deployment

### Connect to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `fb-messenger-tool` repository
5. Click "Deploy"

### Configure Environment Variables
In Vercel project settings, add these environment variables:

```env
# Facebook App
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
NEXTAUTH_SECRET=your_random_secret_key
```

### Generate NEXTAUTH_SECRET
```bash
# Run this command to generate a secure secret
openssl rand -base64 32
```

## Step 5: Facebook Webhook Setup

### Configure Webhook
1. Go to your Facebook app
2. Products → Messenger → Settings
3. Webhooks → Add Callback URL
4. Callback URL: `https://yourdomain.vercel.app/api/webhook`
5. Verify Token: Use the same value as `FACEBOOK_WEBHOOK_VERIFY_TOKEN`
6. Subscribe to these fields:
   - `messages`
   - `messaging_postbacks`
   - `messaging_optins`

## Step 6: Test Deployment

### Test Facebook Login
1. Visit your Vercel app URL
2. Click "Continue with Facebook"
3. Complete OAuth flow
4. Verify you reach the dashboard

### Test Webhook
1. Send a message to your Facebook page
2. Check Vercel function logs
3. Verify message appears in database

## Troubleshooting

### Common Issues

#### 1. Facebook OAuth Error
- Check redirect URI matches exactly
- Verify app is not in development mode
- Ensure permissions are approved

#### 2. Supabase Connection Error
- Verify environment variables
- Check database is running
- Ensure RLS policies are correct

#### 3. Webhook Not Working
- Check webhook URL is accessible
- Verify verify token matches
- Check Vercel function logs

#### 4. Build Errors
- Ensure all dependencies are in package.json
- Check TypeScript compilation
- Verify Next.js configuration

### Debug Commands
```bash
# Check Vercel logs
vercel logs

# Check build locally
npm run build

# Test database connection
npm run dev
```

## Security Checklist

- [ ] Environment variables are set in Vercel
- [ ] Supabase RLS policies are enabled
- [ ] Facebook app is in production mode
- [ ] HTTPS is enforced
- [ ] Webhook verification is working
- [ ] Rate limiting is configured

## Next Steps

1. **Monitor Performance**: Use Vercel Analytics
2. **Set up Monitoring**: Configure error tracking
3. **Scale Database**: Monitor Supabase usage
4. **Custom Domain**: Configure in Vercel
5. **SSL Certificate**: Automatically handled by Vercel

## Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **Facebook**: [developers.facebook.com/support](https://developers.facebook.com/support)

---

**🎉 Your Facebook Messenger SaaS Tool is now deployed and ready to use!**
