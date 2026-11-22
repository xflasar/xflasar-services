import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const returnTo = searchParams.get('returnTo') || '/'

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url))
  }

  const keycloakUrl = process.env.KEYCLOAK_URL || 'https://auth.xflasar.com'
  const realm = process.env.KEYCLOAK_REALM || 'xflasar'
  const clientId = process.env.KEYCLOAK_CLIENT_ID || 'anime-client'
  
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host
  const proto = request.headers.get('x-forwarded-proto') || (request.url.startsWith('https') ? 'https' : 'http')
  const origin = `${proto}://${host}`

  const redirectUri = `${origin}/api/auth/keycloak/callback?returnTo=${encodeURIComponent(returnTo)}`

  try {
    const tokenUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
    })

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Keycloak token exchange error:', errText)
      return NextResponse.redirect(new URL('/?error=token_failed', request.url))
    }

    const json = await res.json()
    const cookieStore = await cookies()

    cookieStore.set('kc_token', json.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: json.expires_in || 3600,
      path: '/',
    })

    return NextResponse.redirect(new URL(returnTo, request.url))
  } catch (err: any) {
    console.error('Keycloak login error:', err)
    return NextResponse.redirect(new URL('/?error=' + encodeURIComponent(err.message), request.url))
  }
}
