# FinanzasJY

## What This Is

Web-based personal finance manager for Jose Ybarra. Lets him register and visualize all financial movements — income, fixed expenses, variable spending, investments, and loans — through a dashboard inspired by Money Manager and YNAB. Single-user, Spanish locale, dark theme.

## Core Value

A single place to register every financial movement and instantly see where money goes — replacing zero current tracking with complete clarity.

## Requirements

### Validated

- ✓ Auth (login, session persistence, logout, middleware redirects) — Phase 1
- ✓ Dashboard shell with metric cards, period selector, last 5 movements, 6-month bar chart — Phase 1
- ✓ Movement registration modal (INGRESO/EGRESO/GASTO/INVERSION) with category filtering — Phase 1
- ✓ Full history with date grouping, filters, inline edit/delete, soft deletes — Phase 1
- ✓ Type-filtered views (Ingresos, Egresos, Inversiones) — Phase 1
- ✓ Settings: category CRUD with predefined seed of 19 categories — Phase 1
- ✓ Database: migrations, RLS, historial audit trail, JY-XXXX transaction IDs — Phase 1

### Active

- [ ] Complete .env.local with SUPABASE_SERVICE_ROLE_KEY
- [ ] Deploy on Dokploy (production environment)
- [ ] QA testing: all modules on desktop and mobile

### Out of Scope

- Mobile apps — web dashboard is sufficient for single user, low-medium volume
- Bank integrations — manual entry is intentional for v1
- Real-time investment quotes — not needed for tracking purposes
- PDF/Excel export — deferred to Phase 3
- Multi-user — single user by design; Supabase architecture allows future expansion
- Push notifications — out of scope v1
- Password change UI — out of scope v1
- Monthly budgets — deferred to Phase 3 backlog

## Context

- Client: Jose Ybarra, personal use, non-technical user
- Stack locked: Next.js 14 App Router, Supabase (project: gmhfkxlqhoofuqdnnrow), Tailwind jy-* tokens, Zod, Radix UI
- Deploy target: Dokploy (self-hosted)
- No prior financial tracking — zero baseline, high value from day 1
- Existing docs in `JoseYbarra/` folder (requirements, roadmap, intake)
- No test framework — QA is manual

## Constraints

- **Stack**: Next.js 14, Supabase, Tailwind — locked, no changes
- **Single user**: RLS scoped to authenticated user, no multi-tenancy
- **Language**: Spanish locale throughout (es-AR), Fraunces + DM Sans fonts
- **Deploy**: Dokploy — needs SERVICE_ROLE_KEY env var to function

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Service Role client for API writes | Bypasses RLS for server-side mutations | ✓ Good |
| Soft deletes only | Immutable history requirement | ✓ Good |
| JY-XXXX human-readable IDs | User-friendly reference for movements | ✓ Good |
| No server actions — API routes only | Cleaner separation, easier to test | ✓ Good |
| historial table for audit trail | Append-only, never mutated | ✓ Good |
| 3 Supabase clients (browser/server/service) | Each scoped to its responsibility | ✓ Good |

---
*Last updated: 2026-03-26 — GSD initialization from existing JoseYbarra/ docs*
