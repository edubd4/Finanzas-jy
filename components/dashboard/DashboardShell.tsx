'use client'

import { Sidebar } from './Sidebar'

interface DashboardShellProps {
  children: React.ReactNode
  userName?: string
}

export function DashboardShell({ children, userName = '' }: DashboardShellProps) {
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
    </div>
  )
}
