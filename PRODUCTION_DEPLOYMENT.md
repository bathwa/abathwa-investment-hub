# Production Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Abathwa Investment Hub to production.

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Supabase recommended)
- Environment variables configured
- Domain name and SSL certificate

## Step 1: Environment Setup

### 1.1 Create Environment File
```bash
cp env.example .env
```

### 1.2 Configure Environment Variables
Update `.env` with your production values:

```env
# Database
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# Security
JWT_SECRET=your_jwt_secret_key
ADMIN_KEY=vvv.ndev

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 2: Database Setup

### 2.1 Run Database Schema
Execute the database schema in your Supabase SQL editor:

```sql
-- Run the contents of database_schema.sql
```

### 2.2 Clean Mock Data
Run the cleanup script to remove any test data:

```sql
-- Run the contents of scripts/cleanup-mock-data.sql
```

### 2.3 Verify Database
Check that your database is clean:

```sql
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_opportunities FROM opportunities;
SELECT COUNT(*) as total_transactions FROM transactions;
SELECT COUNT(*) as total_pools FROM investment_pools;
```

## Step 3: Application Build

### 3.1 Install Dependencies
```bash
npm install
```

### 3.2 Build Application
```bash
# Build frontend
npm run build

# Build server
npm run build:server
```

### 3.3 Run Type Checks
```bash
npm run type-check
npm run type-check:server
```

### 3.4 Run Linting
```bash
npm run lint:fix
```

## Step 4: Production Deployment

### 4.1 Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start dist/server/index.js --name "abathwa-investment-hub"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 4.2 Using Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY .env ./

EXPOSE 3001

CMD ["node", "dist/server/index.js"]
```

```bash
# Build and run
docker build -t abathwa-investment-hub .
docker run -p 3001:3001 abathwa-investment-hub
```

### 4.3 Using Nginx Reverse Proxy
```nginx
# /etc/nginx/sites-available/abathwa-investment-hub
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Frontend
    location / {
        root /var/www/abathwa-investment-hub/dist;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001;
    }
}
```

## Step 5: Security Configuration

### 5.1 Enable Row Level Security
Ensure RLS is enabled on all tables in Supabase.

### 5.2 Configure CORS
Update CORS settings in your Supabase project to only allow your production domain.

### 5.3 Set Up Authentication
Configure Supabase Auth with your production domain.

### 5.4 Enable SSL
Ensure all connections use HTTPS.

## Step 6: Monitoring and Logging

### 6.1 Application Logs
```bash
# View PM2 logs
pm2 logs abathwa-investment-hub

# View real-time logs
pm2 logs abathwa-investment-hub --lines 100
```

### 6.2 Health Checks
Monitor the health endpoint:
```bash
curl https://yourdomain.com/health
```

### 6.3 Database Monitoring
Set up Supabase monitoring and alerts.

## Step 7: Backup Strategy

### 7.1 Database Backups
- Enable automatic backups in Supabase
- Set up manual backup scripts if needed

### 7.2 Application Backups
- Version control all code changes
- Document configuration changes
- Backup environment files securely

## Step 8: Performance Optimization

### 8.1 Enable Compression
```javascript
// Already configured in server/index.ts
app.use(compression());
```

### 8.2 Caching
- Implement Redis for session storage if needed
- Use CDN for static assets
- Enable browser caching

### 8.3 Database Optimization
- Monitor query performance
- Add indexes as needed
- Regular database maintenance

## Step 9: Testing Production

### 9.1 Smoke Tests
```bash
# Test API endpoints
curl https://yourdomain.com/health
curl https://yourdomain.com/api/auth/login

# Test frontend
open https://yourdomain.com
```

### 9.2 User Acceptance Testing
- Test all user roles and permissions
- Verify data integrity
- Test payment flows
- Check mobile responsiveness

## Step 10: Maintenance

### 10.1 Regular Updates
```bash
# Update dependencies
npm update

# Rebuild application
npm run build
npm run build:server

# Restart application
pm2 restart abathwa-investment-hub
```

### 10.2 Database Maintenance
- Regular cleanup of old data
- Monitor storage usage
- Update database schema as needed

### 10.3 Security Updates
- Keep dependencies updated
- Monitor security advisories
- Regular security audits

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL in .env
   - Verify Supabase project is active
   - Check network connectivity

2. **Authentication Issues**
   - Verify SUPABASE_ANON_KEY
   - Check CORS configuration
   - Ensure domain is whitelisted

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all dependencies are installed

4. **Performance Issues**
   - Monitor database query performance
   - Check server resources
   - Review application logs

### Support
For production issues, contact:
- Email: admin@abathwa.com
- Phone: +263 78 998 9619
- WhatsApp: wa.me/789989619

## Emergency Procedures

### Rollback Process
1. Stop the application: `pm2 stop abathwa-investment-hub`
2. Restore from backup
3. Restart application: `pm2 start abathwa-investment-hub`

### Data Recovery
1. Restore database from Supabase backup
2. Verify data integrity
3. Test application functionality

---

**Last Updated**: December 2024
**Version**: 1.0.0 