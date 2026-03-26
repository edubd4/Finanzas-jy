'use client'

import { useState, useEffect, useCallback } from 'react'
import { TrendingDown } from 'lucide-react'
import { TipoBadge } from '@/components/shared/TipoBadge'
import { MontoColoreado } from '@/components/shared/MontoColoreado'
import { PeriodoSelector } from '@/components/shared/PeriodoSelector'
import { formatFecha, formatPesos } from '@/lib/utils'

interface Movimiento {
  id: string
  jy_id: string
  tipo: string
  monto: number
  fecha: string
  descripcion: string | null
  categoria: { id: string; nombre: string } | null
}

export default function EgresosPage() {
  const [periodo, setPeriodo] = useState(new Date())
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const anio = periodo.getFullYear()
      const mes = periodo.getMonth() + 1
      const desde = `${anio}-${String(mes).padStart(2, '0')}-01`
      const hasta = new Date(anio, mes, 0).toISOString().split('T')[0]
      const res = await fetch(`/api/movimientos?desde=${desde}&hasta=${hasta}&tipo=EGRESO,GASTO`)
      const json = await res.json()
      setMovimientos(json.data ?? [])
    } finally {
      setCargando(false)
    }
  }, [periodo])

  useEffect(() => { cargar() }, [cargar])

  const totalEgreso = movimientos.filter(m => m.tipo === 'EGRESO').reduce((s, m) => s + m.monto, 0)
  const totalGasto = movimientos.filter(m => m.tipo === 'GASTO').reduce((s, m) => s + m.monto, 0)
  const totalCombinado = totalEgreso + totalGasto

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-jy-red/10">
          <TrendingDown size={20} className="text-jy-red" />
        </div>
        <h1 className="text-2xl font-display font-semibold text-jy-text">Egresos</h1>
      </div>

      <PeriodoSelector
        fecha={periodo}
        onAnterior={() => setPeriodo(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))}
        onSiguiente={() => setPeriodo(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))}
      />

      {/* Totales por subtipo */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-jy-card rounded-xl p-3 border border-white/5 text-center">
          <p className="text-jy-secondary text-xs mb-1">Egresos fijos</p>
          <p className="text-jy-red font-semibold text-sm">{formatPesos(totalEgreso)}</p>
        </div>
        <div className="bg-jy-card rounded-xl p-3 border border-white/5 text-center">
          <p className="text-jy-secondary text-xs mb-1">Gastos variables</p>
          <p className="text-jy-red font-semibold text-sm">{formatPesos(totalGasto)}</p>
        </div>
        <div className="bg-jy-card rounded-xl p-3 border border-jy-red/20 text-center">
          <p className="text-jy-secondary text-xs mb-1">Total combinado</p>
          <p className="text-jy-red font-display font-semibold">{formatPesos(totalCombinado)}</p>
        </div>
      </div>

      {cargando ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-jy-card rounded-xl animate-pulse" />)}</div>
      ) : !movimientos.length ? (
        <div className="text-center py-12 text-jy-secondary">
          <p>No hay egresos registrados en este período.</p>
        </div>
      ) : (
        <div className="bg-jy-card rounded-xl border border-white/5 divide-y divide-white/5">
          {movimientos.map((m) => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-jy-text text-sm truncate">{m.descripcion ?? m.categoria?.nombre ?? '—'}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-jy-secondary text-xs">{formatFecha(m.fecha)}</span>
                  <span className="text-jy-secondary text-xs">{m.categoria?.nombre}</span>
                  <TipoBadge tipo={m.tipo} />
                </div>
              </div>
              <MontoColoreado monto={m.monto} tipo={m.tipo} className="text-sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
