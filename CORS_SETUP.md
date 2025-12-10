# CORS Configuration Guide

## Current Setup

The backend is configured to handle CORS properly:

- ✅ **Development**: Allows all origins (for local development)
- ✅ **Production**: Can be configured via `ALLOWED_ORIGINS` environment variable
- ✅ **Headers**: Allows common headers needed for API requests
- ✅ **Methods**: Supports GET, POST, PUT, DELETE, OPTIONS, PATCH

## If You See CORS Errors

### Common CORS Error Messages

```
Access to fetch at 'http://localhost:3000/api/booking-notify' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### Quick Fixes

1. **Check Server is Running**
   ```bash
   npm run dev
   ```

2. **Verify CORS Middleware Order**
   - CORS must be configured BEFORE other middleware
   - Current order is correct: `cors()` → `helmet()` → `morgan()` → `express.json()`

3. **Check Frontend URL**
   - Make sure your frontend is calling the correct backend URL
   - Default: `http://localhost:3000`

4. **Browser Cache**
   - Clear browser cache or use incognito/private mode
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

## Production Configuration

For production, set allowed origins in your `.env` file:

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

## Testing CORS

### Test with cURL

```bash
# Test preflight request
curl -X OPTIONS http://localhost:3000/api/booking-notify \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Should see headers like:
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS,PATCH
```

### Test from Browser Console

```javascript
fetch('http://localhost:3000/api/booking-notify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'Test',
    email: 'test@example.com'
  })
})
  .then(res => res.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('CORS Error:', err));
```

## Current CORS Headers Sent

The server sends these headers:

```
Access-Control-Allow-Origin: * (in development) or specific origin (in production)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept
Access-Control-Allow-Credentials: true
```

## Troubleshooting Steps

1. ✅ **Server Running?** Check terminal for "Server is running on port 3000"
2. ✅ **Correct URL?** Verify frontend is calling `http://localhost:3000/api/booking-notify`
3. ✅ **CORS Middleware?** Check that `app.use(cors(corsOptions))` is before other middleware
4. ✅ **Browser Console?** Check for specific CORS error message
5. ✅ **Network Tab?** Check the Network tab in browser DevTools to see the actual request/response

## If Issues Persist

Share the exact error message from the browser console, and I can help troubleshoot further!

