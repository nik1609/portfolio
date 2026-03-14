'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'

interface Experience {
  id: string
  title: string
  location: string
  description: string
  type: string
  date: string
  order: number
}

const empty = { id: '', title: '', location: '', description: '', type: 'work', date: '' }

export default function ExperienceAdmin() {
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<typeof empty>(empty)
  const [isNew, setIsNew] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/admin/experience')
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(empty); setIsNew(true); setShowForm(true) }
  const openEdit = (item: Experience) => { setEditing({ ...item }); setIsNew(false); setShowForm(true) }

  const handleSave = async () => {
    if (!editing.title || !editing.date) { toast.error('Title and date required'); return }
    setSaving(true)
    try {
      const url = isNew ? '/api/admin/experience' : `/api/admin/experience/${editing.id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      })
      if (res.ok) {
        toast.success(isNew ? 'Added!' : 'Updated!')
        setShowForm(false)
        load()
      } else {
        toast.error('Failed to save')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return
    const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted'); load() } else { toast.error('Failed to delete') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-grotesk text-3xl font-black text-slate-100">Experience</h1>
          <p className="text-slate-500 text-sm mt-1">Timeline entries for your portfolio</p>
        </div>
        <button onClick={openNew} className="btn-primary py-2.5">
          <FiPlus /> Add Entry
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-grotesk font-bold text-slate-100">{isNew ? 'Add Experience' : 'Edit Experience'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                <FiX />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { key: 'title', label: 'Title', placeholder: 'Software Engineer at...' },
                { key: 'location', label: 'Location', placeholder: 'Company, City' },
                { key: 'date', label: 'Date', placeholder: 'Jan 2023 - Mar 2023' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">{label}</label>
                  <input
                    type="text"
                    value={(editing as Record<string, string>)[key]}
                    onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Type</label>
                <select
                  value={editing.type}
                  onChange={(e) => setEditing((p) => ({ ...p, type: e.target.value }))}
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-violet-500/60 transition-all"
                >
                  <option value="work">Work</option>
                  <option value="education">Education</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe your role and responsibilities..."
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary py-2.5 flex-1 justify-center">
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />}
                Save
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary py-2.5 flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-slate-500 text-sm py-10 text-center">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center text-slate-500 py-20 glass border-glow rounded-2xl">
          <p className="text-4xl mb-3">📋</p>
          <p>No experience entries yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="glass border-glow rounded-2xl p-5 flex gap-4 items-start group hover-glow">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${item.type === 'work' ? 'bg-violet-400' : 'bg-cyan-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="tag text-[0.6rem] mb-1 inline-block">{item.type}</span>
                    <h3 className="font-grotesk font-bold text-slate-100 text-sm">{item.title}</h3>
                    <p className="text-slate-500 text-xs">{item.location}</p>
                  </div>
                  <span className="font-mono text-xs text-violet-400 flex-shrink-0">{item.date}</span>
                </div>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed line-clamp-2">{item.description}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all">
                  <FiEdit2 className="text-sm" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
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
