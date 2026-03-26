# REQUIREMENTS.md · JoseYbarra — FinanzasJY
Versión: 1.0
Fecha: 2026-03-26
Fuente: propuesta aprobada + intake + capturas de referencia (Money Manager)

---

## Módulo 1: Auth + Login

**RF-101** — El sistema debe tener una pantalla de login con email y contraseña.
- Prioridad: Alta
- Fase: 1
- Notas: Login vía Supabase Auth. Si el usuario ya tiene sesión activa, redirigir directamente al dashboard.

**RF-102** — El usuario no autenticado debe ser redirigido a `/login` en cualquier ruta protegida.
- Prioridad: Alta
- Fase: 1
- Notas: Implementar vía `middleware.ts`.

**RF-103** — La pantalla de login debe mostrar errores claros si las credenciales son incorrectas.
- Prioridad: Media
- Fase: 1
- Notas: Mensaje: "Credenciales incorrectas. Intentá de nuevo."

**RF-104** — El usuario debe poder cerrar sesión desde el Sidebar (botón "Cerrar sesión" al pie).
- Prioridad: Alta
- Fase: 1
- Notas: Limpiar sesión de Supabase + redirigir a `/login`.

---

## Módulo 2: Dashboard principal

**RF-201** — El dashboard debe mostrar 4 tarjetas de métricas del período activo:
- Balance del período (INGRESO − EGRESO − GASTO)
- Total de ingresos del período
- Total de egresos + gastos del período
- Total de inversiones activas (monto total invertido, no solo del período)
- Prioridad: Alta
- Fase: 1

**RF-202** — El período activo por defecto es el mes en curso. El usuario puede navegar hacia meses anteriores con botones ← →.
- Prioridad: Alta
- Fase: 1
- Notas: Referencia directa al patrón de Money Manager. El selector debe mostrar "Marzo 2026" con flechas de navegación.

**RF-203** — El dashboard debe mostrar los últimos 5 movimientos registrados con acceso rápido al historial completo.
- Prioridad: Alta
- Fase: 1
- Notas: Lista compacta: fecha, categoría con ícono, descripción, monto coloreado. Link "Ver todos".

**RF-204** — El dashboard debe incluir una sección de Acciones Rápidas con botones para:
- `+ Ingreso`
- `+ Egreso`
- `+ Gasto`
- `+ Inversión`
- Prioridad: Alta
- Fase: 1
- Notas: Al hacer clic, abrir el formulario de carga rápida (modal/drawer) con el tipo preseleccionado. Botones visibles en la pantalla principal sin scroll.

**RF-205** — El dashboard debe mostrar un gráfico de barras con ingresos vs egresos de los últimos 6 meses.
- Prioridad: Media
- Fase: 1
- Notas: Usar Recharts. Barras verdes (ingresos) y rojas (egresos). Simple y legible.

---

## Módulo 3: Registro de movimientos

**RF-301** — El formulario de carga de movimientos debe ser un modal o drawer lateral que se abre sin salir del contexto actual.
- Prioridad: Alta
- Fase: 1
- Notas: No debe redirigir a otra página. El usuario registra y vuelve al punto donde estaba.

**RF-302** — El formulario debe tener los siguientes campos comunes a todos los tipos:
- Tipo de movimiento (INGRESO / EGRESO / GASTO / INVERSION) — preseleccionado si se abrió desde Acción Rápida
- Monto (número, obligatorio)
- Categoría (select, obligatorio)
- Fecha (date picker, por defecto hoy)
- Descripción / nota (texto libre, opcional)
- Prioridad: Alta
- Fase: 1

**RF-303** — El tipo de movimiento debe cambiar la paleta de color del formulario:
- INGRESO → verde (`jy-green`)
- EGRESO / GASTO → rojo (`jy-red`)
- INVERSION → amber (`jy-amber`)
- Prioridad: Media
- Fase: 1
- Notas: Mejora de UX — feedback visual inmediato al seleccionar el tipo.

