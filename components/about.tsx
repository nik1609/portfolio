'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface Profile {
  name: string
  bio: string
  aboutBio?: string | null
  highlights?: string | null
  cfRating: string
  problemsSolved: string
  location: string
  yearsExp?: string | null
}

interface Highlight {
  icon: string
  text: string
}

const defaultHighlights: Highlight[] = [
  { icon: '🚀', text: 'Solution Acceleration Engineer at Ushur — building agentic AI systems with MCP Servers & LangGraph' },
  { icon: '🏆', text: 'Codeforces Specialist — Rating 1510 · 1000+ DSA problems solved' },
  { icon: '🎓', text: 'B.Tech Electrical Engineering from IIT Palakkad (CGPA 7.99)' },
  { icon: '🤖', text: 'Shipped multi-agent pipelines reducing client workflows from 1 week to 15 minutes' },
  { icon: '🏢', text: 'Contributed to Databricks Enterprise AI Partner of the Year (2025) at Tiger Analytics' },
  { icon: '☁️', text: 'Production deployments on AWS & Azure — Docker, CI/CD, MLOps' },
]

const defaultAboutBio = `<p>I'm a <strong>Software Engineer with 2+ years of experience</strong> building production <strong>AI systems, LLM applications, and full-stack platforms</strong>. Currently a <strong>Solution Acceleration Engineer at Ushur</strong>, where I architect multi-agent AI systems using <em>LangGraph, MCP Servers, and RAG</em>.</p>
<p>My competitive programming roots — <strong>Codeforces Specialist (Rating 1510)</strong>, 1000+ problems solved — give me strong DSA and problem-solving instincts that translate directly into writing clean, efficient production code.</p>
<p>I hold a <strong>B.Tech in Electrical Engineering from IIT Palakkad</strong>. My work contributed to the <strong>Databricks Enterprise AI Partner of the Year (2025)</strong>. I thrive at the intersection of AI engineering and product thinking — building tools that make complex workflows feel effortless.</p>`

export default function About({ profile }: { profile: Profile }) {
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true })

  const highlights: Highlight[] = (() => {
    try {
      return profile.highlights ? JSON.parse(profile.highlights) : defaultHighlights
    } catch {
      return defaultHighlights
    }
  })()

  const aboutBio = profile.aboutBio || defaultAboutBio

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Section header */}
          <div className="flex items-center gap-4 mb-14">
            <div>
              <p className="section-num mb-1">01 / About</p>
              <h2 className="font-grotesk text-4xl sm:text-5xl font-black text-slate-100">
                Who I am
              </h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-500/40 to-transparent ml-6 hidden sm:block" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Bio (rich text from admin) */}
            <div>
              <div
                className="about-bio space-y-4"
                dangerouslySetInnerHTML={{ __html: aboutBio }}
              />
              <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
                <span className="font-mono text-violet-400 font-semibold">{profile.yearsExp || '2+'}yrs</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>{profile.location}</span>
              </div>
            </div>

            {/* Right: Highlights grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="glass border-glow hover-glow rounded-2xl p-4 flex items-start gap-3"
                >
                  <span className="text-xl mt-0.5 flex-shrink-0">{item.icon}</span>
                  <span className="text-slate-400 text-sm leading-relaxed">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
