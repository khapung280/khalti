# LO3 Login Fix — Quick steps for "After" screenshot

## What was wrong
- Frontend called `http://localhost:5000/auth/login` but the **backend was not running** → `ERR_CONNECTION_REFUSED`
- Login page linked to `/signup` but the route was `/register`

## What we fixed in code
1. Backend now **starts on port 5000** even if MongoDB is still connecting
2. Login controller has proper `try/catch` and JWT check
3. `/signup` route added (redirects to Register)
4. Sign Up link on login page points to `/register`

## Run for "After" screenshot

**Terminal 1 — Backend:**
```powershell
cd d:\openIV\khalti\backend
npm run dev
```
Wait for: `🚀 Server running on http://localhost:5000` and `✅ MongoDB connected`

**Terminal 2 — Frontend:**
```powershell
cd d:\openIV\khalti\frontend
npm run dev
```

## Test login
1. Open http://localhost:5173/register — create an account (if you don't have one)
2. Open http://localhost:5173/login
3. Log in → you should see **"Login successful! Redirecting..."**
4. Screenshot: success message + Network tab showing **200** on `auth/login`

## If registration/login returns 500

The backend needs a **working MongoDB** connection.

**Option A — Fix Atlas (cloud):**
1. [MongoDB Atlas](https://cloud.mongodb.com) → your cluster → **Network Access**
2. **Add IP Address** → your current IP, or `0.0.0.0/0` for dev only
3. Restart backend: `npm run dev` until you see `✅ MongoDB connected`

**Option B — Local MongoDB (if Atlas DNS fails):**
1. Install [MongoDB Community](https://www.mongodb.com/try/download/community)
2. Start MongoDB service (runs on `127.0.0.1:27017`)
3. Add to `backend/.env`: `MONGODB_LOCAL_URL=mongodb://127.0.0.1:27017/khalti`
4. Restart backend — it will try Atlas first, then local automatically
