export interface ProcedureSelectCardProps {
  title: string
  description: string
  selected: boolean
  onToggle: () => void
  onView?: () => void
}
