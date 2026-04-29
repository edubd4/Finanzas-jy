'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface CurrencyOption {
  code: string
  label: string
  locale: string
  symbol: string
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'ARS', label: 'Peso argentino',  locale: 'es-AR', symbol: '$'  },
  { code: 'USD', label: 'Dólar (USD)',      locale: 'en-US', symbol: 'US$'},
  { code: 'EUR', label: 'Euro (EUR)',       locale: 'es-ES', symbol: '€'  },
  { code: 'BRL', label: 'Real brasileño',   locale: 'pt-BR', symbol: 'R$' },
  { code: 'CLP', label: 'Peso chileno',     locale: 'es-CL', symbol: '$'  },
  { code: 'UYU', label: 'Peso uruguayo',    locale: 'es-UY', symbol: '$U' },
]

const STORAGE_KEY = 'finanzas-jy:currency'
const DEFAULT_CODE = 'ARS'

interface CurrencyCtx {
  currency: CurrencyOption
  setCurrencyCode: (code: string) => void
  fmt: (amount: number) => string
}

const CurrencyContext = createContext<CurrencyCtx | null>(null)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<string>(DEFAULT_CODE)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && CURRENCIES.find(c => c.code === stored)) setCode(stored)
  }, [])

  const setCurrencyCode = useCallback((newCode: string) => {
    setCode(newCode)
    localStorage.setItem(STORAGE_KEY, newCode)
  }, [])

  const currency = CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0]

  const fmt = useCallback((amount: number) => {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: currency.code === 'ARS' || currency.code === 'CLP' ? 0 : 2,
    }).format(amount)
  }, [currency])

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode, fmt }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
