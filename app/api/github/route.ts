import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const headers: HeadersInit = { 'Accept': 'application/vnd.github+json' }
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/nik1609', { headers, next: { revalidate: 3600 } }),
      fetch('https://api.github.com/users/nik1609/repos?per_page=100&type=owner', { headers, next: { revalidate: 3600 } }),
    ])

    if (!userRes.ok) throw new Error('GitHub API error')

    const user = await userRes.json()
    const repos = reposRes.ok ? await reposRes.json() : []

    const totalStars = Array.isArray(repos)
      ? repos.reduce((acc: number, r: { stargazers_count: number }) => acc + r.stargazers_count, 0)
      : 0

    const langCount: Record<string, number> = {}
    if (Array.isArray(repos)) {
      repos.forEach((r: { language: string | null }) => {
        if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1
      })
    }

    const topLanguages = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([lang]) => lang)

    return NextResponse.json({
      username: user.login,
      name: user.name,
      avatar: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      totalStars,
      topLanguages,
      profileUrl: user.html_url,
    })
  } catch {
    return NextResponse.json({
      username: 'nik1609',
      publicRepos: 0,
      totalStars: 0,
      followers: 0,
      topLanguages: [],
    })
  }
}
