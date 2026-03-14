'use client'

import { useEditor, EditorContent, Node, mergeAttributes } from '@tiptap/react'
import { useRef, useState, useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import {
  FiBold, FiItalic, FiCode, FiList, FiLink2, FiImage,
  FiMinus, FiAlignLeft, FiAlignCenter, FiAlignRight,
} from 'react-icons/fi'
import { MdFormatListNumbered, MdFormatQuote, MdCode } from 'react-icons/md'
import { FiYoutube } from 'react-icons/fi'

// ── Custom Embed Node ─────────────────────────────────────────────────────────
const EmbedExtension = Node.create({
  name: 'embed',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      provider: { default: 'generic' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-embed]' }]
  },

  renderHTML({ node }) {
    const src = node.attrs.src as string
    return [
      'div',
      mergeAttributes({ 'data-embed': '', class: 'embed-block' }),
      [
        'iframe',
        {
          src,
          width: '100%',
          height: '400',
          frameborder: '0',
          allowfullscreen: 'true',
          loading: 'lazy',
        },
      ],
    ]
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div')
      dom.className = 'embed-block-editor'
      dom.style.cssText =
        'border:1px solid rgba(139,92,246,0.3);border-radius:0.75rem;padding:1rem;background:rgba(139,92,246,0.05);display:flex;align-items:center;gap:0.75rem;margin:0.75rem 0;cursor:default;'
      const isYT = node.attrs.provider === 'youtube'
      dom.innerHTML = `
        <div style="font-size:1.5rem">${isYT ? '▶️' : '🔗'}</div>
        <div style="flex:1;min-width:0">
          <div style="color:#a78bfa;font-size:0.8rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">${isYT ? 'YouTube' : 'Embedded'}</div>
          <div style="color:#64748b;font-size:0.72rem;word-break:break-all;margin-top:2px">${node.attrs.src}</div>
        </div>
      `
      return { dom }
    }
  },
})

// ── URL helpers ───────────────────────────────────────────────────────────────
function getEmbedData(url: string): { src: string; provider: string } {
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (ytMatch) {
    return { src: `https://www.youtube.com/embed/${ytMatch[1]}`, provider: 'youtube' }
  }
  // Medium / Hashnode / generic — try the URL directly as an iframe
  return { src: url, provider: 'generic' }
}

// ── Component ─────────────────────────────────────────────────────────────────
interface BlogEditorProps {
  content: string
  onChange: (json: string) => void
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const imgMenuRef = useRef<HTMLDivElement>(null)
  const [imgMenuOpen, setImgMenuOpen] = useState(false)

