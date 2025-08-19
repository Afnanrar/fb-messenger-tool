# Broadcast Setup Instructions

## 1. Environment Variables Required

You need to add these to your `.env.local` file (and also set them in Vercel):

```bash
# Facebook Page (for broadcast)
FACEBOOK_PAGE_ACCESS_TOKEN=your_actual_page_access_token
FACEBOOK_PAGE_ID=your_actual_page_id
```

## 2. How to Get These Values

### Facebook Page Access Token:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Select your app
3. Go to "Tools" > "Graph API Explorer"
4. Select your page from the dropdown
5. Copy the access token

### Facebook Page ID:
1. Go to your Facebook page
2. Look at the URL: `https://www.facebook.com/YourPageName`
3. Or check in Page Settings > General > Page ID

## 3. Test the Broadcast

1. Make sure you have recent conversations (within 24 hours) on your page
2. Go to `/dashboard/broadcast`
3. Click "Create Campaign"
4. Write a test message like: "Hi %(name)s! This is a test broadcast."
5. Select a message tag (e.g., "CONFIRMED_EVENT_UPDATE")
6. Click "Launch Campaign"

## 4. Troubleshooting

If you get errors:
- Check the browser console for detailed error messages
- Check Vercel logs for server-side errors
- Make sure your page token has the right permissions
- Ensure you have recent conversations (Facebook's 24-hour policy)

## 5. Common Issues

- **"Page not configured"**: Missing environment variables
- **"No eligible recipients"**: No recent conversations within 24 hours
- **"Failed to fetch recipients"**: Page token or permissions issue
- **"Failed to send"**: Rate limiting or message tag issues
