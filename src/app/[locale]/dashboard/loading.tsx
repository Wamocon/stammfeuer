export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-pulse">
      {/* Greeting skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-muted rounded-lg" />
        <div className="h-4 w-32 bg-muted rounded-lg opacity-60" />
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted shrink-0" />
            <div className="space-y-1.5">
              <div className="h-6 w-10 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded opacity-60" />
            </div>
          </div>
        ))}
      </div>

      {/* Archive list + prompt widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="h-5 w-28 bg-muted rounded" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 bg-card border border-border rounded-xl" />
          ))}
        </div>
        <div className="space-y-3">
          <div className="h-5 w-24 bg-muted rounded" />
          <div className="h-40 bg-card border border-border rounded-xl" />
        </div>
      </div>

      {/* Recent entries */}
      <div className="space-y-3">
        <div className="h-5 w-36 bg-muted rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 bg-card border border-border rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
