import { useMemo } from 'react'
import type { CapitalGains, Holding } from '../types'

export function useHarvestedGains(
  base: CapitalGains | null,
  holdings: Holding[],
  selected: Record<string, boolean>
): CapitalGains | null {
  return useMemo(() => {
    if (!base) return null
    let stP = base.stcg.profits, stL = base.stcg.losses
    let ltP = base.ltcg.profits, ltL = base.ltcg.losses
    holdings.forEach((a) => {
      if (!selected[a.coin]) return
      const stg = a.stcg?.gain ?? 0
      const ltg = a.ltcg?.gain ?? 0
      if (stg > 0) stP += stg; else stL += Math.abs(stg)
      if (ltg > 0) ltP += ltg; else ltL += Math.abs(ltg)
    })
    return { stcg: { profits: stP, losses: stL }, ltcg: { profits: ltP, losses: ltL } }
  }, [base, holdings, selected])
}