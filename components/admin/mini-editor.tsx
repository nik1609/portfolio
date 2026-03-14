'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { FiBold, FiItalic } from 'react-icons/fi'

interface MiniEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function MiniEditor({ content, onChange, placeholder = 'Write here...' }: MiniEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: content || '<p></p>',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[140px] text-sm text-slate-200 leading-relaxed px-4 py-3',
      },
    },
  })

  if (!editor) return <div className="h-32 bg-slate-800/50 rounded-xl animate-pulse" />

  const ToolBtn = ({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      title={title}
      type="button"
      className={`p-1.5 rounded text-sm transition-all ${active ? 'bg-violet-500/20 text-violet-300' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-700/50'}`}
    >
      {children}
    </button>
  )

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden focus-within:border-violet-500/60 transition-all">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-700/50 bg-slate-900/60">
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <FiBold />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <FiItalic />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setParagraph().run()} active={false} title="New paragraph">
          ¶
        </ToolBtn>
        <span className="ml-2 text-[10px] text-slate-600 font-mono border-l border-slate-700 pl-2">
          <strong className="text-violet-400/60">Bold</strong> = violet · <em className="text-cyan-400/60">Italic</em> = cyan (in public view)
        </span>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
