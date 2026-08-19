import { Icon } from '../Icon/Icon'

export interface ChartCardButtonProps {
  icon: string
  label: string
  onClick?: () => void
}

export function ChartCardButton({ icon, label, onClick }: ChartCardButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 shrink-0 items-center justify-center rounded-sm border border-border-chart-btn bg-surface text-text-icon transition-colors hover:bg-surface-hover"
    >
      <Icon name={icon} size={18} />
    </button>
  )
}
