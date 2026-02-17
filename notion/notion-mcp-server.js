#!/usr/bin/env node
/**
 * Biddt Notion MCP Server
 * 
 * This server provides MCP tools for managing Biddt project data in Notion.
 * 
 * Environment variables:
 * - NOTION_TOKEN: Your Notion integration token
 * - NOTION_DESIGN_DB_ID: Database ID for Design Screens
 * - NOTION_FEATURES_DB_ID: Database ID for Features
 * - NOTION_TASKS_DB_ID: Database ID for Technical Tasks
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Client } from '@notionhq/client';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DESIGN_DB_ID = process.env.NOTION_DESIGN_DB_ID;
const FEATURES_DB_ID = process.env.NOTION_FEATURES_DB_ID;
const TASKS_DB_ID = process.env.NOTION_TASKS_DB_ID;

if (!NOTION_TOKEN) {
  console.error('Error: NOTION_TOKEN environment variable is required');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

const server = new Server(
  {
    name: 'biddt-notion-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool handlers
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'list_design_screens',
        description: 'List all design screens from the Notion database',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Filter by category (Onboarding, Home, Search, Product, Sell, Profile, Checkout, System)',
            },
            status: {
              type: 'string',
              description: 'Filter by status (To Do, In Progress, Review, Done)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results',
              default: 50,
            },
          },
        },
      },
      {
        name: 'get_design_screen',
        description: 'Get details of a specific design screen by name or ID',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the screen',
            },
            screenId: {
              type: 'string',
              description: 'Stitch screen ID',
            },
          },
        },
      },
      {
        name: 'create_design_screen',
        description: 'Create a new design screen entry in Notion',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the screen',
            },
            screenId: {
              type: 'string',
              description: 'Stitch screen ID',
            },
            category: {
              type: 'string',
              description: 'Category (Onboarding, Home, Search, Product, Sell, Profile, Checkout, System)',
            },
            theme: {
              type: 'string',
              description: 'Theme (Light, Dark, Both)',
            },
            priority: {
              type: 'string',
              description: 'Priority (Low, Medium, High)',
            },
            stitchUrl: {
              type: 'string',
              description: 'URL to Stitch design',
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
            },
          },
          required: ['name', 'screenId'],
        },
      },
      {
        name: 'update_design_screen',
        description: 'Update an existing design screen entry',
        inputSchema: {
          type: 'object',
          properties: {
            pageId: {
              type: 'string',
              description: 'Notion page ID',
            },
            status: {
              type: 'string',
              description: 'New status (To Do, In Progress, Review, Done)',
            },
            figmaUrl: {
              type: 'string',
              description: 'Figma design URL',
            },
            assignee: {
              type: 'string',
              description: 'Email of assignee',
            },
            notes: {
              type: 'string',
              description: 'Additional notes',
            },
          },
          required: ['pageId'],
        },
      },
      {
        name: 'list_features',
        description: 'List all features from the Notion database',
        inputSchema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Filter by status',
            },
            priority: {
              type: 'string',
              description: 'Filter by priority (P0, P1, P2, P3)',
            },
          },
        },
      },
      {
        name: 'create_feature',
        description: 'Create a new feature in Notion',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Feature name',
            },
            description: {
              type: 'string',
              description: 'Feature description',
            },
            priority: {
              type: 'string',
              description: 'Priority (P0, P1, P2, P3)',
            },
            platform: {
              type: 'array',
              items: { type: 'string' },
              description: 'Platforms (iOS, Android, Both)',
            },
            dueDate: {
              type: 'string',
              description: 'Due date (ISO 8601)',
            },
          },
          required: ['name', 'priority'],
        },
      },
      {
        name: 'sync_stitch_screens',
        description: 'Bulk import all Stitch screens into Notion',
        inputSchema: {
          type: 'object',
          properties: {
            screens: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  screenId: { type: 'string' },
                  category: { type: 'string' },
                  theme: { type: 'string' },
                },
              },
              description: 'Array of screen objects to import',
            },
          },
          required: ['screens'],
        },
      },
    ],
  };
});

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_design_screens': {
        if (!DESIGN_DB_ID) {
          throw new Error('NOTION_DESIGN_DB_ID not configured');
        }
        
        const filters = [];
        if (args.category) {
          filters.push({
            property: 'Category',
            select: { equals: args.category },
          });
        }
        if (args.status) {
          filters.push({
            property: 'Status',
            select: { equals: args.status },
          });
        }

        const response = await notion.databases.query({
          database_id: DESIGN_DB_ID,
          filter: filters.length > 0 ? { and: filters } : undefined,
          page_size: args.limit || 50,
        });

        const screens = response.results.map((page) => ({
          id: page.id,
          name: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
          screenId: page.properties['Screen ID']?.rich_text?.[0]?.plain_text || '',
          category: page.properties.Category?.select?.name || '',
          theme: page.properties.Theme?.select?.name || '',
          status: page.properties.Status?.select?.name || '',
          priority: page.properties.Priority?.select?.name || '',
          url: page.url,
        }));

        return {
          content: [
            {
              type: 'text',
              text: `Found ${screens.length} design screens:\n\n${screens
                .map((s) => `- ${s.name} (${s.category || 'No category'}) - ${s.status || 'No status'}`)
                .join('\n')}`,
            },
          ],
        };
      }

      case 'create_design_screen': {
        if (!DESIGN_DB_ID) {
          throw new Error('NOTION_DESIGN_DB_ID not configured');
        }

        const properties = {
          Name: { title: [{ text: { content: args.name } }] },
          'Screen ID': { rich_text: [{ text: { content: args.screenId } }] },
        };

        if (args.category) {
          properties.Category = { select: { name: args.category } };
        }
        if (args.theme) {
          properties.Theme = { select: { name: args.theme } };
        }
        if (args.priority) {
          properties.Priority = { select: { name: args.priority } };
        }
        if (args.stitchUrl) {
          properties['Stitch URL'] = { url: args.stitchUrl };
        }
        if (args.notes) {
          properties.Notes = { rich_text: [{ text: { content: args.notes } }] };
        }

        const response = await notion.pages.create({
          parent: { database_id: DESIGN_DB_ID },
          properties,
        });

        return {
          content: [
            {
              type: 'text',
              text: `Created design screen "${args.name}" in Notion. Page ID: ${response.id}`,
            },
          ],
        };
      }

      case 'sync_stitch_screens': {
        if (!DESIGN_DB_ID) {
          throw new Error('NOTION_DESIGN_DB_ID not configured');
        }

        const results = [];
        for (const screen of args.screens) {
          try {
            const response = await notion.pages.create({
              parent: { database_id: DESIGN_DB_ID },
              properties: {
                Name: { title: [{ text: { content: screen.name } }] },
                'Screen ID': { rich_text: [{ text: { content: screen.screenId } }] },
                Category: screen.category ? { select: { name: screen.category } } : undefined,
                Theme: screen.theme ? { select: { name: screen.theme } } : undefined,
                Status: { select: { name: 'To Do' } },
              },
            });
            results.push({ success: true, name: screen.name, id: response.id });
          } catch (error) {
            results.push({ success: false, name: screen.name, error: error.message });
          }
        }

        const successCount = results.filter((r) => r.success).length;
        return {
          content: [
            {
              type: 'text',
              text: `Synced ${successCount}/${results.length} screens to Notion.\n\n${results
                .filter((r) => !r.success)
                .map((r) => `Failed: ${r.name} - ${r.error}`)
                .join('\n')}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Biddt Notion MCP server running on stdio');
