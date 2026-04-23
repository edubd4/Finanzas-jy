import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

// GET /api/dashboard?desde=YYYY-MM-DD&hasta=YYYY-MM-DD[&grafico_anio=YYYY]
// Legacy: ?anio=YYYY&mes=MM (still supported)
export async function GET(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const supabase = await createServiceRoleClient()

  // Resolver rango del período
  let desde: string
  let hasta: string

  if (searchParams.get('desde') && searchParams.get('hasta')) {
    desde = searchParams.get('desde')!
    hasta = searchParams.get('hasta')!
  } else {
    // Backward compat: anio + mes
    const anio = parseInt(searchParams.get('anio') ?? String(new Date().getFullYear()))
    const mes  = parseInt(searchParams.get('mes')  ?? String(new Date().getMonth() + 1))
    desde = `${anio}-${String(mes).padStart(2, '0')}-01`
    hasta = new Date(anio, mes, 0).toISOString().split('T')[0]
  }

  // Parámetro opcional para chart anual
  const graficoAnio = searchParams.get('grafico_anio')
    ? parseInt(searchParams.get('grafico_anio')!)
    : null

  // 1. Métricas + breakdown por categoría (un solo query)
  const { data: movimientosPeriodo } = await supabase
    .from('movimientos')
    .select('tipo, monto, categoria:categorias(id, nombre)')
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .neq('estado', 'ELIMINADO')
    .gte('fecha', desde)
    .lte('fecha', hasta)

  const metricas = { ingresos: 0, egresos: 0, inversiones: 0, balance: 0 }

  // Acumular por categoría+tipo para el pie chart
  const catMap = new Map<string, { nombre: string; tipo: string; total: number }>()

  for (const m of movimientosPeriodo ?? []) {
    if (m.tipo === 'INGRESO') metricas.ingresos += m.monto
    if (m.tipo === 'EGRESO' || m.tipo === 'GASTO') metricas.egresos += m.monto
    if (m.tipo === 'INVERSION') metricas.inversiones += m.monto

    const cat = m.categoria as { id: string; nombre: string } | null
    const key = `${m.tipo}::${cat?.id ?? '__sin_categoria__'}`
    const existing = catMap.get(key)
    if (existing) {
      existing.total += m.monto
    } else {
      catMap.set(key, {
        nombre: cat?.nombre ?? 'Sin categoría',
        tipo: m.tipo,
        total: m.monto,
      })
    }
  }
  metricas.balance = metricas.ingresos - metricas.egresos

  const categorias = Array.from(catMap.values())
    .sort((a, b) => b.total - a.total)

  // 2. Últimos 5 movimientos (siempre los más recientes, sin filtro de período)
  const { data: ultimos } = await supabase
    .from('movimientos')
    .select(`id, jy_id, tipo, monto, fecha, descripcion, categoria:categorias(id, nombre)`)
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .neq('estado', 'ELIMINADO')
    .order('fecha', { ascending: false })
    .limit(5)

  // 3. Gráfico: anual (12 meses) o rolling 6 meses
  const graficoData: { mes: string; ingresos: number; egresos: number }[] = []

  if (graficoAnio) {
    // Vista anual: los 12 meses del año
    for (let m = 1; m <= 12; m++) {
      const mDesde = `${graficoAnio}-${String(m).padStart(2, '0')}-01`
      const mHasta = new Date(graficoAnio, m, 0).toISOString().split('T')[0]
      const { data: movMes } = await supabase
        .from('movimientos')
        .select('tipo, monto')
        .eq('created_by', user.id)
        .is('deleted_at', null)
        .neq('estado', 'ELIMINADO')
        .gte('fecha', mDesde)
        .lte('fecha', mHasta)
        .in('tipo', ['INGRESO', 'EGRESO', 'GASTO'])

      let ing = 0, egr = 0
      for (const mv of movMes ?? []) {
        if (mv.tipo === 'INGRESO') ing += mv.monto
        else egr += mv.monto
      }
      const label = new Date(graficoAnio, m - 1, 1)
        .toLocaleDateString('es-AR', { month: 'short' })
      graficoData.push({ mes: label, ingresos: ing, egresos: egr })
    }
  } else {
    // Rolling 6 meses desde el mes de referencia (mes del "hasta")
    const refDate = new Date(hasta)
    const refAnio = refDate.getFullYear()
    const refMes  = refDate.getMonth() + 1

    for (let i = 5; i >= 0; i--) {
      const d = new Date(refAnio, refMes - 1 - i, 1)
      const mAnio = d.getFullYear()
      const mMes  = d.getMonth() + 1
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

      let ing = 0, egr = 0
      for (const mv of movMes ?? []) {
        if (mv.tipo === 'INGRESO') ing += mv.monto
        else egr += mv.monto
      }
      graficoData.push({
        mes: d.toLocaleDateString('es-AR', { month: 'short' }),
        ingresos: ing,
        egresos: egr,
      })
    }
  }

  // 4. Próximos pagos de préstamos (30 días) — siempre desde hoy
  const hoy    = new Date()
  const en30   = new Date(); en30.setDate(hoy.getDate() + 30)
  const hoyStr = hoy.toISOString().slice(0, 10)
  const en30Str = en30.toISOString().slice(0, 10)

  const { data: cuotasProx } = await supabase
    .from('cuotas_prestamo')
    .select(`
      id, numero_cuota, monto, fecha_vencimiento, estado,
      prestamo:prestamos!inner(id, prest_id, contraparte, tipo, created_by, deleted_at)
    `)
    .eq('prestamo.created_by', user.id)
    .is('prestamo.deleted_at', null)
    .eq('estado', 'PENDIENTE')
    .gte('fecha_vencimiento', hoyStr)
    .lte('fecha_vencimiento', en30Str)
    .order('fecha_vencimiento', { ascending: true })
    .limit(10)

  return NextResponse.json({
    metricas,
    ultimos: ultimos ?? [],
    grafico: graficoData,
    categorias,
    proximosPagos: cuotasProx ?? [],
  })
}
