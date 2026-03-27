import { TIPO_COLOR, TIPO_LABEL } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface TipoBadgeProps {
  tipo: string
  className?: string
}

export function TipoBadge({ tipo, className }: TipoBadgeProps) {
  const color = TIPO_COLOR[tipo as keyof typeof TIPO_COLOR] ?? 'text-jy-secondary'
  const label = TIPO_LABEL[tipo as keyof typeof TIPO_LABEL] ?? tipo

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5',
        color,
        className
      )}
    >
      {label}
    </span>
  )
}
