'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Upload, FileText, Search, Users, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { DocumentCard } from '@/components/DocumentCard'
import { UploadModal } from '@/components/UploadModal'
import { ThemeToggle } from '@/components/ThemeToggle'
import type { DocumentWithShared } from '@/types'

const USERS = [
  { id: 'user_alice', name: 'Alice Johnson', initials: 'AJ' },
  { id: 'user_bob',   name: 'Bob Smith',     initials: 'BS' },
  { id: 'user_carol', name: 'Carol White',   initials: 'CW' },
]

function getUserId() {
  if (typeof window === 'undefined') return 'user_alice'
  return localStorage.getItem('userId') || 'user_alice'
}

export default function HomePage() {
  const router = useRouter()
  const [owned, setOwned] = useState<DocumentWithShared[]>([])
  const [shared, setShared] = useState<DocumentWithShared[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [currentUserId, setCurrentUserId] = useState('user_alice')
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const user = USERS.find(u => u.id === currentUserId) || USERS[0]
  const firstName = user.name.split(' ')[0]

  const visibleOwned = owned.filter(d => d.title.toLowerCase().includes(query.toLowerCase()))
  const visibleShared = shared.filter(d => d.title.toLowerCase().includes(query.toLowerCase()))
  const totalDocs = owned.length + shared.length

  const loadDocs = useCallback(async () => {
    const res = await fetch('/api/documents', {
      headers: { 'x-user-id': getUserId() },
    })
    setLoading(false)
    if (!res.ok) return
    const data = await res.json()
    setOwned(data.owned || [])
    setShared(data.shared || [])
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('userId') || 'user_alice'
    setCurrentUserId(stored)
    loadDocs()
  }, [loadDocs])

  function switchUser(id: string) {
    localStorage.setItem('userId', id)
    setCurrentUserId(id)
    setLoading(true)
    setTimeout(loadDocs, 0)
  }

  async function createDocument(title?: string) {
    const name = title || window.prompt('Name your document:', 'Untitled')
    if (name === null) return

    setCreating(true)
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': getUserId() },
      body: JSON.stringify({ title: name || 'Untitled' }),
    })
    setCreating(false)
    if (res.ok) {
      const doc = await res.json()
      router.push(`/docs/${doc.id}`)
    } else {
      toast.error('Could not create document')
    }
  }

  // Greeting based on time of day
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-20 border-b border-gray-200/60 dark:border-white/[0.06] bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg">
        <div className="max-w-[1120px] mx-auto px-5 h-14 flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
              <FileText size={16} className="text-white" />
            </div>
            <span className="text-[15px] font-semibold text-gray-900 dark:text-white tracking-tight">
              Ajaia Docs
            </span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={currentUserId}
              onChange={e => switchUser(e.target.value)}
              className="text-[13px] border border-gray-200 dark:border-white/[0.08] rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 cursor-pointer"
            >
              {USERS.map(u => (
                <option key={u.id} value={u.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">{u.name}</option>
              ))}
            </select>
            <div className="w-px h-5 bg-gray-200 dark:bg-white/[0.06]" />
            <ThemeToggle />
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white cursor-default select-none"
              title={user.name}
            >
              {user.initials}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1120px] mx-auto px-5 pt-10 pb-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{greeting},</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {firstName}
            </h1>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => setShowUpload(true)}
              className="h-9 px-3.5 text-[13px] font-medium rounded-lg border border-gray-200 dark:border-white/[0.08] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04] active:scale-[0.97] transition-all flex items-center gap-2"
            >
              <Upload size={15} />
              Import
            </button>
            <button
              onClick={() => createDocument()}
              disabled={creating}
              className="h-9 px-3.5 text-[13px] font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.97] disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm shadow-indigo-600/20"
            >
              <Plus size={15} />
              {creating ? 'Creating…' : 'New doc'}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-xl border border-gray-200/80 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} className="text-indigo-500" />
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Documents</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">{totalDocs}</span>
          </div>
          <div className="rounded-xl border border-gray-200/80 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={14} className="text-violet-500" />
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Shared</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">{shared.length}</span>
          </div>
          <div className="rounded-xl border border-gray-200/80 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-amber-500" />
              <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Recent</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">{owned.length > 0 ? 'Today' : '—'}</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search documents…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-[14px] rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
        </div>

        {/* Quick start */}
        <section className="mb-10">
          <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">
            Quick start
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Blank doc',      emoji: '📄' },
              { name: 'Meeting notes',  emoji: '🗒️' },
              { name: 'Project brief',  emoji: '📋' },
              { name: 'Journal entry',  emoji: '✏️' },
            ].map(t => (
              <button
                key={t.name}
                onClick={() => createDocument(t.name)}
                className="h-20 rounded-xl border border-gray-200/80 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.04] hover:border-indigo-300/60 dark:hover:border-indigo-500/20 transition-all flex flex-col items-center justify-center gap-1.5 group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{t.emoji}</span>
                <span className="text-[12px] font-medium text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Documents */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl bg-gray-100 dark:bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <section className="mb-10">
              <div className="flex items-center gap-2.5 mb-4">
                <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  My documents
                </h2>
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-white/[0.04] px-1.5 py-0.5 rounded">
                  {visibleOwned.length}
                </span>
              </div>

              {owned.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-gray-300 dark:border-white/[0.08]">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-3">
                    <FileText size={24} className="text-indigo-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No documents yet</p>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">Create one to get started</p>
                  <button
                    onClick={() => createDocument()}
                    className="text-[13px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Create a document →
                  </button>
                </div>
              ) : visibleOwned.length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center">No results for &ldquo;{query}&rdquo;</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {visibleOwned.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      doc={doc}
                      onClick={() => router.push(`/docs/${doc.id}`)}
                    />
                  ))}
                </div>
              )}
            </section>

            {shared.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-4">
                  <h2 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Shared with me
                  </h2>
                  <span className="text-[11px] font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded">
                    {visibleShared.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {visibleShared.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      doc={doc}
                      isShared
                      onClick={() => router.push(`/docs/${doc.id}`)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={doc => router.push(`/docs/${doc.id}`)}
        />
      )}
    </div>
  )
}
