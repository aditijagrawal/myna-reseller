export interface ChartStat {
  value: string
  label: string
  /** Optional icon shown inline after the value. Currently supports 'star'. */
  icon?: 'star'
}

export interface ChartStatRowProps {
  stats: ChartStat[]
}

function formatValue(raw: string): { display: string; tooltip?: string } {
  const numeric = parseFloat(raw.replace(/,/g, ''))
  if (!isNaN(numeric) && numeric >= 1000) {
    const k = parseFloat((numeric / 1000).toFixed(1))
    return { display: `${k}K`, tooltip: numeric.toLocaleString() }
  }
  return { display: raw }
}

export function ChartStatRow({ stats }: ChartStatRowProps) {
  return (
    <div className="mb-lg flex items-end gap-2xl">
      {stats.map((s) => {
        const { display, tooltip } = formatValue(s.value)
        return (
          <div key={s.label} title={tooltip}>
            <div className="flex items-end gap-xs">
              <span className="text-h3 font-normal text-text-primary">{display}</span>
              {s.icon === 'star' && (
                <span className="text-h3 leading-none" style={{ color: '#f59e0b' }}>★</span>
              )}
            </div>
            <p className="text-small text-text-secondary">{s.label}</p>
          </div>
        )
      })}
    </div>
  )
}
