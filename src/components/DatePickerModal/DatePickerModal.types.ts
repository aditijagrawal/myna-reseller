export interface DatePickerModalProps {
  open: boolean
  anchor: { top: number; left: number } | null
  onClose: () => void
  onApply: (value: string) => void
  /** 'range' = calendar + preset list (default). 'datetime' = calendar + time slots. */
  variant?: 'range' | 'datetime'
}
