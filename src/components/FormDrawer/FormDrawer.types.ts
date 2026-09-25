import type { SelectOption } from '../SelectMenu/SelectMenu.types'
import type { TemplateCategory, TemplateItem } from '../TemplatePicker/TemplatePicker'

export type FormFieldType = 'text' | 'select' | 'template-picker' | 'template-modal' | 'textarea'

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
  /** Options for select fields — plain strings, or SelectOptions for grouped/2-line variants. */
  options?: string[] | SelectOption[]
  /** Allow selecting multiple options (select fields only). Value is stored as a comma-joined string. */
  multi?: boolean
  /** Options for template-picker fields. */
  templateOptions?: TemplateOption[]
  /** Categories for template-modal fields — rendered as the left sidebar. */
  templateCategories?: TemplateCategory[]
  /** Items for template-modal fields. Value is stored as a comma-joined list of item ids. */
  templateItems?: TemplateItem[]
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
