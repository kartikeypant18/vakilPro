# Signaling Server

This is the WebRTC signaling server for handling video call connections.

## Setup

1. Install dependencies:

   ```bash
   cd signaling
   npm install
   ```

2. Set environment variables:

   - `JWT_SECRET`: Same as in your Next.js app (for token verification)
   - `PORT`: Port to run the server (default 4000)

3. Run the server:
   ```bash
   npm start
   ```

## How it works

- Clients connect with a JWT token in `auth.token`.
- Token is verified; payload attached to socket.
- Clients join a room based on `bookingId` from query.
- Relays `call:offer`, `call:answer`, `call:ice`, `call:hangup` events between peers in the room.

## Production Notes

- Use a TURN server for NAT traversal.
- Add rate limiting and logging.
- Secure CORS origins.
