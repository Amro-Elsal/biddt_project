# Biddt Telegram Channel Setup Guide

## Overview

This guide will help you set up a Telegram channel/bot so you can:
- Send files to me via Telegram
- Receive files from me via Telegram
- Chat with me through Telegram

---

## Step 1: Create a Telegram Bot

### 1.1 Open Telegram
- Open Telegram app on your phone or desktop
- Search for: `@BotFather`

### 1.2 Create New Bot
1. Start chat with BotFather
2. Send: `/newbot`
3. Choose a name: `Biddt Assistant`
4. Choose a username: `biddt_assistant_bot` (must end in _bot)
5. **COPY THE BOT TOKEN** (looks like: `123456789:ABCdefGHIjklMNOpqrSTUvwxyz`)

---

## Step 2: Configure OpenClaw

### 2.1 Set Bot Token

Run these commands in terminal:

```bash
# Load nvm environment
source /root/.nvm/nvm.sh

# Set your bot token (replace with your actual token)
openclaw config set channels.telegram.botToken "123456789:YOUR_BOT_TOKEN_HERE"

# Configure settings
openclaw config set channels.telegram.dmPolicy "pairing"
openclaw config set channels.telegram.groups."*".requireMention true
openclaw config set channels.telegram.enabled true
```

### 2.2 Restart Gateway

**IMPORTANT:** I need to restart to apply changes.

```bash
openclaw gateway restart
```

---

## Step 3: Connect to Your Bot

### 3.1 Find Your Bot
- In Telegram, search for your bot username: `@biddt_assistant_bot`
- Click "Start" or send `/start`

### 3.2 Verify Connection
- Send a test message to the bot
- I should respond through Telegram

---

## Step 4: File Sharing

### Send Files TO Me:
1. Open chat with your bot
2. Attach file (document, image, etc.)
3. Send it
4. I'll receive and process it

### Receive Files FROM Me:
1. Ask me to send a file
2. I'll upload it to Telegram
3. You'll receive it in the chat

---

## Supported File Types

| Type | Send | Receive |
|------|------|---------|
| Documents (PDF, DOC, etc.) | ✅ | ✅ |
| Images (JPG, PNG, SVG) | ✅ | ✅ |
| Code files (JS, TS, etc.) | ✅ | ✅ |
| Archives (ZIP, etc.) | ✅ | ✅ |
| Audio/Video | ✅ | Limited |

---

## Useful Commands

Once connected, you can:

```
/sendfile [path]     - Request a file from the server
/files               - List available files
/help                - Show help
```

---

## Security Notes

⚠️ **Keep your bot token secret!**
- Never share it in public
- Don't commit it to GitHub
- If leaked, revoke it via @BotFather

---

## Troubleshooting

### Bot not responding?
1. Check if gateway restarted successfully
2. Verify bot token is correct
3. Check logs: `openclaw gateway logs`

### Can't send files?
1. Telegram has file size limits (20MB for bots)
2. Make sure file type is supported
3. Try compressing large files

---

## Next Steps

1. **Create bot** with @BotFather
2. **Get token** and save it securely
3. **Run config commands** (I can do this for you)
4. **Restart gateway** (I'll handle this)
5. **Test connection** by messaging your bot

---

**Ready to start?**

1. Go to Telegram and message @BotFather
2. Create your bot
3. Send me the bot token (securely)
4. I'll configure everything

Or if you already have a bot token, share it and I'll set it up immediately.