**RF-304** — Las categorías disponibles deben filtrarse según el tipo de movimiento seleccionado.
- Prioridad: Alta
- Fase: 1
- Notas: Ejemplo: "Sueldo" solo aparece en INGRESO. "Alquiler" solo en EGRESO. "Supermercado" en GASTO.

**RF-305** — Al guardar un movimiento, el dashboard debe reflejar el cambio sin recargar la página completa.
- Prioridad: Alta
- Fase: 1
- Notas: Revalidar datos del servidor después del submit.

**RF-306** — El usuario debe poder editar un movimiento existente desde el historial.
- Prioridad: Media
- Fase: 1
- Notas: Abrir el mismo formulario precargado con los datos del movimiento. El historial registra el cambio con INSERT en `historial`.

**RF-307** — El usuario debe poder eliminar un movimiento (soft delete).
- Prioridad: Media
- Fase: 1
- Notas: Confirmación antes de eliminar. No se borra de la base de datos — se marca con `deleted_at`. No aparece más en historial ni métricas.

---

## Módulo 4: Historial de movimientos

**RF-401** — El historial debe mostrar todos los movimientos activos (no eliminados) del usuario ordenados por fecha descendente.
- Prioridad: Alta
- Fase: 1

**RF-402** — Los movimientos deben agruparse por fecha (al estilo Money Manager):
```
▸ Hoy — 26/03/2026
  [movimiento] [movimiento]
▸ Ayer — 25/03/2026
  [movimiento]
```
- Prioridad: Media
- Fase: 1

**RF-403** — Cada fila del historial debe mostrar:
- Ícono o color de la categoría
- Descripción / nota del movimiento
- Categoría (texto)
- Tipo (badge coloreado)
- Fecha
- Monto (coloreado según tipo: verde ingreso, rojo egreso/gasto, amber inversión)
- Prioridad: Alta
- Fase: 1

**RF-404** — El historial debe incluir filtros por:
- Rango de fechas (selector de mes o rango custom)
- Tipo de movimiento (multi-select: INGRESO, EGRESO, GASTO, INVERSION)
- Categoría (select)
- Prioridad: Alta
- Fase: 1

**RF-405** — El historial debe mostrar un resumen en el tope: Total ingresos / Total egresos del período filtrado.
- Prioridad: Media
- Fase: 1
- Notas: Referencia directa a Money Manager (Income / Expenses / Total visible al tope).

**RF-406** — El historial debe incluir buscador por descripción o monto.
- Prioridad: Baja
- Fase: 1

---

## Módulo 5: Vistas por tipo

**RF-501** — `/ingresos` muestra solo movimientos de tipo INGRESO con sus métricas propias (total del período).
- Prioridad: Media
- Fase: 1

**RF-502** — `/egresos` muestra movimientos de tipo EGRESO y GASTO, con totales separados por subtipo y total combinado.
- Prioridad: Media
- Fase: 1

**RF-503** — `/inversiones` muestra movimientos de tipo INVERSION con columnas adaptadas: monto, descripción, fecha, y si aplica: retorno o estado.
- Prioridad: Media
- Fase: 1
- Notas: En V1 es una lista simple. El módulo avanzado de inversiones (con retornos, gráficos de evolución) queda para V3.

---

## Módulo 6: Configuración

**RF-601** — El usuario puede ver y gestionar sus categorías desde `/configuracion`.
- Prioridad: Alta
- Fase: 1
- Notas: Crear, editar nombre, activar/desactivar. No se puede eliminar una categoría que tenga movimientos asociados — solo desactivar.

**RF-602** — Las categorías deben tener: nombre, tipo de movimiento al que aplican (INGRESO / EGRESO / GASTO / INVERSION / TODOS), y estado (ACTIVA / INACTIVA).
- Prioridad: Alta
- Fase: 1

**RF-603** — El sistema debe nacer con categorías predefinidas (seed):

