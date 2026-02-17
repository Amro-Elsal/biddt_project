# Notion MCP Integration for Biddt

This document outlines how to connect Biddt project management to Notion via MCP (Model Context Protocol).

## Prerequisites

1. **Notion Integration**
   - Go to https://www.notion.so/my-integrations
   - Create a new integration named "Biddt Project"
   - Copy the Internal Integration Token

2. **Notion Database Setup**
   - Create a new page in Notion for the Biddt project
   - Add the following databases:

## Database Schema

### 1. Design Screens
```
Title: Design Screens
Properties:
- Name (Title)
- Screen ID (Text) - Stitch screen ID
- Category (Select): Onboarding | Home | Search | Product | Sell | Profile | Checkout | System
- Theme (Select): Light | Dark | Both
- Status (Select): To Do | In Progress | Review | Done
- Priority (Select): Low | Medium | High
- Assignee (People)
- Figma URL (URL)
- Stitch URL (URL)
- Notes (Rich Text)
```

### 2. Features
```
Title: Features
Properties:
- Name (Title)
- Description (Rich Text)
- Status (Select): Backlog | In Progress | Testing | Released
- Priority (Select): P0 | P1 | P2 | P3
- Platform (Multi-select): iOS | Android | Both
- Owner (People)
- Due Date (Date)
- Related Screens (Relation → Design Screens)
```

### 3. Technical Tasks
```
Title: Technical Tasks
Properties:
- Name (Title)
- Type (Select): API | UI | Database | Auth | Payment | Integration
- Status (Select): Todo | In Progress | Code Review | Done
- Priority (Select): Low | Medium | High | Critical
- Assignee (People)
- Sprint (Select)
- Story Points (Number)
- Related Feature (Relation → Features)
```

## MCP Configuration

Add to your OpenClaw gateway configuration:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "your_integration_token_here"
      }
    }
  }
}
```

Or use the SSE endpoint:

```json
{
  "mcpServers": {
    "notion": {
      "url": "https://mcp.notion.so/sse",
      "headers": {
        "Authorization": "Bearer your_integration_token_here"
      }
    }
  }
}
```

## Usage Examples

### Query Design Screens
```
List all design screens with status "To Do" in the Home category
```

### Update Screen Status
```
Update screen "Welcome to Biddt Splash" status to "In Progress"
```

### Create Feature
```
Create a new feature "Safe Exchange QR System" with priority P0
```

## Automation Ideas

1. **Auto-sync from Stitch**: When new screens are added to Stitch project, auto-create entries in Notion
2. **Status tracking**: Update Notion when Figma comments are resolved
3. **Sprint planning**: Generate sprint boards from prioritized features
4. **Design handoff**: Link Figma dev mode URLs to Notion screen entries

## Resources

- [Notion API Docs](https://developers.notion.com/)
- [MCP Specification](https://modelcontextprotocol.io/)
- [Notion MCP Server](https://github.com/makenotion/notion-mcp-server)
