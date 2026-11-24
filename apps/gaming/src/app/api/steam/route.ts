import { NextResponse } from 'next/server'
import { MOCK_PLAYER_SUMMARY, MOCK_GAMES, MOCK_GAMING_STATS } from '@/lib/mock-data'

// =============================================================================
// 🎯 STEAM API INTEGRACE - NÁVOD A ŠABLONA PRO TEBE
// =============================================================================
// Tento endpoint běží na Next.js serveru (`/api/steam`).
//
// Co potřebuješ mít v `.env.local`:
// - STEAM_API_KEY=tve_tajne_steam_api_key (ziskas na https://steamcommunity.com/dev/apikey)
// - STEAM_ID64=tve_17_mistne_steam_id (napr. 76561198xxxxxxxxx)
//
// Jak volat oficiální Steam Web API:
// 1. Live status hráče (avatar, personaName, zda hraje):
//    GET https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}
//    Odpověď: data.response.players[0]
//    - gameextrainfo: název hry, pokud právě hraje
//    - personastate: 0 = offline, 1 = online
//
// 2. Nedávno hrané hry (posledních 14 dní):
//    GET https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json
//
// 3. Všechny hry v knihovně:
//    GET https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json
//
// Tady v této funkci GET můžeš:
// - buď zavolat Steam API přes fetch()
// - nebo (pokud zatím nemáš API klíč) vrátit mock data níže
// =============================================================================

export async function GET() {
  const apiKey = process.env.STEAM_API_KEY
  const steamId = process.env.STEAM_ID64

  // Pokud zatím nemáš nastavený Steam API klíč, vracíme mock data
  if (!apiKey || !steamId) {
    return NextResponse.json({
      success: true,
      isMock: true,
      player: MOCK_PLAYER_SUMMARY,
      games: MOCK_GAMES,
      stats: MOCK_GAMING_STATS,
    })
  }

  try {
    // 1. Paralelní volání všech 3 endpointů přes Promise.all
    const [resSummary, resGames, resRecent] = await Promise.all([
      fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`
      ),
      fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`
      ),
      fetch(
        `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`
      ),
    ])

    const [dataSummary, dataGames, dataRecent] = await Promise.all([
      resSummary.json(),
      resGames.json(),
      resRecent.json(),
    ])

    // 2. Namapování profilu hráče
    const rawPlayer = dataSummary?.response?.players?.[0]
    const player = rawPlayer
      ? {
          steamId: rawPlayer.steamid,
          personaName: rawPlayer.personaname,
          profileUrl: rawPlayer.profileurl,
          avatarUrl: rawPlayer.avatarfull || rawPlayer.avatarmedium,
          personaState: rawPlayer.personastate ?? 0,
          gameExtraInfo: rawPlayer.gameextrainfo, // název hry pokud právě hraje
          gameId: rawPlayer.gameid,
          lastLogoff: rawPlayer.lastlogoff,
        }
      : MOCK_PLAYER_SUMMARY

    // 3. Mapa pro rychlé přiřazení odehraného času za 14 dní (appId -> minuty)
    const recentMap = new Map<number, number>()
    const recentGamesRaw = dataRecent?.response?.games || []
    for (const g of recentGamesRaw) {
      recentMap.set(g.appid, g.playtime_2weeks || 0)
    }

    // 4. Namapování knihovny her
    const rawGames: any[] = dataGames?.response?.games || []
    const games = rawGames.map((g) => ({
      appId: g.appid,
      name: g.name,
      playtimeForeverMinutes: g.playtime_forever || 0,
      playtime2WeeksMinutes: recentMap.get(g.appid) || g.playtime_2weeks || 0,
      imgIconUrl: g.img_icon_url
        ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
        : undefined,
      headerImageUrl: `https://cdn.akamai.steamstatic.com/steam/apps/${g.appid}/header.jpg`,
    }))

    // 5. Výpočet statistik (KPI)
    const totalPlaytimeMinutes = games.reduce(
      (acc, curr) => acc + curr.playtimeForeverMinutes,
      0
    )
    const recentPlaytimeMinutes = recentGamesRaw.reduce(
      (acc: number, curr: any) => acc + (curr.playtime_2weeks || 0),
      0
    )

    // Seřazení pro nalezení nejoblíbenější hry
    const sortedByTime = [...games].sort(
      (a, b) => b.playtimeForeverMinutes - a.playtimeForeverMinutes
    )
    const favoriteGame = sortedByTime[0]
      ? {
          name: sortedByTime[0].name,
          hours: Math.round(sortedByTime[0].playtimeForeverMinutes / 60),
        }
      : undefined

    const stats = {
      totalGames: games.length,
      totalPlaytimeHours: Math.round(totalPlaytimeMinutes / 60),
      recentPlaytimeHours: Number((recentPlaytimeMinutes / 60).toFixed(1)),
      topGame: favoriteGame,
    }

    return NextResponse.json({
      success: true,
      isMock: false,
      player,
      games,
      stats,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
