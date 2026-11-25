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

    // Cache requests for 2 minutes (120s)
    const fetchOptions: RequestInit = {
      headers,
      next: { revalidate: 120 },
      signal: AbortSignal.timeout(6000),
    }

    // Fetch user profile and recently pushed repos simultaneously
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/xflasar', fetchOptions).catch(() => null),
      fetch('https://api.github.com/users/xflasar/repos?sort=pushed&per_page=5', fetchOptions).catch(() => null),
    ])

    const userData = userRes && userRes.ok ? await userRes.json().catch(() => null) : null
    const reposData = reposRes && reposRes.ok ? await reposRes.json().catch(() => []) : []

    let latestCommit: GitHubActivityData['latestCommit'] = undefined

    if (Array.isArray(reposData) && reposData.length > 0) {
      const topRepo = reposData[0]
      const repoFullName = topRepo.full_name || `xflasar/${topRepo.name}`
      const shortRepo = topRepo.name
      const defaultBranch = topRepo.default_branch || 'main'

      // Fetch the actual latest commit from the top recently pushed repo
      try {
        const commitRes = await fetch(
          `https://api.github.com/repos/${repoFullName}/commits/${defaultBranch}`,
          { headers, next: { revalidate: 120 }, signal: AbortSignal.timeout(4000) }
        )
        if (commitRes.ok) {
          const commitJson = await commitRes.json()
          const rawMessage = commitJson?.commit?.message || 'Recent update'
          const committedAt = commitJson?.commit?.committer?.date || commitJson?.commit?.author?.date || topRepo.pushed_at

          latestCommit = {
            repo: shortRepo,
            repoUrl: topRepo.html_url || `https://github.com/${repoFullName}`,
            message: rawMessage.split('\n')[0],
            sha: commitJson?.sha ? commitJson.sha.substring(0, 7) : '',
            timeAgo: formatRelativeTime(committedAt),
            committedAt,
          }
        }
      } catch (err) {
        console.warn('[GitHub API] Failed to fetch commit details:', err)
      }

      // Fallback to repo pushed_at if commit fetch failed
      if (!latestCommit) {
        latestCommit = {
          repo: shortRepo,
          repoUrl: topRepo.html_url || `https://github.com/${repoFullName}`,
          message: topRepo.description || 'Recent update',
          sha: '',
          timeAgo: formatRelativeTime(topRepo.pushed_at),
          committedAt: topRepo.pushed_at,
        }
      }
    }

    const result: GitHubActivityData = {
      latestCommit,
      publicRepos: userData?.public_repos || (Array.isArray(reposData) ? reposData.length : 0),
      followers: userData?.followers || 0,
    }

    return NextResponse.json({ success: true, data: result }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=60',
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
