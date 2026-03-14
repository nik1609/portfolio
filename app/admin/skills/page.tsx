'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FiPlus, FiTrash2, FiSave, FiX } from 'react-icons/fi'

interface Skill { id: string; name: string; category: string; order: number }

const categories = [
  { value: 'language', label: 'Languages' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'ai', label: 'AI & Agents' },
  { value: 'tools', label: 'Cloud & DevOps' },
  { value: 'database', label: 'Databases' },
  { value: 'cs', label: 'System Design' },
]

const catColors: Record<string, string> = {
  language: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
  frontend: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  backend: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  ai: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
  tools: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  database: 'bg-pink-500/15 text-pink-300 border-pink-500/25',
  cs: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
}

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newSkill, setNewSkill] = useState({ name: '', category: 'frontend' })
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/admin/skills').then((r) => r.json()).then(setSkills).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    if (!newSkill.name.trim()) { toast.error('Skill name required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkill),
      })
      if (res.ok) { toast.success('Added!'); setNewSkill({ name: '', category: 'frontend' }); setShowForm(false); load() }
      else toast.error('Failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted'); load() } else toast.error('Failed')
  }

  const grouped = categories.reduce((acc, cat) => {
    acc[cat.value] = skills.filter((s) => s.category === cat.value)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-grotesk text-3xl font-black text-slate-100">Skills</h1>
          <p className="text-slate-500 text-sm mt-1">Your technical toolkit</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary py-2.5"><FiPlus /> Add Skill</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-grotesk font-bold text-slate-100">Add Skill</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-slate-200"><FiX /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Skill Name</label>
                <input type="text" value={newSkill.name} onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="e.g., TypeScript"
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all" autoFocus />
              </div>
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-2">Category</label>
                <select value={newSkill.category} onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))}
                  className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-violet-500/60 transition-all">
                  {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAdd} disabled={saving} className="btn-primary py-2.5 flex-1 justify-center">
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />} Add
              </button>
              <button onClick={() => setShowForm(false)} className="btn-secondary py-2.5 flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="text-slate-500 text-sm py-10 text-center">Loading...</div>
        : (
          <div className="space-y-5">
            {categories.map((cat) => {
              const catSkills = grouped[cat.value] || []
              return (
                <div key={cat.value} className="glass border-glow rounded-2xl p-5">
                  <h3 className="font-grotesk font-bold text-slate-200 text-sm mb-4 uppercase tracking-wider">{cat.label}</h3>
                  {catSkills.length === 0 ? (
                    <p className="text-slate-600 text-xs italic">No skills in this category yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((skill) => (
                        <div key={skill.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${catColors[cat.value]}`}>
                          {skill.name}
                          <button onClick={() => handleDelete(skill.id)} className="hover:text-red-400 transition-colors ml-1">
                            <FiX className="text-[10px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
    </div>
  )
}
