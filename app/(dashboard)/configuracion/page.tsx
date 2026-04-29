'use client'

import { useState, useEffect, useRef } from 'react'
import { Settings, Plus, X, Check, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrency, CURRENCIES } from '@/lib/currency'

interface Categoria {
  id: string
  nombre: string
  tipo: string
  estado: string
  es_default: boolean
}

const GRUPOS = [
  { tipo: 'INGRESO',   label: 'Ingresos',         color: 'text-jy-green',  ring: 'ring-jy-green/40',  bg: 'bg-jy-green/10'  },
  { tipo: 'EGRESO',    label: 'Egresos',           color: 'text-jy-red',    ring: 'ring-jy-red/40',    bg: 'bg-jy-red/10'    },
  { tipo: 'GASTO',     label: 'Gastos',            color: 'text-jy-red',    ring: 'ring-jy-red/40',    bg: 'bg-jy-red/10'    },
  { tipo: 'INVERSION', label: 'Inversiones',       color: 'text-jy-amber',  ring: 'ring-jy-amber/40',  bg: 'bg-jy-amber/10'  },
  { tipo: 'TODOS',     label: 'Todos los tipos',   color: 'text-jy-secondary', ring: 'ring-white/20', bg: 'bg-white/5'      },
]

export default function ConfiguracionPage() {
  const { currency, setCurrencyCode } = useCurrency()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)

  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editandoNombre, setEditandoNombre] = useState('')

  const [agregandoTipo, setAgregandoTipo] = useState<string | null>(null)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [eliminandoId, setEliminandoId] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const cargar = async () => {
    setCargando(true)
    try {
      const res = await fetch('/api/categorias')
      const json = await res.json()
      setCategorias(json.data ?? [])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  useEffect(() => {
    if (agregandoTipo || editandoId) inputRef.current?.focus()
  }, [agregandoTipo, editandoId])

  const crearCategoria = async () => {
    if (!nuevoNombre.trim() || !agregandoTipo) return
    setGuardando(true)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre.trim(), tipo: agregandoTipo }),
      })
      if (!res.ok) {
        const json = await res.json()
        setErrorMsg(json?.error?.formErrors?.[0] ?? json?.error ?? 'Error al crear')
        return
      }
      setAgregandoTipo(null)
      setNuevoNombre('')
      cargar()
    } finally {
      setGuardando(false)
    }
  }

  const guardarEdicion = async () => {
    if (!editandoNombre.trim() || !editandoId) return
    await fetch(`/api/categorias/${editandoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: editandoNombre.trim() }),
    })
    setEditandoId(null)
    cargar()
  }

  const eliminar = async (id: string) => {
    const res = await fetch(`/api/categorias/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setErrorMsg(json?.error ?? 'Error al eliminar')
    }
    setEliminandoId(null)
    cargar()
  }

  const cancelarAgregar = () => {
    setAgregandoTipo(null)
    setNuevoNombre('')
    setErrorMsg(null)
  }

  const cancelarEdicion = () => {
    setEditandoId(null)
    setEditandoNombre('')
  }

  return (
    <>
      {/* Modal confirmar eliminación */}
      {eliminandoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setEliminandoId(null)} />
          <div className="relative bg-jy-card border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-jy-text font-semibold mb-2">¿Eliminar categoría?</h3>
            <p className="text-jy-secondary text-sm mb-4">
              Si tiene movimientos asociados se desactivará. Sin movimientos, se elimina permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setEliminandoId(null)}
                className="flex-1 py-2 rounded-lg bg-jy-input text-jy-text text-sm font-medium hover:bg-jy-input/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminar(eliminandoId)}
                className="flex-1 py-2 rounded-lg bg-jy-red text-white text-sm font-medium hover:bg-jy-red/90 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-jy-secondary/10">
            <Settings size={20} className="text-jy-secondary" />
          </div>
          <h1 className="text-2xl font-display font-semibold text-jy-text">Configuración</h1>
        </div>

        {/* Divisa */}
        <div className="bg-jy-card rounded-xl p-5 border border-white/5">
          <h2 className="text-jy-text font-semibold mb-4">Divisa</h2>
          <div className="flex flex-wrap gap-2">
            {CURRENCIES.map(c => (
              <button
                key={c.code}
                onClick={() => setCurrencyCode(c.code)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border',
                  currency.code === c.code
                    ? 'bg-jy-accent text-white border-jy-accent'
                    : 'bg-jy-input text-jy-secondary border-white/10 hover:text-jy-text'
                )}
              >
                {c.symbol} {c.code} — {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categorías */}
        <div className="bg-jy-card rounded-xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="text-jy-text font-semibold">Categorías</h2>
            <p className="text-jy-secondary text-xs mt-0.5">Hacé clic en una categoría para editarla. La × la elimina.</p>
          </div>

          {cargando ? (
            <div className="p-5 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-jy-input/40 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {GRUPOS.map((grupo) => {
                const items = categorias.filter((c) => c.tipo === grupo.tipo)
                const esteAgregando = agregandoTipo === grupo.tipo

                return (
                  <div key={grupo.tipo} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className={cn('text-xs font-semibold uppercase tracking-wider', grupo.color)}>
                        {grupo.label}
                      </span>
                      <button
                        onClick={() => { cancelarAgregar(); setAgregandoTipo(grupo.tipo) }}
                        className="flex items-center gap-1 text-xs text-jy-secondary hover:text-jy-text transition-colors"
                      >
                        <Plus size={12} />
                        Agregar
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {items.map((cat) => (
                        <div
                          key={cat.id}
                          className={cn(
                            'flex items-center gap-1.5 rounded-lg border text-sm transition-colors',
                            cat.estado === 'INACTIVA' ? 'opacity-40' : '',
                            editandoId === cat.id
                              ? `ring-1 ${grupo.ring} bg-jy-input border-transparent px-1 py-0.5`
                              : `${grupo.bg} border-white/10 px-3 py-1.5`
                          )}
                        >
                          {editandoId === cat.id ? (
                            <>
                              <input
                                ref={inputRef}
                                value={editandoNombre}
                                onChange={(e) => setEditandoNombre(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') guardarEdicion()
                                  if (e.key === 'Escape') cancelarEdicion()
                                }}
                                className="bg-transparent text-jy-text text-sm outline-none w-32"
                              />
                              <button onClick={guardarEdicion} className="text-jy-green hover:text-jy-green/80">
                                <Check size={13} />
                              </button>
                              <button onClick={cancelarEdicion} className="text-jy-secondary hover:text-jy-text">
                                <X size={13} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => { cancelarEdicion(); setEditandoId(cat.id); setEditandoNombre(cat.nombre) }}
                                className={cn('text-sm flex items-center gap-1.5', grupo.color)}
                              >
                                <Pencil size={10} className="opacity-50" />
                                {cat.nombre}
                              </button>
                              <button
                                onClick={() => setEliminandoId(cat.id)}
                                className="text-jy-secondary hover:text-jy-red transition-colors ml-1"
                              >
                                <X size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      ))}

                      {/* Chip de agregar inline */}
                      {esteAgregando && (
                        <div className={cn(
                          'flex items-center gap-1.5 rounded-lg border ring-1 bg-jy-input border-transparent px-2 py-1',
                          grupo.ring
                        )}>
                          <input
                            ref={agregandoTipo === grupo.tipo ? inputRef : undefined}
                            value={nuevoNombre}
                            onChange={(e) => setNuevoNombre(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') crearCategoria()
                              if (e.key === 'Escape') cancelarAgregar()
                            }}
                            placeholder="Nombre..."
                            className="bg-transparent text-jy-text text-sm outline-none w-28 placeholder:text-jy-secondary"
                          />
                          <button
                            onClick={crearCategoria}
                            disabled={guardando || !nuevoNombre.trim()}
                            className="text-jy-green hover:text-jy-green/80 disabled:opacity-40"
                          >
                            <Check size={13} />
                          </button>
                          <button onClick={cancelarAgregar} className="text-jy-secondary hover:text-jy-text">
                            <X size={13} />
                          </button>
                        </div>
                      )}

                      {items.length === 0 && !esteAgregando && (
                        <span className="text-jy-secondary text-xs italic">Sin categorías</span>
                      )}
                    </div>

                    {errorMsg && esteAgregando && (
                      <p className="text-jy-red text-xs mt-2">{errorMsg}</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
