'use client'
import type { Editor } from '@tiptap/react'
import { Bold, Italic, Underline, List, ListOrdered, Heading2, Heading3, Undo, Redo } from 'lucide-react'
import clsx from 'clsx'

interface ToolbarProps {
  editor: Editor | null
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null

  const btn = (
    label: string,
    icon: React.ReactNode,
    action: () => void,
    active: boolean
  ) => (
    <button
      key={label}
      type="button"
      title={label}
      onClick={action}
      className={clsx(
        'p-2.5 rounded-xl transition-all active:scale-90',
        active
          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 border border-transparent'
      )}
    >
      {icon}
    </button>
  )

  return (
    <div className="flex flex-wrap items-center gap-1 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 sticky top-0 z-10">
      <div className="flex items-center gap-0.5">
        {btn('Bold',          <Bold size={16} />,        () => editor.chain().focus().toggleBold().run(),                    editor.isActive('bold'))}
        {btn('Italic',        <Italic size={16} />,      () => editor.chain().focus().toggleItalic().run(),                  editor.isActive('italic'))}
        {btn('Underline',     <Underline size={16} />,   () => editor.chain().focus().toggleUnderline().run(),               editor.isActive('underline'))}
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1.5" />

      <div className="flex items-center gap-0.5">
        {btn('Heading 2',     <Heading2 size={16} />,    () => editor.chain().focus().toggleHeading({ level: 2 }).run(),     editor.isActive('heading', { level: 2 }))}
        {btn('Heading 3',     <Heading3 size={16} />,    () => editor.chain().focus().toggleHeading({ level: 3 }).run(),     editor.isActive('heading', { level: 3 }))}
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1.5" />

      <div className="flex items-center gap-0.5">
        {btn('Bullet List',   <List size={16} />,        () => editor.chain().focus().toggleBulletList().run(),              editor.isActive('bulletList'))}
        {btn('Numbered List', <ListOrdered size={16} />, () => editor.chain().focus().toggleOrderedList().run(),             editor.isActive('orderedList'))}
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1.5" />

      <div className="flex items-center gap-0.5">
        {btn('Undo',          <Undo size={16} />,        () => editor.chain().focus().undo().run(),                          false)}
        {btn('Redo',          <Redo size={16} />,        () => editor.chain().focus().redo().run(),                          false)}
      </div>
    </div>
  )
}
