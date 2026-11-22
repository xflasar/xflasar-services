import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const keycloakUrl = process.env.KEYCLOAK_URL || 'https://auth.xflasar.com'
  const realm = process.env.KEYCLOAK_REALM || 'xflasar'
  const clientId = process.env.KEYCLOAK_CLIENT_ID || 'anime-client'
  
  const returnTo = request.nextUrl.searchParams.get('returnTo') || '/'
  const redirectUri = `${request.nextUrl.origin}/api/auth/keycloak/callback?returnTo=${encodeURIComponent(returnTo)}`

  const authUrl = new URL(`${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth`)
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid profile email roles')
  authUrl.searchParams.set('redirect_uri', redirectUri)

  return NextResponse.redirect(authUrl.toString())
}
