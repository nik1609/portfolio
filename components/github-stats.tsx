'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaGithub } from 'react-icons/fa'
import { FiExternalLink } from 'react-icons/fi'

const GithubCalendar = dynamic(() => import('./github-calendar'), { ssr: false })

interface GithubData {
  username: string
  publicRepos: number
  totalStars: number
  followers: number
  topLanguages: string[]
  profileUrl?: string
}

const langColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572a5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  Go: '#00add8',
  Rust: '#dea584',
}

export default function GithubStats({ data }: { data: GithubData }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const stats = [
    { label: 'Public Repos', value: data.publicRepos, color: 'text-violet-400' },
    { label: 'Total Stars', value: data.totalStars, color: 'text-amber-400' },
    { label: 'Followers', value: data.followers, color: 'text-cyan-400' },
  ]

  return (
    <section className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-4 mb-10">
            <div>
              <p className="section-num mb-1">05 / GitHub</p>
              <h2 className="font-grotesk text-4xl sm:text-5xl font-black text-slate-100">
                Open source
              </h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-500/40 to-transparent ml-6 hidden sm:block" />
          </div>

          <div className="glass border-glow rounded-3xl p-5 sm:p-6 overflow-hidden relative">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl glass border-glow flex items-center justify-center text-2xl text-slate-300">
                  <FaGithub />
                </div>
                <div>
                  <h3 className="font-grotesk font-bold text-slate-100 text-lg">
                    @{data.username}
                  </h3>
                  <p className="text-slate-500 text-sm">GitHub profile</p>
                </div>
              </div>

              {data.profileUrl && (
                <a
                  href={data.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm py-2 self-start sm:self-auto"
                >
                  View Profile <FiExternalLink />
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="glass rounded-2xl p-4 text-center border border-slate-700/30"
                >
                  <div className={`font-mono text-2xl font-black ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Top languages */}
            {data.topLanguages.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-mono mb-3">
                  Top Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.topLanguages.map((lang, i) => (
                    <motion.span
                      key={lang}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="flex items-center gap-2 px-3 py-1.5 glass rounded-full text-xs font-medium text-slate-300 border border-slate-700/40"
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: langColors[lang] || '#8b5cf6' }}
                      />
                      {lang}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Contribution calendar */}
            <GithubCalendar username={data.username} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
