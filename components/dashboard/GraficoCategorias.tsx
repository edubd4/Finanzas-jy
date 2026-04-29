'use client'

import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { TIPO_LABEL } from '@/lib/constants'
import { useCurrency } from '@/lib/currency'
import { cn } from '@/lib/utils'

interface CategoriaDato {
  nombre: string
  tipo: string
  total: number
}

interface GraficoCategoríasProps {
  categorias: CategoriaDato[]
}

// Paleta de colores para las porciones
const COLORES = [
  '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ef4444',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#14b8a6',
  '#8b5cf6', '#fb923c', '#4ade80', '#60a5fa', '#e879f9',
]

const TIPOS_FILTRO = [
  { valor: 'EGRESO',    label: 'Egresos'   },
  { valor: 'GASTO',     label: 'Gastos'    },
  { valor: 'INGRESO',   label: 'Ingresos'  },
  { valor: 'INVERSION', label: 'Inversiones' },
]

interface TooltipProps {
  active?: boolean
  payload?: { name: string; value: number; payload: { pct: string } }[]
  fmt: (n: number) => string
}

export function GraficoCategorias({ categorias }: GraficoCategoríasProps) {
  const { fmt } = useCurrency()
  const [tipoActivo, setTipoActivo] = useState<string>('EGRESO')

  const CustomTooltip = ({ active, payload }: Omit<TooltipProps, 'fmt'>) => {
    if (!active || !payload?.length) return null
    const d = payload[0]
    return (
      <div className="bg-jy-card border border-white/10 rounded-lg px-3 py-2 text-sm shadow-lg">
        <p className="text-jy-text font-medium">{d.name}</p>
        <p className="text-jy-secondary">{fmt(d.value)} · {d.payload.pct}</p>
      </div>
    )
  }

  const datos = useMemo(() => {
    const filtradas = categorias.filter((c) => c.tipo === tipoActivo)
    const total = filtradas.reduce((s, c) => s + c.total, 0)
    if (total === 0) return []
    return filtradas.map((c) => ({
      name: c.nombre,
      value: c.total,
      pct: `${((c.total / total) * 100).toFixed(1)}%`,
    }))
  }, [categorias, tipoActivo])

  const totalFiltrado = datos.reduce((s, d) => s + d.value, 0)

  // Tipos que tienen datos
  const tiposConDatos = useMemo(
    () => new Set(categorias.map((c) => c.tipo)),
    [categorias]
  )

  return (
    <div className="bg-jy-card rounded-xl p-5 border border-white/5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <h2 className="text-jy-text font-semibold">Distribución por categoría</h2>
        <div className="flex items-center gap-1 bg-jy-input rounded-lg p-0.5">
          {TIPOS_FILTRO.map(({ valor, label }) => (
            <button
              key={valor}
              onClick={() => setTipoActivo(valor)}
              disabled={!tiposConDatos.has(valor)}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium transition-colors',
                tipoActivo === valor
                  ? 'bg-jy-accent text-white'
                  : tiposConDatos.has(valor)
                    ? 'text-jy-secondary hover:text-jy-text'
                    : 'text-jy-secondary/30 cursor-not-allowed'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {datos.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-jy-secondary text-sm">
          Sin datos para {TIPO_LABEL[tipoActivo] ?? tipoActivo} en este período
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Pie chart */}
          <div className="w-full sm:w-48 h-48 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datos}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {datos.map((_, i) => (
                    <Cell key={i} fill={COLORES[i % COLORES.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Leyenda */}
          <div className="flex-1 w-full space-y-1.5 overflow-y-auto max-h-48">
            {datos.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORES[i % COLORES.length] }}
                />
                <span className="text-jy-text text-sm flex-1 truncate">{d.name}</span>
                <span className="text-jy-secondary text-xs tabular-nums">{d.pct}</span>
                <span className="text-jy-text text-xs font-medium tabular-nums min-w-[72px] text-right">
                  {fmt(d.value)}
                </span>
              </div>
            ))}
            {/* Total */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-white/10 mt-2">
              <span className="w-2.5 h-2.5 flex-shrink-0" />
              <span className="text-jy-secondary text-xs flex-1">Total</span>
              <span className="text-jy-secondary text-xs">100%</span>
              <span className="text-jy-text text-xs font-semibold tabular-nums min-w-[72px] text-right">
                {fmt(totalFiltrado)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
