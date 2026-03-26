'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatMes } from '@/lib/utils'

interface PeriodoSelectorProps {
  fecha: Date
  onAnterior: () => void
  onSiguiente: () => void
}

export function PeriodoSelector({ fecha, onAnterior, onSiguiente }: PeriodoSelectorProps) {
  const esHoy =
    fecha.getMonth() === new Date().getMonth() &&
    fecha.getFullYear() === new Date().getFullYear()

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onAnterior}
        className="p-1.5 rounded-lg hover:bg-white/10 text-jy-secondary hover:text-jy-text transition-colors"
        aria-label="Mes anterior"
      >
        <ChevronLeft size={18} />
      </button>

      <span className="text-jy-text font-semibold min-w-[140px] text-center capitalize">
        {formatMes(fecha)}
      </span>

      <button
        onClick={onSiguiente}
        disabled={esHoy}
        className="p-1.5 rounded-lg hover:bg-white/10 text-jy-secondary hover:text-jy-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Mes siguiente"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
