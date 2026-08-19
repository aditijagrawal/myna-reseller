export type ChipVariant = 'warning' | 'success' | 'danger' | 'neutral'

export interface ChipProps {
  label: string
  variant?: ChipVariant
}
