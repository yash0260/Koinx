export interface GainEntry {
  balance: number
  gain: number
}

export interface Holding {
  coin: string
  coinName: string
  logo: string
  currentPrice: number
  totalHolding: number
  averageBuyPrice: number
  stcg: GainEntry
  ltcg: GainEntry
}

export interface GainCategory {
  profits: number
  losses: number
}

export interface CapitalGains {
  stcg: GainCategory
  ltcg: GainCategory
}

export interface CapitalGainsResponse {
  capitalGains: CapitalGains
}

export type SortField = 'stcg' | 'ltcg' | 'totalHolding' | 'currentPrice'
export type SortDir = 'asc' | 'desc'