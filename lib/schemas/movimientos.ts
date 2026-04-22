import { z } from 'zod'
import { TIPO_MOVIMIENTO } from '@/lib/constants'

export const createMovimientoSchema = z.object({
  tipo: z.enum(Object.values(TIPO_MOVIMIENTO) as [string, ...string[]]),
  monto: z.number().positive('El monto debe ser mayor a 0'),
  categoria_id: z.string().uuid('Categoría requerida'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  descripcion: z.string().max(255).optional(),
  // Inversiones: campos opcionales
  fecha_entrada: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  fecha_alerta_salida: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  monto_esperado: z.number().positive().optional().nullable(),
})

export const updateMovimientoSchema = createMovimientoSchema.partial()

export type CreateMovimiento = z.infer<typeof createMovimientoSchema>
export type UpdateMovimiento = z.infer<typeof updateMovimientoSchema>
