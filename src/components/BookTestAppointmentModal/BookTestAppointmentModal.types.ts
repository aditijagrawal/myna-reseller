export interface BookTestAppointmentValues {
  firstName: string
  lastName: string
  phone: string
  email: string
  appointmentType: string
  dateTime: string
}

export interface BookTestAppointmentModalProps {
  open: boolean
  onClose: () => void
  onBookAndRun: (values: BookTestAppointmentValues) => void
  initialValues?: BookTestAppointmentValues | null
}
