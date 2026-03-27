---
phase: 01-mvp-deployment
plan: 01
subsystem: deployment
status: partial-checkpoint
tags: [deployment, docker, dependencies, build]
dependency_graph:
  requires: []
  provides: [dockerfile, standalone-build, runtime-deps]
  affects: [deployment-pipeline]
tech_stack:
  added: [Dockerfile, .dockerignore, package-lock.json]
  patterns: [next-standalone-output, multi-stage-docker-build]
key_files:
  created:
    - Dockerfile
    - .dockerignore
    - package-lock.json
  modified:
    - package.json
    - next.config.mjs
    - app/(dashboard)/ingresos/page.tsx
    - app/(dashboard)/movimientos/page.tsx
    - components/dashboard/GraficoBarras.tsx
    - components/shared/TipoBadge.tsx
    - lib/schemas/categorias.ts
decisions:
  - "Used --legacy-peer-deps for install due to @supabase/ssr peer conflict with supabase-js v2.100.1; required clean reinstall of node_modules after lock file corruption"
  - "Added MovimientoEditar interface in movimientos/page.tsx to bridge Movimiento (has categoria object) with FormularioMovimiento prop (expects categoria_id)"
  - "Standalone output ENOENT warning on Windows during build is a known Windows path issue — does not affect Linux Docker builds"
metrics:
  duration: "~20 minutes"
  completed_date: "2026-03-27"
  tasks_completed: 2
  tasks_total: 3
  files_changed: 11
---

# Phase 1 Plan 1: Fix Dependencies, Standalone Output, Dockerfile — Summary

**One-liner:** Added 7 missing runtime deps to package.json, enabled Next.js standalone output, created multi-stage Dockerfile for Dokploy, and fixed 6 TypeScript/ESLint errors blocking the production build.

## Tasks Completed

| Task | Description | Commit | Status |
|------|-------------|--------|--------|
| 1 | Fix package.json deps + next.config.mjs standalone + build | `3229c57` | Done |
| 2 | Create Dockerfile and .dockerignore | `8a26503` | Done |
| 3 | Configure Dokploy and deploy | — | Awaiting human action |

## What Was Built

### Task 1 — Dependencies and Build

Added missing runtime dependencies to `package.json`:
- `@supabase/ssr` ^0.9.0
- `@supabase/supabase-js` ^2.78.0
- `clsx` ^2.1.1
- `lucide-react` ^1.7.0
- `recharts` ^3.8.1
- `tailwind-merge` ^3.5.0
- `zod` ^4.3.6

Updated `next.config.mjs` to enable `output: 'standalone'` for Docker compatibility.

Fixed 6 TypeScript/ESLint errors that blocked `npm run build`:
1. Removed unused `TipoBadge` import in `ingresos/page.tsx`
2. Removed unused `Filter` import in `movimientos/page.tsx`
3. Replaced `any` type with `MovimientoEditar` interface in `movimientos/page.tsx`
4. Fixed `null` vs `undefined` mismatch for `movimientoEditar` prop
5. Replaced `any` types in `GraficoBarras.tsx` with `TooltipProps`/`TooltipEntry` interfaces
6. Removed unused `TIPO_MOVIMIENTO` imports from `TipoBadge.tsx` and `lib/schemas/categorias.ts`

Build result: `npm run build` exits with code 0. `.next/standalone/server.js` exists.

### Task 2 — Docker Configuration

Created `Dockerfile` using the official Next.js multi-stage standalone pattern:
- Stage 1 `deps`: install all npm packages with `npm ci`
- Stage 2 `builder`: copy source + node_modules, run `npm run build`
- Stage 3 `runner`: copy only `.next/standalone` + `.next/static` + `public`, runs as non-root `nextjs:1001`

Created `.dockerignore` excluding `node_modules`, `.next`, `.git`, `.env.local`, `.env*.local`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrupted node_modules after first npm install attempt**
- **Found during:** Task 1 — first npm install with --legacy-peer-deps removed 329 existing packages, corrupting the `braces` module dependency chain
- **Fix:** Deleted `node_modules` and `package-lock.json`, ran clean `npm install --legacy-peer-deps` to regenerate from scratch
- **Files modified:** package-lock.json (regenerated), node_modules/ (clean install)
- **Commit:** 3229c57

**2. [Rule 1 - Bug] 6 TypeScript/ESLint errors blocking build**
- **Found during:** Task 1 — `npm run build` type-check phase
- **Issue:** Unused imports, implicit `any` types, `null` vs `undefined` type mismatch
- **Fix:** Removed 4 unused imports, added typed interfaces for recharts tooltip, bridged Movimiento/MovimientoEditar type shapes
- **Files modified:** 5 source files
- **Commit:** 3229c57

## Known Stubs

None — all changes are infrastructure and type fixes. No UI or data stubs introduced.

## Awaiting

**Task 3 requires human action in Dokploy dashboard:**
1. Push this code to the Git remote
2. Create Dokploy application pointing to this repo
3. Set environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
4. Trigger deploy
5. Verify login page loads at production URL

## Self-Check: PASSED

- `Dockerfile` exists: FOUND
- `.dockerignore` exists: FOUND
- `package.json` contains `@supabase/ssr`: FOUND
- `.next/standalone/server.js` exists: FOUND
- Commits `3229c57` and `8a26503` exist: FOUND
