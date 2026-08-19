export type FormFieldType = 'text' | 'select' | 'template-picker' | 'textarea'

export interface TemplateOption {
  label: string
  body: string
  hasAttachment?: boolean
}

export interface FormField {
  key: string
  label: string
  type: FormFieldType
  placeholder?: string
  /** Options for select fields. */
  options?: string[]
  /** Options for template-picker fields. */
  templateOptions?: TemplateOption[]
  /** Max character count for textarea fields. */
  charLimit?: number
}

export interface FormDrawerProps {
  open: boolean
  title: string
  /** Optional secondary line shown beneath the title (e.g. patient name). */
  subtitle?: string
  fields: FormField[]
  /** Primary button label (e.g. "Add", "Offer slot"). */
  submitLabel: string
  /** Field keys that must be filled before the primary button enables. */
  requiredKeys?: string[]
  /** Seed values (e.g. defaults). */
  initialValues?: Record<string, string>
  onClose: () => void
  onSubmit: (values: Record<string, string>) => void
}
