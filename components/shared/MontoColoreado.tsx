import { TIPO_COLOR, TIPO_SIGNO } from '@/lib/constants'
import { formatPesos, cn } from '@/lib/utils'

export function MontoColoreado({
  monto,
  tipo,
  className,
}: {
  monto: number
  tipo: string
  className?: string
}) {
  const color = TIPO_COLOR[tipo as keyof typeof TIPO_COLOR] ?? 'text-jy-text'
  const signo = TIPO_SIGNO[tipo as keyof typeof TIPO_SIGNO] ?? ''

  return (
    <span className={cn('font-semibold tabular-nums', color, className)}>
      {signo}{formatPesos(monto)}
    </span>
  )
}
