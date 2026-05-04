import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-5">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-10 group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Privacy policy</h1>
        <p className="text-[13px] text-gray-400 dark:text-gray-500 mb-10">Last updated May 2026</p>

        <div className="space-y-8 text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-2">Data we collect</h2>
            <p>We store the documents you create and the account information needed to provide the service. We do not collect analytics, tracking data, or any personal information beyond what you explicitly provide.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-2">How we use it</h2>
            <p>Your data is used solely to operate Ajaia Docs — storing your documents, enabling sharing, and maintaining your account. We never sell or share your data with third parties.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-2">Security</h2>
            <p>All data is transmitted over HTTPS. Documents are stored in encrypted databases with strict access controls. We follow industry-standard security practices.</p>
          </section>

          <section>
            <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white mb-2">Your rights</h2>
            <p>You can export or delete your data at any time. If you have questions, reach out to <a href="mailto:hello@ajaia.docs" className="text-indigo-600 dark:text-indigo-400 hover:underline">hello@ajaia.docs</a>.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
