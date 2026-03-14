'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiLink } from 'react-icons/fi'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  tags: string[]
  published: boolean
  publishedAt?: string
  readTime?: number
  createdAt: string
  blogType?: string
  coverImage?: string
  coverColor?: string
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch('/api/admin/blog').then((r) => r.json()).then(setPosts).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted'); load() } else toast.error('Failed')
  }

  const togglePublish = async (post: BlogPost) => {
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    })
    if (res.ok) { toast.success(post.published ? 'Unpublished' : 'Published!'); load() }
    else toast.error('Failed')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-grotesk text-3xl font-black text-slate-100">Blog Posts</h1>
          <p className="text-slate-500 text-sm mt-1">{posts.filter((p) => p.published).length} published · {posts.length} total</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary py-2.5">
          <FiPlus /> New Post
        </Link>
      </div>

      {loading ? (
        <div className="text-slate-500 text-sm py-10 text-center">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-slate-500 py-20 glass border-glow rounded-2xl">
          <p className="text-4xl mb-3">✍️</p>
          <p className="mb-4">No blog posts yet.</p>
          <Link href="/admin/blog/new" className="btn-primary text-sm py-2.5">
            <FiPlus /> Write your first post
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="glass border-glow rounded-2xl p-5 flex gap-4 items-start group hover-glow">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${post.published ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      <span className={`text-xs font-mono ${post.published ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      {post.readTime && <span className="text-xs text-slate-600">{post.readTime} min</span>}
                      {post.blogType === 'embed' && (
                        <span className="flex items-center gap-1 text-[0.6rem] text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-2 py-0.5">
                          <FiLink className="text-[9px]" /> embed
                        </span>
                      )}
                    </div>
                    <h3 className="font-grotesk font-bold text-slate-100 text-sm leading-snug">{post.title}</h3>
                  </div>
                  <span className="font-mono text-xs text-slate-600 flex-shrink-0">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {post.excerpt && (
                  <p className="text-slate-400 text-xs mb-3 line-clamp-1">{post.excerpt}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 4).map((t) => <span key={t} className="tag text-[0.55rem]">{t}</span>)}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => togglePublish(post)} title={post.published ? 'Unpublish' : 'Publish'}
                  className={`p-2 rounded-lg transition-all ${post.published ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'}`}>
                  {post.published ? <FiEye className="text-sm" /> : <FiEyeOff className="text-sm" />}
                </button>
                <Link href={`/admin/blog/${post.id}`}
                  className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all">
                  <FiEdit2 className="text-sm" />
                </Link>
                <button onClick={() => handleDelete(post.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
