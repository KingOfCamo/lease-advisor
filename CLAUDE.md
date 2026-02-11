# Lease Advisor — Ben Palmieri Consulting

## Quick Start
```bash
npm run dev        # Start dev server on localhost:3000
npx prisma studio  # Browse database
npm run seed       # Re-seed with sample data
npm run build      # Production build
```

## Tech Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui (New York style, navy theme)
- **Prisma 6** + SQLite (`prisma/dev.db`)
- **recharts** for portfolio analytics
- **@react-pdf/renderer** for PDF generation
- **react-hook-form** + zod for wizard validation

## Architecture
- **Server Components** for data fetching; **Server Actions** for mutations
- **API Routes** for PDF generation and analysis triggers
- Multi-step wizard uses **React Context + useReducer** (`wizard-context.tsx`)
- Analysis engine uses **strategy pattern**: `AI_MODE=mock` for rule-based, future `AI_MODE=live` for Claude API
- JSON fields in SQLite for clause scores, recommendations, outgoings

## Key Directories
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (analyse, report PDF, fee proposal PDF, settings)
│   ├── clients/            # Client CRUD
│   ├── dashboard/          # Summary dashboard
│   ├── leases/             # Lease list, detail, wizard, upload
│   ├── portfolio/          # Portfolio dashboard per client
│   ├── reports/            # Reports hub + fee proposal builder
│   └── settings/           # Business settings form
├── components/
│   ├── layout/             # Sidebar, breadcrumbs, page header
│   ├── lease-wizard/       # 8-step wizard (context, shell, steps/)
│   ├── portfolio/          # Portfolio charts (recharts)
│   └── ui/                 # shadcn/ui primitives
├── services/
│   ├── analysis/           # Mock analysis engine (rule-based scoring)
│   ├── market/             # Mock market data for Melbourne suburbs
│   └── pdf/                # PDF templates (lease report, fee proposal)
├── actions/                # Server actions (client CRUD)
└── lib/                    # Prisma client, formatters, utils
```

## Database
- SQLite for dev, PostgreSQL-compatible schema for production
- Models: Client, Property, Lease, LeaseAnalysis, BusinessSettings
- Seed: 2 clients, 5 Melbourne leases (`prisma/seed.ts`)

## PDF Generation
- Uses `@react-pdf/renderer` in API route handlers
- Type bridge: `src/services/pdf/render.ts` wraps `renderToBuffer` to handle type mismatch
- Report route: `GET /api/leases/[id]/report` — 9-section analysis PDF
- Fee proposal: `POST /api/clients/[id]/fee-proposal` — fee proposal PDF

## Known Patterns
- Prisma 6 (not 7) — avoids ESM-only breaking changes
- `renderToBuffer` type mismatch with `React.createElement` — solved via `renderPdfToBuffer` helper
- Recharts v3 has stricter Tooltip types — use default Tooltip without custom formatters
- Australian conventions: AUD currency, sqm areas, DD/MM/YYYY dates
