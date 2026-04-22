import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { cerrarInversionSchema } from '@/lib/schemas/inversiones'

// POST /api/inversiones/[id]/cerrar
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const parsed = cerrarInversionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data: inv, error: errInv } = await supabase
    .from('movimientos')
    .select('id, jy_id, created_by, tipo, monto, fecha_entrada, estado_inversion')
    .eq('id', params.id)
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .single()

  if (errInv || !inv) {
    return NextResponse.json({ error: 'Inversión no encontrada' }, { status: 404 })
  }

  if (inv.tipo !== 'INVERSION') {
    return NextResponse.json({ error: 'El movimiento no es una inversión' }, { status: 400 })
  }

  if (inv.estado_inversion === 'CERRADA') {
    return NextResponse.json({ error: 'La inversión ya está cerrada' }, { status: 400 })
  }

  const { error } = await supabase
    .from('movimientos')
    .update({
      estado_inversion: 'CERRADA',
      monto_final: parsed.data.monto_final,
      fecha_cierre: parsed.data.fecha_cierre,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Error al cerrar inversión' }, { status: 500 })
  }

  const retorno = ((parsed.data.monto_final - Number(inv.monto)) / Number(inv.monto)) * 100

  await supabase.from('historial').insert({
    entidad_tipo: 'movimiento',
    entidad_id: params.id,
    tipo_evento: 'INVERSION_CERRADA',
    descripcion: `Inversión ${inv.jy_id} cerrada — monto final $${parsed.data.monto_final} (retorno ${retorno.toFixed(2)}%)`,
    usuario_id: user.id,
    metadata: {
      monto_inicial: inv.monto,
      monto_final: parsed.data.monto_final,
      porcentaje_retorno: retorno,
    },
  })

  return NextResponse.json({ ok: true, retorno: Number(retorno.toFixed(2)) })
}

// POST reabrir — DELETE sobre la misma ruta
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const supabase = await createServiceRoleClient()

  const { data: inv } = await supabase
    .from('movimientos')
    .select('id, jy_id, created_by, estado_inversion')
    .eq('id', params.id)
    .eq('created_by', user.id)
    .is('deleted_at', null)
    .single()

  if (!inv || inv.estado_inversion !== 'CERRADA') {
    return NextResponse.json({ error: 'Inversión no cerrada' }, { status: 400 })
  }

  await supabase
    .from('movimientos')
    .update({
      estado_inversion: 'ABIERTA',
      monto_final: null,
      fecha_cierre: null,
    })
    .eq('id', params.id)

  await supabase.from('historial').insert({
    entidad_tipo: 'movimiento',
    entidad_id: params.id,
    tipo_evento: 'INVERSION_REABIERTA',
    descripcion: `Inversión ${inv.jy_id} reabierta`,
    usuario_id: user.id,
  })

  return NextResponse.json({ ok: true })
}
