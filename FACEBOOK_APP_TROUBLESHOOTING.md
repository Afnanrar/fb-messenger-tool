# 🔧 Facebook App Troubleshooting Guide

## 🚨 **Current Issues & Solutions**

### **Issue 1: 404 Error on Callback**
**Problem**: `/api/auth/callback/facebook` returns 404
**Solution**: ✅ **FIXED** - Created correct route structure

### **Issue 2: 400 Error in OAuth**
**Problem**: Facebook OAuth fails with status 400
**Solution**: Check Facebook app configuration

## 📱 **Facebook App Configuration Steps**

### **Step 1: Update OAuth Redirect URIs**
In your Facebook app dashboard:

**❌ WRONG (what you probably have):**
```
https://myaimmydream.vercel.app/api/auth/facebook/callback
```

**✅ CORRECT (what you need):**
```
https://myaimmydream.vercel.app/api/auth/callback/facebook
```

### **Step 2: Verify App Settings**
1. **App ID**: Check it matches `NEXT_PUBLIC_FACEBOOK_APP_ID`
2. **App Secret**: Check it matches `FACEBOOK_APP_SECRET`
3. **App Status**: Should be in "Development" mode
4. **Test Users**: Add yourself as a test user

### **Step 3: Required Permissions**
Request these permissions in App Review:
- `pages_show_list` ✅
- `pages_read_engagement` ✅
- `pages_messaging` ✅

## 🔍 **Debug Your Configuration**

### **Visit Debug Route**
Go to: `https://myaimmydream.vercel.app/api/debug/facebook`

This will show you:
- Which environment variables are set
- What the OAuth URL looks like
- Current configuration status

### **Check Vercel Environment Variables**
Make sure these are set in Vercel:

```env
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_WEBHOOK_VERIFY_TOKEN=your_token
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_token
NEXT_PUBLIC_APP_URL=https://myaimmydream.vercel.app
```

## 🧪 **Test the Fix**

### **1. Test OAuth Flow**
- Visit: `https://myaimmydream.vercel.app`
- Click: "Continue with Facebook"
- Should: Redirect to Facebook login
- After login: Return to your app

### **2. Check Vercel Logs**
- Go to Vercel dashboard
- Check function logs for detailed errors
- Look for "Facebook OAuth callback received" message

## 🚨 **Common Facebook App Issues**

### **1. App Not in Development Mode**
- Add yourself as a test user
- Ensure app is in development mode

### **2. Incorrect Redirect URI**
- Must match exactly (including protocol and path)
- No trailing slashes
- Case sensitive

### **3. Missing Permissions**
- Request permissions in App Review
- Wait for approval (1-2 days for production)

### **4. Invalid App ID/Secret**
- Double-check in Facebook app dashboard
- Ensure no extra spaces or characters

## 🔄 **After Making Changes**

1. **Update Facebook app** with correct redirect URI
2. **Redeploy to Vercel**: `vercel --prod`
3. **Test OAuth flow** again
4. **Check debug route** for configuration status

## 📞 **Still Having Issues?**

1. **Check debug route**: `/api/debug/facebook`
2. **Review Vercel logs** for detailed errors
3. **Verify Facebook app** configuration
4. **Test with different** Facebook account

---

**🎯 Goal**: Get Facebook OAuth working with correct callback URL
