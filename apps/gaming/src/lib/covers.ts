// Known games or non-Steam / recent Steam titles where default header.jpg returns 404
export const KNOWN_GAME_COVERS: Record<string, string> = {
  // Wuthering Waves (Steam 3513350)
  '3513350': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3513350/e8eba9795ee09675873ba60232a7ddcc4f222ad9/header.jpg',
  'wuthering waves': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3513350/e8eba9795ee09675873ba60232a7ddcc4f222ad9/header.jpg',
}

/**
 * Returns prioritized URL for game cover, checking known exceptions
 */
export function getGameCoverUrl(appId?: number | string, name?: string): string {
  if (appId && KNOWN_GAME_COVERS[String(appId)]) {
    return KNOWN_GAME_COVERS[String(appId)]
  }

  if (name && KNOWN_GAME_COVERS[name.toLowerCase().trim()]) {
    return KNOWN_GAME_COVERS[name.toLowerCase().trim()]
  }

  if (appId && Number(appId) > 0) {
    return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`
  }

  return ''
}

/**
 * Fallback candidate URLs in case primary header fails
 */
export function getGameFallbackUrls(appId?: number | string, iconUrl?: string): string[] {
  const fallbacks: string[] = []
  if (!appId || Number(appId) <= 0) return fallbacks

  // 1. Akamaihd alternative mirror
  fallbacks.push(`https://steamcdn-a.akamaihd.net/steam/apps/${appId}/header.jpg`)
  // 2. Steam capsule asset
  fallbacks.push(`https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/capsule_616x353.jpg`)
  // 3. Steam community icon
  if (iconUrl) {
    fallbacks.push(iconUrl)
  }

  return fallbacks
}
