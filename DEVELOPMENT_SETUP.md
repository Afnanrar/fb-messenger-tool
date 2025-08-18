# 🚀 Development Setup Guide (No Supabase Required)

## 🎯 **Quick Start for Development**

This guide helps you get the Facebook Messenger Tool running in development mode without setting up Supabase first.

## 🔧 **Environment Variables for Development**

### **1. Facebook App Credentials**
```env
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
```

### **2. Facebook Page Access Token**
```env
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token_here
```

**How to get Page Access Token:**
1. Go to [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Click "Generate Access Token"
4. Add permissions: `pages_show_list`, `pages_read_engagement`, `pages_messaging`
5. Copy the generated token

### **3. App URL**
```env
NEXT_PUBLIC_APP_URL=https://myaimmydream-f80y83ebt-ranaafnan795-6094s-projects.vercel.app
```

## 🚀 **Deploy to Vercel (Development Mode)**

### **1. Set Environment Variables in Vercel**
Go to your Vercel project dashboard → Settings → Environment Variables

Add these variables:
```env
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_WEBHOOK_VERIFY_TOKEN=your_token
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_token
NEXT_PUBLIC_APP_URL=https://myaimmydream-f80y83ebt-ranaafnan795-6094s-projects.vercel.app
NEXT_PUBLIC_DEV_MODE=true
```

### **2. Redeploy**
```bash
vercel --prod
```

## 🧪 **Test the Development Setup**

### **1. Test Facebook Login**
- Visit your Vercel app
- Click "Continue with Facebook"
- Complete OAuth flow
- Should redirect to dashboard

### **2. Test Dashboard Features**
- Page selector should show "Test Facebook Page"
- Inbox should show mock conversations
- Broadcast should work with mock data
- Settings should be editable

## 🔍 **What's Different in Development Mode**

### **Mock Data Instead of Database**
- **Pages**: Hardcoded test page
- **Conversations**: Sample conversations
- **Messages**: Mock message history
- **Broadcasts**: Simulated sending

### **No Supabase Required**
- All API routes work without database
- User authentication uses cookies
- Data persists only during session

## 🚨 **Common Development Issues**

### **1. "Authentication failed" Error**
**Cause**: Facebook app not properly configured
**Solution**: 
- Check Facebook app settings
- Verify OAuth redirect URIs
- Ensure app is in development mode

### **2. Page Token Issues**
**Cause**: Invalid or expired page access token
**Solution**:
- Generate new page access token
- Update environment variable
- Redeploy to Vercel

### **3. CORS Issues**
**Cause**: Facebook app domain mismatch
**Solution**:
- Add Vercel domain to Facebook app
- Check OAuth redirect URI exactly

## 📱 **Facebook App Development Setup**

### **1. App Review Status**
- Keep app in **Development Mode**
- Add yourself as **Test User**
- Test with your own Facebook account

### **2. Required Permissions**
- `pages_show_list` ✅
- `pages_read_engagement` ✅
- `pages_messaging` ✅

### **3. OAuth Redirect URIs**
```
https://myaimmydream-f80y83ebt-ranaafnan795-6094s-projects.vercel.app/api/auth/facebook/callback
```

## 🔄 **Next Steps After Development**

### **1. Test All Features**
- ✅ Facebook OAuth
- ✅ Dashboard navigation
- ✅ Mock data display
- ✅ Basic functionality

### **2. Set Up Supabase (Later)**
- Create database
- Run migrations
- Replace mock APIs with real ones

### **3. Production Deployment**
- Submit Facebook app for review
- Configure production environment
- Enable real data processing

## 💡 **Development Tips**

### **1. Use Browser DevTools**
- Check Network tab for API calls
- Monitor Console for errors
- Verify cookies are set

### **2. Test Different Scenarios**
- Valid Facebook login
- Invalid permissions
- Network errors
- Token expiration

### **3. Mock Data Customization**
Edit the mock data in API routes to test different scenarios.

---

**🎉 You're now ready to test the Facebook Messenger Tool in development mode!**
