import { prisma } from '@/lib/db'
import Link from 'next/link'
import { FiUser, FiBriefcase, FiCode, FiBook, FiFileText, FiEdit } from 'react-icons/fi'

export default async function Dashboard() {
  const [experiences, projects, skills, allPosts, publishedPosts] = await Promise.all([
    prisma.experience.count(),
    prisma.project.count(),
    prisma.skill.count(),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { published: true } }),
  ])

  const stats = [
    { label: 'Experience Items', value: experiences, icon: FiBriefcase, href: '/admin/experience', color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Projects', value: projects, icon: FiCode, href: '/admin/projects', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Skills', value: skills, icon: FiBook, href: '/admin/skills', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Blog Posts', value: `${publishedPosts}/${allPosts}`, icon: FiFileText, href: '/admin/blog', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ]

  const quickActions = [
    { label: 'Edit Profile', href: '/admin/profile', icon: FiUser },
    { label: 'Add Experience', href: '/admin/experience', icon: FiBriefcase },
    { label: 'Add Project', href: '/admin/projects', icon: FiCode },
    { label: 'New Blog Post', href: '/admin/blog/new', icon: FiEdit },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-grotesk text-3xl font-black text-slate-100">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your portfolio content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="glass border-glow hover-glow rounded-2xl p-5">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`text-lg ${stat.color}`} />
              </div>
              <div className={`font-mono text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="glass border-glow rounded-2xl p-6">
        <h2 className="font-grotesk font-bold text-slate-200 mb-4 text-sm uppercase tracking-wider">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 hover:bg-violet-500/10 border border-slate-700/40 hover:border-violet-500/30 rounded-xl transition-all duration-200 text-slate-400 hover:text-violet-300 text-sm font-medium"
            >
              <action.icon className="text-base flex-shrink-0" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
