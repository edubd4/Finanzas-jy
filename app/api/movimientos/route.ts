import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { createMovimientoSchema } from '@/lib/schemas/movimientos'

// GET /api/movimientos?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&tipo=INGRESO,...
export async function GET(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const desde = searchParams.get('desde')
  const hasta = searchParams.get('hasta')
  const tipos = searchParams.get('tipo')?.split(',').filter(Boolean)
  const categoriaId = searchParams.get('categoria_id')
  const busqueda = searchParams.get('q')
  const limite = parseInt(searchParams.get('limit') ?? '200')

  const supabase = await createServiceRoleClient()

  let query = supabase
    .from('movimientos')
    .select(`
      *,
      categoria:categorias(id, nombre, tipo)
    `)
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .neq('estado', 'ELIMINADO')
    .order('fecha', { ascending: false })
    .limit(limite)

  if (desde) query = query.gte('fecha', desde)
  if (hasta) query = query.lte('fecha', hasta)
  if (tipos && tipos.length > 0) query = query.in('tipo', tipos)
  if (categoriaId) query = query.eq('categoria_id', categoriaId)
  if (busqueda) query = query.ilike('descripcion', `%${busqueda}%`)

  const { data, error } = await query

  if (error) {
    console.error('GET /api/movimientos error:', error)
    return NextResponse.json({ error: 'Error al obtener movimientos' }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// POST /api/movimientos
export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const parsed = createMovimientoSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const isInversion = parsed.data.tipo === 'INVERSION'

  const { data, error } = await supabase
    .from('movimientos')
    .insert({
      created_by: user.id,
      tipo: parsed.data.tipo,
      monto: parsed.data.monto,
      categoria_id: parsed.data.categoria_id,
      fecha: parsed.data.fecha,
      descripcion: parsed.data.descripcion ?? null,
      fecha_entrada: isInversion ? (parsed.data.fecha_entrada ?? parsed.data.fecha) : null,
      fecha_alerta_salida: isInversion ? (parsed.data.fecha_alerta_salida ?? null) : null,
      monto_esperado: isInversion ? (parsed.data.monto_esperado ?? null) : null,
      estado_inversion: isInversion ? 'ABIERTA' : null,
    })
    .select()
    .single()

  if (error) {
    console.error('POST /api/movimientos error:', error)
    return NextResponse.json({ error: 'Error al crear movimiento' }, { status: 500 })
  }

  // Insertar en historial
  await supabase.from('historial').insert({
    entidad_tipo: 'movimiento',
    entidad_id: data.id,
    tipo_evento: 'NUEVO_MOVIMIENTO',
    descripcion: `Movimiento ${data.jy_id} creado — ${data.tipo} $${data.monto}`,
    usuario_id: user.id,
  })

  return NextResponse.json({ data }, { status: 201 })
}
