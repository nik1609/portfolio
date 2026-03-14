'use client'

import { useState, useEffect, useRef } from 'react'
import React from 'react'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import { FiSave, FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi'

const MiniEditor = dynamic(() => import('@/components/admin/mini-editor'), { ssr: false })

interface Highlight { icon: string; text: string }
interface Company { name: string; logoUrl: string }

interface Profile {
  id?: string
  name: string; title: string; subtitle: string; bio: string
  aboutBio: string; highlights: string; heroRoles: string; yearsExp: string
  photoUrl: string; resumeUrl: string; email: string
  github: string; linkedin: string; leetcode: string; codeforces: string
  cfRating: string; problemsSolved: string; location: string
  companies: string
  orbitalTags: string
}

const defaultProfile: Profile = {
  name: 'Nikhil Kumar', title: 'Solution Acceleration Engineer',
  subtitle: 'AI Engineer · LangGraph · MCP Servers · IIT Palakkad',
  bio: '', aboutBio: '', highlights: '[]', heroRoles: '[]', yearsExp: '2+',
  photoUrl: '', resumeUrl: '', email: '', github: 'nik1609',
  linkedin: 'nikhil-kumar-dev', leetcode: 'mnik16', codeforces: 'mnik16',
  cfRating: '1510', problemsSolved: '1000+', location: 'Bengaluru, India',
  companies: '[]',
  orbitalTags: '["LangGraph", "Next.js", "Python", "TypeScript"]',
}

const EMOJIS = ['⚡', '🚀', '🏆', '💻', '🤖', '🎓', '☁️', '🔧', '📚', '🛠️', '⚙️', '🌐', '📊', '💡', '🎯', '🔥']

function CompanyLogosEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [logoRefs] = useState<React.RefObject<HTMLInputElement>[]>(() => Array.from({ length: 10 }, () => React.createRef()))

  const companies: Company[] = (() => { try { return value ? JSON.parse(value) : [] } catch { return [] } })()

  const update = (idx: number, field: keyof Company, val: string) => {
    const updated = companies.map((c, i) => i === idx ? { ...c, [field]: val } : c)
    onChange(JSON.stringify(updated))
  }

  const remove = (idx: number) => {
    onChange(JSON.stringify(companies.filter((_, i) => i !== idx)))
  }

  const handleLogoUpload = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => update(idx, 'logoUrl', ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  if (companies.length === 0) return <p className="text-slate-600 text-xs italic">No companies added. Click Add.</p>

  return (
    <div className="space-y-2">
      {companies.map((co, i) => (
        <div key={i} className="flex items-center gap-3 bg-slate-900/40 border border-slate-700/40 rounded-xl p-3">
          <input type="text" value={co.name} onChange={(e) => update(i, 'name', e.target.value)}
            placeholder="Company name"
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-600" />
          {co.logoUrl && <img src={co.logoUrl} alt={co.name} className="h-6 object-contain" />}
          <button type="button" onClick={() => logoRefs[i].current?.click()}
            className="text-xs text-slate-400 hover:text-violet-400 border border-slate-700 rounded-lg px-2 py-1 transition-all">
            {co.logoUrl ? 'Change' : 'Upload Logo'}
          </button>
          <input ref={logoRefs[i]} type="file" accept="image/*" onChange={(e) => handleLogoUpload(i, e)} className="hidden" />
          <button onClick={() => remove(i)} className="text-slate-600 hover:text-red-400 transition-colors"><FiTrash2 className="text-xs" /></button>
        </div>
      ))}
    </div>
  )
}

export default function ProfileAdmin() {
  const [profile, setProfile] = useState<Profile>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [photoPreview, setPhotoPreview] = useState('')
  const [activeTab, setActiveTab] = useState<'basic' | 'whoiam'>('basic')
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [rolesInput, setRolesInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          const merged = { ...defaultProfile, ...data }
          setProfile(merged)
          setPhotoPreview(data.photoUrl || '')
          try { setHighlights(data.highlights ? JSON.parse(data.highlights) : []) } catch { setHighlights([]) }
          try {
            const roles = data.heroRoles ? JSON.parse(data.heroRoles) : []
            setRolesInput(Array.isArray(roles) ? roles.join(', ') : '')
          } catch { setRolesInput('') }
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image too large. Max 2MB.'); return }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      setPhotoPreview(base64)
      setProfile((p) => ({ ...p, photoUrl: base64 }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    const heroRoles = JSON.stringify(rolesInput.split(',').map((r) => r.trim()).filter(Boolean))
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          highlights: JSON.stringify(highlights),
          heroRoles,
        }),
      })
      if (res.ok) toast.success('Profile saved!')
      else { const err = await res.json(); toast.error(err.error || 'Failed') }
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const addHighlight = () => setHighlights((h) => [...h, { icon: '⚡', text: '' }])
  const removeHighlight = (i: number) => setHighlights((h) => h.filter((_, idx) => idx !== i))
  const updateHighlight = (i: number, field: 'icon' | 'text', value: string) =>
    setHighlights((h) => h.map((item, idx) => idx === i ? { ...item, [field]: value } : item))

  const fieldInput = (key: keyof Profile, label: string, placeholder = '') => (
    <div key={key}>
      <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input type="text" value={profile[key] as string}
        onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all" />
    </div>
  )

  if (loading) return <div className="text-slate-500 text-sm py-10 text-center">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-grotesk text-3xl font-black text-slate-100">Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Your public profile and About section</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary py-2.5">
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-900/50 border border-slate-700/50 rounded-xl p-1 w-fit">
        {(['basic', 'whoiam'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'text-slate-400 hover:text-slate-200'}`}>
            {tab === 'basic' ? 'Basic Info' : 'Who I Am'}
          </button>
        ))}
      </div>

      {activeTab === 'basic' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Photo */}
          <div className="glass border-glow rounded-2xl p-6">
            <h2 className="font-grotesk font-bold text-slate-200 mb-4">Profile Photo</h2>
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-violet-500/30 bg-slate-800 flex items-center justify-center">
                {photoPreview
                  ? <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  : <span className="font-grotesk text-3xl font-black text-gradient">NK</span>}
              </div>
              <button onClick={() => fileRef.current?.click()} className="btn-secondary text-sm py-2">
                <FiUpload /> Upload Photo
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              <p className="text-xs text-slate-600 text-center">JPG/PNG, max 2MB.</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="glass border-glow rounded-2xl p-6 space-y-4">
              <h2 className="font-grotesk font-bold text-slate-200">Basic Info</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {fieldInput('name', 'Full Name')}
                {fieldInput('title', 'Title / Role')}
              </div>
              {fieldInput('subtitle', 'Subtitle (Hero tagline)')}
              <div>
                <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1.5">Hero Bio (short, shown in hero section)</label>
                <textarea value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all resize-none" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {fieldInput('email', 'Email')}
                {fieldInput('location', 'Location')}
                {fieldInput('yearsExp', 'Years of Experience', '2+')}
              </div>
            </div>

            <div className="glass border-glow rounded-2xl p-6 space-y-4">
              <h2 className="font-grotesk font-bold text-slate-200">Social Links</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {fieldInput('github', 'GitHub Username')}
                {fieldInput('linkedin', 'LinkedIn Handle')}
                {fieldInput('leetcode', 'LeetCode Username')}
                {fieldInput('codeforces', 'Codeforces Username')}
              </div>
            </div>

            <div className="glass border-glow rounded-2xl p-6 space-y-4">
              <h2 className="font-grotesk font-bold text-slate-200">Stats & Resume</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {fieldInput('cfRating', 'CF Rating')}
                {fieldInput('problemsSolved', 'Problems Solved')}
                {fieldInput('resumeUrl', 'Resume URL')}
              </div>
            </div>

            {/* Companies Worked At */}
            <div className="glass border-glow rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-grotesk font-bold text-slate-200">Companies Worked At</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Logos shown in hero stats. Upload or leave blank for text fallback.</p>
                </div>
                <button onClick={() => {
                  const cos: Company[] = (() => { try { return profile.companies ? JSON.parse(profile.companies) : [] } catch { return [] } })()
                  setProfile(p => ({ ...p, companies: JSON.stringify([...cos, { name: '', logoUrl: '' }]) }))
                }} className="btn-secondary text-sm py-1.5"><FiPlus /> Add</button>
              </div>
              <CompanyLogosEditor value={profile.companies} onChange={(v) => setProfile(p => ({ ...p, companies: v }))} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'whoiam' && (
        <div className="space-y-6">
          {/* Typewriter Roles */}
          <div className="glass border-glow rounded-2xl p-6">
            <h2 className="font-grotesk font-bold text-slate-200 mb-1">Typewriter Roles</h2>
            <p className="text-xs text-slate-500 mb-4">Comma-separated list of roles shown in the hero typewriter animation</p>
            <input type="text" value={rolesInput}
              onChange={(e) => setRolesInput(e.target.value)}
              placeholder="AI Engineer, Full-Stack Developer, Problem Solver"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all" />
            <div className="flex flex-wrap gap-2 mt-3">
              {rolesInput.split(',').map((r) => r.trim()).filter(Boolean).map((r) => (
                <span key={r} className="tag text-xs">{r}</span>
              ))}
            </div>
          </div>

          {/* Orbital Tags */}
          <div className="glass border-glow rounded-2xl p-6">
            <h2 className="font-grotesk font-bold text-slate-200 mb-1">Orbital Tags</h2>
            <p className="text-xs text-slate-500 mb-4">4 tech tags that orbit your profile photo (comma-separated)</p>
            <input type="text"
              value={(() => { try { return profile.orbitalTags ? JSON.parse(profile.orbitalTags).join(', ') : '' } catch { return '' } })()}
              onChange={(e) => {
                const tags = JSON.stringify(e.target.value.split(',').map(t => t.trim()).filter(Boolean))
                setProfile(p => ({ ...p, orbitalTags: tags }))
              }}
              placeholder="LangGraph, Next.js, Python, TypeScript"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500/60 transition-all"
            />
          </div>

          {/* About Bio (rich text) */}
          <div className="glass border-glow rounded-2xl p-6">
            <h2 className="font-grotesk font-bold text-slate-200 mb-1">About Bio</h2>
            <p className="text-xs text-slate-500 mb-4">
              This is shown in the "Who I Am" section. Use <strong className="text-violet-400">Bold</strong> for violet highlights,{' '}
              <em className="text-cyan-400">Italic</em> for cyan highlights.
            </p>
            <MiniEditor
              content={profile.aboutBio}
              onChange={(html) => setProfile((p) => ({ ...p, aboutBio: html }))}
              placeholder="Write your about bio here..."
            />
          </div>

          {/* Highlights grid */}
          <div className="glass border-glow rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-grotesk font-bold text-slate-200">Highlight Cards</h2>
                <p className="text-xs text-slate-500 mt-0.5">6 cards shown in the about section grid</p>
              </div>
              <button onClick={addHighlight} className="btn-secondary text-sm py-2">
                <FiPlus /> Add Card
              </button>
            </div>

            <div className="space-y-3">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-900/40 border border-slate-700/40 rounded-xl p-3">
                  {/* Emoji picker */}
                  <div className="relative group/emoji flex-shrink-0">
                    <button type="button"
                      className="w-10 h-10 text-xl flex items-center justify-center bg-slate-800/60 border border-slate-700/50 rounded-lg hover:border-violet-500/50 transition-all">
                      {h.icon || '⚡'}
                    </button>
                    <div className="absolute top-full left-0 mt-1 z-10 bg-slate-900 border border-violet-500/20 rounded-xl p-2 grid grid-cols-8 gap-1 opacity-0 pointer-events-none group-hover/emoji:opacity-100 group-hover/emoji:pointer-events-auto transition-all shadow-xl min-w-[200px]">
                      {EMOJIS.map((e) => (
                        <button key={e} type="button" onClick={() => updateHighlight(i, 'icon', e)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-violet-500/20 rounded text-base">
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input value={h.text} onChange={(e) => updateHighlight(i, 'text', e.target.value)}
                    placeholder="Card text..."
                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-600" />
                  <button onClick={() => removeHighlight(i)}
                    className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0">
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              ))}
              {highlights.length === 0 && (
                <p className="text-slate-600 text-sm text-center py-6">No highlights yet. Click "Add Card" to create some.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
