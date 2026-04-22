'use client'

import { useState, useEffect, useCallback } from 'react'
import { Handshake, Plus, Trash2, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { formatFecha, formatPesos, cn } from '@/lib/utils'

interface Cuota {
  id: string
  numero_cuota: number
  monto: number
  fecha_vencimiento: string
  estado: 'PENDIENTE' | 'PAGADA' | 'VENCIDA'
  pagada_at: string | null
}

interface Prestamo {
  id: string
  prest_id: string
  tipo: 'acreedor' | 'deudor'
  contraparte: string
  descripcion: string | null
  monto_total: number
  cantidad_cuotas: number
  fecha_inicio: string
  estado: 'ACTIVO' | 'SALDADO' | 'VENCIDO'
  cuotas: Cuota[]
}

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([])
  const [cargando, setCargando] = useState(true)
  const [mostrandoForm, setMostrandoForm] = useState(false)
  const [expandido, setExpandido] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const res = await fetch('/api/prestamos')
      const json = await res.json()
      setPrestamos(json.data ?? [])
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function pagarCuota(cuotaId: string, marcarPaga: boolean) {
    await fetch(`/api/cuotas/${cuotaId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: marcarPaga ? 'pagar' : 'despagar' }),
    })
    await cargar()
  }

  async function eliminarPrestamo(id: string) {
    if (!confirm('¿Eliminar este préstamo y todas sus cuotas?')) return
    await fetch(`/api/prestamos/${id}`, { method: 'DELETE' })
    await cargar()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-jy-purple/10">
            <Handshake size={20} className="text-jy-purple" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-jy-text">Préstamos</h1>
        </div>
        <button
          onClick={() => setMostrandoForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-jy-purple text-white rounded-lg text-sm font-medium hover:bg-jy-purple/90 transition"
        >
          <Plus size={16} /> Nuevo préstamo
        </button>
      </div>

      {mostrandoForm && (
        <FormularioPrestamo
          onClose={() => setMostrandoForm(false)}
          onSaved={async () => { setMostrandoForm(false); await cargar() }}
        />
      )}

      {cargando ? (
        <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-jy-card rounded-xl animate-pulse" />)}</div>
      ) : !prestamos.length ? (
        <div className="bg-jy-card rounded-xl p-8 border border-white/5 text-center">
          <div className="inline-flex p-4 rounded-full bg-jy-purple/10 mb-4">
            <Handshake size={32} className="text-jy-purple" />
          </div>
          <p className="text-jy-secondary text-sm">No hay préstamos registrados todavía.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prestamos.map(p => {
            const pagadas = p.cuotas.filter(c => c.estado === 'PAGADA').length
            const total = p.cantidad_cuotas
            const isOpen = expandido === p.id
            return (
              <div key={p.id} className="bg-jy-card rounded-xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => setExpandido(isOpen ? null : p.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-jy-purple font-mono text-xs">{p.prest_id}</span>
                      <span className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-medium uppercase',
                        p.tipo === 'acreedor' ? 'bg-jy-green/20 text-jy-green' : 'bg-jy-red/20 text-jy-red',
                      )}>
                        {p.tipo === 'acreedor' ? 'Presté' : 'Debo'}
                      </span>
                      <span className={cn(
                        'text-[10px] px-2 py-0.5 rounded-full font-medium',
                        p.estado === 'SALDADO' ? 'bg-jy-green/20 text-jy-green' :
                        p.estado === 'VENCIDO' ? 'bg-jy-red/20 text-jy-red' :
                        'bg-jy-amber/20 text-jy-amber',
                      )}>
                        {p.estado}
                      </span>
                    </div>
                    <p className="text-jy-text text-sm mt-1 truncate">{p.contraparte}</p>
                    <p className="text-jy-secondary text-xs">{pagadas}/{total} cuotas pagadas · inicia {formatFecha(p.fecha_inicio)}</p>
                  </div>
                  <span className="text-jy-text font-display font-semibold">{formatPesos(p.monto_total)}</span>
                  {isOpen ? <ChevronUp size={16} className="text-jy-secondary" /> : <ChevronDown size={16} className="text-jy-secondary" />}
                </button>

                {isOpen && (
                  <div className="border-t border-white/5 bg-jy-bg/40 px-4 py-3 space-y-2">
                    {p.descripcion && <p className="text-jy-secondary text-xs italic">{p.descripcion}</p>}
                    <div className="space-y-1">
                      {p.cuotas.sort((a, b) => a.numero_cuota - b.numero_cuota).map(c => (
                        <div key={c.id} className="flex items-center gap-3 px-2 py-2 rounded bg-jy-card/60">
                          <button
                            onClick={() => pagarCuota(c.id, c.estado !== 'PAGADA')}
                            className={cn(
                              'w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition',
                              c.estado === 'PAGADA'
                                ? 'bg-jy-green border-jy-green text-white'
                                : 'border-jy-secondary hover:border-jy-text'
                            )}
                            aria-label={c.estado === 'PAGADA' ? 'Desmarcar cuota' : 'Marcar cuota pagada'}
                          >
                            {c.estado === 'PAGADA' && <Check size={14} />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="text-jy-text text-xs">Cuota {c.numero_cuota}/{p.cantidad_cuotas}</p>
                            <p className="text-jy-secondary text-[11px]">Vence {formatFecha(c.fecha_vencimiento)}</p>
                          </div>
                          <span className={cn('text-sm font-medium', c.estado === 'PAGADA' && 'text-jy-green line-through')}>
                            {formatPesos(c.monto)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => eliminarPrestamo(p.id)}
                        className="flex items-center gap-1 text-jy-red text-xs hover:underline"
                      >
                        <Trash2 size={12} /> Eliminar préstamo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FormularioPrestamo({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [tipo, setTipo] = useState<'acreedor' | 'deudor'>('deudor')
  const [contraparte, setContraparte] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [montoTotal, setMontoTotal] = useState('')
  const [cantidadCuotas, setCantidadCuotas] = useState('1')
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().slice(0, 10))
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const res = await fetch('/api/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          contraparte: contraparte.trim(),
          descripcion: descripcion.trim() || undefined,
          monto_total: Number(montoTotal),
          cantidad_cuotas: Number(cantidadCuotas),
          fecha_inicio: fechaInicio,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(typeof j.error === 'string' ? j.error : 'Error al guardar')
      }
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="bg-jy-card rounded-xl border border-jy-purple/30 p-4">
      <h2 className="text-jy-text font-display font-semibold mb-4">Nuevo préstamo</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTipo('deudor')}
            className={cn(
              'py-2 rounded-lg text-sm font-medium transition',
              tipo === 'deudor' ? 'bg-jy-red/20 text-jy-red border border-jy-red/40' : 'bg-jy-input text-jy-secondary'
            )}
          >Debo (tomé prestado)</button>
          <button
            type="button"
            onClick={() => setTipo('acreedor')}
            className={cn(
              'py-2 rounded-lg text-sm font-medium transition',
              tipo === 'acreedor' ? 'bg-jy-green/20 text-jy-green border border-jy-green/40' : 'bg-jy-input text-jy-secondary'
            )}
          >Presté</button>
        </div>

        <Input label="Contraparte" value={contraparte} onChange={setContraparte} required placeholder="Ej: Banco, Juan Pérez" />
        <Input label="Descripción (opcional)" value={descripcion} onChange={setDescripcion} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Monto total" value={montoTotal} onChange={setMontoTotal} type="number" required />
          <Input label="Cuotas" value={cantidadCuotas} onChange={setCantidadCuotas} type="number" required />
        </div>
        <Input label="Fecha inicio" value={fechaInicio} onChange={setFechaInicio} type="date" required />

        {error && <p className="text-jy-red text-xs">{error}</p>}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-jy-input text-jy-secondary text-sm hover:bg-jy-input/80"
          >Cancelar</button>
          <button
            type="submit"
            disabled={enviando}
            className="flex-1 py-2 rounded-lg bg-jy-purple text-white text-sm font-medium hover:bg-jy-purple/90 disabled:opacity-50"
          >{enviando ? 'Guardando...' : 'Crear préstamo'}</button>
        </div>
      </form>
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <label className="block">
      <span className="text-jy-secondary text-xs block mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-jy-input text-jy-text text-sm focus:outline-none focus:ring-2 focus:ring-jy-purple"
      />
    </label>
  )
}
