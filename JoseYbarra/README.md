# _TEMPLATE · Instrucciones de uso

Esta carpeta contiene los archivos base para cada nuevo cliente o proyecto.
**Nunca modificar estos archivos directamente** — siempre copiar primero.

---

## Cómo usar este template

### Para un nuevo cliente (fases 1-3)

El agente Intake crea automáticamente la carpeta del cliente al recibir `NUEVO CLIENTE: {nombre}`.
Si necesitás hacerlo manualmente:

```bash
cp -r CLIENTES/_TEMPLATE/ CLIENTES/{nombre}/
```

Archivos relevantes para fases 1-3:
- `intake.md` — el agente Intake lo puebla durante la entrevista
- `PROJECT.md` — el agente Propuestador lo genera al cerrar la propuesta (si aplica)

### Para iniciar implementación (fase 4)

Al ejecutar `INICIAR PROYECTO: {nombre}`, el Arquitecto crea:
- `PROJECT.md` — visión, stack, decisiones clave
- `REQUIREMENTS.md` — requisitos versionados desde la propuesta
- `ROADMAP.md` — fases con estado
- `STATE.md` — posición actual del proyecto

Para cada feature en implementación, el agente correspondiente crea un `TASK.md`:

```bash
cp CLIENTES/_TEMPLATE/TASK.md CLIENTES/{nombre}/fases/{fase}-{feature}.TASK.md
```

---

## Archivos del template

| Archivo | Quién lo usa | Cuándo |
|---------|-------------|--------|
| `intake.md` | Agente Intake | Al iniciar fase 1 |
| `PROJECT.md` | Arquitecto | Al iniciar fase 4 |
| `REQUIREMENTS.md` | Arquitecto | Al iniciar fase 4 |
| `ROADMAP.md` | Arquitecto + PM | Al iniciar fase 4 |
| `STATE.md` | PM | Durante toda la fase 4 |
| `TASK.md` | Todos los agentes técnicos | Una por feature |

---

## Estructura de carpeta de cliente completa

```
CLIENTES/{nombre}/
│
├── intake.md               ← fase 1 · agente Intake
├── diagnostico.docx        ← fase 2 · agente Diagnosticador
├── propuesta.docx          ← fase 3 · agente Propuestador
│
├── PROJECT.md              ← fase 4 · Arquitecto
├── REQUIREMENTS.md         ← fase 4 · Arquitecto
├── ROADMAP.md              ← fase 4 · Arquitecto + PM
├── STATE.md                ← fase 4 · PM (actualización continua)
│
├── fases/
│   ├── 01-{feature}.TASK.md
│   ├── 02-{feature}.TASK.md
│   └── ...
│
└── qa/
    ├── fase1-validacion.md
    ├── fase2-validacion.md
    └── ...
```

---

## Convenciones de nombrado

- Carpetas de clientes: PascalCase sin espacios → `GoJulito`, `AsociacionCivil`, `PanaderiaLopez`
- Archivos TASK: `{nro-orden}-{nombre-feature-kebab}.TASK.md` → `01-auth-login.TASK.md`
- Reportes QA: `fase{N}-validacion.md` → `fase1-validacion.md`
- Sin espacios en nombres de archivo en ningún caso

---

## Placeholders a reemplazar

Todos los templates usan `{MAYÚSCULAS}` para campos que deben completarse:

| Placeholder | Reemplazar con |
|-------------|----------------|
| `{NOMBRE_CLIENTE}` | Nombre exacto de la carpeta del cliente |
| `{NOMBRE_FEATURE}` | Nombre descriptivo de la feature (kebab-case) |
| `{FECHA}` | Fecha en formato YYYY-MM-DD |
| `{N}`, `{M}` | Números según el contexto |

---

*Mantener este README actualizado cuando se agreguen o modifiquen archivos del template.*
