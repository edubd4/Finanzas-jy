import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { createPrestamoSchema } from '@/lib/schemas/prestamos'

// GET /api/prestamos — list with cuotas summary
export async function GET() {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()

  const { data: prestamos, error } = await supabase
    .from('prestamos')
    .select(`
      *,
      cuotas:cuotas_prestamo(id, numero_cuota, monto, fecha_vencimiento, estado, pagada_at)
    `)
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('GET /api/prestamos error:', error)
    return NextResponse.json({ error: 'Error al obtener préstamos' }, { status: 500 })
  }

  return NextResponse.json({ data: prestamos })
}

// POST /api/prestamos — create loan + auto-generate cuotas
export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const parsed = createPrestamoSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data: prestamo, error: errPrestamo } = await supabase
    .from('prestamos')
    .insert({
      created_by: user.id,
      tipo: parsed.data.tipo,
      contraparte: parsed.data.contraparte,
      descripcion: parsed.data.descripcion ?? null,
      monto_total: parsed.data.monto_total,
      cantidad_cuotas: parsed.data.cantidad_cuotas,
      fecha_inicio: parsed.data.fecha_inicio,
    })
    .select()
    .single()

  if (errPrestamo || !prestamo) {
    console.error('POST /api/prestamos error:', errPrestamo)
    return NextResponse.json({ error: 'Error al crear préstamo' }, { status: 500 })
  }

  // Auto-generar cuotas mensuales
  const montoCuota = Math.round((parsed.data.monto_total / parsed.data.cantidad_cuotas) * 100) / 100
  const fechaBase = new Date(parsed.data.fecha_inicio + 'T00:00:00')
  const cuotas = Array.from({ length: parsed.data.cantidad_cuotas }, (_, i) => {
    const vencimiento = new Date(fechaBase)
    vencimiento.setMonth(vencimiento.getMonth() + i)
    return {
      prestamo_id: prestamo.id,
      numero_cuota: i + 1,
      monto: montoCuota,
      fecha_vencimiento: vencimiento.toISOString().slice(0, 10),
      estado: 'PENDIENTE' as const,
    }
  })

  const { error: errCuotas } = await supabase.from('cuotas_prestamo').insert(cuotas)
  if (errCuotas) {
    console.error('POST cuotas error:', errCuotas)
    // rollback: soft delete prestamo
    await supabase.from('prestamos').update({ deleted_at: new Date().toISOString() }).eq('id', prestamo.id)
    return NextResponse.json({ error: 'Error al generar cuotas' }, { status: 500 })
  }

  // Historial
  await supabase.from('historial').insert({
    entidad_tipo: 'prestamo',
    entidad_id: prestamo.id,
    tipo_evento: 'NUEVO_PRESTAMO',
    descripcion: `Préstamo ${prestamo.prest_id} creado — ${prestamo.tipo} ${prestamo.contraparte} $${prestamo.monto_total} en ${prestamo.cantidad_cuotas} cuotas`,
    usuario_id: user.id,
  })

  return NextResponse.json({ data: prestamo }, { status: 201 })
}
