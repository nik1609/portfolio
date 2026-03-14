'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeHash, setActiveHash] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setActiveHash(window.location.hash || '#about')
    const onHashChange = () => setActiveHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (!isHome) return
    const sections = ['about', 'experience', 'projects', 'skills', 'blog', 'contact', 'home']
    const observers: IntersectionObserver[] = []

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveHash(id === 'home' ? '#about' : `#${id}`)
          }
        },
        { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [isHome])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-strong border-b border-violet-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 font-grotesk font-bold text-lg"
        >
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-glow">
            NK
          </span>
          <span className="text-slate-300 group-hover:text-gradient transition-all duration-300">
            Nikhil Kumar
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const resolvedHref = link.href.startsWith('#') && !isHome ? `/${link.href}` : link.href
            const isActive = activeHash === link.href
            return (
              <li key={link.href}>
                <Link
                  href={resolvedHref}
                  onClick={() => setActiveHash(link.href)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group ${
                    isActive
                      ? 'text-violet-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-violet-500/10 border border-violet-500/25 rounded-full"
                      transition={{ type: 'spring', duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Hire me CTA */}
        <a
          href={isHome ? '#contact' : '/#contact'}
          className="hidden md:flex items-center gap-2 btn-primary text-sm py-2 px-5"
          onClick={() => setActiveHash('#contact')}
        >
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Available
        </a>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-slate-200 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <span className={`h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-strong border-t border-violet-500/10 px-5 py-4"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const resolvedHref = link.href.startsWith('#') && !isHome ? `/${link.href}` : link.href
                return (
                <li key={link.href}>
                  <Link
                    href={resolvedHref}
                    onClick={() => { setMenuOpen(false); setActiveHash(link.href) }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-violet-300 hover:bg-violet-500/8 transition-all duration-200 text-sm font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50" />
                    {link.label}
                  </Link>
                </li>
                )
              })}
              <li className="mt-2">
                <a
                  href={isHome ? '#contact' : '/#contact'}
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full justify-center text-sm py-2.5"
                >
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Available
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
