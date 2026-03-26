# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint with Next.js config
```

No test framework is configured — QA is manual.

## Architecture Overview

**FinanzasJY** is a personal finance manager built with Next.js 14 App Router, Supabase (auth + PostgreSQL), and Tailwind CSS. The backend is entirely API routes; no server actions are used.

### Route Groups
- `app/(auth)/login` — Public login page
- `app/(dashboard)/` — All protected pages behind `DashboardShell` + `Sidebar` layout
- `app/api/` — REST API: `/movimientos`, `/movimientos/[id]`, `/dashboard`, `/categorias`, `/categorias/[id]`

`middleware.ts` handles auth redirects: unauthenticated → `/login`, authenticated → dashboard.

### Supabase Clients (3 distinct roles)
Located in `lib/supabase/`:
- **`client.ts`** — Browser client, auth only
- **`server.ts` → `createServerClient()`** — Server-side, respects RLS, uses user session cookie
- **`server.ts` → `createServiceRoleClient()`** — Server-side, bypasses RLS for API writes

All API routes follow this pattern: authenticate with `createServerClient()` first, then use `createServiceRoleClient()` for the actual database write.

### Data Flow Pattern
API routes validate input with Zod schemas (`lib/schemas/`) via `schema.safeParse(body)`, authenticate the user, then write via Service Role client. Pages are `'use client'` components that fetch data via `fetch()` calls to the API routes.

### Audit Trail & Soft Deletes
Every mutation inserts a row in the `historial` table (immutable, append-only). Transactions are never hard-deleted — they're soft-deleted via `deleted_at TIMESTAMPTZ`. All queries filter with `.is('deleted_at', null)`.

### Transaction Types (ENUM)
```
INGRESO   → Income
EGRESO    → Fixed commitment (rent, utilities)
GASTO     → Variable spending
INVERSION → Investments
PRESTAMO  → Loans (Phase 2)
```
Type-to-color mapping and labels are in `lib/constants.ts`.

## Custom Tailwind Colors (`jy-` prefix)

| Token | Hex | Use |
|---|---|---|
| `jy-bg` | `#0d1b2a` | Page background |
| `jy-card` | `#112240` | Cards/panels |
| `jy-input` | `#1a3358` | Inputs |
| `jy-accent` | `#3b82f6` | CTAs, active states |
| `jy-green` | `#22c55e` | Income (INGRESO) |
| `jy-red` | `#ef4444` | Expenses (EGRESO/GASTO) |
| `jy-amber` | `#f59e0b` | Investments (INVERSION) |
| `jy-purple` | `#a855f7` | Loans (PRESTAMO) |
| `jy-text` | `#e2e8f0` | Primary text |
| `jy-secondary` | `#94a3b8` | Secondary text |

Fonts: **Fraunces** (display) + **DM Sans** (body), loaded via `next/font/google`.

## Utilities (`lib/utils.ts`)

```typescript
cn(...)                    // clsx + tailwind-merge
formatPesos(amount)        // ARS currency, no decimals
formatFecha(date)          // DD/MM/YYYY (es-AR)
formatMes(date)            // "Marzo 2026" (es-AR)
```

## Database IDs
- Transactions: `JY-0001` (human-readable) + UUID primary key
- Loans: `PREST-0001` + UUID
- All tables have RLS enabled; users only see their own data

## Project Documentation
Detailed requirements, roadmap, and architecture decisions are in the `JoseYbarra/` folder:
- `PROJECT.md` — Vision, stack, design decisions
- `REQUIREMENTS.md` — Functional requirements (RF-### format)
- `ROADMAP.md` — Phases and task checklist
- `STATE.md` — Current progress and architectural patterns with code examples
