import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'

// GET /api/prestamos/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('prestamos')
    .select(`
      *,
      cuotas:cuotas_prestamo(*)
    `)
    .eq('id', params.id)
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Préstamo no encontrado' }, { status: 404 })
  }

  return NextResponse.json({ data })
}

// DELETE /api/prestamos/[id] — soft delete
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()

  const { data: existing } = await supabase
    .from('prestamos')
    .select('id, prest_id, created_by')
    .eq('id', params.id)
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Préstamo no encontrado' }, { status: 404 })
  }

  const { error } = await supabase
    .from('prestamos')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Error al eliminar préstamo' }, { status: 500 })
  }

  await supabase.from('historial').insert({
    entidad_tipo: 'prestamo',
    entidad_id: params.id,
    tipo_evento: 'PRESTAMO_ELIMINADO',
    descripcion: `Préstamo ${existing.prest_id} eliminado`,
    usuario_id: user.id,
  })

  return NextResponse.json({ ok: true })
}
