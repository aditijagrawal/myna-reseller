export interface IntegrationSelectCardProps {
  name: string
  description: string
  iconBg: string
  iconLabel: string
  selected: boolean
  connected: boolean
  onSelect?: () => void
  onView?: () => void
  onConnect?: () => void
}
