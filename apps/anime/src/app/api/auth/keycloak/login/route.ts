import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const keycloakUrl = process.env.KEYCLOAK_URL || 'https://auth.xflasar.com'
  const realm = process.env.KEYCLOAK_REALM || 'xflasar'
  const clientId = process.env.KEYCLOAK_CLIENT_ID || 'anime-client'
  
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host
  const proto = request.headers.get('x-forwarded-proto') === 'https' || !host.includes('localhost') ? 'https' : 'http'
  const origin = `${proto}://${host}`

  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/'
  const redirectUri = `${origin}/api/auth/keycloak/callback?returnTo=${encodeURIComponent(returnTo)}`

  const authUrl = new URL(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth`)
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid profile email roles')
  authUrl.searchParams.set('redirect_uri', redirectUri)

  return NextResponse.redirect(authUrl.toString())
}
