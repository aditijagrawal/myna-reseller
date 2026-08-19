export interface ColumnOption {
  key: string
  label: string
  /** Mandatory column — always checked, cannot be unchecked or reordered. */
  locked?: boolean
}

export interface CustomizeColumnsDrawerProps {
  open: boolean
  /** All available columns, in their current display order. */
  options: ColumnOption[]
  /** Keys of the columns currently shown in the table. */
  visibleKeys: string[]
  onClose: () => void
  /** Apply: receives the new ordered list of all keys and the visible subset. */
  onSave: (orderedKeys: string[], visibleKeys: string[]) => void
  onRestoreDefault: () => void
}
