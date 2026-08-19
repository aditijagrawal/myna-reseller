export interface QuickSendModalProps {
  open: boolean
  patient: string
  email?: string
  onClose: () => void
  onSend?: () => void
}
