'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiExternalLink, FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi'

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  imageUrl?: string
  link?: string
  featured: boolean
  order: number
}

function ProjectCard({ project, index, featured }: { project: Project; index: number; featured?: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={`glass border-glow hover-glow rounded-2xl overflow-hidden group ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Project image or gradient header */}
      {project.imageUrl ? (
        <div className="w-full h-40 overflow-hidden bg-slate-900/50">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
          />
        </div>
      ) : (
        <div
          className="h-1 w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500"
          style={{ opacity: 0.6 + index * 0.05 }}
        />
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {featured && (
              <span className="flex items-center gap-1 tag text-[0.6rem]">
                <FiStar className="text-amber-400" /> Featured
              </span>
            )}
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all duration-200"
              aria-label="View project"
            >
              <FiExternalLink className="text-lg" />
            </a>
          )}
        </div>

        <h3 className="font-grotesk text-lg font-bold text-slate-100 mb-2 group-hover:text-violet-300 transition-colors duration-300">
          {project.title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="tag text-[0.6rem]">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const INITIAL_REST = 3

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })
  const [showAll, setShowAll] = useState(false)
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)
  const visibleRest = showAll ? rest : rest.slice(0, INITIAL_REST)

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-14"
        >
          <div>
            <p className="section-num mb-1">03 / Projects</p>
            <h2 className="font-grotesk text-4xl sm:text-5xl font-black text-slate-100">
              What I've built
            </h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-violet-500/40 to-transparent ml-6 hidden sm:block" />
        </motion.div>

        {/* Featured projects */}
        {featured.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            {featured.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} featured={featured.length === 1} />
            ))}
          </div>
        )}

        {/* Rest of projects */}
        {rest.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleRest.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i + featured.length} />
              ))}
            </div>

            {rest.length > INITIAL_REST && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="btn-secondary text-sm py-2 gap-2"
                >
                  {showAll
                    ? <><FiChevronUp /> Show less</>
                    : <><FiChevronDown /> View all {rest.length + featured.length} projects</>}
                </button>
              </div>
            )}
          </>
        )}

        {projects.length === 0 && (
          <div className="text-center text-slate-500 py-20">No projects yet. Add them from the admin panel.</div>
        )}
      </div>
    </section>
  )
}
