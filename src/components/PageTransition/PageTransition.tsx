import { useEffect, useRef, useState } from 'react'

interface PageTransitionProps {
  pageKey: string
  children: React.ReactNode
}

/**
 * Wraps screen content in a fade+slide-up enter animation.
 * A brief skeleton shimmer is shown while the new page "loads".
 */
export function PageTransition({ pageKey, children }: PageTransitionProps) {
  const [displayKey, setDisplayKey] = useState(pageKey)
  const [phase, setPhase] = useState<'idle' | 'skeleton' | 'enter'>('idle')
  const prevKey = useRef(pageKey)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (pageKey === prevKey.current) return
    prevKey.current = pageKey

    if (timerRef.current) clearTimeout(timerRef.current)

    setPhase('skeleton')
    timerRef.current = setTimeout(() => {
      setDisplayKey(pageKey)
      setPhase('enter')
      timerRef.current = setTimeout(() => setPhase('idle'), 260)
    }, 120)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [pageKey])

  if (phase === 'skeleton') {
    return <SkeletonPage />
  }

  return (
    <div
      key={displayKey}
      className={phase === 'enter' ? 'animate-page-enter' : undefined}
      style={{ height: '100%', display: 'contents' }}
    >
      {children}
    </div>
  )
}

function SkeletonPage() {
  return (
    <div className="flex h-full flex-col gap-lg p-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="skeleton h-7 w-48 rounded-sm" />
        <div className="flex gap-sm">
          <div className="skeleton h-9 w-24 rounded-sm" />
          <div className="skeleton h-9 w-28 rounded-sm" />
        </div>
      </div>
      {/* Table header */}
      <div className="flex gap-md">
        {[180, 120, 200, 160, 140, 80].map((w, i) => (
          <div key={i} className="skeleton h-4 rounded-sm" style={{ width: w }} />
        ))}
      </div>
      {/* Table rows */}
      {Array.from({ length: 7 }).map((_, row) => (
        <div key={row} className="flex gap-md border-b border-border pb-lg">
          {[180, 120, 200, 160, 140, 80].map((w, i) => (
            <div key={i} className="skeleton h-4 rounded-sm" style={{ width: w, opacity: 1 - row * 0.1 }} />
          ))}
        </div>
      ))}
    </div>
  )
}
