'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaGithub, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import { SiLeetcode, SiCodeforces, SiHashnode, SiMedium } from 'react-icons/si'
import { HiDownload, HiArrowRight } from 'react-icons/hi'

interface Company { name: string; logoUrl: string }

interface Profile {
  name: string
  title: string
  subtitle: string
  bio: string
  photoUrl?: string
  github: string
  linkedin: string
  leetcode: string
  codeforces: string
  cfRating: string
  problemsSolved: string
  location: string
  resumeUrl?: string
  heroRoles?: string | null
  yearsExp?: string | null
  companies?: string | null
  orbitalTags?: string | null
}

const DEFAULT_ROLES = ['AI Engineer', 'Full-Stack Developer', 'LangGraph Builder', 'Problem Solver']
const DEFAULT_ORBITAL = ['LangGraph', 'Next.js', 'Python', 'TypeScript']
const DEFAULT_COMPANIES: Company[] = [
  { name: 'Ushur', logoUrl: '' },
  { name: 'Tiger Analytics', logoUrl: '' },
  { name: 'Satcard', logoUrl: '' },
]

export default function Hero({ profile }: { profile: Profile }) {
  const roles: string[] = (() => {
    try { return profile.heroRoles ? JSON.parse(profile.heroRoles) : DEFAULT_ROLES } catch { return DEFAULT_ROLES }
  })()
  const orbital: string[] = (() => {
    try { return profile.orbitalTags ? JSON.parse(profile.orbitalTags) : DEFAULT_ORBITAL } catch { return DEFAULT_ORBITAL }
  })()
  const companies: Company[] = (() => {
    try { return profile.companies ? JSON.parse(profile.companies) : DEFAULT_COMPANIES } catch { return DEFAULT_COMPANIES }
  })()

  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = roles[roleIdx]
    let timeout: NodeJS.Timeout
    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setRoleIdx((prev) => (prev + 1) % roles.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, roleIdx])

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-60" />
      <div className="absolute inset-0 bg-gradient-radial from-violet-900/20 via-transparent to-transparent" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Text */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-violet-500" />
                <span className="section-num">Hello, World 👋</span>
              </div>

              <h1 className="font-grotesk text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] mb-4">
                <span className="block text-slate-200">I'm</span>
                <span className="block text-gradient mt-1">{profile.name}</span>
              </h1>

              <div className="flex items-center gap-3 mb-6 h-9">
                <span className="font-mono text-lg sm:text-xl font-medium text-slate-300">{displayed}</span>
                <span className="w-0.5 h-6 bg-violet-400 animate-blink" />
              </div>

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                {profile.bio}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="#projects" className="btn-primary">
                  View my work <HiArrowRight className="text-base" />
                </Link>
                <a href={profile.resumeUrl || '/NikhilKumar_resume.pdf'} download className="btn-secondary">
                  Download CV <HiDownload className="text-base" />
                </a>
                <Link href="#contact" className="btn-secondary">Contact me</Link>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-mono uppercase tracking-widest">Find me on</span>
                <div className="h-px w-8 bg-slate-700" />
                {[
                  { href: `https://linkedin.com/in/${profile.linkedin}`, icon: FaLinkedin, label: 'LinkedIn', color: 'hover:text-blue-400 hover:border-blue-400' },
                  { href: 'https://x.com/nikhil_mk16', icon: FaXTwitter, label: 'X', color: 'hover:text-slate-200 hover:border-slate-400' },
                  { href: `https://github.com/${profile.github}`, icon: FaGithub, label: 'GitHub', color: 'hover:text-slate-200 hover:border-slate-400' },
                  { href: `https://leetcode.com/u/${profile.leetcode}`, icon: SiLeetcode, label: 'LeetCode', color: 'hover:text-amber-400 hover:border-amber-400' },
                  { href: `https://codeforces.com/profile/${profile.codeforces}`, icon: SiCodeforces, label: 'Codeforces', color: 'hover:text-cyan-400 hover:border-cyan-400' },
                  { href: '#', icon: SiHashnode, label: 'Hashnode', color: 'hover:text-blue-400 hover:border-blue-400' },
                  { href: '#', icon: SiMedium, label: 'Medium', color: 'hover:text-emerald-400 hover:border-emerald-400' },
                ].map(({ href, icon: Icon, label, color }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className={`p-2.5 rounded-xl text-slate-500 border border-slate-700/50 transition-all duration-300 ${color} hover:shadow-glow-sm hover:-translate-y-0.5 text-lg`}>
                    <Icon />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Photo */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 80 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/20 blur-2xl scale-110" />
              <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 scale-[1.15] animate-spin-slow" />

              {/* Dynamic orbital tags */}
              {orbital.slice(0, 4).map((tech, i) => {
                const angle = (i / 4) * 360
                const rad = (angle * Math.PI) / 180
                const r = 165
                const x = Math.cos(rad) * r
                const y = Math.sin(rad) * r
                return (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.15 }}
                    className="absolute tag text-[0.65rem] py-1 px-2.5 pointer-events-none"
                    style={{ left: `calc(50% + ${x}px - 2.5rem)`, top: `calc(50% + ${y}px - 0.75rem)` }}
                  >
                    {tech}
                  </motion.div>
                )
              })}

              <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-2 border-violet-500/30 shadow-[0_0_60px_rgba(139,92,246,0.3)] bg-gradient-to-br from-violet-900/40 to-dark-200">
                {profile.photoUrl ? (
                  <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-grotesk text-6xl font-black text-gradient">NK</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 glass border-glow rounded-full px-4 py-1.5 flex items-center gap-2 shadow-glow-sm whitespace-nowrap"
              >
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-mono text-slate-300">{profile.location}</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* 3-block stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 grid grid-cols-3 gap-4"
        >
          {/* Block 1: Years of Experience */}
          <div className="glass border-glow rounded-2xl p-5 text-center hover-glow">
            <div className="font-mono text-3xl font-black text-violet-400 mb-1">{profile.yearsExp || '2+'}yrs</div>
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Experience</div>
          </div>

          {/* Block 2: Companies */}
          <div className="glass border-glow rounded-2xl p-5 hover-glow">
            <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-3 text-center">Worked at</div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {companies.map((co) => (
                <div key={co.name} className="flex flex-col items-center gap-1">
                  {co.logoUrl ? (
                    <img src={co.logoUrl} alt={co.name} className="h-6 object-contain opacity-80 hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-700/50 px-2 py-0.5 rounded">{co.name.slice(0, 4).toUpperCase()}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Block 3: Education */}
          <div className="glass border-glow rounded-2xl p-5 text-center hover-glow">
            <div className="font-mono text-lg font-black text-emerald-400 mb-0.5">IIT</div>
            <div className="text-slate-300 text-xs font-semibold">Palakkad</div>
            <div className="text-slate-600 text-[10px] mt-1 uppercase tracking-wider">B.Tech EE · 2024</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
