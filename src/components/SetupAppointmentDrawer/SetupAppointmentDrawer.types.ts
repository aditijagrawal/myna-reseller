export interface SetupAppointmentValues {
  rep: string
  type: string
  date: string
  time: string
}

export interface SetupAppointmentDrawerProps {
  open: boolean
  /** Name of the lead/patient the appointment is for (optional context). */
  subject?: string
  onClose: () => void
  onOfferSlot: (values: SetupAppointmentValues) => void
}
