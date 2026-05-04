'use client'

import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'

export function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setFading(true)
      setTimeout(() => setVisible(false), 500)
    }, 800)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-gray-950 transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <FileText size={18} className="text-white" />
        </div>
        <span className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
          Ajaia Docs
        </span>
      </div>
    </div>
  )
}
