export function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse bg-border/60 rounded-xl ${className}`} />
}

export function SkeletonCard() {
  return (
    <div className="border border-border rounded-2xl p-5 space-y-3">
      <SkeletonBlock className="h-5 w-1/2" />
      <SkeletonBlock className="h-4 w-1/3" />
      <SkeletonBlock className="h-4 w-full" />
    </div>
  )
}

export function SkeletonGrid({ count = 4, cols = 'sm:grid-cols-2' }) {
  return (
    <div className={`grid grid-cols-1 ${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}