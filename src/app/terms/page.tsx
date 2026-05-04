import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-5">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Terms of service</h1>
        <p className="text-[13px] text-gray-400 dark:text-gray-500 mb-10">Effective May 2026</p>

        <div className="space-y-8 text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-2">Usage</h2>
            <p>By using Ajaia Docs you agree to these terms. You may use the service for personal or professional writing and collaboration. You may not use it for any unlawful purpose or to distribute harmful content.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-2">Your content</h2>
            <p>You own everything you write. We don't claim any rights to your documents. You grant us a limited license to store and serve your content as needed to operate the service.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-2">Availability</h2>
            <p>We aim for high uptime but can't guarantee uninterrupted access. The service is provided as-is without warranties of any kind.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-2">Changes</h2>
            <p>We may update these terms occasionally. Continued use after changes constitutes acceptance of the new terms.</p>
          </section>
        </div>

        <p className="mt-12 text-[12px] text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Ajaia Docs. All rights reserved.
        </p>
      </div>
    </div>
  )
}
