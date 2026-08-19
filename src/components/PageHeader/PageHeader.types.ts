export type AppointmentView = 'table' | 'calendar'
export type AppointmentTimescale = 'day' | 'week'

export interface PageHeaderProps {
  date: Date
  providerLabel?: string
  view?: AppointmentView
  isToday?: boolean
  timescale?: AppointmentTimescale
  statusLabel?: string
  primaryActionLabel?: string
  onPrev?: () => void
  onNext?: () => void
  onToday?: () => void
  onProviderClick?: () => void
  onViewChange?: (view: AppointmentView) => void
  onTimescaleChange?: (v: AppointmentTimescale) => void
  onStatusClick?: () => void
  onPrimaryAction?: () => void
  onCustomizeColumns?: () => void
  onFilter?: () => void
}
