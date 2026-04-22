'use client'

import { useState, useEffect, useCallback } from 'react'
import { Wallet, TrendingUp, TrendingDown, LineChart, ArrowRight, Handshake, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { GraficoBarras } from '@/components/dashboard/GraficoBarras'
import { TipoBadge } from '@/components/shared/TipoBadge'
import { MontoColoreado } from '@/components/shared/MontoColoreado'
import { formatPesos, formatFecha, formatMes, cn } from '@/lib/utils'

interface Movimiento {
  id: string
  jy_id: string
  tipo: string
  monto: number
  fecha: string
  descripcion: string | null
  categoria: { id: string; nombre: string } | null
}

interface CuotaProxima {
  id: string
  numero_cuota: number
  monto: number
  fecha_vencimiento: string
  estado: string
  prestamo: { id: string; prest_id: string; contraparte: string; tipo: 'acreedor' | 'deudor' }
}

interface DashboardData {
  metricas: {
    ingresos: number
    egresos: number
    inversiones: number
    balance: number
  }
  ultimos: Movimiento[]
  grafico: { mes: string; ingresos: number; egresos: number }[]
  proximosPagos?: CuotaProxima[]
}

// Tabs de período decorativas — por ahora solo "Mes" funciona (respeta la lógica mensual existente)
const PERIODOS = ['Hoy', 'Semana', 'Mes', 'Año'] as const
type Periodo = typeof PERIODOS[number]

function calcDelta(actual: number, anterior: number): { texto: string; positivo: boolean } | null {
  if (anterior === 0 && actual === 0) return null
  if (anterior === 0) return { texto: 'Nuevo', positivo: actual >= 0 }
  const diff = ((actual - anterior) / Math.abs(anterior)) * 100
  const signo = diff > 0 ? '+' : ''
  return { texto: `${signo}${diff.toFixed(1)}% vs mes anterior`, positivo: diff >= 0 }
}

export default function DashboardPage() {
  const [periodo, setPeriodo] = useState(new Date())
  const [periodoTab, setPeriodoTab] = useState<Periodo>('Mes')
  const [data, setData] = useState<DashboardData | null>(null)
  const [dataPrev, setDataPrev] = useState<DashboardData | null>(null)
  const [cargando, setCargando] = useState(true)

  const cargarDatos = useCallback(async () => {
    setCargando(true)
    try {
      const anio = periodo.getFullYear()
      const mes = periodo.getMonth() + 1
      const anioPrev = mes === 1 ? anio - 1 : anio
      const mesPrev = mes === 1 ? 12 : mes - 1

      const [resActual, resPrev] = await Promise.all([
        fetch(`/api/dashboard?anio=${anio}&mes=${mes}`),
        fetch(`/api/dashboard?anio=${anioPrev}&mes=${mesPrev}`),
      ])
      if (!resActual.ok) throw new Error('Error al cargar datos')
      const jsonActual = await resActual.json()
      const jsonPrev = resPrev.ok ? await resPrev.json() : null
      setData(jsonActual)
      setDataPrev(jsonPrev)
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }, [periodo])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  useEffect(() => {
    const handler = () => cargarDatos()
    window.addEventListener('movimiento:guardado', handler)
    return () => window.removeEventListener('movimiento:guardado', handler)
  }, [cargarDatos])

  const irMesAnterior  = () => setPeriodo(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))
  const irMesSiguiente = () => setPeriodo(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))

  // Deltas vs mes anterior
  const deltaBalance     = data && dataPrev ? calcDelta(data.metricas.balance,     dataPrev.metricas.balance)     : null
  const deltaIngresos    = data && dataPrev ? calcDelta(data.metricas.ingresos,    dataPrev.metricas.ingresos)    : null
  const deltaEgresos     = data && dataPrev ? calcDelta(data.metricas.egresos,     dataPrev.metricas.egresos)     : null
  const deltaInversiones = data && dataPrev ? calcDelta(data.metricas.inversiones, dataPrev.metricas.inversiones) : null

  return (
    <div className="space-y-6">
      {/* Header con tabs de período + navegación de mes */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-display font-bold text-jy-text">Dashboard</h1>
          <div className="flex items-center gap-1">
            {PERIODOS.map(p => {
              const enabled = p === 'Mes' // sólo Mes funcional por ahora
              return (
                <button
                  key={p}
                  onClick={() => enabled && setPeriodoTab(p)}
                  disabled={!enabled}
                  className={cn(
                    'px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-colors',
                    periodoTab === p
                      ? 'text-jy-accent border-b-2 border-jy-accent'
                      : enabled
                        ? 'text-jy-secondary hover:text-jy-text'
                        : 'text-jy-secondary/40 cursor-not-allowed'
                  )}
                  title={!enabled ? 'Próximamente' : undefined}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={irMesAnterior}
            className="p-1.5 rounded hover:bg-jy-input text-jy-secondary hover:text-jy-text transition-colors"
            aria-label="Mes anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-jy-text font-semibold text-sm min-w-[120px] text-center capitalize">
            {formatMes(periodo)}
          </span>
          <button
            onClick={irMesSiguiente}
            className="p-1.5 rounded hover:bg-jy-input text-jy-secondary hover:text-jy-text transition-colors"
            aria-label="Mes siguiente"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Tarjetas de métricas con deltas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          titulo="Balance"
          valor={cargando ? '...' : formatPesos(data?.metricas.balance ?? 0)}
          colorClase={(data?.metricas.balance ?? 0) >= 0 ? 'text-jy-green' : 'text-jy-red'}
          icono={<Wallet size={18} />}
          delta={deltaBalance?.texto}
          deltaPositivo={deltaBalance?.positivo}
        />
        <MetricCard
          titulo="Ingresos"
          valor={cargando ? '...' : formatPesos(data?.metricas.ingresos ?? 0)}
          colorClase="text-jy-green"
          icono={<TrendingUp size={18} />}
          delta={deltaIngresos?.texto}
          deltaPositivo={deltaIngresos?.positivo}
        />
        <MetricCard
          titulo="Egresos"
          valor={cargando ? '...' : formatPesos(data?.metricas.egresos ?? 0)}
          colorClase="text-jy-red"
          icono={<TrendingDown size={18} />}
          delta={deltaEgresos?.texto}
          deltaPositivo={deltaEgresos ? !deltaEgresos.positivo : undefined} // subir egresos es "malo"
        />
        <MetricCard
          titulo="Inversiones"
          valor={cargando ? '...' : formatPesos(data?.metricas.inversiones ?? 0)}
          colorClase="text-jy-amber"
          icono={<LineChart size={18} />}
          delta={deltaInversiones?.texto}
          deltaPositivo={deltaInversiones?.positivo}
        />
      </div>

      {/* Gráfico 2/3 + Últimos movimientos 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {!cargando && data && <GraficoBarras datos={data.grafico} />}
          {cargando && <div className="bg-jy-card rounded-lg border border-jy-border h-[300px] animate-pulse" />}
        </div>

        <div className="bg-jy-card rounded-lg p-5 border border-jy-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-jy-text font-semibold text-sm">Últimos movimientos</h2>
            <Link
              href="/movimientos"
              className="text-jy-accent text-xs font-medium flex items-center gap-1 hover:underline"
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>

          {cargando ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-jy-input/40 rounded animate-pulse" />
              ))}
            </div>
          ) : !data?.ultimos.length ? (
            <p className="text-jy-secondary text-sm text-center py-6">
              No hay movimientos registrados
            </p>
          ) : (
            <div className="space-y-2">
              {data.ultimos.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-2 border-b border-jy-border/50 last:border-0"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-jy-text text-sm truncate">
                      {m.descripcion ?? m.categoria?.nombre ?? '—'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-jy-secondary text-[11px]">{formatFecha(m.fecha)}</span>
                      <TipoBadge tipo={m.tipo} />
                    </div>
                  </div>
                  <MontoColoreado monto={m.monto} tipo={m.tipo} className="text-sm ml-3 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Próximos pagos de préstamos */}
      {!cargando && data?.proximosPagos && data.proximosPagos.length > 0 && (
        <div className="bg-jy-card rounded-lg p-5 border border-jy-purple/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Handshake size={16} className="text-jy-purple" />
              <h2 className="text-jy-text font-semibold text-sm">Próximos pagos (30 días)</h2>
            </div>
            <Link href="/prestamos" className="text-jy-purple text-xs font-medium flex items-center gap-1 hover:underline">
              Ver préstamos <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {data.proximosPagos.map(c => (
              <div key={c.id} className="flex items-center gap-3 py-2 border-b border-jy-border/50 last:border-0">
                <Calendar size={14} className="text-jy-purple flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-jy-text text-sm truncate">
                    {c.prestamo.contraparte}
                    <span className="text-jy-secondary text-xs ml-2 font-mono">{c.prestamo.prest_id}</span>
                  </p>
                  <p className="text-jy-secondary text-xs">
                    Cuota {c.numero_cuota} · vence {formatFecha(c.fecha_vencimiento)}
                    <span className={c.prestamo.tipo === 'acreedor' ? 'text-jy-green ml-2' : 'text-jy-red ml-2'}>
                      {c.prestamo.tipo === 'acreedor' ? 'a cobrar' : 'a pagar'}
                    </span>
                  </p>
                </div>
                <span className="text-jy-text font-semibold text-sm tnum">{formatPesos(c.monto)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
