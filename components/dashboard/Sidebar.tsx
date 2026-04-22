'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  List,
  TrendingUp,
  TrendingDown,
  LineChart,
  Handshake,
  Settings,
  LogOut,
  Plus,
  LifeBuoy,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',              label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/movimientos',   label: 'Movimientos',  icon: List },
  { href: '/ingresos',      label: 'Ingresos',     icon: TrendingUp },
  { href: '/egresos',       label: 'Egresos',      icon: TrendingDown },
  { href: '/inversiones',   label: 'Inversiones',  icon: LineChart },
  { href: '/prestamos',     label: 'Préstamos',    icon: Handshake },
  { href: '/configuracion', label: 'Configuración',icon: Settings },
]

interface SidebarProps {
  userName: string
  onNavigate?: () => void
}

export function Sidebar({ userName, onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  // Disparamos un CustomEvent global — el shell mantiene el formulario montado
  const abrirNuevoMovimiento = () => {
    window.dispatchEvent(new CustomEvent('nuevo-movimiento:abrir'))
    onNavigate?.()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="flex flex-col h-full bg-jy-card border-r border-jy-border px-3 py-5">
      {/* Branding */}
      <div className="mb-6 px-2">
        <h1 className="font-display text-lg font-extrabold tracking-tight text-jy-accent">
          FINANCEPRO
        </h1>
        <p className="text-jy-secondary text-[10px] uppercase tracking-widest mt-0.5">
          Trading Edition
        </p>
        <p className="text-jy-secondary text-xs mt-2 truncate">{userName}</p>
      </div>

      {/* CTA Nuevo Movimiento */}
      <button
        onClick={abrirNuevoMovimiento}
        className="flex items-center justify-center gap-2 w-full px-3 py-2.5 mb-5 rounded bg-jy-accent text-jy-bg text-sm font-semibold hover:bg-jy-accent-hi transition-colors"
      >
        <Plus size={15} />
        Nuevo Movimiento
      </button>

      {/* Navegación */}
      <ul className="flex-1 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors',
                  active
                    ? 'bg-jy-accent/10 text-jy-accent font-medium border-l-2 border-jy-accent'
                    : 'text-jy-secondary hover:text-jy-text hover:bg-jy-input border-l-2 border-transparent'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Footer: Soporte + Logout */}
      <div className="mt-4 pt-4 border-t border-jy-border space-y-0.5">
        <a
          href="mailto:eduardo.barreiro93@gmail.com?subject=Soporte%20FinanzasJY"
          className="flex items-center gap-3 px-3 py-2 rounded text-sm text-jy-secondary hover:text-jy-text hover:bg-jy-input transition-colors"
        >
          <LifeBuoy className="h-4 w-4 flex-shrink-0" />
          Soporte
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-jy-secondary hover:text-jy-red hover:bg-jy-input transition-colors"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}
