export default function VaultLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-pulse">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-4 w-4 bg-muted rounded opacity-40" />
        <div className="h-4 w-28 bg-muted rounded" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-8 w-52 bg-muted rounded-lg" />
          <div className="h-4 w-72 bg-muted rounded opacity-60" />
        </div>
        <div className="h-9 w-36 bg-primary/20 rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 bg-card border border-border rounded-xl" />
        ))}
      </div>

      {/* Categories grid */}
      <div className="space-y-3">
        <div className="h-5 w-24 bg-muted rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-card border border-border rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
