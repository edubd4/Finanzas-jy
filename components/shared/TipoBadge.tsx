import { TIPO_BG, TIPO_LABEL } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface TipoBadgeProps {
  tipo: string
  className?: string
}

export function TipoBadge({ tipo, className }: TipoBadgeProps) {
  const bg = TIPO_BG[tipo as keyof typeof TIPO_BG] ?? 'bg-jy-input text-jy-secondary'
  const label = TIPO_LABEL[tipo as keyof typeof TIPO_LABEL] ?? tipo

  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-semibold uppercase tracking-wider',
        bg,
        className
      )}
    >
      {label}
    </span>
  )
}
