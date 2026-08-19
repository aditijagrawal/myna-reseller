export interface HBarItem {
  label: string
  pct: number
  color: string
  /** Optional native tooltip (e.g. absolute count shown on hover). */
  tooltip?: string
}

export interface HBarListProps {
  items: HBarItem[]
  /** Override the container flex classes. Defaults to fill-height with even spacing. */
  className?: string
}

export function HBarList({ items, className = 'flex flex-1 flex-col justify-between' }: HBarListProps) {
  return (
    <div className={className}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-md">
          <p className="w-[80px] shrink-0 text-small leading-4 text-text-primary">{item.label}</p>
          <div
            className="relative h-6 flex-1 overflow-hidden rounded-sm bg-surface-selected"
            title={item.tooltip}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-sm"
              style={{ width: `${item.pct}%`, backgroundColor: item.color }}
            />
          </div>
          <span className="w-[48px] shrink-0 text-right text-small text-text-primary">
            {item.pct}%
          </span>
        </div>
      ))}
    </div>
  )
}