  useEffect(() => {
    if (!imgMenuOpen) return
    const close = (e: MouseEvent) => {
      if (imgMenuRef.current && !imgMenuRef.current.contains(e.target as Node)) {
        setImgMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [imgMenuOpen])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-violet-400 underline' },
      }),
      Placeholder.configure({ placeholder: 'Start writing your post...' }),
      Typography,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      EmbedExtension,
    ],
    content: content ? JSON.parse(content) : '',
    onCreate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()))
    },
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()))
    },
    editorProps: {
      attributes: { class: 'outline-none min-h-[400px] prose-dark text-sm leading-relaxed' },
    },
  })

  if (!editor) return <div className="h-64 bg-slate-800/50 rounded-xl animate-pulse" />

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { alert('Image too large. Max 3MB.'); return }
    const reader = new FileReader()
    reader.onload = (ev) => {
      editor.chain().focus().setImage({ src: ev.target?.result as string }).run()
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleImageUrl = () => {
    const url = window.prompt('Image URL:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  const handleSetLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) editor.chain().focus().setLink({ href: url }).run()
    else editor.chain().focus().unsetLink().run()
  }

  const handleEmbed = () => {
    const url = window.prompt('Paste embed URL (YouTube, Medium, Hashnode, etc.):')
    if (!url) return
    const { src, provider } = getEmbedData(url.trim())
    editor.chain().focus().insertContent({ type: 'embed', attrs: { src, provider } }).run()
  }

  // ── Toolbar button ────────────────────────────────────────────────────────
  const T = ({
    onClick, active, title, children,
  }: {
    onClick: () => void
    active?: boolean
    title: string
    children: React.ReactNode
  }) => (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      type="button"
      className={`p-1.5 rounded-lg text-sm transition-all duration-150 ${
        active
          ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
          : 'text-slate-500 hover:text-slate-200 hover:bg-slate-700/50'
      }`}
    >
      {children}
    </button>
  )

  const Sep = () => <span className="w-px h-5 bg-slate-700 self-center mx-0.5" />

  return (
    <div className="glass border-glow rounded-2xl overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-0.5 p-2.5 border-b border-violet-500/10 bg-slate-900/40">
        {/* Headings */}
        <T onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
           active={editor.isActive('heading', { level: 1 })} title="H1">
          <span className="font-bold text-[11px]">H1</span>
        </T>
        <T onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
           active={editor.isActive('heading', { level: 2 })} title="H2">
          <span className="font-bold text-[11px]">H2</span>
        </T>
        <T onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
           active={editor.isActive('heading', { level: 3 })} title="H3">
          <span className="font-bold text-[11px]">H3</span>
        </T>

        <Sep />

        {/* Formatting */}
        <T onClick={() => editor.chain().focus().toggleBold().run()}
           active={editor.isActive('bold')} title="Bold"><FiBold /></T>
        <T onClick={() => editor.chain().focus().toggleItalic().run()}
           active={editor.isActive('italic')} title="Italic"><FiItalic /></T>
        <T onClick={() => editor.chain().focus().toggleCode().run()}
           active={editor.isActive('code')} title="Inline Code"><FiCode /></T>

        <Sep />

        {/* Alignment */}
        <T onClick={() => editor.chain().focus().setTextAlign('left').run()}
           active={editor.isActive({ textAlign: 'left' })} title="Align Left">
          <FiAlignLeft />
        </T>
        <T onClick={() => editor.chain().focus().setTextAlign('center').run()}
           active={editor.isActive({ textAlign: 'center' })} title="Align Center">
          <FiAlignCenter />
        </T>
        <T onClick={() => editor.chain().focus().setTextAlign('right').run()}
           active={editor.isActive({ textAlign: 'right' })} title="Align Right">
          <FiAlignRight />
        </T>

        <Sep />

        {/* Lists */}
        <T onClick={() => editor.chain().focus().toggleBulletList().run()}
           active={editor.isActive('bulletList')} title="Bullet List"><FiList /></T>
        <T onClick={() => editor.chain().focus().toggleOrderedList().run()}
           active={editor.isActive('orderedList')} title="Ordered List">
          <MdFormatListNumbered />
        </T>
        <T onClick={() => editor.chain().focus().toggleBlockquote().run()}
           active={editor.isActive('blockquote')} title="Blockquote">
          <MdFormatQuote />
        </T>
        <T onClick={() => editor.chain().focus().toggleCodeBlock().run()}
           active={editor.isActive('codeBlock')} title="Code Block">
          <MdCode />
        </T>

        <Sep />

        {/* Media & embeds */}
        <T onClick={handleSetLink} active={editor.isActive('link')} title="Insert Link">
          <FiLink2 />
        </T>

        {/* Image: click-toggled dropdown */}
        <div className="relative" ref={imgMenuRef}>
          <T onClick={() => setImgMenuOpen((v) => !v)} active={imgMenuOpen} title="Insert Image">
            <FiImage />
          </T>
          {imgMenuOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 glass-strong rounded-xl border border-violet-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.4)] z-20 overflow-hidden">
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setImgMenuOpen(false); fileRef.current?.click() }}
                className="w-full px-4 py-2.5 text-left text-xs text-slate-300 hover:bg-violet-500/10 hover:text-violet-300 transition-colors"
              >
                📁 Upload from computer
              </button>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); setImgMenuOpen(false); handleImageUrl() }}
                className="w-full px-4 py-2.5 text-left text-xs text-slate-300 hover:bg-violet-500/10 hover:text-violet-300 transition-colors"
              >
                🔗 Paste image URL
              </button>
            </div>
          )}
        </div>

        <T onClick={handleEmbed} active={false} title="Embed (YouTube, Medium, etc.)">
          <FiYoutube />
        </T>

        <T onClick={() => editor.chain().focus().setHorizontalRule().run()}
           active={false} title="Divider"><FiMinus /></T>
      </div>

      {/* ── Editor ── */}
      <div className="tiptap-editor p-4 sm:p-6 min-h-[400px] max-h-[680px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  )
}
