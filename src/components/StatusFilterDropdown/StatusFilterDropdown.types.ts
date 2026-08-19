export interface StatusFilterOption {
  id: string
  label: string
  icon?: string
  iconClassName?: string
}

export interface StatusFilterDropdownProps {
  value: string[]
  onChange: (value: string[]) => void
  onApply: () => void
}

export const STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { id: 'all', label: 'All status' },
  { id: 'requested', label: 'Requested', icon: 'help', iconClassName: 'text-text-tertiary' },
  { id: 'confirmed', label: 'Confirmed', icon: 'check_circle', iconClassName: 'text-accent-positive' },
  { id: 'booked', label: 'Booked', icon: 'error', iconClassName: 'text-primary' },
  { id: 'no-show', label: 'No-show', icon: 'do_not_disturb_on', iconClassName: 'text-text-secondary' },
  { id: 'failed', label: 'Failed', icon: 'do_not_disturb_on', iconClassName: 'text-chip-danger-text' },
]

export const ALL_STATUS_IDS = STATUS_FILTER_OPTIONS.map((o) => o.id)
