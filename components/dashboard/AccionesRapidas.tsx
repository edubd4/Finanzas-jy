'use client'

import { TrendingUp, TrendingDown, ShoppingCart, LineChart } from 'lucide-react'
import { TIPO_MOVIMIENTO } from '@/lib/constants'

interface AccionesRapidasProps {
  onAccion: (tipo: string) => void
}

const ACCIONES = [
  {
    tipo: TIPO_MOVIMIENTO.INGRESO,
    label: '+ Ingreso',
    icon: TrendingUp,
    clase: 'bg-jy-green/10 text-jy-green border-jy-green/20 hover:bg-jy-green/20',
  },
  {
    tipo: TIPO_MOVIMIENTO.EGRESO,
    label: '+ Egreso',
    icon: TrendingDown,
    clase: 'bg-jy-red/10 text-jy-red border-jy-red/20 hover:bg-jy-red/20',
  },
  {
    tipo: TIPO_MOVIMIENTO.GASTO,
    label: '+ Gasto',
    icon: ShoppingCart,
    clase: 'bg-jy-red/10 text-jy-red border-jy-red/20 hover:bg-jy-red/20',
  },
  {
    tipo: TIPO_MOVIMIENTO.INVERSION,
    label: '+ Inversión',
    icon: LineChart,
    clase: 'bg-jy-amber/10 text-jy-amber border-jy-amber/20 hover:bg-jy-amber/20',
  },
]

export function AccionesRapidas({ onAccion }: AccionesRapidasProps) {
  return (
    <div className="bg-jy-card rounded-xl p-5 border border-white/5">
      <h2 className="text-jy-text font-semibold mb-4">Acciones rápidas</h2>
      <div className="grid grid-cols-2 gap-3">
        {ACCIONES.map(({ tipo, label, icon: Icon, clase }) => (
          <button
            key={tipo}
            onClick={() => onAccion(tipo)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border font-medium text-sm transition-colors ${clase}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
