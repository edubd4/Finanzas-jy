# Roadmap: FinanzasJY

**Created:** 2026-03-26
**Milestone:** v1.0 — Personal Finance MVP

---

## Phase 1: MVP Deployment
**Goal:** Ship the working MVP to production so Jose can start using it daily.
**Status:** Complete (2026-04-21)
**Plans:** 2 plans

### Requirements Covered
- DEPL-01: Configure SUPABASE_SERVICE_ROLE_KEY in Dokploy env
- DEPL-02: Deploy app on Dokploy with working build
- DEPL-03: QA all modules (auth, dashboard, movements, history, views, settings)

### What's Already Done
- Auth: login, session, logout, middleware redirects
- Dashboard: metrics, period navigation, last 5 movements, 6-month chart
- Movement registration: modal, all types, categories, edit, soft delete
- History: grouped by date, filters, summary, search, inline edit/delete
- Type views: Ingresos, Egresos, Inversiones
- Settings: category CRUD, seed data
- Database: 3 migrations, RLS, historial audit trail

### What Remains
1. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` and Dokploy env vars
2. Verify build passes (`npm run build`)
3. Deploy to Dokploy
4. QA checklist: auth flow, dashboard metrics, CRUD operations, filters, mobile

### Plans
- [x] 01-01-PLAN.md — Fix dependencies, create Dockerfile, deploy to Dokploy — COMPLETE (all 3 tasks, app live in production)
- [x] 01-02-PLAN.md — QA all modules on production — COMPLETE (3 bugs found and fixed)

---

## Phase 2: Loans Module + UX Refinements
**Goal:** Add full loans tracking and polish based on real usage.
**Status:** Pending

### Requirements Covered
- LOAN-01–05: Full loans module (register, installments, mark paid, dashboard view)
- UX-01–03: Refinements from Phase 1 usage feedback

### Planned Work
1. Database migration: `prestamos` + `cuotas_prestamo` tables
2. Loan registration form (amount, recipient, date, installments)
3. Auto-generate installment schedule
4. Mark installments as paid
5. Dashboard: upcoming payments widget (next 30 days)
6. Loans view in sidebar
7. UX refinements (empty states, keyboard shortcuts, feedback from usage)

---

## Phase 3: Advanced Features
**Goal:** Enhanced analytics and data export for power use.
**Status:** Pending

### Planned Work
1. Pie charts by category (per period)
2. Calendar view of movements
3. Monthly budgets with progress bars
4. CSV export
5. Monthly summaries with period-over-period comparison

---

## Milestone: v1.0 Definition of Done

- [ ] All v1 requirements marked Complete in REQUIREMENTS.md
- [ ] App deployed and accessible on Dokploy
- [ ] QA passed: all modules on desktop and mobile
- [ ] Jose can log in and register movements in production
- [ ] Balance calculation verified correct

---
*Roadmap created: 2026-03-26*
*Last updated: 2026-03-27 — 01-01-PLAN.md complete; app deployed to Dokploy*
