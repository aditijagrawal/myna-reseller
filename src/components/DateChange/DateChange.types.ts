export interface DateChangeProps {
  date: Date
  isToday: boolean
  timescale?: 'day' | 'week'
  onPrev: () => void
  onNext: () => void
  onToday?: () => void
}
