'use client'

import { useState, useEffect } from 'react'
import { Settings, Plus, Pencil, Check, X, Trash2 } from 'lucide-react'
import { TIPO_MOVIMIENTO, TIPO_LABEL, TIPO_COLOR } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Categoria {
  id: string
  nombre: string
  tipo: string
  estado: string
  es_default: boolean
}

const TIPOS_CATEGORIA = [
  TIPO_MOVIMIENTO.INGRESO,
  TIPO_MOVIMIENTO.EGRESO,
  TIPO_MOVIMIENTO.GASTO,
  TIPO_MOVIMIENTO.INVERSION,
  'TODOS',
]

export default function ConfiguracionPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS')

  // Formulario nueva categoría
  const [mostrarNueva, setMostrarNueva] = useState(false)
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoTipo, setNuevoTipo] = useState<string>(TIPO_MOVIMIENTO.GASTO)
  const [guardandoNueva, setGuardandoNueva] = useState(false)
  const [errorNueva, setErrorNueva] = useState<string | null>(null)

  // Edición inline
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editandoNombre, setEditandoNombre] = useState('')
  const [eliminandoId, setEliminandoId] = useState<string | null>(null)

  const cargarCategorias = async () => {
    setCargando(true)
    try {
      const res = await fetch('/api/categorias')
      const json = await res.json()
      setCategorias(json.data ?? [])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargarCategorias() }, [])

  const crearCategoria = async () => {
    if (!nuevoNombre.trim()) return
    setGuardandoNueva(true)
    setErrorNueva(null)
    try {
      const res = await fetch('/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoNombre.trim(), tipo: nuevoTipo }),
      })
      if (!res.ok) {
        const json = await res.json()
        setErrorNueva(json?.error?.formErrors?.[0] ?? json?.error ?? 'Error al crear categoría')
        return
      }
      setNuevoNombre('')
      setMostrarNueva(false)
      setFiltroTipo(nuevoTipo)
      cargarCategorias()
    } finally {
      setGuardandoNueva(false)
    }
  }

  const guardarEdicion = async (id: string) => {
    if (!editandoNombre.trim()) return
    await fetch(`/api/categorias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: editandoNombre.trim() }),
    })
    setEditandoId(null)
    cargarCategorias()
  }

  const eliminarCategoria = async (id: string) => {
    const res = await fetch(`/api/categorias/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json()
      console.error('Error al eliminar:', json)
    }
    setEliminandoId(null)
    cargarCategorias()
  }

  const toggleEstado = async (cat: Categoria) => {
    await fetch(`/api/categorias/${cat.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: cat.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA' }),
    })
    cargarCategorias()
  }

  const categoriasFiltradas = filtroTipo === 'TODOS'
    ? categorias
    : categorias.filter((c) => c.tipo === filtroTipo)

  return (
    <>
    {eliminandoId && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60" onClick={() => setEliminandoId(null)} />
        <div className="relative bg-jy-card border border-white/10 rounded-xl p-6 max-w-sm w-full mx-4">
          <h3 className="text-jy-text font-semibold mb-2">¿Eliminar categoría?</h3>
          <p className="text-jy-secondary text-sm mb-4">Si tiene movimientos asociados, se desactivará en lugar de eliminarse.</p>
          <div className="flex gap-3">
            <button onClick={() => setEliminandoId(null)} className="flex-1 py-2 rounded-lg bg-jy-input text-jy-text text-sm font-medium hover:bg-jy-input/80 transition-colors">Cancelar</button>
            <button onClick={() => eliminarCategoria(eliminandoId)} className="flex-1 py-2 rounded-lg bg-jy-red text-white text-sm font-medium hover:bg-jy-red/90 transition-colors">Eliminar</button>
          </div>
        </div>
      </div>
    )}
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-jy-secondary/10">
          <Settings size={20} className="text-jy-secondary" />
        </div>
        <h1 className="text-2xl font-display font-semibold text-jy-text">Configuración</h1>
      </div>

      {/* Sección categorías */}
      <div className="bg-jy-card rounded-xl border border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="text-jy-text font-semibold">Categorías</h2>
          <button
            onClick={() => { setMostrarNueva(!mostrarNueva); setErrorNueva(null) }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-jy-accent text-white rounded-lg text-xs font-medium hover:bg-jy-accent/90 transition-colors"
          >
            <Plus size={14} />
            Nueva
          </button>
        </div>

        {/* Formulario nueva categoría */}
        {mostrarNueva && (
          <div className="px-5 py-4 border-b border-white/5 bg-jy-input/30">
            {errorNueva && (
              <p className="text-jy-red text-xs mb-3">{errorNueva}</p>
            )}
            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Nombre de la categoría"
                className="flex-1 min-w-0 bg-jy-input border border-white/10 rounded-lg px-3 py-2 text-jy-text text-sm focus:outline-none focus:ring-1 focus:ring-jy-accent"
                onKeyDown={(e) => e.key === 'Enter' && crearCategoria()}
                autoFocus
              />
              <select
                value={nuevoTipo}
                onChange={(e) => setNuevoTipo(e.target.value)}
                className="bg-jy-input border border-white/10 rounded-lg px-3 py-2 text-jy-text text-sm focus:outline-none focus:ring-1 focus:ring-jy-accent"
              >
                {TIPOS_CATEGORIA.map((t) => (
                  <option key={t} value={t}>
                    {t === 'TODOS' ? 'Todos los tipos' : TIPO_LABEL[t as keyof typeof TIPO_LABEL] ?? t}
                  </option>
                ))}
              </select>
              <button
                onClick={crearCategoria}
                disabled={guardandoNueva || !nuevoNombre.trim()}
                className="px-4 py-2 bg-jy-accent text-white rounded-lg text-sm font-medium hover:bg-jy-accent/90 disabled:opacity-50 transition-colors"
              >
                {guardandoNueva ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={() => { setMostrarNueva(false); setNuevoNombre(''); setErrorNueva(null) }}
                className="px-3 py-2 bg-jy-input text-jy-secondary rounded-lg text-sm hover:text-jy-text transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Filtro por tipo */}
        <div className="flex gap-1.5 px-5 py-3 border-b border-white/5 overflow-x-auto">
          {['TODOS', ...Object.values(TIPO_MOVIMIENTO).filter(t => t !== 'PRESTAMO')].map((t) => (
            <button
              key={t}
              onClick={() => setFiltroTipo(t)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                filtroTipo === t
                  ? 'bg-jy-accent text-white'
                  : 'bg-jy-input text-jy-secondary hover:text-jy-text'
              )}
            >
              {t === 'TODOS' ? 'Todos' : TIPO_LABEL[t as keyof typeof TIPO_LABEL] ?? t}
            </button>
          ))}
        </div>

        {/* Lista de categorías */}
        {cargando ? (
          <div className="p-5 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-jy-input/40 rounded animate-pulse" />
            ))}
          </div>
        ) : !categoriasFiltradas.length ? (
          <p className="text-center text-jy-secondary text-sm py-8">No hay categorías.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {categoriasFiltradas.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 px-5 py-3">
                {editandoId === cat.id ? (
                  <>
                    <input
                      type="text"
                      value={editandoNombre}
                      onChange={(e) => setEditandoNombre(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') guardarEdicion(cat.id)
                        if (e.key === 'Escape') setEditandoId(null)
                      }}
                      className="flex-1 bg-jy-input border border-jy-accent rounded px-2 py-1 text-jy-text text-sm focus:outline-none"
                      autoFocus
                    />
                    <button onClick={() => guardarEdicion(cat.id)} className="p-1 text-jy-green hover:bg-jy-green/10 rounded">
                      <Check size={15} />
                    </button>
                    <button onClick={() => setEditandoId(null)} className="p-1 text-jy-secondary hover:bg-white/10 rounded">
                      <X size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <span className={cn('text-sm', cat.estado === 'INACTIVA' ? 'text-jy-secondary line-through' : 'text-jy-text')}>
                        {cat.nombre}
                      </span>
                    </div>
                    <span className={cn('text-xs font-medium', TIPO_COLOR[cat.tipo] ?? 'text-jy-secondary')}>
                      {cat.tipo === 'TODOS' ? 'Todos' : TIPO_LABEL[cat.tipo as keyof typeof TIPO_LABEL] ?? cat.tipo}
                    </span>
                    <button
                      onClick={() => { setEditandoId(cat.id); setEditandoNombre(cat.nombre) }}
                      className="p-1.5 text-jy-secondary hover:text-jy-text hover:bg-white/10 rounded transition-colors"
                      title="Editar nombre"
                    >
                      <Pencil size={13} />
                    </button>
                    {!cat.es_default && (
                      <button
                        onClick={() => setEliminandoId(cat.id)}
                        className="p-1.5 text-jy-secondary hover:text-jy-red hover:bg-jy-red/10 rounded transition-colors"
                        title="Eliminar categoría"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                    <button
                      onClick={() => toggleEstado(cat)}
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium transition-colors',
                        cat.estado === 'ACTIVA'
                          ? 'bg-jy-green/10 text-jy-green hover:bg-jy-red/10 hover:text-jy-red'
                          : 'bg-jy-secondary/10 text-jy-secondary hover:bg-jy-green/10 hover:text-jy-green'
                      )}
                      title={cat.estado === 'ACTIVA' ? 'Desactivar' : 'Activar'}
                    >
                      {cat.estado === 'ACTIVA' ? 'Activa' : 'Inactiva'}
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  )
}
