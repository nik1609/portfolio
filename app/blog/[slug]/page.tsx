import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiClock, FiCalendar, FiExternalLink } from 'react-icons/fi'
import { generateHTML } from '@tiptap/html'
import { Node, mergeAttributes } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Typography from '@tiptap/extension-typography'

// Must match the EmbedExtension in blog-editor
const EmbedExtension = Node.create({
  name: 'embed',
  group: 'block',
  atom: true,
  addAttributes() {
    return { src: { default: null }, provider: { default: 'generic' } }
  },
  parseHTML() { return [{ tag: 'div[data-embed]' }] },
  renderHTML({ node }) {
    return [
      'div',
      mergeAttributes({ 'data-embed': '', class: 'embed-block', style: 'margin:1.25rem 0;border-radius:0.75rem;overflow:hidden;padding:1.25rem;background:rgba(30,41,59,0.5);border:1px solid rgba(139,92,246,0.2);' }),
      ['a', { href: node.attrs.src, target: '_blank', rel: 'noopener noreferrer', style: 'color:#a78bfa;font-size:0.875rem;display:flex;align-items:center;gap:0.5rem;' }, '🔗 View external content →'],
    ]
  },
})

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
  return {
    title: post ? `${post.title} | Nikhil Kumar` : 'Post not found',
    description: post?.excerpt || '',
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
  })

  if (!post) notFound()

  let htmlContent = ''
  let renderError = false
  if (post.blogType !== 'embed') {
    try {
      const json = JSON.parse(post.content)
      htmlContent = generateHTML(json, [StarterKit, Image, LinkExtension, TextAlign.configure({ types: ['heading', 'paragraph'] }), Typography, EmbedExtension])
    } catch {
      // Content is not valid TipTap JSON or could not be rendered
      const isJson = post.content?.trim().startsWith('{')
      renderError = isJson
      if (!isJson) htmlContent = post.content
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-violet-400 transition-colors text-sm mb-10">
          <FiArrowLeft /> All posts
        </Link>

        {/* Hero */}
        <div
          className="w-full h-48 sm:h-64 rounded-2xl mb-8 relative overflow-hidden"
          style={{ background: post.coverImage ? undefined : (post.coverColor || 'linear-gradient(135deg, #7c3aed, #3b82f6)') }}
        >
          {post.coverImage
            ? <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            : <div className="absolute inset-0 bg-black/20" />}
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-white/15 backdrop-blur-sm text-white rounded-full text-xs font-medium border border-white/20">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <FiCalendar />
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {post.readTime && (
            <span className="flex items-center gap-1.5">
              <FiClock /> {post.readTime} min read
            </span>
          )}
        </div>

        <h1 className="font-grotesk text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 leading-tight mb-10">
          {post.title}
        </h1>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-violet-500/40 via-violet-500/20 to-transparent mb-10" />

        {/* Content */}
        {post.blogType === 'embed' && post.embedUrl ? (
          <div className="flex flex-col items-center justify-center py-16 gap-6">
            <div className="w-16 h-16 rounded-2xl glass border-glow flex items-center justify-center text-3xl">
              🔗
            </div>
            <div className="text-center max-w-md">
              <p className="text-slate-400 mb-2 text-sm">This post is hosted on an external platform</p>
              <h2 className="font-grotesk font-bold text-xl text-slate-100 mb-6">{post.title}</h2>
              <a href={post.embedUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Read the full article <FiExternalLink />
              </a>
            </div>
            <p className="text-xs text-slate-600 font-mono">{post.embedUrl}</p>
          </div>
        ) : renderError ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <p className="text-slate-500 text-sm">This post could not be rendered. Please re-save it from the admin panel.</p>
          </div>
        ) : (
          <div className="prose-dark" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-violet-500/15">
          <Link href="/blog" className="btn-secondary text-sm py-2">
            <FiArrowLeft /> Back to all posts
          </Link>
        </div>
      </div>
    </div>
  )
}
