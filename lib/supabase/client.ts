import { createBrowserClient } from '@supabase/ssr'

// Cliente browser — solo para auth, nunca para queries sensibles
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
