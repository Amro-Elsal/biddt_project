# Biddt Project Setup Guide

Complete setup instructions for the Biddt marketplace app project.

## 1. Design Assets Setup

### Option A: Manual Download from Google Stitch

1. Visit https://stitch.withgoogle.com/projects/7716826996448100712
2. Log in with your Google account
3. For each of the 34 screens:
   - Click on the screen
   - Export as PNG (2x resolution recommended)
   - Save to `biddt/designs/stitch/`

### Option B: Export All at Once

If Stitch supports bulk export:
- Look for "Export All" or "Download Project" option
- Select PNG format
- Extract to `biddt/designs/stitch/`

### Naming Convention

Use the provided screen numbers:
```
01-seller-analytics.png
02-bidding-interaction.png
03-outbid-alert-navy.png
...
34-profile-light.png
```

## 2. Notion Workspace Setup

### Step 1: Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name: "Biddt Project"
4. Associated workspace: Select your workspace
5. Capabilities: Read content, Update content, Insert content
6. Copy the "Internal Integration Token"

### Step 2: Create Project Page

1. In Notion, create a new page called "Biddt Project"
2. Add the following databases:

#### Database 1: Design Screens

| Property | Type | Options |
|----------|------|---------|
| Name | Title | - |
| Screen ID | Text | - |
| Category | Select | Onboarding, Home, Search, Product, Sell, Profile, Checkout, System |
| Theme | Select | Light, Dark, Both |
| Status | Select | To Do, In Progress, Review, Done |
| Priority | Select | Low, Medium, High |
| Assignee | People | - |
| Figma URL | URL | - |
| Stitch URL | URL | - |
| Notes | Rich Text | - |

#### Database 2: Features

| Property | Type | Options |
|----------|------|---------|
| Name | Title | - |
| Description | Rich Text | - |
| Status | Select | Backlog, In Progress, Testing, Released |
| Priority | Select | P0, P1, P2, P3 |
| Platform | Multi-select | iOS, Android, Both |
| Owner | People | - |
| Due Date | Date | - |
| Related Screens | Relation | → Design Screens |

#### Database 3: Technical Tasks

| Property | Type | Options |
|----------|------|---------|
| Name | Title | - |
| Type | Select | API, UI, Database, Auth, Payment, Integration |
| Status | Select | Todo, In Progress, Code Review, Done |
| Priority | Select | Low, Medium, High, Critical |
| Assignee | People | - |
| Sprint | Select | Sprint 1, Sprint 2, etc. |
| Story Points | Number | - |
| Related Feature | Relation | → Features |

### Step 3: Share Databases with Integration

For each database:
1. Click "..." (more options)
2. Click "Add connections"
3. Select "Biddt Project" integration
4. Repeat for all 3 databases

### Step 4: Get Database IDs

1. Open each database in full-page view
2. Copy the URL, e.g.:
   ```
   https://www.notion.so/workspace/abc123def456?v=...
                               ^^^^^^^^^^^^
                               Database ID
   ```
3. Save these IDs for the MCP configuration

## 3. MCP Configuration

### Option A: Using OpenClaw Gateway Config

Edit your OpenClaw gateway configuration file:

```json
{
  "mcpServers": {
    "biddt-notion": {
      "command": "node",
      "args": ["/root/.openclaw/workspace/biddt/notion/notion-mcp-server.js"],
      "env": {
        "NOTION_TOKEN": "secret_xxxxxxxxxxxxxxxx",
        "NOTION_DESIGN_DB_ID": "abc123def456",
        "NOTION_FEATURES_DB_ID": "def456ghi789",
        "NOTION_TASKS_DB_ID": "ghi789jkl012"
      }
    }
  }
}
```

### Option B: Using npx (simpler)

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "secret_xxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

Then restart OpenClaw gateway:
```bash
openclaw gateway restart
```

## 4. Import Stitch Screens to Notion

Once MCP is configured, run:

```javascript
// In your OpenClaw session, ask:
"Sync all Stitch screens to Notion using the stitch-screens-data.js file"
```

Or manually run the import script:

```bash
cd /root/.openclaw/workspace/biddt/notion
node -e "
import { stitchScreens } from './stitch-screens-data.js';
console.log(JSON.stringify(stitchScreens, null, 2));
"
```

## 5. Mobile App Setup

### React Native (Recommended)

```bash
cd /root/.openclaw/workspace/biddt/src/mobile
npx react-native init BiddtApp --template react-native-template-typescript
cd BiddtApp
```

Install dependencies:
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-reanimated react-native-gesture-handler
npm install @shopify/react-native-skia  # For advanced graphics
npm install react-native-vision-camera    # For QR scanning
npm install @stripe/stripe-react-native   # For payments
```

### Flutter (Alternative)

```bash
cd /root/.openclaw/workspace/biddt/src/mobile
flutter create biddt_app
cd biddt_app
```

## 6. Backend Setup

```bash
cd /root/.openclaw/workspace/biddt/src/backend
# Node.js/Express example:
npm init -y
npm install express mongoose cors dotenv
npm install -D typescript @types/express @types/node
```

## 7. Quick Start Commands

```bash
# View project structure
tree -L 3 /root/.openclaw/workspace/biddt

# Check design files
ls -la /root/.openclaw/workspace/biddt/designs/stitch/

# Run screen data summary
node /root/.openclaw/workspace/biddt/notion/stitch-screens-data.js

# Start MCP server (after configuring env vars)
node /root/.openclaw/workspace/biddt/notion/notion-mcp-server.js
```

## Next Steps

1. ⬜ Download all 34 Stitch screens
2. ⬜ Create Notion integration and databases
3. ⬜ Configure MCP in OpenClaw
4. ⬜ Import screens to Notion
5. ⬜ Initialize mobile app project
6. ⬜ Set up backend API
7. ⬜ Create Figma project for design handoff

## Resources

- [Google Stitch](https://stitch.withgoogle.com)
- [Notion API Docs](https://developers.notion.com/)
- [MCP Specification](https://modelcontextprotocol.io/)
- [React Native Docs](https://reactnative.dev/)
- [Nike App Design Analysis](https://www.niceverynice.com/portfolio/nike)
