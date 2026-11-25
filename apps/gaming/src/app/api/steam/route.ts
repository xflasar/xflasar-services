import { NextResponse } from 'next/server'
import { MOCK_PLAYER_SUMMARY, MOCK_GAMES, MOCK_GAMING_STATS } from '@/lib/mock-data'
import { getGameCoverUrl } from '@/lib/covers'

export async function GET() {
  const apiKey = process.env.STEAM_API_KEY
  const steamId = process.env.STEAM_ID64 || process.env.STEAM_ID

  // If Steam credentials are not configured, return fallback mock data
  if (!apiKey || !steamId) {
    console.warn('[Steam API] Missing STEAM_API_KEY or STEAM_ID/STEAM_ID64 in env. Falling back to mock data.')
    return NextResponse.json({
      success: true,
      isMock: true,
      player: MOCK_PLAYER_SUMMARY,
      games: MOCK_GAMES,
      stats: MOCK_GAMING_STATS,
    })
  }

  try {
    const fetchOptions: RequestInit = {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    }

    const [resSummary, resGames, resRecent] = await Promise.all([
      fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`,
        fetchOptions
      ),
      fetch(
        `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`,
        fetchOptions
      ),
      fetch(
        `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`,
        fetchOptions
      ),
    ])

    if (!resSummary.ok || !resGames.ok) {
      console.error(
        `[Steam API] Steam responded with error status. Summary: ${resSummary.status}, Games: ${resGames.status}`
      )
    }

    const [dataSummary, dataGames, dataRecent] = await Promise.all([
      resSummary.ok ? (resSummary.json().catch(() => ({})) as Promise<any>) : Promise.resolve({} as any),
      resGames.ok ? (resGames.json().catch(() => ({})) as Promise<any>) : Promise.resolve({} as any),
      resRecent.ok ? (resRecent.json().catch(() => ({})) as Promise<any>) : Promise.resolve({} as any),
    ])

    // Map player summary profile
    const rawPlayer = dataSummary?.response?.players?.[0]
    const player = rawPlayer
      ? {
          steamId: rawPlayer.steamid,
          personaName: rawPlayer.personaname,
          profileUrl: rawPlayer.profileurl,
          avatarUrl: rawPlayer.avatarfull || rawPlayer.avatarmedium,
          personaState: rawPlayer.personastate ?? 0,
          gameExtraInfo: rawPlayer.gameextrainfo,
          gameId: rawPlayer.gameid,
          lastLogoff: rawPlayer.lastlogoff,
        }
      : MOCK_PLAYER_SUMMARY

    // Build map of recent 2-week playtime (appId -> minutes)
    const recentMap = new Map<number, number>()
    const recentGamesRaw = dataRecent?.response?.games || []
    for (const g of recentGamesRaw) {
      recentMap.set(g.appid, g.playtime_2weeks || 0)
    }

    // Map owned games library
    const rawGames: any[] = dataGames?.response?.games || []
    const games = rawGames.map((g) => ({
      appId: g.appid,
      name: g.name,
      playtimeForeverMinutes: g.playtime_forever || 0,
      playtime2WeeksMinutes: recentMap.get(g.appid) || g.playtime_2weeks || 0,
      imgIconUrl: g.img_icon_url
        ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
        : undefined,
      headerImageUrl: getGameCoverUrl(g.appid, g.name),
    }))

    // Calculate aggregated stats
    const totalPlaytimeMinutes = games.reduce(
      (acc, curr) => acc + curr.playtimeForeverMinutes,
      0
    )
    const recentPlaytimeMinutes = recentGamesRaw.reduce(
      (acc: number, curr: any) => acc + (curr.playtime_2weeks || 0),
      0
    )

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

    // Fetch achievements for top played games dynamically from Steam
    const topGamesForAchievements = sortedByTime.slice(0, 3)
    let rareAchievements: any[] = []

    try {
      const achPromises = topGamesForAchievements.map(async (tg) => {
        const [resPlayerAch, resGlobalPerc, resSchema] = await Promise.all([
          fetch(
            `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${tg.appId}&key=${apiKey}&steamid=${steamId}&l=english`,
            fetchOptions
          ).catch(() => null),
          fetch(
            `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid=${tg.appId}&format=json`,
            fetchOptions
          ).catch(() => null),
          fetch(
            `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${apiKey}&appid=${tg.appId}&l=english`,
            fetchOptions
          ).catch(() => null),
        ])

        if (!resPlayerAch?.ok || !resGlobalPerc?.ok) return []

        const [dataPlayer, dataGlobal, dataSchema] = await Promise.all([
          resPlayerAch.json().catch(() => ({})),
          resGlobalPerc.json().catch(() => ({})),
          resSchema?.ok ? resSchema.json().catch(() => ({})) : Promise.resolve({}),
        ])

        const unlocked = (dataPlayer?.playerstats?.achievements || []).filter(
          (a: any) => a.achieved === 1
        )
        const globalPercMap = new Map<string, number>()
        for (const gp of dataGlobal?.achievementpercentages?.achievements || []) {
          globalPercMap.set(gp.name, Number(Number(gp.percent).toFixed(1)))
        }

        const schemaMap = new Map<string, { displayName: string; description: string; icon: string }>()
        for (const sa of dataSchema?.game?.availableGameStats?.achievements || []) {
          schemaMap.set(sa.name, {
            displayName: sa.displayName || sa.name,
            description: sa.description || '',
            icon: sa.icon,
          })
        }

        return unlocked.map((u: any) => {
          const schema = schemaMap.get(u.apiname)
          return {
            apiName: u.apiname,
            name: schema?.displayName || u.apiname,
            description: schema?.description || '',
            icon: schema?.icon || tg.headerImageUrl,
            gameName: tg.name,
            gameAppId: tg.appId,
            unlockedAt: u.unlocktime,
            rarityPercent: globalPercMap.get(u.apiname) ?? 100,
          }
        })
      })

      const allUnlockedResults = await Promise.all(achPromises)
      rareAchievements = allUnlockedResults
        .flat()
        .filter((a) => a.rarityPercent !== undefined)
        .sort((a, b) => a.rarityPercent - b.rarityPercent)
        .slice(0, 4)
    } catch (achErr) {
      console.warn('[Steam API] Failed to fetch live achievements, continuing:', achErr)
    }

    return NextResponse.json({
      success: true,
      isMock: false,
      player,
      games,
      stats,
      rareAchievements: rareAchievements.length > 0 ? rareAchievements : undefined,
    })
  } catch (error: any) {
    console.error('[Steam API] Failed to fetch Steam data:', error)
    return NextResponse.json({
      success: true,
      isMock: true,
      error: error?.message || 'Failed to fetch Steam API',
      player: MOCK_PLAYER_SUMMARY,
      games: MOCK_GAMES,
      stats: MOCK_GAMING_STATS,
    })
  }
}
