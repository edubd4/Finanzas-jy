'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { FormularioMovimiento } from '@/components/movimientos/FormularioMovimiento'

interface DashboardShellProps {
  children: React.ReactNode
  userName?: string
}

export function DashboardShell({ children, userName = '' }: DashboardShellProps) {
  const [formAbierto, setFormAbierto] = useState(false)

  useEffect(() => {
    const abrir = () => setFormAbierto(true)
    window.addEventListener('nuevo-movimiento:abrir', abrir)
    return () => window.removeEventListener('nuevo-movimiento:abrir', abrir)
  }, [])

  // Cuando se guarda, las páginas que les interese recargan escuchando este evento
  const handleGuardado = () => {
    window.dispatchEvent(new CustomEvent('movimiento:guardado'))
  }

  return (
    <div className="flex h-screen bg-jy-bg overflow-hidden">
      {/* Sidebar fijo */}
      <div className="w-56 shrink-0 h-full">
        <Sidebar userName={userName} />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Formulario global disparado desde el sidebar */}
      <FormularioMovimiento
        abierto={formAbierto}
        onCerrar={() => setFormAbierto(false)}
        onGuardado={handleGuardado}
      />
    </div>
  )
}
