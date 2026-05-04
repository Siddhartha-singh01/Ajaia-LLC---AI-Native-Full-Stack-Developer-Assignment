import Link from 'next/link'
import { ArrowLeft, FileText, Edit3, Share2, Save } from 'lucide-react'

const steps = [
  { title: 'Create a document', desc: 'Click "New doc" on your dashboard. Give it a name or leave it blank — you can rename later.', icon: <FileText size={16} className="text-indigo-500" /> },
  { title: 'Write and format', desc: 'Use the toolbar to add headings, bold, italic, lists, and more. The editor gets out of your way.', icon: <Edit3 size={16} className="text-violet-500" /> },
  { title: 'Auto-save takes care of the rest', desc: 'Every change is saved automatically after a short pause. No save button needed.', icon: <Save size={16} className="text-emerald-500" /> },
  { title: 'Share with others', desc: "Open the share panel to invite collaborators by name. They'll see the document on their dashboard.", icon: <Share2 size={16} className="text-blue-500" /> },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen py-16 px-5">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Editor guide</h1>
        <p className="text-[15px] text-gray-500 dark:text-gray-400 mb-12">Get up to speed in under a minute.</p>

        <div className="space-y-8">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-gray-200 dark:bg-white/[0.06] mt-2" />}
              </div>
              <div className="pb-8">
                <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/10 text-center">
          <p className="text-[14px] font-medium text-gray-900 dark:text-white mb-3">Ready to start?</p>
          <Link href="/" className="text-[13px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
            Go to dashboard →
          </Link>
        </div>
      </div>
    </div>
  )
}
