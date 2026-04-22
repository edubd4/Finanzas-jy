'use client'

import { useState, useEffect, useCallback } from 'react'
import { LineChart, ChevronDown, ChevronUp, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { formatFecha, formatPesos, cn } from '@/lib/utils'

interface Inversion {
  id: string
  jy_id: string
  tipo: string
  monto: number
  fecha: string
  descripcion: string | null
  categoria: { id: string; nombre: string } | null
  fecha_entrada: string | null
  fecha_alerta_salida: string | null
  monto_esperado: number | null
  monto_final: number | null
  fecha_cierre: string | null
  estado_inversion: 'ABIERTA' | 'CERRADA' | null
}

export default function InversionesPage() {
  const [inversiones, setInversiones] = useState<Inversion[]>([])
  const [cargando, setCargando] = useState(true)
  const [expandido, setExpandido] = useState<string | null>(null)
  const [cerrando, setCerrando] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const res = await fetch('/api/movimientos?tipo=INVERSION&limit=500')
      const json = await res.json()
      setInversiones(json.data ?? [])
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  const abiertas = inversiones.filter(i => i.estado_inversion !== 'CERRADA')
  const cerradas = inversiones.filter(i => i.estado_inversion === 'CERRADA')

  const totalAbierto = abiertas.reduce((s, i) => s + i.monto, 0)
  const totalCerradoFinal = cerradas.reduce((s, i) => s + (i.monto_final ?? 0), 0)
  const totalCerradoInicial = cerradas.reduce((s, i) => s + i.monto, 0)
  const retornoGlobal = totalCerradoInicial
    ? ((totalCerradoFinal - totalCerradoInicial) / totalCerradoInicial) * 100
    : 0

  const hoy = new Date().toISOString().slice(0, 10)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-jy-amber/10">
          <LineChart size={20} className="text-jy-amber" />
        </div>
        <h1 className="text-2xl font-display font-semibold text-jy-text">Inversiones</h1>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-jy-card rounded-xl p-4 border border-jy-amber/20">
          <p className="text-jy-secondary text-xs">Abiertas</p>
          <p className="text-jy-amber font-display font-semibold text-lg mt-1">{formatPesos(totalAbierto)}</p>
          <p className="text-jy-secondary text-[11px] mt-0.5">{abiertas.length} {abiertas.length === 1 ? 'inversión' : 'inversiones'}</p>
        </div>
        <div className="bg-jy-card rounded-xl p-4 border border-white/5">
          <p className="text-jy-secondary text-xs">Retorno realizado</p>
          <p className={cn('font-display font-semibold text-lg mt-1', retornoGlobal >= 0 ? 'text-jy-green' : 'text-jy-red')}>
            {retornoGlobal >= 0 ? '+' : ''}{retornoGlobal.toFixed(2)}%
          </p>
          <p className="text-jy-secondary text-[11px] mt-0.5">{cerradas.length} cerradas</p>
        </div>
      </div>

      {cargando ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-jy-card rounded-xl animate-pulse" />)}</div>
      ) : (
        <>
          <Seccion titulo={`Abiertas (${abiertas.length})`} vacio="No hay inversiones abiertas.">
            {abiertas.map(inv => (
              <FilaInversion
                key={inv.id}
                inv={inv}
                expandido={expandido === inv.id}
                onToggle={() => setExpandido(expandido === inv.id ? null : inv.id)}
                onCerrar={() => setCerrando(inv.id)}
                hoy={hoy}
              />
            ))}
          </Seccion>

          <Seccion titulo={`Cerradas (${cerradas.length})`} vacio="Todavía no cerraste ninguna inversión.">
            {cerradas.map(inv => (
              <FilaInversion
                key={inv.id}
                inv={inv}
                expandido={expandido === inv.id}
                onToggle={() => setExpandido(expandido === inv.id ? null : inv.id)}
                hoy={hoy}
              />
            ))}
          </Seccion>
        </>
      )}

      {cerrando && (
        <ModalCerrar
          inversion={inversiones.find(i => i.id === cerrando)!}
          onClose={() => setCerrando(null)}
          onSaved={async () => { setCerrando(null); await cargar() }}
        />
      )}
    </div>
  )
}

