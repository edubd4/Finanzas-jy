# PROJECT.md · JoseYbarra — FinanzasJY
Creado: 2026-03-26
Propuesta aprobada: 2026-03-26

---

## Visión del proyecto

**FinanzasJY** es un sistema web de gestión financiera personal para Jose Ybarra. Permite registrar, consultar y analizar todos los movimientos financieros: ingresos, egresos, gastos, inversiones y préstamos. Cuenta con un dashboard principal con métricas en tiempo real, accesos rápidos a las acciones más frecuentes, e historial completo con filtros por período y categoría.

El diseño está inspirado en Money Manager y YNAB: claridad visual, categorización ágil, y flujo de caja siempre visible. Registrar un movimiento debe tomar menos de 10 segundos.

---

## Stack tecnológico

**Perfil B — Stack web**

| Capa | Tecnología | Versión | Notas |
|------|-----------|---------|-------|
| Framework | Next.js | 14.x | App Router. Sin Pages Router. |
| Lenguaje | TypeScript | 5.x | Strict mode. Sin `any`. |
| Base de datos | Supabase (PostgreSQL) | latest | Auth + DB + RLS |
| Auth | Supabase Auth | latest | JWT. Usuario único (Jose). |
| Estilos | Tailwind CSS | 3.4.x | Prefijo `jy-` para colores custom |
| Componentes UI | Radix UI (manual) | latest | Sin shadcn CLI — copiar de GoJulito y reemplazar `gj-` → `jy-` |
| Iconos | Lucide React | latest | |
| Validación | Zod | latest | Schemas en `lib/schemas/` |
| Utilidades | clsx + tailwind-merge + CVA | latest | |
| Fuentes | Fraunces (display) + DM Sans (cuerpo) | — | Via next/font/google |
| Hosting | Dokploy / VPS Hostinger | — | Node 18.18.1 |

---

## Paleta de colores (prefijo `jy-`)

```
jy-bg:        #0d1b2a   ← Fondo principal (azul marino oscuro)
jy-card:      #112240   ← Cards y paneles
jy-input:     #1a3358   ← Inputs y áreas interactivas
jy-accent:    #3b82f6   ← Azul principal (CTAs, acciones)
jy-green:     #22c55e   ← Ingresos, estados positivos
jy-red:       #ef4444   ← Egresos/gastos, estados negativos
jy-amber:     #f59e0b   ← Inversiones, alertas
jy-purple:    #a855f7   ← Préstamos
jy-text:      #e2e8f0   ← Texto principal
jy-secondary: #94a3b8   ← Texto secundario, placeholders
```

Lógica de color por tipo de movimiento:
- **Verde** → INGRESO (dinero que entra)
- **Rojo** → EGRESO / GASTO (dinero que sale)
- **Amber** → INVERSION (dinero comprometido/invertido)
- **Morado** → PRESTAMO (deuda activa)

---

## Módulos del proyecto

| # | Módulo | Descripción | Fase |
|---|--------|-------------|------|
| 1 | Auth + Login | Pantalla de login con email/password vía Supabase Auth | 1 |
| 2 | Dashboard principal | Métricas en tiempo real (balance, ingresos, egresos, resumen) + acciones rápidas | 1 |
| 3 | Registro de movimientos | Formulario modal de carga rápida para los 5 tipos de movimiento | 1 |
| 4 | Historial con filtros | Listado paginado con filtros por período, tipo y categoría | 1 |
| 5 | Vistas por tipo | Páginas filtradas: /ingresos, /egresos, /inversiones | 1 |
| 6 | Configuración | Gestión de categorías (CRUD), perfil del usuario, preferencias | 1 |
| 7 | Préstamos + cuotas | Módulo de seguimiento de préstamos activos con alertas de vencimiento | 2 |
| 8 | Gráficos avanzados | Gráfico de dona por categoría, gráfico de tendencia mensual | 3 |
| 9 | Exportación | Exportar historial a CSV o PDF | 3 |

