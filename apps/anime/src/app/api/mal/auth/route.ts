import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { generateCodeVerifier } from '@/lib/mal-auth'

export async function GET(request: NextRequest) {
  const clientId = process.env.MAL_CLIENT_ID
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host
  const proto = request.headers.get('x-forwarded-proto') === 'https' || !host.includes('localhost') ? 'https' : 'http'
  const origin = `${proto}://${host}`
  const redirectUri = process.env.MAL_REDIRECT_URI || `${origin}/api/mal/callback`

  if (!clientId) {
    return NextResponse.json(
      { error: 'Missing MAL_CLIENT_ID in environment variables' },
      { status: 500 }
    )
  }

  // Generate PKCE code verifier (128 chars)
  const codeVerifier = generateCodeVerifier(128)
  const state = Math.random().toString(36).substring(2, 15)

  // Store code_verifier and state in secure HTTP-only cookies
  const cookieStore = await cookies()
  cookieStore.set('mal_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15, // 15 minutes
    path: '/',
  })

  cookieStore.set('mal_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15,
    path: '/',
  })

  // MAL authorization URL with PKCE (plain)
  const malAuthUrl = new URL('https://myanimelist.net/v1/oauth2/authorize')
  malAuthUrl.searchParams.set('response_type', 'code')
  malAuthUrl.searchParams.set('client_id', clientId)
  malAuthUrl.searchParams.set('code_challenge', codeVerifier)
  malAuthUrl.searchParams.set('code_challenge_method', 'plain')
  malAuthUrl.searchParams.set('state', state)
  malAuthUrl.searchParams.set('redirect_uri', redirectUri)

  return NextResponse.redirect(malAuthUrl.toString())
}
