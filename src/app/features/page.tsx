import Link from 'next/link'
import { ArrowLeft, Zap, Shield, Globe, Moon, Palette } from 'lucide-react'

const items = [
  {
    title: 'Rich text editing',
    desc: 'Format with bold, italic, headings, lists — everything you need to write well.',
    icon: <Zap size={18} className="text-amber-500" />,
  },
  {
    title: 'Auto-save',
    desc: 'Your work is saved automatically as you type. Never lose a word.',
    icon: <Shield size={18} className="text-emerald-500" />,
  },
  {
    title: 'Document sharing',
    desc: 'Invite others to view or edit your documents with a single click.',
    icon: <Globe size={18} className="text-blue-500" />,
  },
  {
    title: 'Dark mode',
    desc: "A carefully tuned dark theme that's easy on your eyes during late sessions.",
    icon: <Moon size={18} className="text-indigo-500" />,
  },
  {
    title: 'Markdown import',
    desc: 'Upload .md or .txt files and instantly turn them into editable documents.',
    icon: <Palette size={18} className="text-rose-500" />,
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen py-16 px-5">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Features</h1>
        <p className="text-[15px] text-gray-500 dark:text-gray-400 mb-12 max-w-lg">
          Everything you need for writing and collaboration, nothing you don't.
        </p>

        <div className="space-y-6">
          {items.map((item, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-xl border border-gray-200/80 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02]">
              <div className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
