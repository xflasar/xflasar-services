import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const idToken = cookieStore.get('kc_id_token')?.value
  cookieStore.delete('kc_token')
  cookieStore.delete('kc_id_token')
  cookieStore.delete('admin_secret')

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host
  const proto = request.headers.get('x-forwarded-proto') === 'https' || !host.includes('localhost') ? 'https' : 'http'
  const origin = `${proto}://${host}`

  const keycloakUrl = process.env.KEYCLOAK_URL || 'https://auth.xflasar.com'
  const realm = process.env.KEYCLOAK_REALM || 'xflasar'
  const postLogoutRedirect = origin

  const logoutUrl = new URL(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout`)
  logoutUrl.searchParams.set('post_logout_redirect_uri', postLogoutRedirect)
  if (idToken) {
    logoutUrl.searchParams.set('id_token_hint', idToken)
  }

  return NextResponse.redirect(logoutUrl.toString())
}
