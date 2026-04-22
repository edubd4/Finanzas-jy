'use client'

import { useState, useEffect, useCallback } from 'react'
import { Wallet, TrendingUp, TrendingDown, LineChart, ArrowRight, Handshake, Calendar } from 'lucide-react'
import Link from 'next/link'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { AccionesRapidas } from '@/components/dashboard/AccionesRapidas'
import { GraficoBarras } from '@/components/dashboard/GraficoBarras'
import { PeriodoSelector } from '@/components/shared/PeriodoSelector'
import { TipoBadge } from '@/components/shared/TipoBadge'
import { MontoColoreado } from '@/components/shared/MontoColoreado'
import { FormularioMovimiento } from '@/components/movimientos/FormularioMovimiento'
import { formatPesos, formatFecha } from '@/lib/utils'

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

export default function DashboardPage() {
  const [periodo, setPeriodo] = useState(new Date())
  const [data, setData] = useState<DashboardData | null>(null)
  const [cargando, setCargando] = useState(true)
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [tipoFormulario, setTipoFormulario] = useState<string | undefined>()

  const cargarDatos = useCallback(async () => {
    setCargando(true)
    try {
      const anio = periodo.getFullYear()
      const mes = periodo.getMonth() + 1
      const res = await fetch(`/api/dashboard?anio=${anio}&mes=${mes}`)
      if (!res.ok) throw new Error('Error al cargar datos')
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error(err)
    } finally {
      setCargando(false)
    }
  }, [periodo])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  // Refresco cuando se guarda desde el modal global del sidebar
  useEffect(() => {
    const handler = () => cargarDatos()
    window.addEventListener('movimiento:guardado', handler)
    return () => window.removeEventListener('movimiento:guardado', handler)
  }, [cargarDatos])

  const irMesAnterior = () => {
    setPeriodo(p => new Date(p.getFullYear(), p.getMonth() - 1, 1))
  }

  const irMesSiguiente = () => {
    setPeriodo(p => new Date(p.getFullYear(), p.getMonth() + 1, 1))
  }

  const handleAccion = (tipo: string) => {
    setTipoFormulario(tipo)
    setFormularioAbierto(true)
  }

  return (
    <>
    <FormularioMovimiento
      abierto={formularioAbierto}
      onCerrar={() => setFormularioAbierto(false)}
      onGuardado={cargarDatos}
      tipoInicial={tipoFormulario}
    />
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-semibold text-jy-text">
          Dashboard
        </h1>
        <PeriodoSelector
          fecha={periodo}
          onAnterior={irMesAnterior}
          onSiguiente={irMesSiguiente}
        />
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          titulo="Balance"
          valor={cargando ? '...' : formatPesos(data?.metricas.balance ?? 0)}
          colorClase={
            (data?.metricas.balance ?? 0) >= 0 ? 'text-jy-green' : 'text-jy-red'
          }
          icono={<Wallet size={18} />}
        />
        <MetricCard
          titulo="Ingresos"
          valor={cargando ? '...' : formatPesos(data?.metricas.ingresos ?? 0)}
          colorClase="text-jy-green"
          icono={<TrendingUp size={18} />}
        />
        <MetricCard
          titulo="Egresos"
          valor={cargando ? '...' : formatPesos(data?.metricas.egresos ?? 0)}
          colorClase="text-jy-red"
          icono={<TrendingDown size={18} />}
        />
        <MetricCard
          titulo="Inversiones"
          valor={cargando ? '...' : formatPesos(data?.metricas.inversiones ?? 0)}
          colorClase="text-jy-amber"
          descripcion="Total invertido"
          icono={<LineChart size={18} />}
        />
      </div>

      {/* Acciones rápidas + últimos movimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <AccionesRapidas onAccion={handleAccion} />
        </div>

        {/* Últimos movimientos */}
        <div className="lg:col-span-2 bg-jy-card rounded-xl p-5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-jy-text font-semibold">Últimos movimientos</h2>
            <Link
              href="/movimientos"
              className="text-jy-accent text-sm flex items-center gap-1 hover:underline"
            >
              Ver todos <ArrowRight size={14} />
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
              {data.ultimos.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-jy-text text-sm truncate">
                      {m.descripcion ?? m.categoria?.nombre ?? '—'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-jy-secondary text-xs">{formatFecha(m.fecha)}</span>
                      <TipoBadge tipo={m.tipo} />
                    </div>
                  </div>
                  <MontoColoreado monto={m.monto} tipo={m.tipo} className="text-sm ml-4 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Próximos pagos de préstamos */}
      {!cargando && data?.proximosPagos && data.proximosPagos.length > 0 && (
        <div className="bg-jy-card rounded-xl p-5 border border-jy-purple/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Handshake size={16} className="text-jy-purple" />
              <h2 className="text-jy-text font-semibold">Próximos pagos (30 días)</h2>
            </div>
            <Link href="/prestamos" className="text-jy-purple text-sm flex items-center gap-1 hover:underline">
              Ver préstamos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {data.proximosPagos.map(c => (
              <div key={c.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
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
                <span className="text-jy-text font-semibold text-sm">{formatPesos(c.monto)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gráfico */}
      {!cargando && data && (
        <GraficoBarras datos={data.grafico} />
      )}
    </div>
    </>
  )
}
