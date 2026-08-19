import { useEffect, useRef, useState } from 'react'

/**
 * Delays unmounting so the close animation has time to play.
 *
 * Returns:
 *   - mounted:  whether to render the drawer at all
 *   - closing:  whether the close animation is active (swap in/out class)
 */
export function useDrawer(open: boolean, duration = 240) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (open) {
      if (timerRef.current) clearTimeout(timerRef.current)
      setClosing(false)
      setMounted(true)
    } else if (mounted) {
      setClosing(true)
      timerRef.current = setTimeout(() => {
        setMounted(false)
        setClosing(false)
      }, duration)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  return { mounted, closing }
}
