import { Handshake } from 'lucide-react'

export default function PrestamosPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-jy-purple/10">
          <Handshake size={20} className="text-jy-purple" />
        </div>
        <h1 className="text-2xl font-display font-semibold text-jy-text">Préstamos</h1>
      </div>

      <div className="bg-jy-card rounded-xl p-8 border border-white/5 text-center">
        <div className="inline-flex p-4 rounded-full bg-jy-purple/10 mb-4">
          <Handshake size={32} className="text-jy-purple" />
        </div>
        <h2 className="text-jy-text font-semibold text-lg mb-2">Próximamente en Fase 2</h2>
        <p className="text-jy-secondary text-sm max-w-sm mx-auto">
          El módulo de préstamos con gestión de cuotas estará disponible en la siguiente fase del proyecto.
        </p>
      </div>
    </div>
  )
}
