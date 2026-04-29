'use client'

import { useState, useEffect, useCallback } from 'react'
import { Wallet, TrendingUp, TrendingDown, LineChart, ArrowRight, Handshake, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { GraficoBarras } from '@/components/dashboard/GraficoBarras'
import { GraficoCategorias } from '@/components/dashboard/GraficoCategorias'
import { TipoBadge } from '@/components/shared/TipoBadge'
import { MontoColoreado } from '@/components/shared/MontoColoreado'
import { formatFecha, formatMes, cn } from '@/lib/utils'
import { useCurrency } from '@/lib/currency'

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
  metricas: { ingresos: number; egresos: number; inversiones: number; balance: number }
  ultimos: Movimiento[]
  grafico: { mes: string; ingresos: number; egresos: number }[]
  categorias: { nombre: string; tipo: string; total: number }[]
  proximosPagos?: CuotaProxima[]
}

type TabPeriodo = 'Hoy' | 'Semana' | 'Mes' | 'Año'

// ── Helpers de fecha ──────────────────────────────────────────────────────────
function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}

function getRango(tab: TabPeriodo, mesFecha: Date, anioNav: number) {
  const hoy = new Date()
  switch (tab) {
    case 'Hoy': {
      const s = toDateStr(hoy)
      return { desde: s, hasta: s, graficoAnio: null }
    }
    case 'Semana': {
      const lunes = new Date(hoy)
      lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7))
      return { desde: toDateStr(lunes), hasta: toDateStr(hoy), graficoAnio: null }
    }
    case 'Mes': {
      const anio = mesFecha.getFullYear()
      const mes  = mesFecha.getMonth() + 1
      return {
        desde: `${anio}-${String(mes).padStart(2, '0')}-01`,
        hasta: new Date(anio, mes, 0).toISOString().split('T')[0],
        graficoAnio: null,
      }
    }
    case 'Año':
      return {
        desde: `${anioNav}-01-01`,
        hasta: `${anioNav}-12-31`,
        graficoAnio: anioNav,
      }
  }
}

