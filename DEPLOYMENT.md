# Deployment Guide

This guide covers deploying the Facebook Messenger SaaS Tool to various platforms.

## Prerequisites

- All environment variables configured
- Facebook app configured for production
- Supabase database set up and migrated
- Domain name (for production)

## Environment Variables for Production

Update your `.env.local` with production values:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_FACEBOOK_APP_ID=your_production_facebook_app_id
FACEBOOK_APP_SECRET=your_production_facebook_app_secret
FACEBOOK_WEBHOOK_VERIFY_TOKEN=your_production_webhook_verify_token
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
NEXTAUTH_SECRET=your_production_nextauth_secret
```

## Facebook App Production Setup

1. **App Review**: Submit your app for Facebook review
2. **Permissions**: Ensure all required permissions are approved
3. **Webhook**: Update webhook URL to production domain
4. **OAuth**: Update OAuth redirect URIs for production

## Vercel Deployment (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configure Environment Variables**:
   - Go to Vercel dashboard
   - Navigate to your project
   - Add all environment variables

4. **Custom Domain** (Optional):
   - Add your domain in Vercel dashboard
   - Update DNS records

## Netlify Deployment

1. **Build Command**:
   ```bash
   npm run build
   ```

2. **Publish Directory**:
   ```
   .next
   ```

3. **Environment Variables**:
   - Add in Netlify dashboard
   - Prefix with `NEXT_PUBLIC_` for client-side variables

## Railway Deployment

1. **Connect Repository**:
   - Connect your GitHub repo
   - Railway will auto-detect Next.js

2. **Environment Variables**:
   - Add in Railway dashboard
   - No prefix needed

3. **Deploy**:
   - Railway will auto-deploy on push

## Docker Deployment

1. **Create Dockerfile**:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Build and Run**:
   ```bash
   docker build -t fb-messenger-tool .
   docker run -p 3000:3000 fb-messenger-tool
   ```

## AWS Deployment

### AWS Amplify

1. **Connect Repository**:
   - Connect your GitHub repo
   - Amplify will auto-detect Next.js

2. **Build Settings**:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```

### EC2 with PM2

1. **Install Dependencies**:
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   npm install -g pm2
   ```

2. **Deploy**:
   ```bash
   git clone your-repo
   cd fb-messenger-tool
   npm install
   npm run build
   pm2 start npm --name "fb-messenger" -- start
   pm2 startup
   pm2 save
   ```

## Nginx Configuration

For custom server deployments:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL/HTTPS Setup

### Let's Encrypt (Free)

1. **Install Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Get Certificate**:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Auto-renewal**:
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Cloudflare (Recommended)

1. **Add Domain**:
   - Add your domain to Cloudflare
   - Update nameservers

2. **SSL/TLS**:
   - Set to "Full (strict)"
   - Enable "Always Use HTTPS"

## Monitoring and Logs

### Vercel
- Built-in analytics
- Function logs in dashboard
- Performance monitoring

### Custom Server
- PM2 logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- Application logs: Configure in your app

## Performance Optimization

1. **Image Optimization**:
   - Use Next.js Image component
   - Configure image domains

2. **Caching**:
   - Implement Redis for session storage
   - Use CDN for static assets

3. **Database**:
   - Enable connection pooling
   - Use read replicas if needed

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting implemented
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version
   - Verify all dependencies
   - Check TypeScript errors

2. **Runtime Errors**:
   - Verify environment variables
   - Check database connectivity
   - Review application logs

3. **Facebook Integration**:
   - Verify app permissions
   - Check webhook configuration
   - Validate OAuth redirect URIs

### Support

- Check application logs
- Review Facebook app settings
- Verify Supabase configuration
- Check network connectivity

## Backup and Recovery

1. **Database**:
   - Regular Supabase backups
   - Export data periodically

2. **Code**:
   - Version control with Git
   - Tag releases

3. **Environment**:
   - Document configuration
   - Backup environment files
