'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { FiArrowRight, FiClock, FiCalendar } from 'react-icons/fi'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  coverColor?: string
  tags: string[]
  publishedAt?: string
  readTime?: number
  blogType?: string
  embedUrl?: string
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const gradient = post.coverColor || 'linear-gradient(135deg, #7c3aed, #3b82f6)'
  const href = post.blogType === 'embed' && post.embedUrl ? post.embedUrl : `/blog/${post.slug}`
  const isExternal = post.blogType === 'embed' && !!post.embedUrl
  const safeExcerpt = post.excerpt && !post.excerpt.trim().startsWith('{') && !post.excerpt.trim().startsWith('[') ? post.excerpt : undefined

  const cardInner = (
    <div className="glass border-glow hover-glow rounded-2xl overflow-hidden h-full">
      {/* Gradient header */}
      <div
        className="h-32 relative overflow-hidden"
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-white/15 backdrop-blur-sm text-white rounded-full text-xs font-medium border border-white/20">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-grotesk font-bold text-slate-100 text-base leading-snug mb-2 group-hover:text-violet-300 transition-colors duration-300 line-clamp-2">
          {post.title}
        </h3>
        {safeExcerpt && (
          <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{safeExcerpt}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <FiCalendar />
                {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            {post.readTime && (
              <span className="flex items-center gap-1">
                <FiClock />
                {post.readTime} min read
              </span>
            )}
          </div>
          <span className="text-violet-400 group-hover:translate-x-1 transition-transform duration-300">
            <FiArrowRight />
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block group">
          {cardInner}
        </a>
      ) : (
        <Link href={href} className="block group">
          {cardInner}
        </Link>
      )}
    </motion.div>
  )
}

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  if (posts.length === 0) return null

  return (
    <section id="blog" className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between gap-4 mb-14"
        >
          <div className="flex items-center gap-4">
            <div>
              <p className="section-num mb-1">06 / Blog</p>
              <h2 className="font-grotesk text-4xl sm:text-5xl font-black text-slate-100">
                Latest posts
              </h2>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-violet-500/40 to-transparent ml-6 hidden sm:block w-32" />
          </div>
          <Link href="/blog" className="btn-secondary text-sm py-2 flex-shrink-0">
            All posts <FiArrowRight />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.slice(0, 3).map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
