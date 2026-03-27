import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

// GET /api/dashboard?anio=2026&mes=3
export async function GET(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const anio = parseInt(searchParams.get('anio') ?? String(new Date().getFullYear()))
  const mes = parseInt(searchParams.get('mes') ?? String(new Date().getMonth() + 1))

  const supabase = await createServiceRoleClient()

  // Rango del período seleccionado
  const desde = `${anio}-${String(mes).padStart(2, '0')}-01`
  const hasta = new Date(anio, mes, 0).toISOString().split('T')[0] // último día del mes

  // 1. Métricas del período
  const { data: movimientosPeriodo } = await supabase
    .from('movimientos')
    .select('tipo, monto')
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .neq('estado', 'ELIMINADO')
    .gte('fecha', desde)
    .lte('fecha', hasta)

  const metricas = {
    ingresos: 0,
    egresos: 0,
    inversiones: 0,
    balance: 0,
  }

  for (const m of movimientosPeriodo ?? []) {
    if (m.tipo === 'INGRESO') metricas.ingresos += m.monto
    if (m.tipo === 'EGRESO' || m.tipo === 'GASTO') metricas.egresos += m.monto
    if (m.tipo === 'INVERSION') metricas.inversiones += m.monto
  }
  metricas.balance = metricas.ingresos - metricas.egresos

  // 2. Últimos 5 movimientos
  const { data: ultimos } = await supabase
    .from('movimientos')
    .select(`
      id, jy_id, tipo, monto, fecha, descripcion,
      categoria:categorias(id, nombre)
    `)
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .neq('estado', 'ELIMINADO')
    .order('fecha', { ascending: false })
    .limit(5)

  // 3. Gráfico: ingresos vs egresos últimos 6 meses
  const graficoData: { mes: string; ingresos: number; egresos: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(anio, mes - 1 - i, 1)
    const mAnio = d.getFullYear()
    const mMes = d.getMonth() + 1
    const mDesde = `${mAnio}-${String(mMes).padStart(2, '0')}-01`
    const mHasta = new Date(mAnio, mMes, 0).toISOString().split('T')[0]

    const { data: movMes } = await supabase
      .from('movimientos')
      .select('tipo, monto')
      .eq('created_by', user.id)
      .is('deleted_at', null)
      .neq('estado', 'ELIMINADO')
      .gte('fecha', mDesde)
      .lte('fecha', mHasta)
      .in('tipo', ['INGRESO', 'EGRESO', 'GASTO'])

    let ingresos = 0
    let egresos = 0
    for (const m of movMes ?? []) {
      if (m.tipo === 'INGRESO') ingresos += m.monto
      else egresos += m.monto
    }

    graficoData.push({
      mes: d.toLocaleDateString('es-AR', { month: 'short' }),
      ingresos,
      egresos,
    })
  }

  return NextResponse.json({
    metricas,
    ultimos: ultimos ?? [],
    grafico: graficoData,
  })
}
