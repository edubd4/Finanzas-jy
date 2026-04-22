'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { TIPO_MOVIMIENTO, TIPO_LABEL, TIPO_FORM_ACCENT, TIPO_BG } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Categoria {
  id: string
  nombre: string
  tipo: string
}

interface FormularioMovimientoProps {
  abierto: boolean
  onCerrar: () => void
  onGuardado: () => void
  tipoInicial?: string
  movimientoEditar?: {
    id: string
    tipo: string
    monto: number
    categoria_id: string
    fecha: string
    descripcion: string | null
  }
}

const TIPOS = [
  TIPO_MOVIMIENTO.INGRESO,
  TIPO_MOVIMIENTO.EGRESO,
  TIPO_MOVIMIENTO.GASTO,
  TIPO_MOVIMIENTO.INVERSION,
]

export function FormularioMovimiento({
  abierto,
  onCerrar,
  onGuardado,
  tipoInicial,
  movimientoEditar,
}: FormularioMovimientoProps) {
  const esEdicion = Boolean(movimientoEditar)

  const [tipo, setTipo] = useState(tipoInicial ?? TIPO_MOVIMIENTO.INGRESO)
  const [monto, setMonto] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [descripcion, setDescripcion] = useState('')
  const [fechaAlertaSalida, setFechaAlertaSalida] = useState('')
  const [montoEsperado, setMontoEsperado] = useState('')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  // Prefill en modo edición
  useEffect(() => {
    if (movimientoEditar) {
      setTipo(movimientoEditar.tipo)
      setMonto(String(movimientoEditar.monto))
      setCategoriaId(movimientoEditar.categoria_id)
      setFecha(movimientoEditar.fecha)
      setDescripcion(movimientoEditar.descripcion ?? '')
    } else {
      setTipo(tipoInicial ?? TIPO_MOVIMIENTO.INGRESO)
      setMonto('')
      setCategoriaId('')
      setFecha(new Date().toISOString().split('T')[0])
      setDescripcion('')
      setFechaAlertaSalida('')
      setMontoEsperado('')
    }
    setError('')
  }, [movimientoEditar, tipoInicial, abierto])

  // Cargar categorías según tipo
  useEffect(() => {
    if (!abierto) return
    fetch(`/api/categorias?tipo=${tipo}`)
      .then((r) => r.json())
      .then((json) => {
        setCategorias(json.data ?? [])
        if (!movimientoEditar) setCategoriaId('')
      })
  }, [tipo, abierto, movimientoEditar])

  const accentClass = TIPO_FORM_ACCENT[tipo] ?? ''
  const bgClass = TIPO_BG[tipo] ?? ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!monto || !categoriaId || !fecha) {
      setError('Completá monto, categoría y fecha.')
      return
    }

    setGuardando(true)
    setError('')

    const body: Record<string, unknown> = {
      tipo,
      monto: parseFloat(monto),
      categoria_id: categoriaId,
      fecha,
      descripcion: descripcion || undefined,
    }

    if (tipo === TIPO_MOVIMIENTO.INVERSION) {
      body.fecha_entrada = fecha
      if (fechaAlertaSalida) body.fecha_alerta_salida = fechaAlertaSalida
      if (montoEsperado) body.monto_esperado = parseFloat(montoEsperado)
    }

    try {
      const url = esEdicion
        ? `/api/movimientos/${movimientoEditar!.id}`
        : '/api/movimientos'
      const method = esEdicion ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const json = await res.json()
        setError(json.error?.formErrors?.[0] ?? 'Error al guardar. Intentá de nuevo.')
        return
      }

      onGuardado()
      onCerrar()
    } catch {
      setError('Error de conexión. Intentá de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCerrar}
      />

      {/* Modal */}
      <div className="relative bg-jy-card w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-jy-border">
          <div>
            <h2 className="font-display font-bold text-base text-jy-accent">
              {esEdicion ? 'Editar movimiento' : 'Nuevo movimiento'}
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-jy-secondary mt-0.5">
              Registro de transacción financiera
            </p>
          </div>
          <button
            onClick={onCerrar}
            className="p-1 rounded hover:bg-jy-input text-jy-secondary hover:text-jy-text transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Selector de tipo */}
          <div>
            <label className="text-jy-secondary text-xs font-medium mb-1.5 block">
              Tipo
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {TIPOS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipo(t)}
                  className={cn(
                    'py-2 px-1 rounded-lg text-xs font-medium border transition-colors',
                    tipo === t
                      ? cn(TIPO_BG[t], 'border-current')
                      : 'bg-jy-input/40 text-jy-secondary border-white/10 hover:bg-jy-input'
                  )}
                >
                  {TIPO_LABEL[t]}
                </button>
              ))}
            </div>
          </div>

          {/* Monto */}
          <div>
            <label className="text-jy-secondary text-xs font-medium mb-1.5 block">
              Monto <span className="text-jy-red">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-jy-secondary text-sm">$</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0"
                className={cn(
                  'w-full bg-jy-input rounded-lg pl-8 pr-4 py-2.5 text-jy-text text-sm border focus:outline-none focus:ring-1',
                  accentClass || 'border-white/10 focus:ring-jy-accent'
                )}
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="text-jy-secondary text-xs font-medium mb-1.5 block">
              Categoría <span className="text-jy-red">*</span>
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className={cn(
                'w-full bg-jy-input rounded-lg px-3 py-2.5 text-jy-text text-sm border focus:outline-none focus:ring-1',
                accentClass || 'border-white/10 focus:ring-jy-accent'
              )}
            >
              <option value="">Seleccioná una categoría</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="text-jy-secondary text-xs font-medium mb-1.5 block">
              Fecha <span className="text-jy-red">*</span>
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={cn(
                'w-full bg-jy-input rounded-lg px-3 py-2.5 text-jy-text text-sm border focus:outline-none focus:ring-1',
                accentClass || 'border-white/10 focus:ring-jy-accent'
              )}
            />
          </div>

          {/* Campos extra para Inversiones */}
          {tipo === TIPO_MOVIMIENTO.INVERSION && !esEdicion && (
            <div className="space-y-3 p-3 rounded-lg bg-jy-amber/5 border border-jy-amber/20">
              <p className="text-jy-amber text-[11px] font-medium">Seguimiento de la inversión</p>
              <div>
                <label className="text-jy-secondary text-xs font-medium mb-1.5 block">
                  Fecha de alerta/salida <span className="text-jy-secondary/60">(opcional)</span>
                </label>
                <input
                  type="date"
                  value={fechaAlertaSalida}
                  onChange={(e) => setFechaAlertaSalida(e.target.value)}
                  className="w-full bg-jy-input rounded-lg px-3 py-2.5 text-jy-text text-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-jy-amber"
                />
              </div>
              <div>
                <label className="text-jy-secondary text-xs font-medium mb-1.5 block">
                  Monto esperado <span className="text-jy-secondary/60">(opcional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-jy-secondary text-sm">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={montoEsperado}
                    onChange={(e) => setMontoEsperado(e.target.value)}
                    placeholder="Target de retorno"
                    className="w-full bg-jy-input rounded-lg pl-8 pr-4 py-2.5 text-jy-text text-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-jy-amber"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Descripción (opcional) */}
          <div>
            <label className="text-jy-secondary text-xs font-medium mb-1.5 block">
              Descripción <span className="text-jy-secondary/60">(opcional)</span>
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={255}
              placeholder="Ej: supermercado del sábado"
              className={cn(
                'w-full bg-jy-input rounded-lg px-3 py-2.5 text-jy-text text-sm border focus:outline-none focus:ring-1',
                accentClass || 'border-white/10 focus:ring-jy-accent'
              )}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-jy-red text-xs">{error}</p>
          )}

          {/* Botón guardar */}
          <button
            type="submit"
            disabled={guardando}
            className="w-full py-3 rounded font-semibold text-sm uppercase tracking-wider bg-jy-accent text-jy-bg hover:bg-jy-accent-hi transition-colors disabled:opacity-60"
          >
            {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Guardar movimiento'}
          </button>
          <p className="text-[10px] uppercase tracking-widest text-jy-secondary text-center">
            La transacción será procesada e impactará en su balance inmediatamente
          </p>
        </form>
      </div>
    </div>
  )
}
