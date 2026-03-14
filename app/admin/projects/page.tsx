'use client'

import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiStar, FiUpload } from 'react-icons/fi'

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  link: string
  featured: boolean
  order: number
}

const empty = { id: '', title: '', description: '', tags: [] as string[], imageUrl: '', link: '', featured: false, order: 0 }

export default function ProjectsAdmin() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<typeof empty>({ ...empty })
  const [tagsInput, setTagsInput] = useState('')
  const [isNew, setIsNew] = useState(true)
  const [saving, setSaving] = useState(false)
  const imgRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { toast.error('Max 3MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => setEditing(p => ({ ...p, imageUrl: ev.target?.result as string }))
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const load = () => {
    fetch('/api/admin/projects').then((r) => r.json()).then(setItems).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing({ ...empty }); setTagsInput(''); setIsNew(true); setShowForm(true) }
  const openEdit = (item: Project) => {
    setEditing({ ...item })
    setTagsInput(item.tags.join(', '))
    setIsNew(false)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!editing.title) { toast.error('Title required'); return }
    setSaving(true)
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    const payload = { ...editing, tags }
    try {
      const url = isNew ? '/api/admin/projects' : `/api/admin/projects/${editing.id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) { toast.success(isNew ? 'Added!' : 'Updated!'); setShowForm(false); load() }
      else toast.error('Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted'); load() } else toast.error('Failed')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-grotesk text-3xl font-black text-slate-100">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Showcase your work</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5"><FiPlus /> Add Project</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-grotesk font-bold text-slate-100">{isNew ? 'Add Project' : 'Edit Project'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-slate-200"><FiX /></button>
            </div>
            <div className="space-y-4">
              {[
                { key: 'title', label: 'Project Title', placeholder: 'My Awesome Project' },
                { key: 'link', label: 'Live URL', placeholder: 'https://...' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">{label}</label>
                  <input type="text" value={(editing as unknown as Record<string, string>)[key]} onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder} className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all" />
                </div>
              ))}
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Project Image</label>
                {editing.imageUrl && (
                  <div className="mb-2 relative h-24 rounded-xl overflow-hidden">
                    <img src={editing.imageUrl} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setEditing(p => ({ ...p, imageUrl: '' }))}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 text-xs">✕</button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={() => imgRef.current?.click()}
                    className="btn-secondary text-xs py-2 px-3">
                    <FiUpload /> Upload
                  </button>
                  <input type="text" value={editing.imageUrl} onChange={(e) => setEditing(p => ({ ...p, imageUrl: e.target.value }))}
                    placeholder="or paste image URL..."
                    className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all" />
                </div>
                <input ref={imgRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea value={editing.description} onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))} rows={3}
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all resize-none" placeholder="Describe the project..." />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Tags (comma-separated)</label>
                <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, TypeScript, Node.js"
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing((p) => ({ ...p, featured: e.target.checked }))}
                  className="w-4 h-4 rounded accent-violet-500" />
                <span className="text-slate-300 text-sm">Featured project (shown prominently)</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 flex-1 justify-center">
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />} Save
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary py-2.5 flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="text-slate-500 text-sm py-10 text-center">Loading...</div>
        : items.length === 0 ? (
          <div className="text-center text-slate-500 py-20 glass border-glow rounded-2xl">
            <p className="text-4xl mb-3">🚀</p><p>No projects yet. Add your first one!</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item.id} className="glass border-glow rounded-2xl p-5 group hover-glow">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-grotesk font-bold text-slate-100 text-sm">{item.title}</h3>
                    {item.featured && <FiStar className="text-amber-400 text-xs" />}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all"><FiEdit2 className="text-xs" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><FiTrash2 className="text-xs" /></button>
                  </div>
                </div>
                <p className="text-slate-400 text-xs mb-3 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 4).map((t) => <span key={t} className="tag text-[0.55rem]">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}
