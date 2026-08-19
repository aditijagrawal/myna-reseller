export interface IntegrationPickerItem {
  id: string
  iconBg: string
  iconLabel: string
  name: string
  description: string
}

export interface IntegrationsPickerSaveResult {
  selectedId: string | null
  connectedIds: string[]
}

export interface IntegrationsPickerDrawerProps {
  open: boolean
  integrations: IntegrationPickerItem[]
  /** Account-level connected integrations (multiple). */
  connectedIds: string[]
  /** Agent-level selected integration (one). */
  selectedId: string | null
  onClose: () => void
  onSave: (result: IntegrationsPickerSaveResult) => void
  onOpenIntegrationSettings?: (integrationId: string) => void
}
