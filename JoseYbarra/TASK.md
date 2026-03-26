# TASK.md · {NOMBRE_CLIENTE} / {NOMBRE_FEATURE}
Agente: {Frontend / Backend / Integrador / Arquitecto}
Fecha: {FECHA}
Fase: {fase del roadmap}
Sesión: única — no continuar en otra sesión sin crear un nuevo TASK.md

---

## Contexto

{2-3 oraciones que describen el estado actual del proyecto relevante para esta tarea.
Qué ya existe, con qué se conecta esta feature, qué decisiones del Arquitecto aplican.}

Stack activo: {Next.js 14 + Supabase + shadcn/ui / Google Sheets + n8n + Telegram}

Archivos relevantes:
- {ruta}: {por qué es relevante}
- {ruta}: {por qué es relevante}

---

## Objetivo

{Una oración que describe exactamente qué debe existir al final de esta sesión
que no existe ahora. Concreto y verificable.}

---

## Pasos

1. {paso concreto}
2. {paso concreto}
3. {paso concreto}
{...}

---

## Reglas técnicas

{Reglas específicas de esta tarea además de las de METODOLOGIA.md}

- {regla}
- {regla}

Reglas base siempre activas:
- TypeScript strict, sin `any`
- historial: insert-only, nunca update ni delete
- SERVICE_ROLE_KEY solo en servidor
- Soft deletes con deleted_at
- Validación Zod antes de operaciones de DB
- Server Components por defecto en UI

---

## Definition of Done

{Lista verificable. El QA valida cada ítem exactamente como está escrito acá.}

- [ ] {ítem concreto y verificable}
- [ ] {ítem concreto y verificable}
- [ ] Sin errores de TypeScript
- [ ] Sin `any` en código nuevo
- [ ] {ítem específico de la feature}

---

## Qué NO hacer

{Límites explícitos para esta sesión. Evita scope creep y errores comunes.}

- No {acción prohibida}
- No modificar {archivo o componente fuera de scope}
- No avanzar a {tarea siguiente} en esta sesión

---

## Notas adicionales

{Información extra que el agente necesita: ejemplos de uso, links a docs,
contexto de decisiones previas, advertencias específicas}
