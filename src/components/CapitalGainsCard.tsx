import type { CapitalGains } from '../types'
import InfoTooltip from './InfoTooltip'

const fmt = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v)

interface Props {
  title: string
  subtitle: string
  variant: 'dark' | 'blue'
  gains: CapitalGains
  savings?: number
}

export default function CapitalGainsCard({ title, subtitle, variant, gains, savings = 0 }: Props) {
  const netST = gains.stcg.profits - gains.stcg.losses
  const netLT = gains.ltcg.profits - gains.ltcg.losses
  const realised = netST + netLT
  const isDark = variant === 'dark'
  const bg = isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500'
  const box = isDark ? 'bg-white/[0.07] border-white/10' : 'bg-white/[0.15] border-white/20'

  return (
    <section className={`${bg} rounded-3xl p-6 text-white shadow-2xl flex flex-col gap-5 relative overflow-hidden`}>
      <span className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/[0.05] pointer-events-none" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-white/60 text-sm mt-1 max-w-xs">{subtitle}</p>
        </div>
        <span className={`shrink-0 px-3 py-1.5 rounded-full border ${box} text-xs font-semibold`}>
          {realised >= 0 ? '▲ Net Gain' : '▼ Net Loss'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Short-Term', net: netST, p: gains.stcg.profits, l: gains.stcg.losses, tip: 'Assets held < 36 months. Taxed at your income slab rate.' },
          { label: 'Long-Term',  net: netLT, p: gains.ltcg.profits, l: gains.ltcg.losses, tip: 'Assets held > 36 months. Taxed at flat 20% with indexation.' },
        ].map(({ label, net, p, l, tip }) => (
          <div key={label} className={`${box} border rounded-2xl p-4`}>
            <div className="text-white/60 text-xs uppercase tracking-wider flex items-center mb-2">
              {label}<InfoTooltip content={tip} />
            </div>
            <p className="text-2xl font-extrabold tabular-nums">{fmt(net)}</p>
            <div className="text-white/60 text-xs mt-2 space-y-0.5">
              <p>Profits <span className="font-semibold text-white/90">{fmt(p)}</span></p>
              <p>Losses  <span className="font-semibold text-white/90">{fmt(l)}</span></p>
            </div>
          </div>
        ))}
      </div>

      <div className={`border-t border-white/10 pt-4 flex items-center justify-between`}>
        <div>
          <p className="text-white/60 text-xs uppercase tracking-wider">Realised Capital Gains</p>
          <p className="text-3xl font-extrabold tabular-nums mt-1">{fmt(realised)}</p>
        </div>
      </div>

      {savings > 0 && (
        <div className={`${box} border rounded-2xl px-4 py-3 text-sm font-semibold flex items-center gap-2 animate-slide-up`}>
          🎉 You're going to save {fmt(savings)} in taxes!
        </div>
      )}
    </section>
  )
}