---

## Módulos reutilizables utilizados

| Módulo | Archivo | Estado | Adaptaciones |
|--------|---------|--------|--------------|
| Auth & Roles | `auth-supabase.md` | ✅ Adaptado | Sin roles múltiples — usuario único. Tabla `profiles` simplificada. |
| CRUD + Historial | `crud-business-logic.md` | ✅ Adaptado | ENUMs: TIPO_MOVIMIENTO en lugar de estados de trámite. Prefijo ID: `JY-`. |
| Dashboard Shell | `dashboard-shell.md` | ✅ Adaptado | Prefijo `jy-`, paleta azul marino. Nav items del dominio financiero. |
| Bot Telegram/n8n | `bot-telegram-n8n.md` | ⛔ No aplica | No hay bot en V1. |

---

## Entidades del dominio

| Entidad | Tabla | Prefijo ID | Estados posibles |
|---------|-------|-----------|-----------------|
| Movimiento | `movimientos` | `JY-` | `ACTIVO` / `ELIMINADO` |
| Categoría | `categorias` | — | `ACTIVA` / `INACTIVA` |
| Préstamo | `prestamos` | `PREST-` | `ACTIVO` / `SALDADO` / `VENCIDO` |
| Cuota | `cuotas_prestamo` | — | `PENDIENTE` / `PAGADA` / `VENCIDA` |

**Tipos de movimiento (ENUM):**
```typescript
INGRESO | EGRESO | GASTO | INVERSION | PRESTAMO
```
> EGRESO = pago fijo/comprometido (alquiler, servicio). GASTO = consumo variable (super, restaurante).
> Ambos restan del balance pero permiten análisis separado por categoría.

---

## Reglas de negocio críticas

1. **Balance = Σ(INGRESO) − Σ(EGRESO + GASTO)** en el período seleccionado. Inversiones y préstamos tienen secciones propias y NO se computan en el balance principal.
2. **Soft delete obligatorio** — los movimientos nunca se eliminan. Se usa `deleted_at TIMESTAMPTZ`.
3. **Historial inmutable** — cada creación/edición/eliminación genera un INSERT en `historial`. Sin UPDATE ni DELETE en esa tabla.
4. **Categorías con seed** — el sistema nace con categorías predefinidas (Alimentación, Transporte, Salud, etc.). El usuario puede agregar las suyas desde Configuración.
5. **Período activo** — el dashboard muestra el mes actual por defecto. Navegación ← mes → como en Money Manager.
6. **Usuario único** — no hay multi-usuario en V1. Toda la RLS se basa en `auth.uid()`.

---

## Estructura de carpetas