| Categoría | Tipo |
|-----------|------|
| Sueldo / Salario | INGRESO |
| Freelance / Honorarios | INGRESO |
| Alquiler cobrado | INGRESO |
| Otros ingresos | INGRESO |
| Alquiler pagado | EGRESO |
| Servicios (luz, gas, internet) | EGRESO |
| Cuotas / Suscripciones | EGRESO |
| Salud / Obra social | EGRESO |
| Supermercado | GASTO |
| Restaurante / Comida | GASTO |
| Transporte | GASTO |
| Indumentaria | GASTO |
| Entretenimiento | GASTO |
| Farmacia | GASTO |
| Otros gastos | GASTO |
| Plazo fijo | INVERSION |
| Acciones / Cripto | INVERSION |
| Fondo de inversión | INVERSION |
| Otras inversiones | INVERSION |

- Prioridad: Alta
- Fase: 1

**RF-604** — El usuario puede ver su información de perfil (nombre, email) desde Configuración.
- Prioridad: Baja
- Fase: 1
- Notas: Solo lectura en V1. No se puede cambiar email ni contraseña desde la app en V1.

---

## Módulo 7: Préstamos + cuotas (Fase 2)

**RF-701** — El usuario puede registrar un préstamo (otorgado o recibido) con: monto total, descripción, tipo (otorgado / recibido), fecha de inicio, cantidad de cuotas, y monto por cuota.
- Prioridad: Alta
- Fase: 2

**RF-702** — Cada préstamo genera automáticamente sus cuotas con fechas de vencimiento calculadas.
- Prioridad: Alta
- Fase: 2

**RF-703** — El usuario puede marcar cuotas como pagadas.
- Prioridad: Alta
- Fase: 2

**RF-704** — El dashboard debe mostrar en Fase 2: próximas cuotas a vencer (en los próximos 7 días).
- Prioridad: Media
- Fase: 2

**RF-705** — `/prestamos` muestra el listado de préstamos activos con: saldo pendiente, próxima cuota, estado.
- Prioridad: Alta
- Fase: 2

---

## Requisitos no funcionales

**RNF-01 — Rendimiento**
Cargar un movimiento (desde clic en botón hasta que aparece en historial) debe tomar menos de 2 segundos en conexión normal. El dashboard debe renderizarse en menos de 1.5 segundos.

**RNF-02 — Disponibilidad**
Uptime esperado: igual al VPS de Hostinger donde corre GoJulito. Sin ventanas de mantenimiento planificadas en V1.

**RNF-03 — Seguridad**
- Autenticación obligatoria en todas las rutas (middleware)
- `SUPABASE_SERVICE_ROLE_KEY` nunca expuesta en browser
- RLS activado en todas las tablas — el usuario solo accede a sus propios datos
- Sin exposición de stack traces al cliente

**RNF-04 — Usabilidad**
- Responsive: funciona en desktop, tablet y mobile (browser)
- Idioma: español (Argentina) — fechas en DD/MM/YYYY, moneda con separador de miles
- Registro de un movimiento: máximo 3 campos obligatorios + 1 clic para guardar
- Sin curva de aprendizaje: primera sesión sin necesidad de tutorial

---

## Fuera de scope — V1

- App mobile nativa (iOS / Android)
- Integración con bancos, tarjetas o billeteras digitales
- Módulo de inversiones con cotizaciones en tiempo real o conexión a brokers
- Exportación a PDF o Excel
- Multi-usuario o acceso compartido
- Notificaciones push o por email
- Cambio de contraseña desde la app
- Presupuesto mensual por categoría (feature YNAB — queda para V3)

---

## Backlog V3

- Gráfico de dona por categoría de gastos (estilo Money Manager Stats)
- Vista de calendario con movimientos por día
- Presupuesto mensual por categoría con indicador de avance (barra %)
- Exportación del historial a CSV
- Resumen mensual automático (cuánto gasté vs mes anterior)
- Notas o etiquetas personalizadas en movimientos
- Modo claro (light theme)

---

## Historial de cambios

| Versión | Fecha | Cambio | Aprobado por |
|---------|-------|--------|--------------|
| 1.0 | 2026-03-26 | Versión inicial — basada en propuesta aprobada + capturas Money Manager | Edu |
