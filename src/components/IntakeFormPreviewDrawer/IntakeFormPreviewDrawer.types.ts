export interface IntakeBasicDetails {
  age: string
  gender: string
  phone: string
  email: string
  emergencyContact: string
  emergencyRelationship: string
  emergencyPhone: string
  emergencyEmail: string
}

export interface IntakePreviewPatient {
  name: string
  initials: string
  aiSummary: string[]
  basicDetails: IntakeBasicDetails
}

export interface IntakeFormPreviewDrawerProps {
  open: boolean
  patient: IntakePreviewPatient | null
  onClose: () => void
}
