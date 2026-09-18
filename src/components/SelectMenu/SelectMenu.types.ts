export interface SelectOption {
  value: string
  label: string
  /** Optional second line rendered under the label (e.g. a business id) — "2 lines" dropdown variant. */
  subLabel?: string
  /** Optional section header this option is grouped under — "with Sections" dropdown variant. */
  group?: string
}

export interface SelectMenuProps {
  options: SelectOption[]
  /** Currently selected values. */
  value: string[]
  /** Optional field label shown above options (filter panel pattern). */
  title?: string
  /** Multi-select (checkboxes + All + Apply) vs single-select. */
  multi?: boolean
  searchable?: boolean
  onChange: (value: string[]) => void
  /** Multi-select only — fired when the Apply button is pressed. */
  onApply?: () => void
}
