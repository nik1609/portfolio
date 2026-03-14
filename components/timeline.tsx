'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface Experience {
  id: string
  title: string
  location: string
  description: string
  type: string
  date: string
  order: number
}

const INITIAL_SHOW = 4

export default function Timeline({ experiences }: { experiences: Experience[] }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? experiences : experiences.slice(0, INITIAL_SHOW)

  return (
    <section id="experience" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-14">
          <div>
            <p className="section-num mb-1">02 / Experience</p>
            <h2 className="font-grotesk text-4xl sm:text-5xl font-black text-slate-100">
              My journey
            </h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-violet-500/40 to-transparent ml-6 hidden sm:block" />
        </div>

        <div ref={ref} className="relative">
          {/* Center line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/0 via-violet-500/30 to-violet-500/0 hidden sm:block" />

          <div className="space-y-6">
            {visible.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative sm:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-6 hidden sm:flex">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${
                    item.type === 'work'
                      ? 'border-violet-500 bg-violet-500/20 shadow-glow-sm'
                      : 'border-cyan-500 bg-cyan-500/20 shadow-glow-cyan'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'work' ? 'bg-violet-400' : 'bg-cyan-400'
                    }`} />
                  </div>
                </div>

                {/* Card */}
                <div className="glass border-glow hover-glow rounded-2xl p-5 sm:p-6 group">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`tag ${item.type === 'work' ? '' : 'tag-cyan'} text-[0.6rem]`}>
                          {item.type === 'work' ? '💼 Work' : '🎓 Education'}
                        </span>
                      </div>
                      <h3 className="font-grotesk text-lg font-bold text-slate-100 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-sm mt-0.5">{item.location}</p>
                    </div>
                    <span className="font-mono text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 whitespace-nowrap flex-shrink-0 self-start">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {experiences.length > INITIAL_SHOW && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 flex justify-center"
            >
              <button
                onClick={() => setShowAll((v) => !v)}
                className="btn-secondary text-sm py-2 gap-2"
              >
                {showAll ? <><FiChevronUp /> Show less</> : <><FiChevronDown /> View all {experiences.length} entries</>}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
