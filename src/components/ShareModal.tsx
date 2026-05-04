'use client'
import { useState, useEffect } from 'react'
import { X, UserPlus, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import type { User } from '@/types'

interface ShareModalProps {
  documentId: string
  onClose: () => void
}

export function ShareModal({ documentId, onClose }: ShareModalProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(false)

  const currentUserId =
    typeof window !== 'undefined'
      ? localStorage.getItem('userId') || 'user_alice'
      : 'user_alice'

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then((all: User[]) => setUsers(all.filter(u => u.id !== currentUserId)))
  }, [currentUserId])

  async function handleShare() {
    if (!selectedId) {
      toast.error('Please select a user')
      return
    }
    setLoading(true)
    const res = await fetch('/api/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': currentUserId,
      },
      body: JSON.stringify({ documentId, shareWithUserId: selectedId }),
    })
    setLoading(false)

    if (res.ok) {
      toast.success('Access granted successfully!')
      onClose()
    } else {
      const err = await res.json()
      toast.error(err.error || 'Failed to share document')
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-950/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <UserPlus size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share Access</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Grant edit access to a team member. They will see this document in their "Shared with Me" list.
          </p>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
            {users.length === 0 && (
              <div className="py-8 text-center text-gray-400 animate-pulse">Loading users...</div>
            )}
            {users.map(user => (
              <label
                key={user.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98]
                  ${selectedId === user.id
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  ${selectedId === user.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <input
                  type="radio"
                  name="share-target"
                  value={user.id}
                  checked={selectedId === user.id}
                  onChange={() => setSelectedId(user.id)}
                  className="w-4 h-4 accent-blue-600"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 bg-gray-50 dark:bg-gray-950/50">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-xl py-3 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={loading || !selectedId}
            className="flex-1 bg-blue-600 text-white rounded-xl py-3 text-sm font-bold
                       hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
          >
            {loading ? 'Sharing...' : 'Grant Access'}
          </button>
        </div>
      </div>
    </div>
  )
}
