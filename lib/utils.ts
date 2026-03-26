import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatear moneda — ARS con separador de miles
export function formatPesos(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Formatear fecha en DD/MM/YYYY
export function formatFecha(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Nombre del mes en español
export function formatMes(date: Date): string {
  return date.toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  })
}
