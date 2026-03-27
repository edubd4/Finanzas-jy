'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { TipoBadge } from '@/components/shared/TipoBadge'
import { MontoColoreado } from '@/components/shared/MontoColoreado'
import { PeriodoSelector } from '@/components/shared/PeriodoSelector'
import { FormularioMovimiento } from '@/components/movimientos/FormularioMovimiento'
import { formatFecha, formatPesos } from '@/lib/utils'
import { TIPO_MOVIMIENTO, TIPO_LABEL } from '@/lib/constants'

interface Movimiento {
  id: string
  jy_id: string
  tipo: string
  monto: number
  fecha: string
  descripcion: string | null
  categoria: { id: string; nombre: string } | null
}

interface MovimientoEditar {
  id: string
  tipo: string
  monto: number
  categoria_id: string
  fecha: string
  descripcion: string | null
}

interface GrupoFecha {
  fecha: string
  movimientos: Movimiento[]
  totalIngresos: number
  totalEgresos: number
}

function agruparPorFecha(movimientos: Movimiento[]): GrupoFecha[] {
  const mapa = new Map<string, Movimiento[]>()
  for (const m of movimientos) {
    const lista = mapa.get(m.fecha) ?? []
    lista.push(m)
    mapa.set(m.fecha, lista)
  }
  return Array.from(mapa.entries()).map(([fecha, items]) => ({
    fecha,
    movimientos: items,
    totalIngresos: items
      .filter((m) => m.tipo === 'INGRESO')
      .reduce((s, m) => s + m.monto, 0),
    totalEgresos: items
      .filter((m) => m.tipo === 'EGRESO' || m.tipo === 'GASTO')
      .reduce((s, m) => s + m.monto, 0),
  }))
}

