# Biddt API Integration

Base URL: `http://localhost:3001` (dev) / `https://api.biddt.com` (prod)

## Authentication

All endpoints except `/auth/*` require a Bearer token:
```
Authorization: Bearer <accessToken>
```

## Endpoints

### Auth
- `POST /auth/phone/send-code` - Send OTP
- `POST /auth/phone/verify` - Verify OTP, get tokens
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout

### Users
- `GET /users/me` - Get current user
- `PATCH /users/me` - Update profile
- `GET /users/:id` - Get public profile

### Listings
- `GET /listings` - Browse listings
- `POST /listings` - Create listing
- `GET /listings/:id` - Get listing details
- `POST /listings/:id/watch` - Watch/unwatch
- `DELETE /listings/:id` - Delete listing

### Bids
- `POST /bids` - Place bid
- `GET /bids/my-bids` - Get my bids
- `GET /bids/listing/:id` - Get bid history

### Transactions
- `POST /transactions` - Create transaction (winner)
- `GET /transactions/my-transactions` - Get my transactions
- `GET /transactions/:id` - Get transaction details
- `GET /transactions/:id/qr` - Generate QR code
- `POST /transactions/:id/verify` - Verify QR (seller)

### Messages
- `GET /messages/transaction/:id` - Get messages
- `POST /messages/transaction/:id` - Send message

### Notifications
- `GET /notifications` - Get notifications
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/read-all` - Mark all as read

## WebSocket

Connect to: `ws://localhost:3001/ws/bidding/:listingId`

Events:
- `bid_placed` - New bid
- `outbid` - You've been outbid
- `ending_soon` - Auction ending
- `won` - You won

## Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
