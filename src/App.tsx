import { HarvestingProvider, useHarvesting } from './context/HarvestingContext'
import { useHarvestedGains } from './hooks/useHarvestedGains'
import Navbar from './components/Navbar'
import HowItWorks from './components/HowItWorks'
import CapitalGainsCard from './components/CapitalGainsCard'
import HoldingsTable from './components/HoldingsTable'
import SkeletonLoader from './components/SkeletonLoader'

function Dashboard() {
  const { state } = useHarvesting()
  const { holdings, capitalGains, selected, loading, error } = state
  const harvestedGains = useHarvestedGains(capitalGains, holdings, selected)

  const preRealised = capitalGains
    ? (capitalGains.stcg.profits - capitalGains.stcg.losses) + (capitalGains.ltcg.profits - capitalGains.ltcg.losses)
    : 0
  const postRealised = harvestedGains
    ? (harvestedGains.stcg.profits - harvestedGains.stcg.losses) + (harvestedGains.ltcg.profits - harvestedGains.ltcg.losses)
    : 0
  const savings = Math.max(0, preRealised - postRealised)

  if (loading) return <SkeletonLoader />

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
      </div>
      <p className="text-slate-600 dark:text-slate-300 font-medium">{error}</p>
      <button onClick={() => window.location.reload()}
        className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
        Retry
      </button>
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <HowItWorks />
      {capitalGains && harvestedGains && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CapitalGainsCard
            title="Pre Harvesting"
            subtitle="Your current capital gains based on realised transactions."
            variant="dark"
            gains={capitalGains}
          />
          <CapitalGainsCard
            title="After Harvesting"
            subtitle="Updated in real-time as you select holdings to harvest."
            variant="blue"
            gains={harvestedGains}
            savings={savings}
          />
        </div>
      )}
      <HoldingsTable />
    </div>
  )
}

export default function App() {
  return (
    <HarvestingProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900 transition-colors">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Tax Loss Harvesting</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Optimise your crypto taxes by strategically realising losses
            </p>
          </div>
          <Dashboard />
        </main>
      </div>
    </HarvestingProvider>
  )
}