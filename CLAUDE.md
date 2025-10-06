# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Enterprise AI Support V7** - Production-ready AI assistant interface with **real Zoho Desk & CRM integration**, Claude AI tool calling, and progressive streaming responses.

**Version**: 7.0.0
**Port**: 3005
**Status**: Production - Real integrations

## Application URLs

**IMPORTANT**: V7 uses the root page for the main interface.

**Development Server**: http://localhost:3005

**Main Application**:
- **Root Page**: http://localhost:3005 (PRIMARY INTERFACE)

**Legacy Demo Routes** (inherited from V6, use root instead):
- http://localhost:3005/demo/c-level
- http://localhost:3005/demo/cs-manager
- http://localhost:3005/demo/support-agent

## Development Commands

### Core Development
```bash
npm run dev              # Start Next.js dev server with Turbopack (port 3005)
npm run dev:full         # Start both frontend and mock WebSocket server
npm run dev:ws           # Start mock WebSocket server only
npm run build            # Production build with Turbopack
npm run start            # Start production server (port 3005)
```

### Code Quality
```bash
npm run type-check       # TypeScript validation (run before commits)
npm run lint             # ESLint validation
```

### Database Operations
```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database (development)
npm run db:migrate       # Create and run migrations (production)
npm run db:studio        # Open Prisma Studio for database management
```

## Technology Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript (strict mode)
- **Frontend**: React 19 with client components
- **Database**: Prisma ORM with PostgreSQL (optional)
- **Styling**: Tailwind CSS 4 with Solar Dusk theme
- **Animations**: Framer Motion (motion/react)
- **AI Integration**: Anthropic Claude SDK (@anthropic-ai/sdk) - **REQUIRED**
- **Zoho Integration**: Zoho Desk API + Zoho CRM API - **REQUIRED**
- **HTTP Client**: Axios for API calls
- **Icons**: Lucide React
- **Charts**: Recharts

## V7-Specific Features

### Real Zoho Integration
Unlike V6 (mock data) and V8 (testing), V7 connects to **real Zoho APIs**:

**Zoho Desk Integration**:
- List tickets with filters (`list_zoho_tickets`)
- Get single ticket detail (`get_ticket_detail`)
- Create new tickets (`create_ticket`)
- Check customer support status

**Zoho CRM Integration**:
- Search leads, contacts, accounts
- Check customer information
- Link CRM data with support tickets

### Claude AI Tool Calling
V7 uses Claude as an orchestrator with 8+ tools:

1. **list_zoho_tickets** - Fetch real tickets from Zoho Desk
2. **get_ticket_detail** - Get single ticket by ID
3. **create_ticket** - Create new support tickets
4. **search_zoho_crm** - Search CRM for leads/contacts/accounts
5. **search_zoho_crm_contacts** - Targeted contact search
6. **check_zoho_desk_status** - Check support status for customers
7. **send_slack_message** - Send Slack notifications (mock)
8. **schedule_google_calendar_event** - Schedule meetings (mock)

### Progressive Streaming
V7 implements smooth typewriter-style streaming:
- **Chunk size**: 50 characters
- **Delay**: 20ms between chunks
- **Total time**: ~8-9 seconds for Claude + Zoho roundtrip
- **Real-time**: Tool execution notifications during streaming

### Widget Data Transformation
V7 transforms Zoho API responses to widget format:
- Zoho ticket data → `TicketListData` widget
- Maps Zoho fields (priority, status, dates) to widget schema
- Appends `WIDGET_DATA:` marker for frontend parsing
- Renders beautiful TicketListWidget with real data

## Environment Variables

### Required for Production

```bash
# Claude AI (REQUIRED)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Zoho OAuth Credentials (REQUIRED)
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token
ZOHO_DESK_ORG_ID=your_org_id

# Zoho API Endpoints (REQUIRED)
ZOHO_DESK_API_URL=https://desk.zoho.com/api/v1
ZOHO_CRM_API_URL=https://www.zohoapis.com/crm/v2
```

### Optional

```bash
# Database (optional - for Prisma features)
DATABASE_URL=postgresql://...

# WebSocket (optional - for real-time features)
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Demo Mode (set to true to use mock data instead of real APIs)
DEMO_MODE=false
```

## Zoho OAuth Setup

### Prerequisites
1. Zoho Developer Console account
2. Create a Server-based Application
3. Set redirect URI: `http://localhost:3005/auth/callback`

