import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { exchangeCodeForTokens } from '@/lib/mal-auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host
  const proto = request.headers.get('x-forwarded-proto') === 'https' || !host.includes('localhost') ? 'https' : 'http'
  const origin = `${proto}://${host}`

  if (error) {
    return NextResponse.redirect(new URL('/?mal_error=' + encodeURIComponent(error), origin))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?mal_error=no_code', origin))
  }

  const cookieStore = await cookies()
  const savedState = cookieStore.get('mal_auth_state')?.value
  const codeVerifier = cookieStore.get('mal_code_verifier')?.value

  if (!codeVerifier) {
    return NextResponse.redirect(new URL('/?mal_error=missing_verifier', origin))
  }

  if (savedState && state && savedState !== state) {
    return NextResponse.redirect(new URL('/?mal_error=state_mismatch', origin))
  }

  const clientId = process.env.MAL_CLIENT_ID
  const clientSecret = process.env.MAL_CLIENT_SECRET
  const redirectUri = process.env.MAL_REDIRECT_URI || `${origin}/api/mal/callback`

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/?mal_error=server_misconfigured', origin))
  }

  try {
    const tokens = await exchangeCodeForTokens(code, codeVerifier, clientId, clientSecret, redirectUri)

    const isProd = process.env.NODE_ENV === 'production'
    const cookieDomain = isProd && !origin.includes('localhost') ? '.xflasar.com' : undefined

    // Store access_token and refresh_token in secure HTTP-only cookies
    cookieStore.set('mal_access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: tokens.expires_in,
      path: '/',
      domain: cookieDomain,
    })

    if (tokens.refresh_token) {
      cookieStore.set('mal_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 31, // 31 days
        path: '/',
        domain: cookieDomain,
      })
    }

    // Clean up temporary verifier cookies
    cookieStore.delete('mal_code_verifier')
    cookieStore.delete('mal_auth_state')

    return NextResponse.redirect(new URL('/?mal_connected=true', origin))
  } catch (err: any) {
    console.error('Error exchanging MAL code:', err)
    return NextResponse.redirect(new URL('/?mal_error=' + encodeURIComponent(err.message), origin))
  }
}
