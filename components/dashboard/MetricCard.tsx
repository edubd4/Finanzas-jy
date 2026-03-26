import { cn } from '@/lib/utils'

interface MetricCardProps {
  titulo: string
  valor: string
  descripcion?: string
  colorClase?: string
  icono?: React.ReactNode
}

export function MetricCard({
  titulo,
  valor,
  descripcion,
  colorClase = 'text-jy-text',
  icono,
}: MetricCardProps) {
  return (
    <div className="bg-jy-card rounded-xl p-5 flex flex-col gap-2 border border-white/5">
      <div className="flex items-center justify-between">
        <p className="text-jy-secondary text-sm font-medium">{titulo}</p>
        {icono && <span className="text-jy-secondary">{icono}</span>}
      </div>
      <p className={cn('text-2xl font-display font-semibold', colorClase)}>
        {valor}
      </p>
      {descripcion && (
        <p className="text-jy-secondary text-xs">{descripcion}</p>
      )}
    </div>
  )
}
