export interface SteamPlayerSummary {
  steamId: string
  personaName: string
  profileUrl: string
  avatarUrl: string
  personaState: number // 0 = Offline, 1 = Online, 2 = Busy, 3 = Away, 4 = Snooze, 5 = Looking to trade, 6 = Looking to play
  gameExtraInfo?: string // Current game name if playing
  gameId?: string
  lastLogoff: number
}

export interface SteamGame {
  appId: number
  name: string
  playtimeForeverMinutes: number // Total playtime in minutes
  playtime2WeeksMinutes?: number // Last 2 weeks playtime
  imgIconUrl?: string
  headerImageUrl: string
}

export interface GamingStats {
  totalGames: number
  totalPlaytimeHours: number
  recentPlaytimeHours: number
  topGame?: {
    name: string
    hours: number
  }
}

export interface HardwareSpec {
  category: 'DESKTOP' | 'LAPTOP'
  name: string
  cpu: string
  gpu: string
  ram: string
  storage: string
  peripherals?: {
    monitors?: string
    mouse?: string
    keyboard?: string
    headset?: string
  }
}

export interface PunotedSummary {
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE'
  activePlayersTracked?: number
  lastUpdated?: string
  topServer?: string
}

export interface RiotProfile {
  riotId: string
  tag: string
  rank?: string
  favoriteChampions?: string[]
}
