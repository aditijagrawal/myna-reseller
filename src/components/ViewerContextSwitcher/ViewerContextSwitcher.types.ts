import type { ViewerRole } from '../../data/resellerTypes'

export interface ViewerContextSwitcherProps {
  viewerRole: ViewerRole
  businesses: { id: string; name: string }[]
  onChange: (role: ViewerRole) => void
}
