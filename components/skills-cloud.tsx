'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface Skill {
  id: string
  name: string
  category: string
  order: number
}

const categoryMeta: Record<string, { label: string; color: string; num: string }> = {
  language:  { label: 'Languages',      color: 'from-orange-500/20 to-orange-600/10 border-orange-500/25',  num: '01' },
  frontend:  { label: 'Frontend',       color: 'from-blue-500/20 to-blue-600/10 border-blue-500/25',        num: '02' },
  backend:   { label: 'Backend',        color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/25',        num: '03' },
  ai:        { label: 'AI & Agents',    color: 'from-violet-500/20 to-violet-600/10 border-violet-500/25',  num: '04' },
  tools:     { label: 'Cloud & DevOps', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/25', num: '05' },
  database:  { label: 'Databases',      color: 'from-pink-500/20 to-pink-600/10 border-pink-500/25',        num: '06' },
  cs:        { label: 'System Design',  color: 'from-amber-500/20 to-amber-600/10 border-amber-500/25',     num: '07' },
}

const tagColors: Record<string, string> = {
  language: 'bg-orange-500/10 text-orange-300 border-orange-500/25',
  frontend: 'bg-blue-500/10 text-blue-300 border-blue-500/25',
  backend:  'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
  ai:       'bg-violet-500/10 text-violet-300 border-violet-500/25',
  tools:    'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  database: 'bg-pink-500/10 text-pink-300 border-pink-500/25',
  cs:       'bg-amber-500/10 text-amber-300 border-amber-500/25',
}

export default function SkillsCloud({ skills }: { skills: Skill[] }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  const grouped = Object.entries(categoryMeta).reduce(
    (acc, [cat]) => {
      acc[cat] = skills.filter((s) => s.category === cat).sort((a, b) => a.order - b.order)
      return acc
    },
    {} as Record<string, Skill[]>
  )

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-14"
        >
          <div>
            <p className="section-num mb-1">04 / Skills</p>
            <h2 className="font-grotesk text-4xl sm:text-5xl font-black text-slate-100">
              My toolkit
            </h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-violet-500/40 to-transparent ml-6 hidden sm:block" />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(categoryMeta).map(([cat, meta], catIdx) => {
            const catSkills = grouped[cat] || []
            if (catSkills.length === 0) return null

            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                className={`glass rounded-2xl p-5 border bg-gradient-to-br ${meta.color}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-xs text-slate-600">{meta.num}</span>
                  <h3 className="font-grotesk text-sm font-bold text-slate-300 uppercase tracking-wider">
                    {meta.label}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((skill, i) => (
                    <motion.span
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: catIdx * 0.1 + i * 0.04 }}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 cursor-default ${tagColors[cat]}`}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {skills.length === 0 && (
          <div className="text-center text-slate-500 py-20">No skills yet. Add them from the admin panel.</div>
        )}
      </div>
    </section>
  )
}
