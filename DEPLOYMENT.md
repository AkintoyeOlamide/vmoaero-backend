# Deployment Guide

## Build & Start Commands

### Build Command
```bash
npm run build
```
**Note**: For Node.js backends, there's no actual build step. This command is provided for platforms that require it.

### Start Command
```bash
npm start
```
This runs: `node src/index.js`

### Development Command
```bash
npm run dev
```
This runs: `nodemon src/index.js` (auto-restarts on file changes)

---

## Platform-Specific Deployment

### Vercel
- **Build Command**: `npm run build` (or leave empty)
- **Output Directory**: (leave empty - not applicable for Node.js)
- **Install Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18.x or 20.x

### Railway
- **Build Command**: `npm install` (or `npm run build`)
- **Start Command**: `npm start`
- **Environment Variables**: Add in Railway dashboard

### Render
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Node
- **Node Version**: 20.x

### Heroku
- **Build Command**: (auto-detected, runs `npm install`)
- **Start Command**: `npm start` (auto-detected from package.json)
- **Procfile** (optional):
  ```
  web: npm start
  ```

### DigitalOcean App Platform
- **Build Command**: `npm install`
- **Run Command**: `npm start`
- **Environment Variables**: Add in dashboard

### AWS Elastic Beanstalk
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: Set in `.nvmrc` or `package.json` engines

---

## Environment Variables

Make sure to set these in your deployment platform:

```env
EMAIL_USER=vmoaeronigltd@gmail.com
EMAIL_PASS=your-app-password-here
PORT=3000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

---

## Quick Reference

| Command | What it does |
|---------|-------------|
| `npm run dev` | Development server with auto-reload |
| `npm start` | Production server |
| `npm run build` | No-op (for platforms that require it) |
| `npm install` | Install dependencies |

---

## Testing After Deployment

1. Check server health:
   ```bash
   curl https://your-api-domain.com/
   ```

2. Test booking endpoint:
   ```bash
   curl -X POST https://your-api-domain.com/api/booking-notify \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test","email":"test@example.com"}'
   ```

3. Verify CORS headers:
   ```bash
   curl -X OPTIONS https://your-api-domain.com/api/booking-notify \
     -H "Origin: https://your-frontend-domain.com" \
     -v
   ```

---

## Common Issues

### Port Configuration
- Most platforms set `PORT` automatically
- Your code uses: `process.env.PORT || 3000`
- No changes needed!

### Build Failures
- If build fails, try: `npm install` as build command
- Or leave build command empty if platform allows

### Email Not Sending
- Verify `EMAIL_USER` and `EMAIL_PASS` are set correctly
- Gmail may require App Password (not regular password)
- Check platform logs for error messages

