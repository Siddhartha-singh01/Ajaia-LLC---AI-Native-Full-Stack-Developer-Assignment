import Link from 'next/link'
import { ArrowLeft, Moon, Sun } from 'lucide-react'

export default function DarkModePage() {
  return (
    <div className="min-h-screen py-16 px-5">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Themes</h1>
        <p className="text-[15px] text-gray-500 dark:text-gray-400 mb-12">
          Switch between light and dark modes using the toggle in the top navigation bar.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="p-6 rounded-xl border border-gray-200 bg-white">
            <Sun size={20} className="text-amber-500 mb-3" />
            <h3 className="text-[15px] font-semibold text-gray-900 mb-1">Light mode</h3>
            <p className="text-[13px] text-gray-500 leading-relaxed">Clean white backgrounds with subtle borders. Great for daytime work.</p>
          </div>
          <div className="p-6 rounded-xl border border-white/[0.08] bg-gray-950">
            <Moon size={20} className="text-indigo-400 mb-3" />
            <h3 className="text-[15px] font-semibold text-white mb-1">Dark mode</h3>
            <p className="text-[13px] text-gray-400 leading-relaxed">True dark backgrounds with muted accents. Designed for extended sessions.</p>
          </div>
        </div>

        <p className="text-[13px] text-gray-400 dark:text-gray-500">
          The app respects your system preference by default, or you can override it manually.
        </p>
      </div>
    </div>
  )
}
