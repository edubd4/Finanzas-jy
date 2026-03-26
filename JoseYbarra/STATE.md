# STATE.md · JoseYbarra — FinanzasJY
Última actualización: 2026-03-26

---

## Fase actual
**Fase 1 — MVP Core del sistema**

## Progreso
0 de 3 fases completas — Fase 1 aprox. 75% implementada

---

## Completado

### Setup inicial ✅
- [x] Proyecto Next.js 14 creado con TypeScript strict
- [x] Tailwind configurado con paleta `jy-*`
- [x] Proyecto Supabase creado (ID: `gmhfkxlqhoofuqdnnrow`)
- [x] Middleware de auth configurado
- [x] `.env.local` con URL y ANON KEY — falta SERVICE_ROLE_KEY

### Base de datos ✅
- [x] Migración 001: profiles + generate_readable_id + historial
- [x] Migración 002: movimientos + RLS + soft delete
- [x] Migración 003: categorias + seed 19 categorías

### Auth (M1) — parcial
- [x] Login page `/login` con email/password y manejo de errores
- [x] Middleware redirige no autenticados → `/login`
- [x] Botón cerrar sesión en Sidebar

### Dashboard shell ✅
- [x] `DashboardShell.tsx` + Sidebar
- [x] Layout protegido `(dashboard)/layout.tsx`

### Dashboard (M2) ✅
- [x] `MetricCard` — 4 tarjetas (Balance, Ingresos, Egresos, Inversiones)
- [x] `AccionesRapidas` — botones + Ingreso, + Egreso, + Gasto, + Inversión
- [x] `PeriodoSelector` — navegación ← mes →
- [x] Lista de últimos 5 movimientos
- [x] `GraficoBarras` — Recharts, ingresos vs egresos últimos 6 meses
- [x] API `GET /api/dashboard`

### Registro de movimientos (M3) ✅
- [x] `FormularioMovimiento` — modal con color por tipo
- [x] Select de categoría filtrado por tipo
- [x] Date picker, monto, descripción opcional
- [x] `POST /api/movimientos` + Zod + historial
- [x] `PATCH /api/movimientos/[id]` — editar
- [x] `DELETE /api/movimientos/[id]` — soft delete con confirmación

### Historial (M4) ✅
- [x] `/movimientos` con lista agrupada por fecha
- [x] Filtros por período, tipo multi-select, búsqueda
- [x] Resumen en tope (ingresos / egresos / balance del período)
- [x] Editar y eliminar inline

### Vistas por tipo (M5) ✅
- [x] `/ingresos` — lista + total del período
- [x] `/egresos` — lista + totales EGRESO vs GASTO + combinado
- [x] `/inversiones` — lista + total invertido

### Configuración (M6) ✅
- [x] `/configuracion` — listado de categorías con filtro por tipo
- [x] Crear nueva categoría
- [x] Editar nombre inline
- [x] Activar/desactivar
- [x] APIs `POST/PATCH/DELETE /api/categorias`

## En curso
- [ ] Fase 1 — falta: completar SERVICE_ROLE_KEY + deploy en Dokploy

## Pendiente
- [ ] Completar `.env.local` con `SUPABASE_SERVICE_ROLE_KEY` (manual — ver dashboard Supabase)
- [ ] Deploy en Dokploy
- [ ] QA en desktop y mobile
- [ ] Fase 2 — Préstamos + refinamiento UI/UX
- [ ] Fase 3 — Gráficos avanzados + Exportación

## Pendiente
- [ ] Fase 2 — Préstamos + refinamiento UI/UX
- [ ] Fase 3 — Gráficos avanzados + Exportación

---

## Decisiones tomadas

