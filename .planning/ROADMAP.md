# Roadmap: FinanzasJY

**Created:** 2026-03-26
**Last updated:** 2026-04-22 — v2.0 roadmap scoped (Phase 2: Loans, Phase 3: Inversiones Enhancement)
**Current milestone:** v2.0 — Loans Module + Inversiones Enhancement

---

## Phases

- [x] **Phase 1: MVP Deployment** — Ship the v1.0 finance manager to production on Dokploy (COMPLETE)
- [ ] **Phase 2: Loans Module** — Full préstamos tracking with auto-generated cuotas, paid flow, dashboard widget, and sidebar entry
- [ ] **Phase 3: Inversiones Enhancement** — Entry/exit tracking, close flow with % retorno, expandable detail card, open/closed split

---

## Phase Details

### Phase 1: MVP Deployment
**Goal:** Ship the working v1.0 MVP to production so Jose can start using it daily.
**Status:** Complete (2026-04-21)
**Depends on:** Nothing (first phase)
**Requirements:** DEPL-01, DEPL-02, DEPL-03 (plus all v1 module work completed during phase)
**Success Criteria** (what must be TRUE):
  1. Jose can reach the app at the Dokploy production URL and log in with his credentials
  2. Every v1 module (auth, dashboard, movimientos, history, type views, settings) works end-to-end in production
  3. Manual QA passed on desktop and mobile; any blocker bugs fixed before close
**Plans:**
- [x] 01-01-PLAN.md — Fix dependencies, create Dockerfile, deploy to Dokploy — COMPLETE
- [x] 01-02-PLAN.md — QA all modules on production (3 bugs found and fixed) — COMPLETE

---

### Phase 2: Loans Module
**Goal:** Jose can register préstamos, track cuotas, mark them paid, and see upcoming payments from the dashboard — fully integrated with the existing audit and soft-delete patterns.
**Status:** Pending
**Depends on:** Phase 1 (auth, historial table, soft-delete conventions, Supabase clients pattern)
**Requirements:** LOAN-01, LOAN-02, LOAN-03, LOAN-04, LOAN-05, LOAN-06, LOAN-07, LOAN-08
**Success Criteria** (what must be TRUE):
  1. User can register a new préstamo (monto, destinatario, fecha inicio, cantidad de cuotas, frecuencia mensual) and the system creates a PREST-XXXX record with all cuotas auto-generated with correct due dates
  2. User can view the préstamos list showing each loan with a paid-vs-remaining summary (e.g. 3/12 cuotas pagadas) and drill into individual cuotas
  3. User can mark a cuota as paid; `paid_at` timestamp is captured and the payment reflects immediately in the loan summary and dashboard widget
  4. Dashboard shows a "Próximos pagos (30 días)" widget listing upcoming cuotas across all active loans
  5. Sidebar has a `/prestamos` entry that navigates to the loans view; deleting a loan or cuota is soft-only and every mutation writes a `historial` row
**Plans:** TBD
**UI hint**: yes

---

### Phase 3: Inversiones Enhancement
**Goal:** Jose can track the full lifecycle of an inversión — from entry with optional exit alert, through close with auto-calculated % retorno — and see open vs closed investments distinctly.
**Status:** Pending
**Depends on:** Phase 2 (no hard dependency on loans, but sequenced after to keep a single active work stream; builds on existing movimientos.INVERSION records from Phase 1)
**Requirements:** INV-01, INV-02, INV-03, INV-04, INV-05, INV-06
**Success Criteria** (what must be TRUE):
  1. When registering or editing an inversión, user can set `fecha_entrada` (required), `total_invertido` (required), and optionally `fecha_alerta_salida` and `monto_esperado`; inversiones carry an explicit `estado` of ABIERTA or CERRADA
  2. User can close an open inversión by entering `monto_final`; the system persists the close and auto-calculates `% retorno` and `días mantenida` from fecha_entrada → fecha de cierre
  3. Clicking an inversión row opens an expandable detail card showing fecha_entrada, total_invertido, monto_esperado, monto_final, % retorno, and días mantenida
  4. Open inversiones show a visible alert indicator once `fecha_alerta_salida` has passed (no push, purely in-app visual)
  5. The /inversiones view lists abiertas and cerradas in separate sections so Jose can see active positions vs realized returns at a glance
**Plans:** TBD
**UI hint**: yes

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. MVP Deployment | 2/2 | **Complete** | 2026-04-21 |
| 2. Loans Module | 0/TBD | Not started | — |
| 3. Inversiones Enhancement | 0/TBD | Not started | — |

---

## Milestone: v2.0 Definition of Done

- [ ] All v2 requirements (LOAN-01–08, INV-01–06) marked Complete in REQUIREMENTS.md
- [ ] Préstamos module live in production with at least one real loan registered and at least one cuota marked paid
- [ ] Inversiones enhancement live: one inversión closed with correct % retorno calculation verified by Jose
- [ ] Dashboard widget "Próximos pagos" shows data
- [ ] `/prestamos` sidebar entry functional
- [ ] Manual QA passed on desktop and mobile for both modules
- [ ] historial audit trail verified to capture préstamo + cuota mutations and inversión close events

---

## Coverage Validation

**v2 requirements mapped:** 14/14 ✓

| Requirement | Phase |
|-------------|-------|
| LOAN-01 | Phase 2 |
| LOAN-02 | Phase 2 |
| LOAN-03 | Phase 2 |
| LOAN-04 | Phase 2 |
| LOAN-05 | Phase 2 |
| LOAN-06 | Phase 2 |
| LOAN-07 | Phase 2 |
| LOAN-08 | Phase 2 |
| INV-01 | Phase 3 |
| INV-02 | Phase 3 |
| INV-03 | Phase 3 |
| INV-04 | Phase 3 |
| INV-05 | Phase 3 |
| INV-06 | Phase 3 |

No orphaned v2 requirements. v3 backlog and v2.1 UX refinements are intentionally deferred and not mapped to any phase.

---
*Roadmap created: 2026-03-26*
*Last updated: 2026-04-22 — v2.0 milestone scoped; Phase 1 closed (2026-04-21), Phase 2 (Loans) and Phase 3 (Inversiones Enhancement) defined*