export default function MovimientosPage() {
  const [periodo, setPeriodo] = useState(new Date())
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [tiposFiltro, setTiposFiltro] = useState<string[]>([])
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [movimientoEditar, setMovimientoEditar] = useState<MovimientoEditar | null>(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState<string | null>(null)

  const cargarMovimientos = useCallback(async () => {
    setCargando(true)
    try {
      const anio = periodo.getFullYear()
      const mes = periodo.getMonth() + 1
      const desde = `${anio}-${String(mes).padStart(2, '0')}-01`
      const hasta = new Date(anio, mes, 0).toISOString().split('T')[0]

      let url = `/api/movimientos?desde=${desde}&hasta=${hasta}`
      if (tiposFiltro.length > 0) url += `&tipo=${tiposFiltro.join(',')}`
      if (busqueda) url += `&q=${encodeURIComponent(busqueda)}`

      const res = await fetch(url)
      const json = await res.json()
      setMovimientos(json.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }, [periodo, tiposFiltro, busqueda])

  useEffect(() => {
    cargarMovimientos()
  }, [cargarMovimientos])

  const toggleTipo = (tipo: string) => {
    setTiposFiltro((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    )
  }

  const eliminarMovimiento = async (id: string) => {
    await fetch(`/api/movimientos/${id}`, { method: 'DELETE' })
    setConfirmarEliminar(null)
    cargarMovimientos()
  }

  const grupos = agruparPorFecha(movimientos)
  const totalIngresos = movimientos.filter(m => m.tipo === 'INGRESO').reduce((s, m) => s + m.monto, 0)
  const totalEgresos = movimientos.filter(m => m.tipo === 'EGRESO' || m.tipo === 'GASTO').reduce((s, m) => s + m.monto, 0)

  return (
    <>
      <FormularioMovimiento
        abierto={formularioAbierto}
        onCerrar={() => { setFormularioAbierto(false); setMovimientoEditar(null) }}
        onGuardado={cargarMovimientos}
        movimientoEditar={movimientoEditar ?? undefined}
      />

      {/* Confirmación de eliminación */}
      {confirmarEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmarEliminar(null)} />
          <div className="relative bg-jy-card border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-jy-text font-semibold mb-2">¿Eliminar movimiento?</h3>
            <p className="text-jy-secondary text-sm mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmarEliminar(null)}
                className="flex-1 py-2 rounded-lg bg-jy-input text-jy-text text-sm font-medium hover:bg-jy-input/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminarMovimiento(confirmarEliminar)}
                className="flex-1 py-2 rounded-lg bg-jy-red text-white text-sm font-medium hover:bg-jy-red/90 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-semibold text-jy-text">Movimientos</h1>
          <button
            onClick={() => setFormularioAbierto(true)}
            className="flex items-center gap-2 px-4 py-2 bg-jy-accent text-white rounded-lg text-sm font-medium hover:bg-jy-accent/90 transition-colors"
          >
            <Plus size={16} />
            Nuevo
          </button>
        </div>

        {/* Selector de período */}
        <PeriodoSelector
          fecha={periodo}
          onAnterior={() => setPeriodo(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))}
          onSiguiente={() => setPeriodo(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))}
        />

        {/* Resumen del período */}
        <div className="flex gap-4 bg-jy-card rounded-xl p-4 border border-white/5">
          <div className="flex-1 text-center">
            <p className="text-jy-secondary text-xs mb-0.5">Ingresos</p>
            <p className="text-jy-green font-semibold">{formatPesos(totalIngresos)}</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex-1 text-center">
            <p className="text-jy-secondary text-xs mb-0.5">Egresos</p>
            <p className="text-jy-red font-semibold">{formatPesos(totalEgresos)}</p>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex-1 text-center">
            <p className="text-jy-secondary text-xs mb-0.5">Balance</p>
            <p className={`font-semibold ${totalIngresos - totalEgresos >= 0 ? 'text-jy-green' : 'text-jy-red'}`}>
              {formatPesos(totalIngresos - totalEgresos)}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-jy-secondary" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por descripción..."
              className="w-full bg-jy-input border border-white/10 rounded-lg pl-9 pr-4 py-2 text-jy-text text-sm placeholder:text-jy-secondary focus:outline-none focus:ring-1 focus:ring-jy-accent"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {Object.values(TIPO_MOVIMIENTO).filter(t => t !== 'PRESTAMO').map((t) => (
              <button
                key={t}
                onClick={() => toggleTipo(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  tiposFiltro.includes(t)
                    ? 'bg-jy-accent text-white border-jy-accent'
                    : 'bg-jy-input text-jy-secondary border-white/10 hover:text-jy-text'
                }`}
              >
                {TIPO_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        {/* Lista agrupada por fecha */}
        {cargando ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-jy-card rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !grupos.length ? (
          <div className="text-center py-12 text-jy-secondary">
            <p className="text-lg mb-1">Sin movimientos</p>
            <p className="text-sm">No hay registros para este período.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {grupos.map((grupo) => (
              <div key={grupo.fecha}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-jy-secondary text-xs font-medium">
                    {formatFecha(grupo.fecha)}
                  </span>
                  <div className="flex gap-3 text-xs">
                    {grupo.totalIngresos > 0 && (
                      <span className="text-jy-green">+{formatPesos(grupo.totalIngresos)}</span>
                    )}
                    {grupo.totalEgresos > 0 && (
                      <span className="text-jy-red">-{formatPesos(grupo.totalEgresos)}</span>
                    )}
                  </div>
                </div>
                <div className="bg-jy-card rounded-xl border border-white/5 divide-y divide-white/5">
                  {grupo.movimientos.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 px-4 py-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-jy-text text-sm truncate">
                          {m.descripcion ?? m.categoria?.nombre ?? '—'}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-jy-secondary text-xs">{m.categoria?.nombre}</span>
                          <TipoBadge tipo={m.tipo} />
                        </div>
                      </div>
                      <MontoColoreado monto={m.monto} tipo={m.tipo} className="text-sm shrink-0" />
                      {/* Acciones (hover) */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setMovimientoEditar({ id: m.id, tipo: m.tipo, monto: m.monto, categoria_id: m.categoria?.id ?? '', fecha: m.fecha, descripcion: m.descripcion }); setFormularioAbierto(true) }}
                          className="p-1.5 rounded hover:bg-white/10 text-jy-secondary hover:text-jy-text text-xs transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setConfirmarEliminar(m.id)}
                          className="p-1.5 rounded hover:bg-jy-red/20 text-jy-secondary hover:text-jy-red text-xs transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
