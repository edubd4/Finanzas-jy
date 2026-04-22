import { z } from 'zod'

export const createInversionSchema = z.object({
  monto: z.number().positive('Monto debe ser mayor a 0'),
  categoria_id: z.string().uuid('Categoría requerida'),
  fecha_entrada: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  fecha_alerta_salida: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  monto_esperado: z.number().positive().optional().nullable(),
  descripcion: z.string().max(255).optional(),
})

export const updateInversionSchema = createInversionSchema.partial()

export const cerrarInversionSchema = z.object({
  monto_final: z.number().positive('Monto final debe ser mayor a 0'),
  fecha_cierre: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
})

export type CreateInversion = z.infer<typeof createInversionSchema>
export type CerrarInversion = z.infer<typeof cerrarInversionSchema>
