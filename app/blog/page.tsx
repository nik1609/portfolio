import { prisma } from '@/lib/db'
import Link from 'next/link'
import { FiClock, FiCalendar, FiArrowLeft, FiLink } from 'react-icons/fi'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Blog | Nikhil Kumar' }

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverColor: string | null
  coverImage: string | null
  tags: string[]
  published: boolean
  publishedAt: Date | null
  readTime: number | null
  blogType: string
  embedUrl: string | null
}

function isRawJson(s: string | null): boolean {
  if (!s) return false
  const t = s.trim()
  return t.startsWith('{') || t.startsWith('[')
}

function BlogCard({ post }: { post: BlogPost }) {
  const href = post.blogType === 'embed' && post.embedUrl ? post.embedUrl : `/blog/${post.slug}`
  const isExternal = post.blogType === 'embed' && !!post.embedUrl
  const safeExcerpt = isRawJson(post.excerpt) ? null : post.excerpt

  const cardContent = (
    <div className="glass border-glow hover-glow rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row gap-5">
      {/* Cover: photo or gradient */}
      <div
        className="w-full sm:w-28 h-24 rounded-xl flex-shrink-0 overflow-hidden relative hidden sm:block"
        style={{ background: post.coverImage ? undefined : (post.coverColor || 'linear-gradient(135deg,#7c3aed,#3b82f6)') }}
      >
        {post.coverImage
          ? <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          : <div className="absolute inset-0 bg-black/20 dot-grid opacity-30" />}
        {post.blogType === 'embed' && (
          <div className="absolute bottom-1 left-1 bg-black/70 rounded px-1.5 py-0.5 flex items-center gap-1">
            <FiLink className="text-[9px] text-violet-300" />
            <span className="text-[9px] text-violet-300 font-mono">embed</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {post.blogType === 'embed' && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.6rem] font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <FiLink className="text-[9px]" /> Embedded
            </span>
          )}
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag text-[0.6rem]">{tag}</span>
          ))}
        </div>
        <h2 className="font-grotesk font-bold text-lg sm:text-xl text-slate-100 group-hover:text-violet-300 transition-colors duration-300 leading-snug mb-2">
          {post.title}
        </h2>
        {safeExcerpt && (
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">{safeExcerpt}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <FiCalendar />
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {post.readTime && (
            <span className="flex items-center gap-1">
              <FiClock /> {post.readTime} min read
            </span>
          )}
        </div>
      </div>
    </div>
  )

  if (isExternal) {
    return (
      <a key={post.id} href={href} target="_blank" rel="noopener noreferrer" className="block group">
        {cardContent}
      </a>
    )
  }

  return (
    <Link key={post.id} href={href} className="block group">
      {cardContent}
    </Link>
  )
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true, title: true, slug: true, excerpt: true,
      coverColor: true, coverImage: true, tags: true,
      published: true, publishedAt: true, readTime: true,
      blogType: true, embedUrl: true,
    }
  })

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-400 transition-colors text-sm mb-8">
            <FiArrowLeft /> Back to portfolio
          </Link>
          <p className="section-num mb-2">Blog</p>
          <h1 className="font-grotesk text-4xl sm:text-5xl font-black text-gradient">
            Writing & thoughts
          </h1>
          <p className="text-slate-400 mt-3 text-lg">
            Articles on software engineering, AI, career, and everything in between.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <p className="text-4xl mb-4">✍️</p>
            <p className="text-lg">No posts published yet. Stay tuned!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
