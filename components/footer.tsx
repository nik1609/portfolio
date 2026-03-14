export default function Footer() {
  return (
    <footer className="relative py-10 border-t border-violet-500/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">
              NK
            </span>
            <span className="text-slate-500 text-sm">Nikhil Kumar</span>
          </div>
          <p className="text-slate-600 text-xs text-center">
            Built with Next.js, TypeScript, Tailwind CSS & Framer Motion.
            &copy; {new Date().getFullYear()} Nikhil Kumar. All rights reserved.
          </p>
          <div className="w-px h-4 bg-slate-700 hidden sm:block" />
        </div>
      </div>
    </footer>
  )
}
