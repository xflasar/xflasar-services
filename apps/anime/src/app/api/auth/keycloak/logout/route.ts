import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const idToken = cookieStore.get('kc_id_token')?.value

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host
  const proto = request.headers.get('x-forwarded-proto') === 'https' || !host.includes('localhost') ? 'https' : 'http'
  const origin = `${proto}://${host}`
  const cookieDomain = !origin.includes('localhost') ? '.xflasar.com' : undefined

  // Delete cookies locally across entire domain and host-only
  cookieStore.set('kc_token', '', { path: '/', domain: cookieDomain, maxAge: 0 })
  cookieStore.set('kc_id_token', '', { path: '/', domain: cookieDomain, maxAge: 0 })
  cookieStore.set('admin_secret', '', { path: '/', domain: cookieDomain, maxAge: 0 })
  cookieStore.set('kc_token', '', { path: '/', maxAge: 0 })
  cookieStore.set('kc_id_token', '', { path: '/', maxAge: 0 })

  const keycloakUrl = process.env.KEYCLOAK_URL || 'https://auth.xflasar.com'
  const realm = process.env.KEYCLOAK_REALM || 'xflasar'
  const postLogoutRedirect = origin

  // Keycloak OIDC: ONLY pass post_logout_redirect_uri if id_token_hint is present.
  // Otherwise Keycloak throws "Missing parameters: id_token_hint".
  if (idToken) {
    const logoutUrl = new URL(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout`)
    logoutUrl.searchParams.set('client_id', 'anime-client')
    logoutUrl.searchParams.set('id_token_hint', idToken)
    logoutUrl.searchParams.set('post_logout_redirect_uri', postLogoutRedirect)
    return NextResponse.redirect(logoutUrl.toString())
  }

  // If no id_token was found, local cookies are already cleared -> return straight home!
  return NextResponse.redirect(origin)
}
