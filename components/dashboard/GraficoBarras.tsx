'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { useCurrency } from '@/lib/currency'

interface DatoMes {
  mes: string
  ingresos: number
  egresos: number
}

interface GraficoBarrasProps {
  datos: DatoMes[]
  titulo?: string
}

interface TooltipEntry {
  name: string
  color: string
  value: number
}

interface TooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
  fmt: (n: number) => string
}

export function GraficoBarras({ datos, titulo = 'Ingresos vs Egresos — últimos 6 meses' }: GraficoBarrasProps) {
  const { fmt } = useCurrency()

  const CustomTooltip = ({ active, payload, label }: Omit<TooltipProps, 'fmt'>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-jy-card border border-white/10 rounded-lg p-3 text-sm">
          <p className="text-jy-text font-medium mb-1">{label}</p>
          {payload.map((entry: TooltipEntry) => (
            <p key={entry.name} style={{ color: entry.color }}>
              {entry.name === 'ingresos' ? 'Ingresos' : 'Egresos'}:{' '}
              {fmt(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-jy-card rounded-xl p-5 border border-white/5">
      <h2 className="text-jy-text font-semibold mb-4">{titulo}</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datos} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0f" />
          <XAxis
            dataKey="mes"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
            }
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff08' }} />
          <Legend
            formatter={(value) =>
              value === 'ingresos' ? 'Ingresos' : 'Egresos'
            }
            wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
          />
          <Bar dataKey="ingresos" fill="#0ecb81" radius={[4, 4, 0, 0]} />
          <Bar dataKey="egresos" fill="#f6465d" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