### Steps to Get Tokens

1. **Get Authorization Code**:
```bash
https://accounts.zoho.com/oauth/v2/auth?scope=Desk.tickets.ALL,ZohoCRM.modules.ALL&client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3005/auth/callback&access_type=offline
```

2. **Exchange for Refresh Token**:
```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "code=AUTHORIZATION_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=http://localhost:3005/auth/callback" \
  -d "grant_type=authorization_code"
```

3. **Add to `.env.local`**:
```bash
ZOHO_REFRESH_TOKEN=1000.abc123...
```

## Architecture Overview

### Root Page Design
V7 uses a single-page interface at `/` with:
- Purple C-Level theme
- Quick Actions: SLA Performance, Churn Risk, Executive Summary, etc.
- "Quick Launch ⌘K" button
- Real-time chat with Claude AI
- Progressive streaming responses

### Query Routing Logic
Smart routing determines data source:

```typescript
// page.tsx:628-631
const shouldUseRealData =
  messageText.includes('list') && messageText.includes('ticket') ||
  messageText.includes('show') && messageText.includes('ticket') ||
  messageText.includes('all ticket');

// If shouldUseRealData = true → Claude API → Zoho → Real data
// If shouldUseRealData = false → Client-side widget → Mock data
```

### Data Flow

**Real Data Path** (Ticket Queries):
```
User Query
  ↓
Skip client-side detection (shouldUseRealData = true)
  ↓
POST /api/chat with message
  ↓
Claude AI determines tool to use
  ↓
Execute list_zoho_tickets tool
  ↓
GET /api/zoho/tickets (real Zoho API)
  ↓
Transform Zoho response → TicketListData
  ↓
Append WIDGET_DATA marker
  ↓
Stream progressively to frontend (50 chars / 20ms)
  ↓
Frontend parses WIDGET_DATA
  ↓
Render TicketListWidget with real data
```

**Mock Data Path** (Other Queries):
```
User Query
  ↓
Client-side widget detection
  ↓
Match pattern → Return mock widget
  ↓
Render immediately (no API call)
```

## Testing Queries

### Queries That Use Real Zoho Data
```
"list all tickets"
"show me all tickets"
"show me all open tickets"
"list high priority tickets"
"show me ticket #105"
"create a ticket for email server issue"
```

### Queries That Use Mock Data
```
"show me executive summary"
"which customers are at risk?"
"show me SLA performance"
"show team workload"
```

### Multi-Tool Workflows
```
"find all webinar attendees and check if they have support tickets"
→ Uses: search_zoho_crm + check_zoho_desk_status

"send a Slack summary of all open tickets to #support"
→ Uses: list_zoho_tickets + send_slack_message
```

## Performance Expectations

### Response Times
- **Mock widgets**: Instant (~500ms)
- **Claude only**: 2-3 seconds
- **Claude + Zoho**: 8-9 seconds (NORMAL)
- **Multi-tool**: 10-15 seconds

### Breakdown
1. Claude AI processing: ~2-3s
2. Zoho API call: ~2-3s
3. Data transformation: ~100ms
4. Progressive streaming: ~3-4s
5. **Total**: ~8-9s

This is **expected** for real integrations. The progressive streaming makes it feel faster.

## Troubleshooting

### Issue: "Stuck thinking" / No response

**Causes**:
1. Missing `ANTHROPIC_API_KEY`
2. Invalid Claude API key
3. Network timeout

**Solutions**:
- Check `.env.local` has valid API key
- Check console for errors
- Restart dev server

### Issue: "No widget data" / Shows JSON instead of widget

**Causes**:
1. `WIDGET_DATA:` parsing failed
2. Frontend not detecting marker
3. Widget renderer not matching type

**Solutions**:
- Check browser console for parsing errors
- Verify `WIDGET_DATA:` marker in response (page.tsx:804-828)
- Check WidgetRenderer has ticket-list case

### Issue: Zoho API errors

**Causes**:
1. Expired/invalid `ZOHO_REFRESH_TOKEN`
2. Missing OAuth scopes
3. Incorrect `ZOHO_DESK_ORG_ID`

**Solutions**:
- Regenerate refresh token (see Zoho OAuth Setup)
- Check token has `Desk.tickets.ALL` and `ZohoCRM.modules.ALL` scopes
- Verify org ID in Zoho Desk settings

### Issue: Slow responses (>15 seconds)

