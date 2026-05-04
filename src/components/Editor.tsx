'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import { Toolbar } from './Toolbar'

interface EditorProps {
  content: string         // Tiptap JSON string or empty string
  onChange: (json: string) => void
  editable?: boolean
}

export function Editor({ content, onChange, editable = true }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: 'Start writing your masterpiece...' }),
    ],
    immediatelyRender: false,
    editable,
    content: (() => {
      try { return content ? JSON.parse(content) : '' } catch { return '' }
    })(),
    onUpdate({ editor }) {
      onChange(JSON.stringify(editor.getJSON()))
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none outline-none min-h-[70vh] px-8 sm:px-12 py-10 focus:outline-none text-gray-900 dark:text-gray-100 transition-colors',
      },
    },
  })

  // Sync content when switching between documents
  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    try {
      const parsed = content ? JSON.parse(content) : ''
      editor.commands.setContent(parsed, { emitUpdate: false }) // don't emit update event
    } catch {}
  }, [content, editor])

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden bg-white dark:bg-gray-900 shadow-2xl shadow-gray-200/50 dark:shadow-none transition-all">
      <Toolbar editor={editor} />
      <div className="bg-white dark:bg-gray-900/50">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
