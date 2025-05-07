import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Utiliser getUser() pour une vérification authentifiée auprès du serveur Supabase
  const { data: { user } } = await supabase.auth.getUser()

  // Veille à récupérer la session aussi pour rafraîchir les tokens si nécessaire
  await supabase.auth.getSession()

  // Vérification d'auth en utilisant user au lieu de session
  if (!user && request.nextUrl.pathname.startsWith('/pro')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}