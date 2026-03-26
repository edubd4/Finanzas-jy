import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { updateCategoriaSchema } from '@/lib/schemas/categorias'

// PATCH /api/categorias/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const parsed = updateCategoriaSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  // Verificar ownership
  const { data: existing } = await supabase
    .from('categorias')
    .select('id, usuario_id')
    .eq('id', params.id)
    .eq('usuario_id', user.id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('categorias')
    .update(parsed.data)
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    console.error('PATCH /api/categorias/[id] error:', error)
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// DELETE /api/categorias/[id] — solo desactiva si tiene movimientos, sino borra
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()

  const { data: existing } = await supabase
    .from('categorias')
    .select('id, usuario_id')
    .eq('id', params.id)
    .eq('usuario_id', user.id)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
  }

  // Verificar si tiene movimientos activos
  const { count } = await supabase
    .from('movimientos')
    .select('*', { count: 'exact', head: true })
    .eq('categoria_id', params.id)
    .is('deleted_at', null)

  if (count && count > 0) {
    // Tiene movimientos — solo desactivar
    const { data, error } = await supabase
      .from('categorias')
      .update({ estado: 'INACTIVA' })
      .eq('id', params.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Error al desactivar' }, { status: 500 })
    return NextResponse.json({ data, desactivada: true })
  }

  // Sin movimientos — eliminar físicamente
  const { error } = await supabase.from('categorias').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
