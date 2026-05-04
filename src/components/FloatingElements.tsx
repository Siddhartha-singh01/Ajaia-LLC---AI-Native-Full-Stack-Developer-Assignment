import { FileText, Pencil, Sparkles, Files, Layers } from 'lucide-react'

export function FloatingElements() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none">
      {/* Left side elements */}
      <div className="absolute top-20 -left-10 opacity-[0.08] dark:opacity-[0.12] animate-float-slow">
        <FileText size={300} className="rotate-12 text-blue-600 dark:text-blue-500" />
      </div>
      
      <div className="absolute bottom-40 -left-20 opacity-[0.06] dark:opacity-[0.1] animate-float-delayed">
        <Files size={400} className="-rotate-6 text-purple-600 dark:text-purple-500" />
      </div>

      <div className="absolute top-1/2 -left-10 opacity-[0.08] dark:opacity-[0.15] animate-float">
        <Sparkles size={150} className="rotate-45 text-yellow-500 dark:text-yellow-400" />
      </div>

      {/* Right side elements */}
      <div className="absolute top-40 -right-10 opacity-[0.08] dark:opacity-[0.12] animate-float">
        <Layers size={350} className="-rotate-12 text-indigo-600 dark:text-indigo-500" />
      </div>

      <div className="absolute bottom-20 -right-20 opacity-[0.06] dark:opacity-[0.1] animate-float-slow-delayed">
        <Pencil size={450} className="rotate-12 text-pink-600 dark:text-pink-500" />
      </div>
      
      <div className="absolute top-[70%] -right-10 opacity-[0.08] dark:opacity-[0.15] animate-float-delayed">
        <FileText size={200} className="-rotate-45 text-emerald-600 dark:text-emerald-500" />
      </div>

      {/* Decorative ambient blobs */}
      <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/20 blur-[150px] rounded-full" />
    </div>
  )
}
