# Expo Connection Instructions

## Server Status: STARTING ⏳

The Expo development server is starting up. This may take 1-2 minutes for the first time.

---

## Connection Methods:

### Method 1: QR Code (Recommended)
Once the server is ready, a QR code will be displayed in the terminal.

**To view the QR code:**
```bash
cat /tmp/expo-lan.log
```

### Method 2: Direct URL
If QR code doesn't work, use this URL in Expo Go:

**exp://10.140.214.94:8081**

Or open Safari/Chrome on your phone and type:
**http://10.140.214.94:8081**

### Method 3: Manual Entry
In Expo Go app, tap "Enter URL manually" and type:
**exp://10.140.214.94:8081**

---

## Current Server Info:
- **Status:** Starting up...
- **Local URL:** http://localhost:8081
- **Network URL:** http://10.140.214.94:8081
- **Expo URL:** exp://10.140.214.94:8081

---

## Troubleshooting:

1. **If QR code doesn't scan:**
   - Make sure your phone is on the same WiFi network
   - Try the direct URL method

2. **If app doesn't load:**
   - Wait for bundling to complete (first time takes 1-2 minutes)
   - Check that the server is running: `ps aux | grep expo`

3. **If connection fails:**
   - Restart the server: `pkill -f expo && npx expo start --lan`

---

## Check Server Status:
Run this command to see current status:
```bash
cat /tmp/expo-lan.log | tail -20
```
