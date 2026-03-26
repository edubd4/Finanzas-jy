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
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/',               label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/movimientos',    label: 'Movimientos',  icon: List },
  { href: '/ingresos',       label: 'Ingresos',     icon: TrendingUp },
  { href: '/egresos',        label: 'Egresos',      icon: TrendingDown },
  { href: '/inversiones',    label: 'Inversiones',  icon: LineChart },
  { href: '/prestamos',      label: 'Préstamos',    icon: Handshake },
  { href: '/configuracion',  label: 'Configuración',icon: Settings },
]

interface SidebarProps {
  userName: string
  onNavigate?: () => void
}

export function Sidebar({ userName, onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="flex flex-col h-full bg-jy-card border-r border-jy-input px-4 py-6">
      {/* Logo + usuario */}
      <div className="mb-8 px-2">
        <h1 className="font-display text-xl font-bold text-jy-accent">FinanzasJY</h1>
        <p className="text-jy-secondary text-xs mt-1 truncate">{userName}</p>
      </div>

      {/* Navegación */}
      <ul className="flex-1 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                pathname === href
                  ? 'bg-jy-accent/20 text-jy-accent font-medium'
                  : 'text-jy-secondary hover:text-jy-text hover:bg-jy-input'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-jy-secondary hover:text-jy-red hover:bg-jy-input transition-colors"
      >
        <LogOut className="h-4 w-4 flex-shrink-0" />
        Cerrar sesión
      </button>
    </nav>
  )
}