function calcDelta(actual: number, anterior: number) {
  if (anterior === 0 && actual === 0) return null
  if (anterior === 0) return { texto: 'Nuevo', positivo: actual >= 0 }
  const diff = ((actual - anterior) / Math.abs(anterior)) * 100
  return { texto: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}% vs periodo anterior`, positivo: diff >= 0 }
}

function labelNavegacion(tab: TabPeriodo, mesFecha: Date, anioNav: number) {
  if (tab === 'Mes') return formatMes(mesFecha)
  if (tab === 'Año') return String(anioNav)
  return ''
}

// ── Componente ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { fmt } = useCurrency()
  const [tabActivo, setTabActivo]   = useState<TabPeriodo>('Mes')
  const [mesFecha, setMesFecha]     = useState(new Date())
  const [anioNav, setAnioNav]       = useState(new Date().getFullYear())
  const [data, setData]             = useState<DashboardData | null>(null)
  const [dataPrev, setDataPrev]     = useState<DashboardData | null>(null)
  const [cargando, setCargando]     = useState(true)

  const cargarDatos = useCallback(async () => {
    setCargando(true)
    try {
      const { desde, hasta, graficoAnio } = getRango(tabActivo, mesFecha, anioNav)
      const params = new URLSearchParams({ desde, hasta })
      if (graficoAnio) params.set('grafico_anio', String(graficoAnio))

      // Período anterior para deltas (solo MES y AÑO)
      let urlPrev: string | null = null
      if (tabActivo === 'Mes') {
        const prev = new Date(mesFecha.getFullYear(), mesFecha.getMonth() - 1, 1)
        const { desde: dp, hasta: hp } = getRango('Mes', prev, anioNav)
        urlPrev = `/api/dashboard?desde=${dp}&hasta=${hp}`
      } else if (tabActivo === 'Año') {
        urlPrev = `/api/dashboard?desde=${anioNav - 1}-01-01&hasta=${anioNav - 1}-12-31`
      }

      const [resActual, resPrev] = await Promise.all([
        fetch(`/api/dashboard?${params}`),
        urlPrev ? fetch(urlPrev) : Promise.resolve(null),
      ])

      if (!resActual.ok) throw new Error('Error')
      setData(await resActual.json())
      setDataPrev(resPrev?.ok ? await resPrev.json() : null)
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }, [tabActivo, mesFecha, anioNav])

  useEffect(() => { cargarDatos() }, [cargarDatos])

  useEffect(() => {
    const handler = () => cargarDatos()
    window.addEventListener('movimiento:guardado', handler)
    return () => window.removeEventListener('movimiento:guardado', handler)
  }, [cargarDatos])

  // Navegación anterior / siguiente
  const irAnterior = () => {
    if (tabActivo === 'Mes') setMesFecha(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))
    if (tabActivo === 'Año') setAnioNav(p => p - 1)
  }
  const irSiguiente = () => {
    if (tabActivo === 'Mes') setMesFecha(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))
    if (tabActivo === 'Año') setAnioNav(p => p + 1)
  }

  const showNav = tabActivo === 'Mes' || tabActivo === 'Año'

  const deltaBalance     = data && dataPrev ? calcDelta(data.metricas.balance,     dataPrev.metricas.balance)     : null
  const deltaIngresos    = data && dataPrev ? calcDelta(data.metricas.ingresos,    dataPrev.metricas.ingresos)    : null
  const deltaEgresos     = data && dataPrev ? calcDelta(data.metricas.egresos,     dataPrev.metricas.egresos)     : null
  const deltaInversiones = data && dataPrev ? calcDelta(data.metricas.inversiones, dataPrev.metricas.inversiones) : null

  const tituloGrafico = tabActivo === 'Año'
    ? `Resumen mensual ${anioNav}`
    : 'Ingresos vs Egresos — últimos 6 meses'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-display font-bold text-jy-text">Dashboard</h1>
          {/* Navegación de período */}
          {showNav && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={irAnterior}
                className="p-1.5 rounded hover:bg-jy-input text-jy-secondary hover:text-jy-text transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-jy-text font-semibold text-sm min-w-[100px] text-center capitalize">
                {labelNavegacion(tabActivo, mesFecha, anioNav)}
              </span>
              <button
                onClick={irSiguiente}
                className="p-1.5 rounded hover:bg-jy-input text-jy-secondary hover:text-jy-text transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
        {/* Tabs de período */}
        <div className="flex items-center gap-0.5 bg-jy-input rounded-lg p-0.5 w-fit">
          {(['Hoy', 'Semana', 'Mes', 'Año'] as TabPeriodo[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setTabActivo(tab)}
              className={cn(
                'px-3 py-1.5 rounded text-xs font-semibold transition-colors',
                tabActivo === tab
                  ? 'bg-jy-accent text-white'
                  : 'text-jy-secondary hover:text-jy-text'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          titulo="Balance"
          valor={cargando ? '...' : fmt(data?.metricas.balance ?? 0)}
          colorClase={(data?.metricas.balance ?? 0) >= 0 ? 'text-jy-green' : 'text-jy-red'}
          icono={<Wallet size={18} />}
          delta={deltaBalance?.texto}
          deltaPositivo={deltaBalance?.positivo}
        />
        <MetricCard
          titulo="Ingresos"
          valor={cargando ? '...' : fmt(data?.metricas.ingresos ?? 0)}
          colorClase="text-jy-green"
          icono={<TrendingUp size={18} />}
          delta={deltaIngresos?.texto}
          deltaPositivo={deltaIngresos?.positivo}
        />
        <MetricCard
          titulo="Egresos"
          valor={cargando ? '...' : fmt(data?.metricas.egresos ?? 0)}
          colorClase="text-jy-red"
          icono={<TrendingDown size={18} />}
          delta={deltaEgresos?.texto}
          deltaPositivo={deltaEgresos ? !deltaEgresos.positivo : undefined}
        />
        <MetricCard
          titulo="Inversiones"
          valor={cargando ? '...' : fmt(data?.metricas.inversiones ?? 0)}
          colorClase="text-jy-amber"
          icono={<LineChart size={18} />}
          delta={deltaInversiones?.texto}
          deltaPositivo={deltaInversiones?.positivo}
        />
      </div>

      {/* Gráfico + Últimos movimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {!cargando && data ? (
            <GraficoBarras datos={data.grafico} titulo={tituloGrafico} />
          ) : (
            <div className="bg-jy-card rounded-lg border border-jy-border h-[300px] animate-pulse" />
          )}
        </div>

        <div className="bg-jy-card rounded-lg p-5 border border-jy-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-jy-text font-semibold text-sm">Últimos movimientos</h2>
            <Link href="/movimientos" className="text-jy-accent text-xs font-medium flex items-center gap-1 hover:underline">
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
            <p className="text-jy-secondary text-sm text-center py-6">No hay movimientos registrados</p>
          ) : (
            <div className="space-y-2">
              {data.ultimos.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-jy-border/50 last:border-0">
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

      {/* Distribución por categoría */}
      {!cargando && data && data.categorias.length > 0 && (
        <GraficoCategorias categorias={data.categorias} />
      )}
      {cargando && (
        <div className="bg-jy-card rounded-xl border border-white/5 h-64 animate-pulse" />
      )}

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
                <span className="text-jy-text font-semibold text-sm">{fmt(c.monto)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
