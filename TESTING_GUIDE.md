# Vakeel Video Call Testing Guide

## Prerequisites

1. **Environment Setup**

   - Copy `.env.example` to `.env.local`
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` to a secure secret key
   - Set `NEXT_PUBLIC_SIGNALING_URL` to your signaling server URL

2. **Start Services**

   ```bash
   # Terminal 1: Start the signaling server
   cd signaling
   npm install
   node server.js

   # Terminal 2: Start the Next.js app
   npm run dev
   ```

## Testing the Video Call Feature

### Step 1: Create Test Users

1. Register as a client at `/auth/register/client`
2. Register as a lawyer at `/auth/register/lawyer`

### Step 2: Create a Booking

1. Login as client
2. Go to `/user/lawyers` and select a lawyer
3. Book a session with available slots
4. Note the booking ID from the confirmation

### Step 3: Start Video Call Session

1. **Lawyer side:**

   - Login as lawyer
   - Go to `/lawyer/session`
   - Find the booking and click "Start Session"
   - Enter OTP: `123456` (hardcoded for testing)
   - Should redirect to call page

2. **Client side:**
   - Login as client
   - Go to `/user/session/[sessionId]/otp`
   - Enter OTP: `123456`
   - Should redirect to call page

### Step 4: Test WebRTC Features

- **Media Access:** Both users should see camera/microphone permissions
- **Video Streams:** Local and remote video should appear
- **Call Controls:** Test mute/unmute, camera on/off
- **Connection Status:** Green indicator when connected
- **Chat:** Send messages between users
- **Call End:** Either party can end the call

## Expected Behavior

✅ **Connection Flow:**

1. OTP verification creates Call record
2. Redirect to call page with JWT token
3. Socket connection with authentication
4. WebRTC peer connection establishment
5. Media stream exchange
6. Call status updates in database

✅ **Error Handling:**

- Media access denied gracefully handled
- Connection failures show retry options
- Invalid tokens prevent access
- Call cleanup on page close

## Troubleshooting

**No Video/Audio:**

- Check browser permissions
- Ensure HTTPS or localhost
- Verify media devices available

**Connection Issues:**

- Check signaling server is running
- Verify CORS settings
- Check browser console for WebRTC errors

**Database Errors:**

- Ensure MongoDB is running
- Check connection string in .env.local
- Verify JWT_SECRET is set