| Fecha | Agente | Decisión | Justificación |
|-------|--------|----------|---------------|
| 2026-03-26 | Arquitecto | Prefijo de colores `jy-` | Evitar colisión con GoJulito al reutilizar componentes |
| 2026-03-26 | Arquitecto | EGRESO y GASTO como tipos separados | Permite análisis diferenciado: fijo vs variable |
| 2026-03-26 | Arquitecto | Inversiones NO restan del balance | Son activos, tienen su propia métrica en el dashboard |
| 2026-03-26 | Arquitecto | Préstamos en Fase 2 | Lógica de cuotas más compleja — prioridad al core primero |
| 2026-03-26 | Arquitecto | Sin n8n ni Telegram en V1 | Sistema de uso personal, sin notificaciones externas necesarias |
| 2026-03-26 | Arquitecto | Formulario de movimiento como modal/drawer | No interrumpe el contexto del usuario — registro fluido |
| 2026-03-26 | Arquitecto | Recharts para gráficos | Librería React nativa, sin complejidad extra |

---

## Blockers activos

| # | Descripción | Responsable | Qué lo desbloquea |
|---|-------------|-------------|-------------------|
| — | Sin blockers | — | — |

---

## Próximo paso

**Setup inicial del proyecto:**
1. Crear repositorio `finanzas-jy` y proyecto Next.js 14 con TypeScript strict
2. Configurar Tailwind con paleta `jy-*` (ver PROJECT.md)
3. Crear proyecto en Supabase
4. Copiar componentes UI de GoJulito reemplazando `gj-` → `jy-`
5. Configurar middleware de auth y deploy inicial en Dokploy

Referencia: ROADMAP.md → Fase 1 → "Setup inicial"

---

## Notas de sesión

### 2026-03-26
Proyecto iniciado. Intake, diagnóstico y propuesta completados. PROJECT.md, REQUIREMENTS.md, ROADMAP.md y STATE.md generados. El cliente tiene capturas de referencia de Money Manager como guía de UX. Se agregaron módulos de Configuración (/configuracion) e Inversiones (/inversiones) que no estaban en la propuesta original pero son necesarios para el MVP funcional.

---

## Contexto técnico para la próxima sesión

**Repo / acceso:** Pendiente crear — nombre sugerido: `finanzas-jy`

**Archivos críticos a leer antes de codear:**
- `CLIENTES/JoseYbarra/PROJECT.md` — stack, paleta de colores, estructura de carpetas
- `CLIENTES/JoseYbarra/REQUIREMENTS.md` — requisitos detallados por módulo
- `CLIENTES/JoseYbarra/ROADMAP.md` — tareas técnicas pendientes de la Fase 1
- `MODULOS/dashboard-shell.md` — cómo montar el layout (reemplazar `gj-` → `jy-`)
- `MODULOS/auth-supabase.md` — middleware + clientes Supabase
- `MODULOS/crud-business-logic.md` — patrón API routes + historial inmutable

**Patrones obligatorios:**

```typescript
// 1. Siempre verificar auth antes de operar en API routes
const authClient = await createServerClient()
const { data: { user } } = await authClient.auth.getUser()
if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

// 2. Usar createServiceRoleClient() para escrituras (bypassa RLS)
const supabase = await createServiceRoleClient()

// 3. Validar con Zod antes de tocar la base de datos
const parsed = createMovimientoSchema.safeParse(body)
if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

// 4. SIEMPRE insertar en historial después de cada mutación
await supabase.from('historial').insert({
  entidad_tipo: 'movimiento',
  entidad_id: data.jy_id,
  tipo_evento: 'NUEVO_MOVIMIENTO',
  descripcion: `Movimiento JY-XXXX creado`,
  usuario_id: user.id,
})

// 5. Soft delete — nunca hard delete
.update({ deleted_at: new Date().toISOString() })
```

**Convenciones del proyecto:**
- Prefijo de IDs: `JY-0001`
- Prefijo de colores Tailwind: `jy-` (NO `gj-`)
- Colores por tipo: verde=ingreso, rojo=egreso/gasto, amber=inversión, morado=préstamo
- El formulario de movimiento es siempre un modal/drawer, nunca una página separada
- El período por defecto es siempre el mes en curso
- Balance = Σ(INGRESO) − Σ(EGRESO + GASTO). Inversiones y préstamos tienen métricas propias.

---

## Historial de cierres

| Fase | Fecha cierre | QA | Notas |
|------|-------------|-----|-------|
| — | — | — | Proyecto recién iniciado |
