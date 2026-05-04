import { Heart, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200/60 dark:border-white/[0.06]">
      <div className="max-w-[1120px] mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <span className="text-[15px] font-semibold text-gray-900 dark:text-white tracking-tight">
              Ajaia Docs
            </span>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-2 max-w-xs leading-relaxed">
              A lightweight editor for writing, collaborating, and organizing your work.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-[13px] text-gray-600 dark:text-gray-400">
              <li><Link href="/features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link></li>
              <li><Link href="/guide" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Editor Guide</Link></li>
              <li><Link href="/dark-mode" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Themes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-[13px] text-gray-600 dark:text-gray-400">
              <li><Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200/60 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Ajaia Docs
          </p>
          <p className="text-[12px] text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
            Built with <Heart size={11} className="text-red-400 fill-red-400" /> by
            <span className="font-medium text-gray-600 dark:text-gray-300">Siddharth</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
