export interface AutomotiveIntegration {
  id: string
  iconBg: string
  iconLabel: string
  name: string
  description: string
}

export const AUTOMOTIVE_INTEGRATION_CATALOG: AutomotiveIntegration[] = [
  {
    id: 'cdk',
    iconBg: '#0055A5',
    iconLabel: 'CDK',
    name: 'CDK Global',
    description: 'Sync vehicle inventory, service appointments, and customer records from CDK Drive DMS.',
  },
  {
    id: 'reynolds',
    iconBg: '#C8102E',
    iconLabel: 'R',
    name: 'Reynolds & Reynolds',
    description: 'Connect to ERA-IGNITE to manage customer accounts, ROs, and scheduling.',
  },
  {
    id: 'dealersocket',
    iconBg: '#1B3A6B',
    iconLabel: 'DS',
    name: 'DealerSocket',
    description: 'Access DealerSocket CRM and DMS data for leads, service history, and inventory.',
  },
  {
    id: 'tekion',
    iconBg: '#0B7A75',
    iconLabel: 'T',
    name: 'Tekion',
    description: 'Pull real-time vehicle data, repair orders, and appointments from Tekion ARC.',
  },
  {
    id: 'dealertrack',
    iconBg: '#E87722',
    iconLabel: 'DT',
    name: 'DealerTrack',
    description: 'Integrate DealerTrack DMS for F&I workflows, inventory, and service scheduling.',
  },
  {
    id: 'vauto',
    iconBg: '#6BBF4B',
    iconLabel: 'vA',
    name: 'vAuto',
    description: 'Connect vAuto to surface live market pricing, appraisals, and used-car inventory.',
  },
  {
    id: 'routeone',
    iconBg: '#F47B20',
    iconLabel: 'R1',
    name: 'RouteOne',
    description: 'Sync RouteOne credit applications and finance contracts into the agent workflow.',
  },
]

/** Integrations connected at the account level (multiple allowed). */
export const DEFAULT_AUTO_ACCOUNT_CONNECTED_INTEGRATION_IDS = ['cdk', 'reynolds', 'dealersocket', 'tekion']

/** All catalog integrations shown as connected in the new-agent setup wizard. */
export const DEFAULT_AUTO_WIZARD_CONNECTED_INTEGRATION_IDS = AUTOMOTIVE_INTEGRATION_CATALOG.map(
  (item) => item.id,
)

/** Single integration selected for the front desk agent. */
export const DEFAULT_AUTO_AGENT_SELECTED_INTEGRATION_ID = 'cdk'

export function getAutomotiveIntegration(id: string): AutomotiveIntegration | undefined {
  return AUTOMOTIVE_INTEGRATION_CATALOG.find((item) => item.id === id)
}
