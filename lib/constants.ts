// ── Tipos de movimiento ──────────────────────────────────────────────────────
export const TIPO_MOVIMIENTO = {
  INGRESO:   'INGRESO',
  EGRESO:    'EGRESO',
  GASTO:     'GASTO',
  INVERSION: 'INVERSION',
  PRESTAMO:  'PRESTAMO',
} as const

export type TipoMovimiento = typeof TIPO_MOVIMIENTO[keyof typeof TIPO_MOVIMIENTO]

// ── Estados de movimiento ────────────────────────────────────────────────────
export const ESTADO_MOVIMIENTO = {
  ACTIVO:    'ACTIVO',
  ELIMINADO: 'ELIMINADO',
} as const

// ── Estados de préstamo ──────────────────────────────────────────────────────
export const ESTADO_PRESTAMO = {
  ACTIVO:  'ACTIVO',
  SALDADO: 'SALDADO',
  VENCIDO: 'VENCIDO',
} as const

// ── Estados de cuota ─────────────────────────────────────────────────────────
export const ESTADO_CUOTA = {
  PENDIENTE: 'PENDIENTE',
  PAGADA:    'PAGADA',
  VENCIDA:   'VENCIDA',
} as const

// ── Colores por tipo de movimiento (Tailwind classes) ────────────────────────
export const TIPO_COLOR: Record<string, string> = {
  INGRESO:   'text-jy-green',
  EGRESO:    'text-jy-red',
  GASTO:     'text-jy-red',
  INVERSION: 'text-jy-amber',
  PRESTAMO:  'text-jy-purple',
}

export const TIPO_BG: Record<string, string> = {
  INGRESO:   'bg-jy-green/20 text-jy-green',
  EGRESO:    'bg-jy-red/20 text-jy-red',
  GASTO:     'bg-jy-red/20 text-jy-red',
  INVERSION: 'bg-jy-amber/20 text-jy-amber',
  PRESTAMO:  'bg-jy-purple/20 text-jy-purple',
}

export const TIPO_FORM_ACCENT: Record<string, string> = {
  INGRESO:   'border-jy-green focus:ring-jy-green',
  EGRESO:    'border-jy-red focus:ring-jy-red',
  GASTO:     'border-jy-red focus:ring-jy-red',
  INVERSION: 'border-jy-amber focus:ring-jy-amber',
  PRESTAMO:  'border-jy-purple focus:ring-jy-purple',
}

// ── Labels de tipo ────────────────────────────────────────────────────────────
export const TIPO_LABEL: Record<string, string> = {
  INGRESO:   'Ingreso',
  EGRESO:    'Egreso',
  GASTO:     'Gasto',
  INVERSION: 'Inversión',
  PRESTAMO:  'Préstamo',
}

// ── Signo del monto por tipo (+/-) ───────────────────────────────────────────
export const TIPO_SIGNO: Record<string, string> = {
  INGRESO:   '+',
  EGRESO:    '-',
  GASTO:     '-',
  INVERSION: '',
  PRESTAMO:  '',
}
