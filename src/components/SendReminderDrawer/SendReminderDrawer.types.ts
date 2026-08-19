export interface SendReminderDrawerProps {
  open: boolean
  patientName?: string
  appointmentDate?: string
  appointmentTime?: string
  onClose: () => void
  onSend: (data: { via: 'sms' | 'email' | 'call'; message: string }) => void
}
