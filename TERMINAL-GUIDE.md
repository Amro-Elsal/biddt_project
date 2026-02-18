# Biddt Terminal Access & MCP Setup Guide

## Step 1: Open Terminal

### Option A: SSH into your server
```bash
ssh root@YOUR_SERVER_IP
```

### Option B: Use web terminal (if available)
- Check your hosting provider's control panel
- Look for "Console" or "Terminal"

### Option C: Local terminal (if files are local)
- Open Terminal (Mac) or Command Prompt/PowerShell (Windows)
- Navigate to the project folder

---

## Step 2: Navigate to Project

Once in terminal, run:

```bash
# Go to project folder
cd /root/.openclaw/workspace/biddt

# List all files
ls -la

# View directory structure
tree . -L 2
```

---

## Step 3: View Files

### View Documentation
```bash
# Read README
cat README.md

# Read workflow visualization
cat docs/workflow-visualization.md

# Read design system
cat docs/design-system-v2.md
```

### View Code
```bash
# Backend API entry point
cat src/backend/src/index.ts

# Database schema
cat src/backend/src/db/schema.ts

# Mobile components
cat src/mobile/shared/components/Button.tsx
```

### View Logo SVG
```bash
# Display SVG content
cat designs/assets/logo-concept-2-spark.svg
```

---

## Step 4: Start Web Server (to view in browser)

```bash
cd /root/.openclaw/workspace/biddt

# Start Python HTTP server
python3 -m http.server 8080

# Keep this running!
# Now open browser to: http://YOUR_SERVER_IP:8080
```

**In a new terminal window**, verify it's working:
```bash
curl http://localhost:8080/README.md | head -20
```

---

## Step 5: Set Up GitHub MCP

### 5.1 Create GitHub Token

1. Go to: https://github.com/settings/tokens/new
2. Token name: "Biddt Project"
3. Select scopes:
   - [x] `repo` (Full control of private repositories)
   - [x] `workflow` (Update GitHub Action workflows)
4. Click "Generate token"
5. **COPY THE TOKEN** (you won't see it again)

### 5.2 Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `biddt`
3. Make it **Private**
4. DON'T initialize with README (we have one)
5. Click "Create repository"

### 5.3 Push Code to GitHub

In terminal:
```bash
cd /root/.openclaw/workspace/biddt

# Add your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/biddt.git

# Push code
git branch -M main
git push -u origin main
```

Enter your GitHub username and **token** as password.

---

## Step 6: Set Up Notion MCP

### 6.1 Create Notion Integration

1. Go to: https://www.notion.so/my-integrations
2. Click "New integration"
3. Name: "Biddt Project"
4. Associated workspace: Select yours
5. Capabilities:
   - [x] Read content
   - [x] Update content
   - [x] Insert content
6. Click "Submit"
7. **COPY THE TOKEN** (Internal Integration Token)

### 6.2 Create Notion Workspace

1. Go to your Notion workspace
2. Create new page: "Biddt Project"
3. Add icon: 💎

### 6.3 Create Databases

Inside "Biddt Project" page, create:

**Database 1: Design Screens**
```
Properties:
- Name (Title)
- Screen ID (Text)
- Category (Select): Onboarding | Home | Search | Product | Sell | Profile | Checkout | System
- Theme (Select): Light | Dark | Both
- Status (Select): Not Started | Wireframe | Design | Review | Dev Handoff | In Dev | QA | Done
- Priority (Select): Critical | High | Medium | Low
```

**Database 2: Tasks**
```
Properties:
- Name (Title)
- Team (Select): R&D | Marketing | BD | Engineering | Design | Legal
- Status (Select): Backlog | To Do | In Progress | Review | Done | Blocked
- Priority (Select): P0 | P1 | P2 | P3
- Assignee (People)
```

### 6.4 Get Database IDs

1. Open each database in full-page view
2. Copy URL: `https://www.notion.so/workspace/ABC123?v=...`
3. The `ABC123` part is your Database ID

### 6.5 Configure OpenClaw MCP

Edit your OpenClaw config file:

```bash
# Find config location
openclaw config get

# Edit config (usually ~/.config/openclaw/config.json)
nano ~/.config/openclaw/config.json
```

Add this MCP server:
```json
{
  "mcpServers": {
    "biddt-notion": {
      "command": "node",
      "args": ["/root/.openclaw/workspace/biddt/notion/notion-mcp-server.js"],
      "env": {
        "NOTION_TOKEN": "secret_YOUR_NOTION_TOKEN_HERE",
        "NOTION_DESIGN_DB_ID": "YOUR_DESIGN_DB_ID",
        "NOTION_TASKS_DB_ID": "YOUR_TASKS_DB_ID"
      }
    }
  }
}
```

Restart OpenClaw:
```bash
openclaw gateway restart
```

---

## Step 7: Verify MCP Connection

Once configured, ask me:
```
"List all design screens in Notion"
"Create a new task for Team Engineering"
"Update screen status to 'In Progress'"
```

---

## Quick Reference Commands

```bash
# Navigate to project
cd /root/.openclaw/workspace/biddt

# View any file
cat filename

# Edit file
nano filename

# Start backend
cd src/backend && npm install && npm run dev

# Start mobile
cd src/mobile && npm install && npx expo start

# Git commands
git status
git add .
git commit -m "message"
git push

# View running processes
ps aux | grep node

# Kill process
kill PROCESS_ID
```

---

## Troubleshooting

### "Permission denied"
```bash
chmod +x script.sh
sudo command
```

### "Port already in use"
```bash
# Find process using port 8080
lsof -i :8080

# Kill it
kill -9 PROCESS_ID
```

### "npm not found"
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## Need Help?

Tell me:
1. Which step you're on
2. What error message you see
3. What you want to accomplish

I'll guide you through it.
