import type { SelectOption } from '../SelectMenu/SelectMenu.types'

export interface FilterField {
  id: string
  label: string
  /** Options shown in the select menu when the field is opened. */
  options?: SelectOption[]
  /** Multi-select (default true) vs single-select. */
  multi?: boolean
}

export interface FilterPanelProps {
  open: boolean
  fields: FilterField[]
  selections?: Record<string, string[]>
  onSelectionsChange?: (selections: Record<string, string[]>) => void
  onClose?: () => void
  onSaveView?: () => void
  onAdvancedFilters?: () => void
  onSelectionChange?: (selections: Record<string, string[]>) => void
}