function Seccion({ titulo, vacio, children }: { titulo: string; vacio: string; children: React.ReactNode }) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children
  return (
    <div>
      <h2 className="text-jy-secondary text-xs uppercase tracking-wide font-medium mb-2">{titulo}</h2>
      {!hasChildren ? (
        <div className="bg-jy-card rounded-xl p-4 border border-white/5 text-center text-jy-secondary text-sm">{vacio}</div>
      ) : (
        <div className="bg-jy-card rounded-xl border border-white/5 divide-y divide-white/5 overflow-hidden">{children}</div>
      )}
    </div>
  )
}

function FilaInversion({ inv, expandido, onToggle, onCerrar, hoy }: {
  inv: Inversion; expandido: boolean; onToggle: () => void; onCerrar?: () => void; hoy: string
}) {
  const cerrada = inv.estado_inversion === 'CERRADA'
  const alerta = !cerrada && inv.fecha_alerta_salida && inv.fecha_alerta_salida <= hoy

  const retorno = cerrada && inv.monto_final
    ? ((inv.monto_final - inv.monto) / inv.monto) * 100
    : null

  const diasMantenida = cerrada && inv.fecha_entrada && inv.fecha_cierre
    ? Math.round((new Date(inv.fecha_cierre).getTime() - new Date(inv.fecha_entrada).getTime()) / 86400000)
    : inv.fecha_entrada
      ? Math.round((Date.now() - new Date(inv.fecha_entrada).getTime()) / 86400000)
      : null

  return (
    <div>
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition text-left">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-jy-amber font-mono text-xs">{inv.jy_id}</span>
            {alerta && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-jy-red/20 text-jy-red font-medium">
                <AlertCircle size={10} /> Alerta salida
              </span>
            )}
            {cerrada && retorno !== null && (
              <span className={cn(
                'flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium',
                retorno >= 0 ? 'bg-jy-green/20 text-jy-green' : 'bg-jy-red/20 text-jy-red'
              )}>
                {retorno >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {retorno >= 0 ? '+' : ''}{retorno.toFixed(2)}%
              </span>
            )}
          </div>
          <p className="text-jy-text text-sm mt-1 truncate">{inv.descripcion ?? inv.categoria?.nombre ?? '—'}</p>
          <p className="text-jy-secondary text-[11px]">
            {inv.categoria?.nombre} · Entrada {formatFecha(inv.fecha_entrada ?? inv.fecha)}
          </p>
        </div>
        <span className={cn('font-display font-semibold', cerrada ? 'text-jy-secondary' : 'text-jy-amber')}>
          {formatPesos(inv.monto)}
        </span>
        {expandido ? <ChevronUp size={16} className="text-jy-secondary" /> : <ChevronDown size={16} className="text-jy-secondary" />}
      </button>

      {expandido && (
        <div className="bg-jy-bg/40 px-4 py-3 border-t border-white/5">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Dato label="Fecha entrada" value={formatFecha(inv.fecha_entrada ?? inv.fecha)} />
            <Dato label="Total invertido" value={formatPesos(inv.monto)} />
            <Dato label="Alerta salida" value={inv.fecha_alerta_salida ? formatFecha(inv.fecha_alerta_salida) : '—'} />
            <Dato label="Monto esperado" value={inv.monto_esperado ? formatPesos(inv.monto_esperado) : '—'} />
            {cerrada && (
              <>
                <Dato label="Fecha cierre" value={formatFecha(inv.fecha_cierre!)} />
                <Dato label="Monto final" value={formatPesos(inv.monto_final!)} />
                <Dato label="% Retorno" value={`${retorno! >= 0 ? '+' : ''}${retorno!.toFixed(2)}%`} highlight={retorno! >= 0 ? 'green' : 'red'} />
                <Dato label="Días mantenida" value={`${diasMantenida} días`} />
              </>
            )}
            {!cerrada && diasMantenida !== null && (
              <Dato label="Días en curso" value={`${diasMantenida} días`} />
            )}
          </div>
          {!cerrada && onCerrar && (
            <div className="flex justify-end pt-3">
              <button
                onClick={onCerrar}
                className="px-3 py-1.5 rounded-lg bg-jy-amber text-jy-bg text-xs font-medium hover:bg-jy-amber/90"
              >Cerrar inversión</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Dato({ label, value, highlight }: { label: string; value: string; highlight?: 'green' | 'red' }) {
  return (
    <div>
      <p className="text-jy-secondary text-[10px] uppercase tracking-wide">{label}</p>
      <p className={cn(
        'text-sm font-medium mt-0.5',
        highlight === 'green' ? 'text-jy-green' : highlight === 'red' ? 'text-jy-red' : 'text-jy-text'
      )}>{value}</p>
    </div>
  )
}

function ModalCerrar({ inversion, onClose, onSaved }: {
  inversion: Inversion; onClose: () => void; onSaved: () => void
}) {
  const [montoFinal, setMontoFinal] = useState('')
  const [fechaCierre, setFechaCierre] = useState(new Date().toISOString().slice(0, 10))
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const retornoPreview = montoFinal && !isNaN(Number(montoFinal))
    ? ((Number(montoFinal) - inversion.monto) / inversion.monto) * 100
    : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const res = await fetch(`/api/inversiones/${inversion.id}/cerrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ monto_final: Number(montoFinal), fecha_cierre: fechaCierre }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(typeof j.error === 'string' ? j.error : 'Error al cerrar')
      }
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-jy-card rounded-xl border border-jy-amber/30 p-5 max-w-md w-full">
        <h2 className="text-jy-text font-display font-semibold mb-1">Cerrar inversión</h2>
        <p className="text-jy-secondary text-xs mb-4">{inversion.jy_id} · {inversion.descripcion ?? inversion.categoria?.nombre}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <span className="text-jy-secondary text-xs block mb-1">Monto invertido</span>
            <p className="text-jy-text text-sm">{formatPesos(inversion.monto)}</p>
          </div>

          <label className="block">
            <span className="text-jy-secondary text-xs block mb-1">Monto final</span>
            <input
              type="number"
              step="0.01"
              value={montoFinal}
              onChange={e => setMontoFinal(e.target.value)}
              required
              autoFocus
              className="w-full px-3 py-2 rounded-lg bg-jy-input text-jy-text text-sm focus:outline-none focus:ring-2 focus:ring-jy-amber"
            />
          </label>

          <label className="block">
            <span className="text-jy-secondary text-xs block mb-1">Fecha de cierre</span>
            <input
              type="date"
              value={fechaCierre}
              onChange={e => setFechaCierre(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-jy-input text-jy-text text-sm focus:outline-none focus:ring-2 focus:ring-jy-amber"
            />
          </label>

          {retornoPreview !== null && (
            <div className="bg-jy-input rounded-lg p-3">
              <p className="text-jy-secondary text-xs">Retorno estimado</p>
              <p className={cn('font-display font-semibold text-lg', retornoPreview >= 0 ? 'text-jy-green' : 'text-jy-red')}>
                {retornoPreview >= 0 ? '+' : ''}{retornoPreview.toFixed(2)}%
              </p>
            </div>
          )}

          {error && <p className="text-jy-red text-xs">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg bg-jy-input text-jy-secondary text-sm hover:bg-jy-input/80">Cancelar</button>
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 py-2 rounded-lg bg-jy-amber text-jy-bg text-sm font-medium hover:bg-jy-amber/90 disabled:opacity-50"
            >{enviando ? 'Cerrando...' : 'Confirmar cierre'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
