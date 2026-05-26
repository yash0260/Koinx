import { useState } from 'react'

export default function InfoTooltip({ content }: { content: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex ml-1">
      <button
        className="w-4 h-4 rounded-full bg-white/20 text-white/80 text-xs font-bold flex items-center justify-center hover:bg-white/30 transition-colors"
        onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)} onBlur={() => setShow(false)}
        aria-label="More info"
      >i</button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl z-50 leading-relaxed pointer-events-none">
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </span>
      )}
    </span>
  )
}