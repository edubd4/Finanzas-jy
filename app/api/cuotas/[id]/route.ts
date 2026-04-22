import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

// PATCH /api/cuotas/[id] — mark paid / unpaid
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const accion = body.accion as 'pagar' | 'despagar' | undefined

  const supabase = await createServiceRoleClient()

  const { data: cuota, error: errCuota } = await supabase
    .from('cuotas_prestamo')
    .select('id, numero_cuota, estado, prestamo_id')
    .eq('id', params.id)
    .single()

  if (errCuota || !cuota) {
    return NextResponse.json({ error: 'Cuota no encontrada' }, { status: 404 })
  }

  const { data: prestamo } = await supabase
    .from('prestamos')
    .select('id, prest_id, created_by')
    .eq('id', cuota.prestamo_id)
    .single()

  if (!prestamo || prestamo.created_by !== user.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const markPaid = accion !== 'despagar' && cuota.estado !== 'PAGADA'

  const { error } = await supabase
    .from('cuotas_prestamo')
    .update({
      estado: markPaid ? 'PAGADA' : 'PENDIENTE',
      pagada_at: markPaid ? new Date().toISOString() : null,
    })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Error al actualizar cuota' }, { status: 500 })
  }

  // Sync estado del préstamo según cuotas pendientes
  const { count: pendientes } = await supabase
    .from('cuotas_prestamo')
    .select('id', { count: 'exact', head: true })
    .eq('prestamo_id', cuota.prestamo_id)
    .neq('estado', 'PAGADA')

  const nuevoEstado = (pendientes ?? 0) === 0 ? 'SALDADO' : 'ACTIVO'
  await supabase.from('prestamos').update({ estado: nuevoEstado }).eq('id', cuota.prestamo_id)

  await supabase.from('historial').insert({
    entidad_tipo: 'cuota_prestamo',
    entidad_id: params.id,
    tipo_evento: markPaid ? 'CUOTA_PAGADA' : 'CUOTA_DESPAGADA',
    descripcion: `Cuota ${cuota.numero_cuota} del préstamo ${prestamo.prest_id} ${markPaid ? 'pagada' : 'marcada pendiente'}`,
    usuario_id: user.id,
  })

  return NextResponse.json({ ok: true })
}
