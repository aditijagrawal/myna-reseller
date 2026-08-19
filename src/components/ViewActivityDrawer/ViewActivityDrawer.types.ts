export type ActivityType = 'google-review' | 'birdeye-review' | 'completed' | 'booked' | 'no-show' | 'survey' | 'check' | 'form-sent' | 'reminder'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  subtitle?: string
  actionLabel?: string
  date: string
}

export interface ViewActivityDrawerProps {
  open: boolean
  patient: string
  onClose: () => void
  appointmentDate?: string
  appointmentTime?: string
  appointmentType?: string
  formType?: string
  status?: string
  bookedOn?: string
  insuranceProvider?: string
  sentVia?: string
  onViewAllDetails?: () => void
}
