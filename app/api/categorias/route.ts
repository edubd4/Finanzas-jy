import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createServiceRoleClient } from '@/lib/supabase/server'
import { createCategoriaSchema } from '@/lib/schemas/categorias'

// GET /api/categorias?tipo=INGRESO (opcional — filtra por tipo)
export async function GET(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const tipo = searchParams.get('tipo')

  const supabase = await createServiceRoleClient()

  let query = supabase
    .from('categorias')
    .select('*')
    .eq('usuario_id', user.id)
    .eq('estado', 'ACTIVA')
    .order('nombre')

  if (tipo) {
    query = query.or(`tipo.eq.${tipo},tipo.eq.TODOS`)
  }

  const { data, error } = await query

  if (error) {
    console.error('GET /api/categorias error:', error)
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// POST /api/categorias
export async function POST(req: NextRequest) {
  const authClient = await createServerClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const parsed = createCategoriaSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createServiceRoleClient()

  const { data, error } = await supabase
    .from('categorias')
    .insert({
      usuario_id: user.id,
      nombre: parsed.data.nombre,
      tipo: parsed.data.tipo,
      estado: 'ACTIVA',
    })
    .select()
    .single()

  if (error) {
    console.error('POST /api/categorias error:', error)
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
