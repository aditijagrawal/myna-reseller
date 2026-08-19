export interface ChartTooltipItem {
  color: string
  label: string
  value: number
}

export interface ChartTooltipProps {
  label?: string
  items: ChartTooltipItem[]
  accentColor?: string
  showSplit?: boolean
}

function formatValue(value: number): string {
  if (value >= 1000) return `${parseFloat((value / 1000).toFixed(1))}K`
  return value.toLocaleString()
}

export function ChartTooltip({ label, items }: ChartTooltipProps) {
  const displayLabel = label?.replace('\n', ' ') ?? ''

  return (
    <div
      className="min-w-[180px] rounded-md bg-surface p-md"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}
    >
      {displayLabel && (
        <p className="mb-sm text-small text-text-primary">{displayLabel}</p>
      )}
      <div className="flex flex-col gap-xs">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-lg">
            <div className="flex items-center gap-sm">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-small text-text-secondary">{item.label}</span>
            </div>
            <span className="text-small text-text-primary">{formatValue(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
