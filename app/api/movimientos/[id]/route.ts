import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { updateMovimientoSchema } from '@/lib/schemas/movimientos'

// PATCH /api/movimientos/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const parsed = updateMovimientoSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  // Verificar que el movimiento pertenece al usuario
  const { data: existing } = await supabase
    .from('movimientos')
    .select('id, jy_id, usuario_id')
    .eq('id', params.id)
    .eq('usuario_id', user.id)
    .is('deleted_at', null)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Movimiento no encontrado' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('movimientos')
    .update({
      ...parsed.data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    console.error('PATCH /api/movimientos/[id] error:', error)
    return NextResponse.json({ error: 'Error al actualizar movimiento' }, { status: 500 })
  }

  // Historial
  await supabase.from('historial').insert({
    entidad_tipo: 'movimiento',
    entidad_id: params.id,
    tipo_evento: 'MOVIMIENTO_EDITADO',
    descripcion: `Movimiento ${existing.jy_id} editado`,
    usuario_id: user.id,
  })

  return NextResponse.json({ data })
}

// DELETE /api/movimientos/[id] — soft delete
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()

  const { data: existing } = await supabase
    .from('movimientos')
    .select('id, jy_id, usuario_id')
    .eq('id', params.id)
    .eq('usuario_id', user.id)
    .is('deleted_at', null)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Movimiento no encontrado' }, { status: 404 })
  }

  const { error } = await supabase
    .from('movimientos')
    .update({
      deleted_at: new Date().toISOString(),
      estado: 'ELIMINADO',
    })
    .eq('id', params.id)

  if (error) {
    console.error('DELETE /api/movimientos/[id] error:', error)
    return NextResponse.json({ error: 'Error al eliminar movimiento' }, { status: 500 })
  }

  // Historial
  await supabase.from('historial').insert({
    entidad_tipo: 'movimiento',
    entidad_id: params.id,
    tipo_evento: 'MOVIMIENTO_ELIMINADO',
    descripcion: `Movimiento ${existing.jy_id} eliminado`,
    usuario_id: user.id,
  })

  return NextResponse.json({ ok: true })
}
