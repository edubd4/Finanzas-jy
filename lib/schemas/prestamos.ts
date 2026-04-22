import { z } from 'zod'

export const createPrestamoSchema = z.object({
  tipo: z.enum(['acreedor', 'deudor']),
  contraparte: z.string().min(1, 'Contraparte requerida').max(100),
  descripcion: z.string().max(255).optional(),
  monto_total: z.number().positive('El monto debe ser mayor a 0'),
  cantidad_cuotas: z.number().int().positive('Mínimo 1 cuota'),
  fecha_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
})

export const updatePrestamoSchema = createPrestamoSchema.partial()

export type CreatePrestamo = z.infer<typeof createPrestamoSchema>
export type UpdatePrestamo = z.infer<typeof updatePrestamoSchema>
