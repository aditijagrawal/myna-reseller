import { Fragment } from 'react'

export interface HeatmapProps {
  rowLabels: string[]
  colLabels: string[]
  /** values[row][col]; intensity is scaled against the max value. */
  values: number[][]
}

export function Heatmap({ rowLabels, colLabels, values }: HeatmapProps) {
  const max = Math.max(1, ...values.flat())
  const cols = colLabels.length
  const gridCols = `44px repeat(${cols}, minmax(24px, 1fr))`

  return (
    <div className="overflow-x-auto">
      {/* Cells */}
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: gridCols }}>
        {rowLabels.map((rl, r) => (
          <Fragment key={rl}>
            <div className="flex items-center pr-sm text-small text-text-secondary">{rl}</div>
            {colLabels.map((cl, c) => {
              const alpha = (values[r]?.[c] ?? 0) / max
              return (
                <div
                  key={cl}
                  title={`${rl} ${cl}: ${values[r]?.[c] ?? 0}`}
                  className="h-7 rounded-[3px] outline-primary transition-[outline] hover:outline hover:outline-2 hover:-outline-offset-2"
                  style={{ backgroundColor: `rgba(25, 118, 210, ${0.06 + 0.94 * alpha})` }}
                />
              )
            })}
          </Fragment>
        ))}
      </div>

      {/* X-axis labels (vertical, below the grid so they never overlap cells) */}
      <div className="mt-sm grid gap-[3px]" style={{ gridTemplateColumns: gridCols }}>
        <div />
        {colLabels.map((cl) => (
          <div key={cl} className="flex justify-center">
            <span className="text-[10px] text-text-secondary [writing-mode:vertical-rl]">{cl}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
