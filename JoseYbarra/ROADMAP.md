# ROADMAP.md · JoseYbarra — FinanzasJY
Versión: 1.0
Fecha: 2026-03-26

---

## Estado general

```
Fase 1 ──────── Fase 2 ──────── Fase 3
  🔄 En curso      ⬜ Pendiente    ⬜ Pendiente
```

Leyenda: ✅ Completa · 🔄 En curso · ⬜ Pendiente · ⛔ Bloqueada

---

## Fase 1: MVP — Core del sistema
Estado: 🔄 En curso
Duración estimada: 4-6 semanas
Fecha inicio: 2026-03-26
Fecha cierre: —

### Módulos incluidos
- M1: Auth + Login
- M2: Dashboard principal (métricas + acciones rápidas + gráfico)
- M3: Registro de movimientos (formulario modal)
- M4: Historial con filtros
- M5: Vistas por tipo (/ingresos, /egresos, /inversiones)
- M6: Configuración (categorías + perfil)

### Entregable
Aplicación web desplegada y funcional. Jose puede registrar todos sus movimientos financieros, ver el dashboard con métricas del mes actual, navegar el historial con filtros y gestionar sus categorías desde Configuración.

### Tareas técnicas

#### Setup inicial
- [ ] Crear proyecto Next.js 14 con TypeScript strict
- [ ] Configurar Tailwind con paleta `jy-*`
- [ ] Crear proyecto en Supabase
- [ ] Copiar componentes UI de GoJulito (reemplazar `gj-` → `jy-`)
- [ ] Configurar middleware de auth
- [ ] Deploy inicial en Dokploy (dominio/subdominio)

#### Base de datos
- [ ] Migración 001: profiles + generate_readable_id + historial
- [ ] Migración 002: tabla movimientos + RLS + indexes
- [ ] Migración 003: tabla categorias + seed de 19 categorías predefinidas

#### Auth (M1)
- [ ] Pantalla `/login` con email/password
- [ ] Redirección automática si hay sesión activa
- [ ] Botón "Cerrar sesión" en Sidebar
- [ ] Manejo de error de credenciales

#### Dashboard (M2)
- [ ] Layout protegido `(dashboard)/layout.tsx` con DashboardShell + Sidebar
- [ ] Sidebar con ítems de navegación del dominio financiero
- [ ] Selector de período ← mes →
- [ ] Componente `MetricCard` (4 tarjetas: Balance, Ingresos, Egresos, Inversiones)
- [ ] Componente `AccionesRapidas` (botones: + Ingreso, + Egreso, + Gasto, + Inversión)
- [ ] Lista de últimos 5 movimientos con link al historial
- [ ] Gráfico de barras: ingresos vs egresos últimos 6 meses (Recharts)
- [ ] API: `GET /api/movimientos` con filtro por período

#### Registro de movimientos (M3)
- [ ] Componente `FormularioMovimiento` (modal/drawer)
- [ ] Select de tipo con cambio de color del formulario
- [ ] Select de categoría filtrado por tipo
- [ ] Date picker (default: hoy)
- [ ] Input de monto + descripción opcional
- [ ] `POST /api/movimientos` + validación Zod + insert en historial
- [ ] `PATCH /api/movimientos/[id]` (editar)
- [ ] `DELETE /api/movimientos/[id]` (soft delete con confirmación)

#### Historial (M4)
- [ ] Página `/movimientos` con `TablaMovimientos`
- [ ] Agrupación por fecha (estilo Money Manager)
- [ ] `FilaMovimiento`: ícono categoría, descripción, tipo badge, monto coloreado
- [ ] `FiltrosMovimientos`: período, tipo multi-select, categoría
- [ ] Resumen en tope: total ingresos / total egresos del período filtrado
- [ ] Buscador por descripción

#### Vistas por tipo (M5)
- [ ] `/ingresos` — lista filtrada + total del período
- [ ] `/egresos` — lista filtrada + totales por subtipo (EGRESO vs GASTO) + total combinado
- [ ] `/inversiones` — lista simple + total invertido

