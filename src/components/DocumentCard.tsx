import { FileText } from 'lucide-react'
import type { DocumentWithShared } from '@/types'

interface Props {
  doc: DocumentWithShared
  isShared?: boolean
  onClick: () => void
}

export function DocumentCard({ doc, isShared, onClick }: Props) {
  const date = new Date(doc.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border border-gray-200/80 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.05] hover:border-indigo-300/60 dark:hover:border-indigo-500/20 hover:shadow-sm transition-all p-4 group backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
          <FileText size={16} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {doc.title || 'Untitled'}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[12px] text-gray-400 dark:text-gray-500">{date}</span>
            {isShared && doc.owner?.name && (
              <>
                <span className="text-gray-300 dark:text-gray-700">·</span>
                <span className="text-[12px] text-gray-400 dark:text-gray-500">{doc.owner.name}</span>
              </>
            )}
          </div>
        </div>
        {isShared && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded shrink-0">
            Shared
          </span>
        )}
      </div>
    </button>
  )
}
