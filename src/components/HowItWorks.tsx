import { useState } from 'react'

export default function HowItWorks() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 text-blue-800 font-semibold text-sm hover:bg-blue-100 transition-colors"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          How does Tax Loss Harvesting work?
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-blue-900 leading-relaxed space-y-3 animate-slide-up">
          <p>Tax Loss Harvesting is a strategy to reduce your tax liability by selling assets that have decreased in value, thereby realising a loss that can offset capital gains.</p>
          <p>Select holdings below to see real-time impact on your capital gains. Assets with negative gains will reduce your taxable amount.</p>
          <div className="p-3 bg-blue-100 rounded-xl text-xs text-blue-700">
            <strong>Important notes & disclaimer:</strong> This tool is for informational purposes only. Consult a qualified tax professional before any investment decisions.
          </div>
        </div>
      )}
    </div>
  )
}