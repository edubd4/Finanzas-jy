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

interface DatoMes {
  mes: string
  ingresos: number
  egresos: number
}

interface GraficoBarrasProps {
  datos: DatoMes[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-jy-card border border-white/10 rounded-lg p-3 text-sm">
        <p className="text-jy-text font-medium mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }}>
            {entry.name === 'ingresos' ? 'Ingresos' : 'Egresos'}:{' '}
            {new Intl.NumberFormat('es-AR', {
              style: 'currency',
              currency: 'ARS',
              maximumFractionDigits: 0,
            }).format(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function GraficoBarras({ datos }: GraficoBarrasProps) {
  return (
    <div className="bg-jy-card rounded-xl p-5 border border-white/5">
      <h2 className="text-jy-text font-semibold mb-4">
        Ingresos vs Egresos — últimos 6 meses
      </h2>
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
          <Bar dataKey="ingresos" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="egresos" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
