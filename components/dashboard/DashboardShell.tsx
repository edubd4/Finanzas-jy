'use client'

import { useState, useEffect } from 'react'
import { Menu, Plus } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { FormularioMovimiento } from '@/components/movimientos/FormularioMovimiento'
import { CurrencyProvider } from '@/lib/currency'

interface DashboardShellProps {
  children: React.ReactNode
  userName?: string
}

export function DashboardShell({ children, userName = '' }: DashboardShellProps) {
  const [formAbierto, setFormAbierto] = useState(false)
  const [sidebarAbierto, setSidebarAbierto] = useState(false)

  useEffect(() => {
    const abrir = () => setFormAbierto(true)
    window.addEventListener('nuevo-movimiento:abrir', abrir)
    return () => window.removeEventListener('nuevo-movimiento:abrir', abrir)
  }, [])

  // Bloquear scroll del body cuando el drawer está abierto en mobile
  useEffect(() => {
    document.body.style.overflow = sidebarAbierto ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarAbierto])

  const handleGuardado = () => {
    window.dispatchEvent(new CustomEvent('movimiento:guardado'))
  }

  return (
    <CurrencyProvider>
      <div className="flex h-screen bg-jy-bg overflow-hidden">

        {/* ── Sidebar desktop (md+) ─────────────────────────────── */}
        <div className="hidden md:block w-56 shrink-0 h-full">
          <Sidebar userName={userName} />
        </div>

        {/* ── Sidebar mobile: overlay drawer ───────────────────── */}
        {sidebarAbierto && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarAbierto(false)}
            />
            <div className="absolute left-0 top-0 h-full w-64 shadow-2xl">
              <Sidebar
                userName={userName}
                onNavigate={() => setSidebarAbierto(false)}
              />
            </div>
          </div>
        )}

        {/* ── Contenido principal ──────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">

          {/* Top bar mobile */}
          <div className="md:hidden sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-jy-card border-b border-jy-border">
            <button
              onClick={() => setSidebarAbierto(true)}
              className="p-1.5 rounded text-jy-secondary hover:text-jy-text hover:bg-jy-input transition-colors"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
            <span className="font-display font-extrabold text-jy-accent tracking-tight">
              FINANCEPRO
            </span>
          </div>

          {/* Contenido de página */}
          <div className="p-4 md:p-6 max-w-7xl mx-auto pb-28 md:pb-6">
            {children}
          </div>
        </main>

        {/* ── FAB mobile: Nuevo Movimiento ─────────────────────── */}
        <button
          onClick={() => setFormAbierto(true)}
          className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3.5 rounded-full bg-jy-accent text-white font-semibold text-sm shadow-xl shadow-jy-accent/30 z-40 active:scale-95 transition-transform"
        >
          <Plus size={16} />
          Nuevo Movimiento
        </button>

        {/* Formulario global */}
        <FormularioMovimiento
          abierto={formAbierto}
          onCerrar={() => setFormAbierto(false)}
          onGuardado={handleGuardado}
        />
      </div>
    </CurrencyProvider>
  )
}
