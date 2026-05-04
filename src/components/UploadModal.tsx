'use client'
import { useState, useRef } from 'react'
import { X, Upload, FileType, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Document } from '@/types'

interface UploadModalProps {
  onClose: () => void
  onSuccess: (doc: Document) => void
}

export function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentUserId =
    typeof window !== 'undefined'
      ? localStorage.getItem('userId') || 'user_alice'
      : 'user_alice'

  async function handleFile(file: File) {
    const isValid = file.name.endsWith('.txt') || file.name.endsWith('.md')
    if (!isValid) {
      toast.error('Only .txt and .md files are supported')
      return
    }

    setUploading(true)
    const form = new FormData()
    form.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'x-user-id': currentUserId },
      body: form,
    })
    setUploading(false)

    if (res.ok) {
      const data = await res.json()
      toast.success(`"${data.document.title}" imported successfully`)
      onSuccess(data.document)
    } else {
      const err = await res.json()
      toast.error(err.error || 'Upload failed')
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-950/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Upload size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Import Document</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault()
              setDragging(false)
              const file = e.dataTransfer.files[0]
              if (file) handleFile(file)
            }}
            onClick={() => inputRef.current?.click()}
            className={`group border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all
              ${dragging 
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800/30'}`}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Processing file...</p>
              </div>
            ) : (
              <>
                <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                  <FileType size={32} className="text-gray-400 group-hover:text-inherit" />
                </div>
                <p className="text-gray-900 dark:text-white font-bold mb-1">Click to browse or drag & drop</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Supported: .txt, .md (max 5MB)</p>
              </>
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-xl">
              <CheckCircle2 size={14} className="text-green-500" /> Auto-formatting
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-xl">
              <CheckCircle2 size={14} className="text-green-500" /> Tiptap Ready
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".txt,.md"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-950/50 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
