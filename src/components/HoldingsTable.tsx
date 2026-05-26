import { useState, useRef, useEffect } from 'react'
import type { SortField, SortDir } from '../types'
import { useHarvesting } from '../context/HarvestingContext'

const fmtINR = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v)

const fmtUnits = (v: number) => {
  if (v === 0) return '0'
  if (Math.abs(v) < 1e-6) return v.toExponential(3)
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 6 }).format(v)
}

const DEFAULT_ROWS = 4

export default function HoldingsTable() {
  const { state, dispatch } = useHarvesting()
  const { holdings, selected } = state
  const [showAll, setShowAll] = useState(false)
  const [sortField, setSortField] = useState<SortField>('stcg')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const sorted = [...holdings].sort((a, b) => {
    const map: Record<SortField, number> = {
      stcg: a.stcg.gain - b.stcg.gain,
      ltcg: a.ltcg.gain - b.ltcg.gain,
      totalHolding: a.totalHolding - b.totalHolding,
      currentPrice: a.currentPrice - b.currentPrice,
    }
    return sortDir === 'asc' ? map[sortField] : -map[sortField]
  })

  const visible = showAll ? sorted : sorted.slice(0, DEFAULT_ROWS)
  const visibleCoins = visible.map(h => h.coin)
  const allSelected = visibleCoins.length > 0 && visibleCoins.every(c => selected[c])
  const someSelected = visibleCoins.some(c => selected[c])
  const selectedCount = Object.values(selected).filter(Boolean).length

  const cbRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (cbRef.current) cbRef.current.indeterminate = someSelected && !allSelected
  }, [someSelected, allSelected])

  const toggleSort = (f: SortField) => {
    if (sortField === f) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(f); setSortDir('desc') }
  }

  const SortBtn = ({ field, label }: { field: SortField; label: string }) => (
    <button onClick={() => toggleSort(field)}
      className="flex items-center gap-1 text-slate-500 dark:text-slate-400 uppercase tracking-wide text-xs font-semibold hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
      {label}
      <span className={sortField === field ? 'text-blue-500' : 'text-slate-300 dark:text-slate-600'}>
        {sortField === field && sortDir === 'asc' ? '↑' : '↓'}
      </span>
    </button>
  )

  return (
    <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-md overflow-hidden border border-slate-100 dark:border-slate-700 transition-colors">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 border-b border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Holdings</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Select assets to see real-time impact on your capital gains
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {selectedCount > 0 && (
            <>
              <span className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                {selectedCount} selected
              </span>
              <button onClick={() => dispatch({ type: 'DESELECT_ALL' })}
                className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                Clear
              </button>
            </>
          )}
          <button onClick={() => setShowAll(p => !p)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            {showAll ? 'Show less' : `View all (${holdings.length})`}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[960px] w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
              <th className="pl-6 pr-3 py-3 w-10">
                <input ref={cbRef} type="checkbox"
                  className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  checked={allSelected}
                  onChange={() => allSelected
                    ? dispatch({ type: 'DESELECT_ALL' })
                    : dispatch({ type: 'SELECT_ALL', payload: visibleCoins })}
                  aria-label="Select all" />
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Asset</th>
              <th className="px-3 py-3 text-right"><SortBtn field="totalHolding" label="Holdings / Avg Buy" /></th>
              <th className="px-3 py-3 text-right"><SortBtn field="currentPrice" label="Current Price" /></th>
              <th className="px-3 py-3 text-right"><SortBtn field="stcg" label="Short-Term Gain" /></th>
              <th className="px-3 py-3 text-right"><SortBtn field="ltcg" label="Long-Term Gain" /></th>
              <th className="px-3 pr-6 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Amount to Sell</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
            {visible.map((asset) => {
              const isSel = !!selected[asset.coin]
              const stg = asset.stcg?.gain ?? 0
              const ltg = asset.ltcg?.gain ?? 0
              return (
                <tr key={`${asset.coin}-${asset.coinName}`}
                  onClick={() => dispatch({ type: 'TOGGLE_HOLDING', payload: asset.coin })}
                  className={`cursor-pointer transition-colors
                    ${isSel
                      ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                  <td className="pl-6 pr-3 py-4">
                    <input type="checkbox"
                      className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                      checked={isSel}
                      onChange={() => dispatch({ type: 'TOGGLE_HOLDING', payload: asset.coin })}
                      onClick={e => e.stopPropagation()}
                      aria-label={`Select ${asset.coin}`} />
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                      <img src={asset.logo} alt={asset.coinName} loading="lazy"
                        width={36} height={36}
                        className="w-9 h-9 rounded-full object-cover border border-slate-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 shrink-0"
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg'
                        }} />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{asset.coin}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[180px] truncate">{asset.coinName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{fmtUnits(asset.totalHolding)}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Avg {fmtINR(asset.averageBuyPrice)}</p>
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{fmtINR(asset.currentPrice)}</p>
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums">
                    <p className={`font-bold ${stg >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                      {fmtINR(stg)}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Bal: {fmtUnits(asset.stcg?.balance ?? 0)}</p>
                  </td>
                  <td className="px-3 py-4 text-right tabular-nums">
                    <p className={`font-bold ${ltg >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                      {fmtINR(ltg)}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Bal: {fmtUnits(asset.ltcg?.balance ?? 0)}</p>
                  </td>
                  <td className="px-3 pr-6 py-4 text-right tabular-nums">
                    {isSel
                      ? <span className="inline-flex px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold">
                          {fmtUnits(asset.totalHolding)}
                        </span>
                      : <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!showAll && holdings.length > DEFAULT_ROWS && (
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 text-center">
          <button onClick={() => setShowAll(true)}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            View all {holdings.length} holdings →
          </button>
        </div>
      )}
    </section>
  )
}