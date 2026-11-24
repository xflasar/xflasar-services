import { NextResponse } from 'next/server'

export interface GitHubActivityData {
  latestCommit?: {
    repo: string
    repoUrl: string
    message: string
    sha: string
    timeAgo: string
    committedAt: string
  }
  publicRepos: number
  followers: number
}

function formatRelativeTime(dateString: string): string {
  const now = Date.now()
  const date = new Date(dateString).getTime()
  const diffSeconds = Math.max(0, Math.floor((now - date) / 1000))

  if (diffSeconds < 60) return 'just now'
  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `${diffDays}d ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

export async function GET() {
  try {
    const headers: Record<string, string> = {
      'User-Agent': 'xflasar-portfolio',
      Accept: 'application/vnd.github.v3+json',
    }

    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
    }

    // Cache requests for 5 minutes (300s) on server side
    const fetchOptions: RequestInit = {
      headers,
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(6000),
    }

    const [userRes, eventsRes] = await Promise.all([
      fetch('https://api.github.com/users/xflasar', fetchOptions).catch(() => null),
      fetch('https://api.github.com/users/xflasar/events/public?per_page=10', fetchOptions).catch(() => null),
    ])

    const userData = userRes && userRes.ok ? await userRes.json().catch(() => null) : null
    const eventsData = eventsRes && eventsRes.ok ? await eventsRes.json().catch(() => []) : []

    let latestCommit: GitHubActivityData['latestCommit'] = undefined

    if (Array.isArray(eventsData)) {
      // Find latest PushEvent (commits array can be empty in public events payload, so check head or commits)
      const pushEvent = eventsData.find((ev: any) => ev.type === 'PushEvent')
      if (pushEvent) {
        const repoFullName = pushEvent.repo?.name || 'xflasar'
        const shortRepo = repoFullName.includes('/') ? repoFullName.split('/')[1] : repoFullName
        
        // 1. Try to get message from payload.commits
        let commitMsg = ''
        let commitSha = ''
        if (pushEvent.payload?.commits && pushEvent.payload.commits.length > 0) {
          const last = pushEvent.payload.commits[pushEvent.payload.commits.length - 1]
          commitMsg = last.message ? last.message.split('\n')[0] : ''
          commitSha = last.sha ? last.sha.substring(0, 7) : ''
        }

        // 2. If commits array is omitted in events feed, use head SHA
        if (!commitSha && pushEvent.payload?.head) {
          commitSha = pushEvent.payload.head.substring(0, 7)
        }

        // 3. Optional: fetch commit message if missing
        if (!commitMsg && pushEvent.payload?.head) {
          try {
            const commitRes = await fetch(
              `https://api.github.com/repos/${repoFullName}/commits/${pushEvent.payload.head}`,
              { headers, next: { revalidate: 3600 }, signal: AbortSignal.timeout(3000) }
            )
            if (commitRes.ok) {
              const commitJson = await commitRes.json()
              commitMsg = commitJson?.commit?.message ? commitJson.commit.message.split('\n')[0] : ''
            }
          } catch {}
        }

        latestCommit = {
          repo: shortRepo,
          repoUrl: `https://github.com/${repoFullName}`,
          message: commitMsg || 'Recent update',
          sha: commitSha,
          timeAgo: formatRelativeTime(pushEvent.created_at),
          committedAt: pushEvent.created_at,
        }
      }
    }

    const result: GitHubActivityData = {
      latestCommit,
      publicRepos: userData?.public_repos || 0,
      followers: userData?.followers || 0,
    }

    return NextResponse.json({ success: true, data: result }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch (error: any) {
    console.error('[GitHub API Error]:', error?.message)
    return NextResponse.json({
      success: false,
      data: {
        publicRepos: 0,
        followers: 0,
      },
    })
  }
}
