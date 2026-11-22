import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const keycloakToken = cookieStore.get('kc_token')?.value

  // For testing / direct admin bypass via secret env if configured
  const adminSecret = cookieStore.get('admin_secret')?.value
  if (process.env.ADMIN_SECRET && adminSecret === process.env.ADMIN_SECRET) {
    return NextResponse.json({ isAdmin: true, username: 'admin' })
  }

  if (!keycloakToken) {
    return NextResponse.json({ isAdmin: false })
  }

  try {
    // Decode JWT payload without verifying signature on client or verify via Keycloak userinfo
    const parts = keycloakToken.split('.')
    if (parts.length !== 3) {
      return NextResponse.json({ isAdmin: false })
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
    const roles: string[] = payload?.realm_access?.roles || []

    const isAdmin = roles.includes('admin')
    return NextResponse.json({
      isAdmin,
      username: payload.preferred_username || payload.name || 'User',
    })
  } catch (err) {
    return NextResponse.json({ isAdmin: false })
  }
}
