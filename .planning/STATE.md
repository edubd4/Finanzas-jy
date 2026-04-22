---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Loans Module + Inversiones Enhancement
current_phase: 2
status: ready-to-plan
last_updated: "2026-04-22T00:00:00.000Z"
progress:
  total_phases: 2
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
---

# Project State: FinanzasJY

**Last updated:** 2026-04-22
**Current phase:** Phase 2 — Loans Module (ready to plan)
**Stopped at:** v2.0 roadmap defined; awaiting `/gsd:plan-phase 2`
**Last activity:** 2026-04-22 — Milestone v2.0 roadmap created (Phase 2: Loans, Phase 3: Inversiones Enhancement)

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-22)

**Core value:** Register every financial movement and see where money goes — replaces zero tracking.
**Current focus:** v2.0 — Loans module (prestamos + cuotas) + Inversiones enhancement (entry/exit tracking, % return)

## Phase Progress (v2.0)

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 2 | Loans Module | Pending | 0/TBD plans |
| 3 | Inversiones Enhancement | Pending | 0/TBD plans |

## Previous Milestone (v1.0) — Complete

| Phase | Name | Status | Closed |
|-------|------|--------|--------|
| 1 | MVP Deployment | **Complete** | 2026-04-21 — deployed to Dokploy, QA passed, 3 bugs fixed |

v1.0 shipped 30 requirements across Auth, Dashboard, Movements, History, Type Views, Settings, Deployment.

## Phase 2 — Scope Summary

**Goal:** Full préstamos tracking — register, auto-generate cuotas, mark paid, dashboard widget, sidebar entry.

**Requirements:** LOAN-01 through LOAN-08 (8 total)

**Known work areas:**
- New DB migration: `prestamos` + `cuotas_prestamo` tables with RLS + soft-delete columns
- PREST-XXXX ID generation (mirror JY-XXXX pattern)
- Auto-generate cuotas on loan create (single source of truth — see Key Decision in PROJECT.md)
- API routes: `/api/prestamos`, `/api/prestamos/[id]`, `/api/cuotas/[id]` (mark paid)
- Pages: `/prestamos` list + detail, sidebar entry
- Dashboard widget: upcoming 30 days
- historial writes for every mutation (reuse existing audit pattern)

## Phase 3 — Scope Summary

**Goal:** Inversiones lifecycle — entry/exit tracking, close flow with % retorno, open/closed split.

**Requirements:** INV-01 through INV-06 (6 total)

**Known work areas:**
- DB migration: extend `movimientos` (or dedicated table) with `fecha_entrada`, `fecha_alerta_salida`, `monto_esperado`, `monto_final`, `estado` (ABIERTA/CERRADA)
- Close flow endpoint that captures `monto_final` and computes `% retorno` + `días mantenida`
- Expandable detail card component
- Visual alert when `fecha_alerta_salida` reached
- `/inversiones` view split into abiertas and cerradas sections

## Decisions Made (carrying forward from v1.0)

| Decision | Context | Outcome |
|----------|---------|---------|
| Service Role client for API writes | Bypasses RLS for server-side mutations | ✓ Good — apply to new tables |
| Soft deletes only | Immutable history requirement | ✓ Applies to prestamos + cuotas_prestamo (LOAN-07) |
| historial table for audit trail | Append-only, never mutated | ✓ Applies to loan + cuota mutations (LOAN-08) and inversión close |
| 3 Supabase clients (browser/server/service) | Each scoped to its responsibility | ✓ Reuse for new endpoints |
| PREST-XXXX IDs for loans | Consistent with JY-XXXX pattern | Pending v2 — implement in Phase 2 |
| Auto-generate cuotas on loan create | Single source of truth, prevents manual drift | Pending v2 — implement in Phase 2 |
| Inversiones `estado` enum (ABIERTA/CERRADA) | Explicit lifecycle, enables close flow + % return | Pending v2 — implement in Phase 3 |

## Key Patterns (for plan-phase reference)

```typescript
// Auth pattern in API routes
const supabase = createServerClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// Write pattern (bypasses RLS)
const serviceClient = createServiceRoleClient()
await serviceClient.from('prestamos').insert({...})

// Soft delete pattern
await serviceClient.from('prestamos')
  .update({ deleted_at: new Date().toISOString() })
  .eq('id', id)

// Query pattern (always filter soft deletes)
await supabase.from('prestamos').select('*').is('deleted_at', null)

// Audit trail pattern — mandatory on every mutation
await serviceClient.from('historial').insert({
  user_id: user.id,
  entidad: 'prestamo', // or 'cuota_prestamo', 'movimiento', etc.
  accion: 'crear' | 'editar' | 'eliminar' | 'pagar' | 'cerrar',
  entidad_id: row.id,
  detalle: {...}
})
```

## Supabase Project

- Project ID: `gmhfkxlqhoofuqdnnrow`
- Existing tables: `profiles`, `historial`, `movimientos`, `categorias`
- Phase 2 will add: `prestamos`, `cuotas_prestamo`
- Phase 3 will extend: `movimientos` (or equivalent) with inversión lifecycle columns
- RLS: enabled on all tables (required for new tables too)

## Session Continuity

**Next action:** `/gsd:plan-phase 2` — decompose Phase 2 (Loans Module) into plans.

---
*State initialized: 2026-03-26 via GSD new-project*
*Last updated: 2026-04-22 — v2.0 roadmap created; Phase 2 (Loans) ready to plan, Phase 3 (Inversiones Enhancement) queued*
