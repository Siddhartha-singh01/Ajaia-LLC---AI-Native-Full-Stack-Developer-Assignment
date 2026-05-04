'use client'
import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Trash2, CheckCircle, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { Editor } from '@/components/Editor'
import { ShareModal } from '@/components/ShareModal'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { Document } from '@/types'

function getUserId() {
  if (typeof window === 'undefined') return 'user_alice'
  return localStorage.getItem('userId') || 'user_alice'
}

export default function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [doc, setDoc] = useState<Document | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(true)
  const [loading, setLoading] = useState(true)
  const [showShare, setShowShare] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isOwner = doc?.ownerId === getUserId()

  // Load document on mount
  useEffect(() => {
    fetch(`/api/documents/${id}`, {
      headers: { 'x-user-id': getUserId() }
    })
      .then(async r => {
        if (r.status === 404) { setNotFound(true); return }
        const data = await r.json()
        setDoc(data)
        setTitle(data.title)
        setContent(data.content || '')
        setLoading(false)
      })
      .catch(() => setNotFound(true))
  }, [id])

  // Auto-save — fires 1.5s after last change
  function scheduleSave(newTitle: string, newContent: string) {
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': getUserId(),
        },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      })
      if (res.ok) setSaved(true)
      else toast.error('Failed to save')
    }, 1500)
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value)
    scheduleSave(e.target.value, content)
  }

  function handleContentChange(newContent: string) {
    setContent(newContent)
    scheduleSave(title, newContent)
  }

  async function handleDelete() {
    if (!confirm('Delete this document? This cannot be undone.')) return
    const res = await fetch(`/api/documents/${id}`, {
      method: 'DELETE',
      headers: { 'x-user-id': getUserId() }
    })
    if (res.ok) {
      toast.success('Document deleted')
      router.push('/')
    } else {
      toast.error('Failed to delete')
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-sm">
          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Document Not Found</p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">This document may have been deleted or you don't have access.</p>
          <button 
            onClick={() => router.push('/')} 
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Opening document...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Bar - Glassmorphism */}
      <div className="bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            title="Back to home"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1 flex items-center min-w-0 group/title">
            <input
              value={title}
              onChange={handleTitleChange}
              disabled={!isOwner}
              placeholder="Untitled Document"
              className="flex-1 text-lg font-bold bg-transparent border-none outline-none
                         focus:ring-2 focus:ring-blue-500/20 rounded-lg px-2 -ml-2
                         text-gray-900 dark:text-white truncate
                         hover:bg-gray-100 dark:hover:bg-gray-800/50
                         disabled:cursor-default disabled:hover:bg-transparent transition-all"
            />
            {isOwner && (
              <div className="hidden sm:flex items-center ml-2 opacity-0 group-hover/title:opacity-100 transition-opacity">
                <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
                  Click to rename
                </div>
              </div>
            )}
            {/* Save indicator */}
            <div className="flex items-center gap-2 text-xs font-medium shrink-0 ml-2">
              {saved
                ? <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full">
                    <CheckCircle size={12} /> <span className="hidden sm:inline">Saved</span>
                  </div>
                : <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                    <Save size={12} className="animate-pulse" /> <span className="hidden sm:inline">Saving...</span>
                  </div>
              }
            </div>
          </div>

          {!isOwner && (
            <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 px-2 py-1 rounded-full shrink-0">
              Read Only
            </span>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              onClick={() => router.push('/')}
              className="hidden sm:flex items-center gap-1.5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Dashboard
            </button>
            {isOwner && (
              <>
                <button
                  onClick={() => setShowShare(true)}
                  className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2
                             rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                >
                  <Share2 size={16} /> <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                  title="Delete document"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        <Editor
          content={content}
          onChange={handleContentChange}
          editable={true}
        />
      </main>

      {/* Share Modal */}
      {showShare && (
        <ShareModal
          documentId={id}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}