```
finanzas-jy/
├── app/
│   ├── (auth)/login/page.tsx             ← Login con email/password
│   ├── (dashboard)/
│   │   ├── layout.tsx                    ← Layout protegido + sidebar
│   │   ├── page.tsx                      ← Dashboard principal
│   │   ├── movimientos/page.tsx          ← Historial completo con filtros
│   │   ├── ingresos/page.tsx             ← Vista: solo ingresos
│   │   ├── egresos/page.tsx              ← Vista: solo egresos + gastos
│   │   ├── inversiones/page.tsx          ← Vista: inversiones activas
│   │   ├── prestamos/page.tsx            ← Módulo préstamos (Fase 2)
│   │   └── configuracion/page.tsx        ← Categorías, perfil, preferencias
│   └── api/
│       ├── movimientos/route.ts + [id]/route.ts
│       ├── categorias/route.ts + [id]/route.ts
│       └── prestamos/route.ts + [id]/route.ts
├── components/
│   ├── ui/                               ← Radix base (copiados de GoJulito, prefijo jy-)
│   ├── dashboard/
│   │   ├── DashboardShell.tsx
│   │   ├── Sidebar.tsx                   ← Nav: Dashboard, Movimientos, Ingresos, Egresos, Inversiones, Préstamos, Config
│   │   ├── MetricCard.tsx                ← Tarjeta: Balance / Ingresos / Egresos / Inversiones
│   │   ├── AccionesRapidas.tsx           ← Botones: + Ingreso, + Egreso, + Gasto, + Inversión
│   │   ├── ResumenPeriodo.tsx            ← Selector de mes + totales del período
│   │   └── GraficoBarras.tsx             ← Ingresos vs Egresos por mes (recharts)
│   ├── movimientos/
│   │   ├── TablaMovimientos.tsx          ← Listado con agrupación por fecha (estilo Money Manager)
│   │   ├── FilaMovimiento.tsx            ← Fila: ícono categoría, descripción, monto coloreado
│   │   ├── FormularioMovimiento.tsx      ← Modal/drawer de carga rápida
│   │   └── FiltrosMovimientos.tsx        ← Período, tipo, categoría, búsqueda
│   ├── inversiones/TablaInversiones.tsx
│   ├── prestamos/TablaPrestamos.tsx
│   └── shared/
│       ├── MontoColoreado.tsx            ← Formatea monto con color por tipo
│       ├── TipoBadge.tsx                 ← Badge: INGRESO/EGRESO/etc con color
│       └── PeriodoSelector.tsx           ← Navegación ← mes actual →
├── lib/
│   ├── constants.ts                      ← TIPO_MOVIMIENTO, CATEGORIAS_DEFAULT, BADGE_COLOR
│   ├── utils.ts                          ← cn(), formatPesos(), formatFecha()
│   └── schemas/
│       ├── movimientos.ts
│       ├── categorias.ts
│       └── prestamos.ts
├── database/migrations/
│   ├── 001_initial.sql                   ← profiles, generate_readable_id, historial
│   ├── 002_movimientos.sql               ← movimientos + RLS + indexes
│   ├── 003_categorias.sql                ← categorias + seed inicial
│   └── 004_prestamos.sql                 ← prestamos + cuotas_prestamo (Fase 2)
├── middleware.ts
├── tailwind.config.ts                    ← Paleta jy-*
└── .env.local
```

---

## Navegación (Sidebar)

```
📊  Dashboard          /
📋  Movimientos        /movimientos
💰  Ingresos           /ingresos
💸  Egresos            /egresos
📈  Inversiones        /inversiones
🤝  Préstamos          /prestamos       ← Fase 2
⚙️   Configuración     /configuracion
```

---

## Decisiones técnicas clave

| Fecha | Decisión | Justificación |
|-------|----------|---------------|
| 2026-03-26 | Prefijo de colores `jy-` (no `gj-`) | Evitar colisión con GoJulito al copiar componentes |
| 2026-03-26 | EGRESO y GASTO como tipos separados | Permite análisis diferenciado: gastos variables vs compromisos fijos |
| 2026-03-26 | Inversiones NO restan del balance principal | Son activos, no salidas. Tienen su propia métrica en el dashboard |
| 2026-03-26 | Préstamos en Fase 2 | Lógica de cuotas requiere más modelado — prioridad el core de registro primero |
| 2026-03-26 | Sin n8n ni Telegram en V1 | Sistema de uso personal, sin necesidad de notificaciones externas |
| 2026-03-26 | Recharts para gráficos | Librería React nativa, sin dependencias externas complejas |

---

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # solo server-side, nunca browser
```

---

## Referencias de diseño

- **Money Manager (realbyteapps.com):** lista de transacciones agrupada por fecha, gráfico de dona por categoría, navegación por mes, botón `+` flotante para carga rápida, vista Daily/Calendar/Weekly/Monthly/Summary.
- **YNAB:** énfasis en "cuánto me queda este mes", categorías con presupuesto asignado, claridad en el flujo de caja.

**Principio de diseño:** registrar un movimiento ≤ 10 segundos. El estado financiero visible sin buscar.

---

## Contacto del cliente

Nombre: Jose Ybarra
Canal preferido: WhatsApp / Telegram
Disponibilidad: A confirmar