#### Configuración (M6)
- [ ] `/configuracion` con sección de Categorías
- [ ] Listado de categorías con estado (ACTIVA/INACTIVA)
- [ ] Crear nueva categoría (nombre + tipo)
- [ ] Editar nombre de categoría
- [ ] Desactivar categoría (no eliminar si tiene movimientos)
- [ ] Sección de perfil (nombre + email — solo lectura en V1)
- [ ] `POST/PATCH/DELETE /api/categorias`

### Definition of Done — Fase 1
- [ ] El usuario puede hacer login y logout
- [ ] El dashboard muestra métricas reales del mes actual
- [ ] Se puede cargar un movimiento de cada tipo en menos de 10 segundos
- [ ] El historial filtra correctamente por período, tipo y categoría
- [ ] Las categorías se pueden crear y desactivar desde Configuración
- [ ] El sistema está desplegado y accesible desde el dominio
- [ ] QA: probar en desktop y mobile (browser)
- [ ] `CERRAR FASE: JoseYbarra / Fase 1` ejecutado
- [ ] STATE.md actualizado
- [ ] Cliente notificado y acceso entregado

---

## Fase 2: Préstamos + refinamiento UI/UX
Estado: ⬜ Pendiente
Duración estimada: 2-3 semanas
Fecha inicio: —
Fecha cierre: —

### Módulos incluidos
- M7: Préstamos + cuotas
- Refinamientos basados en uso real del MVP

### Entregable
Módulo de seguimiento de préstamos activo. Ajustes de UX basados en feedback real de Jose tras usar el MVP durante algunos días.

### Tareas técnicas

#### Base de datos
- [ ] Migración 004: tabla prestamos + cuotas_prestamo

#### Préstamos (M7)
- [ ] `/prestamos` con listado de préstamos activos
- [ ] Formulario: monto, descripción, tipo (otorgado/recibido), fecha inicio, cant. cuotas, monto por cuota
- [ ] Generación automática de cuotas al crear préstamo
- [ ] Marcar cuota como pagada
- [ ] Indicador de próximas cuotas a vencer en el dashboard
- [ ] `POST/PATCH /api/prestamos` + `POST /api/prestamos/[id]/cuotas/[cuotaId]`

#### Refinamiento UI/UX
- [ ] Ajustes de diseño basados en feedback de Jose
- [ ] Mejoras de performance si se detectan lentitudes
- [ ] Corrección de bugs reportados en Fase 1

### Definition of Done — Fase 2
- [ ] El usuario puede registrar préstamos y marcar cuotas como pagadas
- [ ] El dashboard muestra próximas cuotas a vencer
- [ ] QA del módulo de préstamos
- [ ] `CERRAR FASE: JoseYbarra / Fase 2` ejecutado
- [ ] STATE.md actualizado
- [ ] Cliente notificado

---

## Fase 3: Expansión — Gráficos + Exportación
Estado: ⬜ Pendiente
Duración estimada: A definir según prioridades post-Fase 2
Fecha inicio: —
Fecha cierre: —

### Módulos incluidos (a confirmar con Jose)
- Gráfico de dona por categoría de gastos (estilo Money Manager Stats)
- Vista de calendario con movimientos por día
- Presupuesto mensual por categoría (barra % gastado vs asignado)
- Exportación del historial a CSV

### Definition of Done — Fase 3
- [ ] Features acordadas implementadas y testeadas
- [ ] QA aprobado
- [ ] `CERRAR FASE: JoseYbarra / Fase 3` ejecutado
- [ ] STATE.md actualizado

---

## Duración total estimada
- Fase 1: 4-6 semanas
- Fase 2: 2-3 semanas
- **Total Fase 1 + 2: 6-9 semanas**
- Fase 3: a definir

---

## Historial de cambios al roadmap

| Fecha | Cambio | Motivo | Aprobado por |
|-------|--------|--------|--------------|
| 2026-03-26 | Versión inicial | Proyecto iniciado | Edu |
