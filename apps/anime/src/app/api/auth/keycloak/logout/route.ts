import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  cookieStore.delete('kc_token')
  cookieStore.delete('admin_secret')

  const keycloakUrl = process.env.KEYCLOAK_URL || 'https://auth.xflasar.com'
  const realm = process.env.KEYCLOAK_REALM || 'xflasar'
  const postLogoutRedirect = request.nextUrl.origin

  const logoutUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirect)}`

  return NextResponse.redirect(logoutUrl)
}
