import { ReportHeaderProps } from './ReportHeader.types'

export function ReportHeader({ title, subtitle, rightSlot }: ReportHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex items-start justify-between bg-surface px-2xl py-xl">
      <div className="flex flex-col gap-xs">
        <h1 className="text-h3 text-text-primary">{title}</h1>
        {subtitle && <p className="text-small text-text-secondary">{subtitle}</p>}
      </div>
      {rightSlot}
    </div>
  )
}
