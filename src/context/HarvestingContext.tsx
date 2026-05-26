import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { CapitalGains, Holding } from '../types'
import { fetchHoldings, fetchCapitalGains } from '../services/mockApi'

interface State {
  holdings: Holding[]
  capitalGains: CapitalGains | null
  selected: Record<string, boolean>
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'SET_HOLDINGS'; payload: Holding[] }
  | { type: 'SET_CAPITAL_GAINS'; payload: CapitalGains }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'TOGGLE_HOLDING'; payload: string }
  | { type: 'SELECT_ALL'; payload: string[] }
  | { type: 'DESELECT_ALL' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_HOLDINGS': return { ...state, holdings: action.payload }
    case 'SET_CAPITAL_GAINS': return { ...state, capitalGains: action.payload }
    case 'SET_LOADING': return { ...state, loading: action.payload }
    case 'SET_ERROR': return { ...state, error: action.payload, loading: false }
    case 'TOGGLE_HOLDING': return { ...state, selected: { ...state.selected, [action.payload]: !state.selected[action.payload] } }
    case 'SELECT_ALL': {
      const next = { ...state.selected }
      action.payload.forEach((c) => { next[c] = true })
      return { ...state, selected: next }
    }
    case 'DESELECT_ALL': return { ...state, selected: {} }
    default: return state
  }
}

const HarvestingContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null)

export function HarvestingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    holdings: [], capitalGains: null, selected: {}, loading: true, error: null,
  })

  useEffect(() => {
    let active = true
    Promise.all([fetchHoldings(), fetchCapitalGains()])
      .then(([h, g]) => {
        if (!active) return
        dispatch({ type: 'SET_HOLDINGS', payload: h })
        dispatch({ type: 'SET_CAPITAL_GAINS', payload: g.capitalGains })
        dispatch({ type: 'SET_LOADING', payload: false })
      })
      .catch(() => { if (active) dispatch({ type: 'SET_ERROR', payload: 'Failed to load data. Please refresh.' }) })
    return () => { active = false }
  }, [])

  return <HarvestingContext.Provider value={{ state, dispatch }}>{children}</HarvestingContext.Provider>
}

export function useHarvesting() {
  const ctx = useContext(HarvestingContext)
  if (!ctx) throw new Error('useHarvesting must be inside HarvestingProvider')
  return ctx
}