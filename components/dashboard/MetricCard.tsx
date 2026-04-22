import { cn } from '@/lib/utils'

interface MetricCardProps {
  titulo: string
  valor: string
  descripcion?: string
  colorClase?: string
  icono?: React.ReactNode
  delta?: string          // Ej: "+12% vs mes anterior"
  deltaPositivo?: boolean // controla color del delta
}

export function MetricCard({
  titulo,
  valor,
  descripcion,
  colorClase = 'text-jy-text',
  icono,
  delta,
  deltaPositivo,
}: MetricCardProps) {
  return (
    <div className="bg-jy-card rounded-lg p-5 flex flex-col gap-2 border border-jy-border hover:border-jy-accent/40 transition-colors">
      <div className="flex items-center justify-between">
        <p className="text-jy-secondary text-[11px] font-semibold uppercase tracking-wider">
          {titulo}
        </p>
        {icono && <span className="text-jy-secondary">{icono}</span>}
      </div>
      <p className={cn('text-2xl font-display font-bold tnum', colorClase)}>
        {valor}
      </p>
      {delta && (
        <span
          className={cn(
            'inline-flex items-center gap-1 text-[11px] font-medium w-fit px-1.5 py-0.5 rounded',
            deltaPositivo === false
              ? 'text-jy-red bg-jy-red/10'
              : 'text-jy-green bg-jy-green/10'
          )}
        >
          {delta}
        </span>
      )}
      {descripcion && (
        <p className="text-jy-secondary text-xs">{descripcion}</p>
      )}
    </div>
  )
}
