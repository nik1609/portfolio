'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { FiArrowLeft, FiSave, FiEye, FiEyeOff, FiUpload, FiLink2, FiExternalLink } from 'react-icons/fi'
import { MdOutlineCode } from 'react-icons/md'

const BlogEditor = dynamic(() => import('@/components/admin/blog-editor'), { ssr: false })

const gradients = [
  'linear-gradient(135deg, #7c3aed, #3b82f6)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #ec4899, #8b5cf6)',
  'linear-gradient(135deg, #6366f1, #22d3ee)',
]

export default function EditBlogPost() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const coverImgRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [coverColor, setCoverColor] = useState(gradients[0])
  const [coverImage, setCoverImage] = useState('')
  const [readTime, setReadTime] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [blogType, setBlogType] = useState<'written' | 'embed'>('written')
  const [embedUrl, setEmbedUrl] = useState('')

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTitle(data.title || '')
        setExcerpt(data.excerpt || '')
        setTagsInput((data.tags || []).join(', '))
        setCoverColor(data.coverColor || gradients[0])
        setCoverImage(data.coverImage || '')
        setReadTime(data.readTime?.toString() || '')
        setContent(data.content || '')
        setPublished(data.published || false)
        setBlogType(data.blogType || 'written')
        setEmbedUrl(data.embedUrl || '')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { toast.error('Image too large. Max 3MB.'); return }
    const reader = new FileReader()
    reader.onload = (ev) => setCoverImage(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSave = async (pub?: boolean) => {
    if (!title.trim()) { toast.error('Title required'); return }
    if (blogType === 'embed' && !embedUrl.trim()) { toast.error('Embed URL required'); return }
    setSaving(true)
    const shouldPublish = pub ?? published
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt: excerpt || undefined,
          tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
          coverColor,
          coverImage: coverImage || undefined,
          readTime: readTime ? parseInt(readTime) : undefined,
          content: blogType === 'written' ? content : '',
          blogType,
          embedUrl: blogType === 'embed' ? embedUrl : undefined,
          published: shouldPublish,
        }),
      })
      if (res.ok) {
        toast.success('Saved!')
        setPublished(shouldPublish)
      } else {
        toast.error('Failed to save')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-slate-500 text-sm py-10 text-center">Loading post...</div>

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/blog" className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-all">
          <FiArrowLeft />
        </Link>
        <div className="flex-1">
          <h1 className="font-grotesk text-3xl font-black text-slate-100">Edit Post</h1>
          <span className={`text-xs font-mono ${published ? 'text-emerald-400' : 'text-slate-500'}`}>
            {published ? '● Published' : '○ Draft'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {published
            ? <button onClick={() => handleSave(false)} disabled={saving} className="btn-secondary py-2 text-sm"><FiEyeOff /> Unpublish</button>
            : <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary py-2 text-sm"><FiEye /> Publish</button>}
          <button onClick={() => handleSave()} disabled={saving} className="btn-secondary py-2 text-sm">
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />}
            Save
          </button>
        </div>
      </div>

      {/* Blog type toggle */}
      <div className="flex gap-2 mb-6">
        {(['written', 'embed'] as const).map((t) => (
          <button key={t} onClick={() => setBlogType(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${blogType === t ? 'bg-violet-500/20 border-violet-500/40 text-violet-300' : 'border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}>
            {t === 'written' ? <><MdOutlineCode /> Written Blog</> : <><FiLink2 /> External Link</>}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title..."
            className="w-full bg-transparent text-slate-100 text-2xl sm:text-3xl font-bold placeholder:text-slate-700 focus:outline-none border-b border-slate-800 pb-3 mb-2" />

          {blogType === 'written' ? (
            content !== undefined && <BlogEditor content={content} onChange={setContent} />
          ) : (
            <div className="glass border-glow rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Article / Post URL</label>
                <input type="url" value={embedUrl} onChange={(e) => setEmbedUrl(e.target.value)}
                  placeholder="https://linkedin.com/posts/... or medium.com/@user/article..."
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all" />
                <p className="text-[10px] text-slate-600 mt-1.5">Paste any URL — LinkedIn, Medium, Hashnode, Dev.to, YouTube, etc.</p>
              </div>
              {embedUrl.trim() && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Preview</p>
                  <div className="rounded-xl border border-violet-500/20 bg-slate-900/50 p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xl flex-shrink-0">
                      🔗
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-400 text-xs font-mono mb-1 truncate">{embedUrl}</p>
                      <p className="text-slate-500 text-xs">Visitors will be redirected to this URL when they click the post.</p>
                      <a href={embedUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-violet-400 hover:text-violet-300 text-xs transition-colors">
                        <FiExternalLink className="text-[10px]" /> Open link to verify
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass border-glow rounded-2xl p-5 space-y-4">
            <h2 className="font-grotesk font-bold text-slate-200 text-sm uppercase tracking-wider">Post Settings</h2>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Excerpt</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all resize-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Tags</label>
              <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Read Time (min)</label>
              <input type="number" value={readTime} onChange={(e) => setReadTime(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all" />
            </div>
          </div>

          {/* Cover Photo */}
          <div className="glass border-glow rounded-2xl p-5 space-y-3">
            <h2 className="font-grotesk font-bold text-slate-200 text-sm uppercase tracking-wider">Cover Photo</h2>
            <div className="w-full h-28 rounded-xl overflow-hidden relative" style={{ background: coverImage ? undefined : coverColor }}>
              {coverImage
                ? <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                : <div className="absolute inset-0 dot-grid opacity-20" />}
            </div>
            <div className="flex gap-2">
              <button onClick={() => coverImgRef.current?.click()} className="btn-secondary text-xs py-1.5 flex-1 justify-center">
                <FiUpload /> Upload Photo
              </button>
              {coverImage && (
                <button onClick={() => setCoverImage('')} className="btn-secondary text-xs py-1.5 px-3 text-red-400">✕</button>
              )}
            </div>
            <input ref={coverImgRef} type="file" accept="image/*" onChange={handleCoverImage} className="hidden" />
          </div>

          {!coverImage && (
            <div className="glass border-glow rounded-2xl p-5">
              <h2 className="font-grotesk font-bold text-slate-200 text-sm uppercase tracking-wider mb-3">Cover Color</h2>
              <div className="grid grid-cols-3 gap-2">
                {gradients.map((g) => (
                  <button key={g} onClick={() => setCoverColor(g)}
                    className={`h-10 rounded-xl transition-all ${coverColor === g ? 'ring-2 ring-violet-400 ring-offset-1 ring-offset-slate-900 scale-95' : 'opacity-70 hover:opacity-100'}`}
                    style={{ background: g }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
