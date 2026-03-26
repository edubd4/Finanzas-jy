import { z } from 'zod'
import { TIPO_MOVIMIENTO } from '@/lib/constants'

const tiposValidos = ['INGRESO', 'EGRESO', 'GASTO', 'INVERSION', 'PRESTAMO', 'TODOS'] as const

export const createCategoriaSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido').max(100),
  tipo: z.enum(tiposValidos),
})

export const updateCategoriaSchema = createCategoriaSchema.partial().extend({
  estado: z.enum(['ACTIVA', 'INACTIVA']).optional(),
})

export type CreateCategoria = z.infer<typeof createCategoriaSchema>
export type UpdateCategoria = z.infer<typeof updateCategoriaSchema>
