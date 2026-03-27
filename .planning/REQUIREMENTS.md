# Requirements: FinanzasJY

**Defined:** 2026-03-26
**Core Value:** A single place to register every financial movement and instantly see where money goes.

## v1 Requirements

### Authentication

- [x] **AUTH-01**: User can log in with email and password
- [x] **AUTH-02**: Unauthenticated users are redirected to /login
- [x] **AUTH-03**: Auth errors display clear messages
- [x] **AUTH-04**: User can log out; session is destroyed

### Dashboard

- [x] **DASH-01**: Dashboard shows 4 metric cards (balance, income, expenses, investments)
- [x] **DASH-02**: User can navigate between periods (month/year)
- [x] **DASH-03**: Last 5 movements shown with type color coding
- [x] **DASH-04**: Quick action buttons to register movement by type
- [x] **DASH-05**: 6-month bar chart of income vs expenses

### Movements

- [x] **MOV-01**: Modal form to register movements with type selector
- [x] **MOV-02**: Fields: description, amount, date, category, notes
- [x] **MOV-03**: Form colors adapt to selected type
- [x] **MOV-04**: Categories filtered by movement type
- [x] **MOV-05**: List updates without full page reload after submit
- [x] **MOV-06**: Inline edit of existing movements
- [x] **MOV-07**: Soft delete (deleted_at timestamp, never shown after)

### History

- [x] **HIST-01**: All active movements visible in chronological list
- [x] **HIST-02**: Movements grouped by date (Money Manager style)
- [x] **HIST-03**: Each row shows: ID, description, category, amount, type color
- [x] **HIST-04**: Filters: date range, type, category
- [x] **HIST-05**: Period summary (income, expenses, balance)
- [x] **HIST-06**: Text search by description

### Type Views

- [x] **VIEW-01**: Dedicated view for Ingresos filtered to INGRESO type
- [x] **VIEW-02**: Dedicated view for Egresos filtered to EGRESO/GASTO types
- [x] **VIEW-03**: Dedicated view for Inversiones filtered to INVERSION type

### Settings

- [x] **CONF-01**: Manage categories: create, edit, activate/deactivate
- [x] **CONF-02**: Predefined seed of 19 categories on first load
- [x] **CONF-03**: User profile section (read-only display)

### Deployment

- [x] **DEPL-01**: SUPABASE_SERVICE_ROLE_KEY configured in production env
- [x] **DEPL-02**: App deployed and accessible on Dokploy
- [ ] **DEPL-03**: QA pass: all modules verified on desktop and mobile

## v2 Requirements

### Loans (Préstamos)

- **LOAN-01**: Register loans with amount, recipient, start date, installment count
- **LOAN-02**: System auto-generates monthly installments (PREST-XXXX IDs)
- **LOAN-03**: User can mark individual installments as paid
- **LOAN-04**: Dashboard shows upcoming payments in next 30 days
- **LOAN-05**: Loans appear in movement history with PRESTAMO type

### UI/UX Refinements

- **UX-01**: Refinements based on real usage feedback after Phase 1 deploy
- **UX-02**: Keyboard shortcuts for common actions
- **UX-03**: Empty states with helpful prompts

## v3 Backlog

- Pie charts by category
- Calendar view of movements
- Monthly budgets with progress bars
- CSV export
- Monthly summaries with comparison
- Custom tags on movements
- Light theme option

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile apps | Web dashboard sufficient for single user; low-medium volume |
| Bank integrations | Manual entry intentional for v1 |
| Real-time investment quotes | Tracking only, not portfolio management |
| PDF/Excel export | Deferred to Phase 3 |
| Multi-user / teams | Single user by design; can expand later |
| Push notifications | Not needed for personal use v1 |
| Password change UI | Out of scope v1; use Supabase dashboard |
| OAuth login | Email/password sufficient |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01–04 | Phase 1 | Complete |
| DASH-01–05 | Phase 1 | Complete |
| MOV-01–07 | Phase 1 | Complete |
| HIST-01–06 | Phase 1 | Complete |
| VIEW-01–03 | Phase 1 | Complete |
| CONF-01–03 | Phase 1 | Complete |
| DEPL-01–02 | Phase 1 | Complete |
| DEPL-03 | Phase 1 | Pending (QA) |
| LOAN-01–05 | Phase 2 | Pending |
| UX-01–03 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Complete: 29
- Pending: 1 (DEPL-03 QA)
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-26*
*Last updated: 2026-03-27 — DEPL-01 and DEPL-02 complete; app deployed to Dokploy*
