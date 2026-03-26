'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Credenciales incorrectas. Intentá de nuevo.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-jy-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo / título */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-jy-accent">FinanzasJY</h1>
          <p className="text-jy-secondary text-sm mt-2">Gestión financiera personal</p>
        </div>

        {/* Card de login */}
        <div className="bg-jy-card border border-jy-input rounded-xl p-8">
          <h2 className="text-jy-text font-semibold text-lg mb-6">Iniciar sesión</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-jy-secondary text-sm mb-1.5" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-jy-input border border-jy-input rounded-lg px-3 py-2.5 text-jy-text text-sm placeholder-jy-secondary focus:outline-none focus:border-jy-accent focus:ring-1 focus:ring-jy-accent transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-jy-secondary text-sm mb-1.5" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-jy-input border border-jy-input rounded-lg px-3 py-2.5 text-jy-text text-sm placeholder-jy-secondary focus:outline-none focus:border-jy-accent focus:ring-1 focus:ring-jy-accent transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-jy-red text-sm bg-jy-red/10 border border-jy-red/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-jy-accent hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2.5 text-sm transition-colors mt-2"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
