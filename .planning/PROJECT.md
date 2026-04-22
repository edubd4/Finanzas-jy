# FinanzasJY

## What This Is

Web-based personal finance manager for Jose Ybarra. Lets him register and visualize all financial movements — income, fixed expenses, variable spending, investments, and loans — through a dashboard inspired by Money Manager and YNAB. Single-user, Spanish locale, dark theme.

## Core Value

A single place to register every financial movement and instantly see where money goes — replacing zero current tracking with complete clarity.

## Current Milestone: v2.0 Loans Module + Inversiones Enhancement

**Goal:** Agregar el módulo completo de préstamos con cuotas y enriquecer inversiones con tracking de entrada/salida y cálculo de retorno.

**Target features:**
- Loans module: `prestamos` + `cuotas_prestamo` tables, registration form, auto-generated installments, mark installments paid, dashboard widget for upcoming 30 days, sidebar entry
- Inversiones enhancement: entry/exit tracking (fecha_entrada, fecha_alerta_salida opt, monto_esperado opt), close flow with monto_final + auto-calculated % return, expandable detail card

## Requirements

### Validated

- ✓ Auth (login, session persistence, logout, middleware redirects) — Phase 1
- ✓ Dashboard shell with metric cards, period selector, last 5 movements, 6-month bar chart — Phase 1
- ✓ Movement registration modal (INGRESO/EGRESO/GASTO/INVERSION) with category filtering — Phase 1
- ✓ Full history with date grouping, filters, inline edit/delete, soft deletes — Phase 1
- ✓ Type-filtered views (Ingresos, Egresos, Inversiones) — Phase 1
- ✓ Settings: category CRUD with predefined seed of 19 categories — Phase 1
- ✓ Database: migrations, RLS, historial audit trail, JY-XXXX transaction IDs — Phase 1
- ✓ Production deployment on Dokploy — Phase 1 (2026-04-21)
- ✓ QA all modules on desktop and mobile — Phase 1

### Active

- [ ] Loans module (register, installments, mark paid, dashboard widget, sidebar)
- [ ] Inversiones enhancement (entry/exit tracking, close flow, % return, detail card)

### Out of Scope

- Mobile apps — web dashboard is sufficient for single user, low-medium volume
- Bank integrations — manual entry is intentional
- Real-time investment quotes — not needed for tracking purposes
- PDF/Excel export — deferred (Phase 3 backlog)
- Multi-user — single user by design; Supabase architecture allows future expansion
- Push notifications — out of scope
- Password change UI — out of scope
- Monthly budgets — deferred (Phase 3 backlog)
- Pie charts by category, calendar view, period comparisons — deferred (Phase 3 backlog)
- General UX refinements — deferred to v2.1 when concrete feedback arrives

## Context

- Client: Jose Ybarra, personal use, non-technical user
- Stack locked: Next.js 14 App Router, Supabase (project: gmhfkxlqhoofuqdnnrow), Tailwind jy-* tokens, Zod, Radix UI
- Deploy target: Dokploy (self-hosted) — LIVE in production since 2026-04-21
- Jose's v2 feedback (2026-04-22): only specific ask was inversiones improvement, told us "hacelo como vos pienses"
- Existing docs in `JoseYbarra/` folder (requirements, roadmap, intake)
- No test framework — QA is manual

## Constraints

- **Stack**: Next.js 14, Supabase, Tailwind — locked, no changes
- **Single user**: RLS scoped to authenticated user, no multi-tenancy
- **Language**: Spanish locale throughout (es-AR), Fraunces + DM Sans fonts
- **Deploy**: Dokploy — needs SERVICE_ROLE_KEY env var to function
- **Data integrity**: soft deletes only; historial audit trail for every mutation (applies to new tables too)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Service Role client for API writes | Bypasses RLS for server-side mutations | ✓ Good |
| Soft deletes only | Immutable history requirement | ✓ Good |
| JY-XXXX human-readable IDs | User-friendly reference for movements | ✓ Good |
| No server actions — API routes only | Cleaner separation, easier to test | ✓ Good |
| historial table for audit trail | Append-only, never mutated | ✓ Good |
| 3 Supabase clients (browser/server/service) | Each scoped to its responsibility | ✓ Good |
| PREST-XXXX IDs for loans | Consistent with JY-XXXX pattern, user-friendly | Pending v2 |
| Auto-generate cuotas on loan create | Single source of truth, prevents manual drift | Pending v2 |
| Inversiones `estado` enum (ABIERTA/CERRADA) | Explicit lifecycle, enables close flow + % return | Pending v2 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-22 — Milestone v2.0 started (Loans + Inversiones Enhancement)*
