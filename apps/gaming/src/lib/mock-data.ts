import { SteamGame, SteamPlayerSummary, GamingStats } from '@/types'

export const MOCK_PLAYER_SUMMARY: SteamPlayerSummary = {
  steamId: '76561198000000000',
  personaName: 'xSupeFly',
  profileUrl: 'https://steamcommunity.com/id/xsupefly',
  avatarUrl: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
  personaState: 1, // Online
  gameExtraInfo: 'DayZ', // Currently playing DayZ
  gameId: '221100',
  lastLogoff: Math.floor(Date.now() / 1000) - 3600,
}

export const MOCK_GAMES: SteamGame[] = [
  {
    appId: 221100,
    name: 'DayZ',
    playtimeForeverMinutes: 168420, // ~2807 hours
    playtime2WeeksMinutes: 1420, // ~23 hours
    headerImageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/221100/header.jpg',
  },
  {
    appId: 252490,
    name: 'Rust',
    playtimeForeverMinutes: 82400, // ~1373 hours
    playtime2WeeksMinutes: 0,
    headerImageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg',
  },
  {
    appId: 730,
    name: 'Counter-Strike 2',
    playtimeForeverMinutes: 64200, // ~1070 hours
    playtime2WeeksMinutes: 320,
    headerImageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg',
  },
  {
    appId: 108600,
    name: "Project Zomboid",
    playtimeForeverMinutes: 14500, // ~241 hours
    playtime2WeeksMinutes: 180,
    headerImageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/108600/header.jpg',
  },
  {
    appId: 294100,
    name: 'RimWorld',
    playtimeForeverMinutes: 28400, // ~473 hours
    playtime2WeeksMinutes: 0,
    headerImageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/294100/header.jpg',
  },
  {
    appId: 1091500,
    name: 'Cyberpunk 2077',
    playtimeForeverMinutes: 7200, // ~120 hours
    playtime2WeeksMinutes: 0,
    headerImageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg',
  },
]

export const MOCK_GAMING_STATS: GamingStats = {
  totalGames: 148,
  totalPlaytimeHours: 5820,
  recentPlaytimeHours: 32.5,
  topGame: {
    name: 'DayZ',
    hours: 2807,
  },
}
