import { prisma } from '@/lib/db'
import Hero from '@/components/hero'
import About from '@/components/about'
import Timeline from '@/components/timeline'
import ProjectsGrid from '@/components/projects-grid'
import SkillsCloud from '@/components/skills-cloud'
import GithubStats from '@/components/github-stats'
import BlogPreview from '@/components/blog-preview'
import Contact from '@/components/contact'

async function getData() {
  try {
    const [profile, experiences, projects, skills, posts] = await Promise.all([
      prisma.profile.findFirst(),
      prisma.experience.findMany({ orderBy: { order: 'asc' } }),
      prisma.project.findMany({ orderBy: { order: 'asc' } }),
      prisma.skill.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] }),
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        select: {
          id: true, title: true, slug: true, excerpt: true,
          coverColor: true, coverImage: true, tags: true,
          published: true, publishedAt: true, readTime: true,
          blogType: true, embedUrl: true,
        }
      }),
    ])
    return { profile, experiences, projects, skills, posts }
  } catch {
    return { profile: null, experiences: [], projects: [], skills: [], posts: [] }
  }
}

async function getGithubStats() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/github`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error()
    return res.json()
  } catch {
    return { username: 'nik1609', publicRepos: 0, totalStars: 0, followers: 0, topLanguages: [], profileUrl: 'https://github.com/nik1609' }
  }
}

const defaultProfile = {
  name: 'Nikhil Kumar',
  title: 'Solution Acceleration Engineer',
  subtitle: 'AI Engineer · LangGraph · MCP Servers · IIT Palakkad',
  bio: 'Software Engineer with 2+ years of experience building production AI systems, LLM applications, and full-stack platforms.',
  aboutBio: null,
  highlights: null,
  heroRoles: null,
  yearsExp: '2+',
  companies: null,
  orbitalTags: null,
  github: 'nik1609',
  linkedin: 'nikhil-kumar-dev',
  leetcode: 'mnik16',
  codeforces: 'mnik16',
  cfRating: '1510',
  problemsSolved: '1000+',
  location: 'Bengaluru, India',
  photoUrl: '/profilepic.jpg',
  email: 'iamnik1609@gmail.com',
}

export default async function Home() {
  const { profile, experiences, projects, skills, posts } = await getData()
  const githubData = await getGithubStats()

  const p = profile ?? defaultProfile

  return (
    <div className="relative">
      <Hero profile={p as typeof defaultProfile} />
      <About profile={p as typeof defaultProfile} />
      <Timeline experiences={experiences} />
      <ProjectsGrid projects={projects.map((p) => ({ ...p, imageUrl: p.imageUrl ?? undefined, link: p.link ?? undefined }))} />
      <SkillsCloud skills={skills} />
      <GithubStats data={githubData} />
      {posts.length > 0 && <BlogPreview posts={posts.map((p) => ({ ...p, excerpt: p.excerpt ?? undefined, coverColor: p.coverColor ?? undefined, publishedAt: p.publishedAt?.toISOString(), readTime: p.readTime ?? undefined, blogType: p.blogType, embedUrl: p.embedUrl ?? undefined }))} />}
      <Contact profile={p as typeof defaultProfile} />
    </div>
  )
}