**Causes**:
1. Zoho API rate limiting
2. Large dataset queries
3. Multiple tool calls

**Solutions**:
- Add query filters to reduce data
- Use pagination for large results
- Optimize tool calling logic

### Issue: Model deprecation warnings

**Current**: Using `claude-3-5-sonnet-20241022` (EOL Oct 22, 2025)

**Solutions**:
- Migrate to `claude-3-5-sonnet-20250219` or latest
- Update `src/app/api/chat/route.ts:3164`

## Key Files

### Core Application
- `/src/app/page.tsx` - Root interface with chat and query routing
- `/src/app/layout.tsx` - Root layout with V7 metadata
- `/src/app/globals.css` - Solar Dusk theme styles

### API Routes
- `/src/app/api/chat/route.ts` - Claude AI integration with tool calling
- `/src/app/api/zoho/tickets/route.ts` - Zoho Desk API proxy
- `/src/app/api/zoho/crm/route.ts` - Zoho CRM API proxy (if exists)

### Data & Configuration
- `/src/data/personas.ts` - Persona configurations (Note: Support Agent has C-Level theme in V7)
- `/src/lib/query-detection.ts` - Client-side widget pattern matching
- `/src/types/widget.ts` - Widget type definitions

### Components
- `/src/components/widgets/WidgetRenderer.tsx` - Dynamic widget loader
- `/src/components/widgets/TicketListWidget.tsx` - Ticket list display
- `/src/components/widgets/WidgetSkeleton.tsx` - Loading states

## Important Notes

### Demo Routes Warning
V7 has `/demo/*` routes inherited from V6, but they serve no purpose:
- **Use**: `http://localhost:3005` (root page)
- **Avoid**: `http://localhost:3005/demo/*` routes

### Persona Configuration
The Support Agent persona in V7 intentionally uses:
- **Purple theme** (C-Level colors)
- **C-Level Quick Actions** (SLA Performance, Churn Risk, etc.)

This was a design decision for the root page interface. To revert:
```typescript
// src/data/personas.ts:268-309
// Change theme to green and Quick Actions to agent-specific
```

### Widget vs Real Data
V7 operates in hybrid mode:
- **Ticket queries** → Real Zoho data
- **Other queries** → Mock widgets

This is controlled by `shouldUseRealData` logic in `page.tsx:628-631`.

## Deployment Notes

### Production Requirements
- PostgreSQL 12+ database (optional)
- Node.js 18+ runtime
- Valid Claude API key
- Valid Zoho OAuth credentials
- SSL certificates for secure connections

### Environment Variables for Production
All required vars must be set:
- `ANTHROPIC_API_KEY`
- `ZOHO_CLIENT_ID`
- `ZOHO_CLIENT_SECRET`
- `ZOHO_REFRESH_TOKEN`
- `ZOHO_DESK_ORG_ID`

### Scaling Considerations
- Zoho API has rate limits (check Zoho documentation)
- Claude API has rate limits (check Anthropic documentation)
- Consider caching Zoho responses for frequently queried data
- Use pagination for large ticket lists

## Version Comparison

| Feature | V6 | V7 | V8 |
|---------|----|----|----|
| **Port** | 3004 | 3005 | 3006 |
| **Purpose** | Demo reference | Production | Testing sandbox |
| **Data** | Mock only | Real Zoho API | Mock only |
| **Claude** | Optional | Required | Optional |
| **Routes** | /demo/* | / and /demo/* | /demo/* |
| **Tools** | Mock tools | 8+ real tools | Mock tools |
| **Streaming** | Basic | Progressive (50/20ms) | Basic |

## Getting Help

If you encounter issues:
1. Check this CLAUDE.md troubleshooting section
2. Verify environment variables in `.env.local`
3. Check browser console for errors
4. Check server logs for API errors
5. Test with mock data first (`DEMO_MODE=true`)

## Project Context

V7 is the **production branch** with real integrations:
- **V4**: Stable base with multi-persona system
- **V6**: Demo reference with mock data (port 3004)
- **V7**: Production with real Zoho + Claude (port 3005) ← **YOU ARE HERE**
- **V8**: Testing sandbox cloned from V6 (port 3006)

V7 demonstrates a production-ready AI assistant that can:
- Fetch real customer support tickets
- Search real CRM data
- Create actual support tickets
- Provide intelligent responses using Claude
- Display data in beautiful, interactive widgets
