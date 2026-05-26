const Box = ({ cls = '' }: { cls?: string }) => <div className={`skeleton-shimmer rounded-xl ${cls}`} />

export default function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-slate-800 p-6 space-y-4 min-h-[300px]">
          <Box cls="h-6 w-40 bg-slate-700" />
          <Box cls="h-4 w-56 bg-slate-700" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Box cls="h-24 bg-slate-700" />
            <Box cls="h-24 bg-slate-700" />
          </div>
          <Box cls="h-14 bg-slate-700" />
        </div>
        <div className="rounded-3xl bg-blue-700 p-6 space-y-4 min-h-[300px]">
          <Box cls="h-6 w-40 bg-blue-600" />
          <Box cls="h-4 w-56 bg-blue-600" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Box cls="h-24 bg-blue-600" />
            <Box cls="h-24 bg-blue-600" />
          </div>
          <Box cls="h-14 bg-blue-600" />
        </div>
      </div>
      <div className="bg-white rounded-3xl p-6 space-y-3">
        <Box cls="h-6 w-40" />
        {[...Array(4)].map((_, i) => <Box key={i} cls="h-16 w-full" />)}
      </div>
    </div>
  )
}