import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ConfirmModal,
  CustomizeColumnsDrawer,
  DataTable,
  FilterPanel,
  FormDrawer,
  HeaderSearchField,
  Icon,
  Link,
  Toast,
  TopNav,
  type ColumnOption,
  type FilterField,
  type RowMenuItem,
  type SelectOption,
  type TemplateCategory,
  type TemplateItem,
} from '../components'
import { BackArrowIcon } from '../assets/BackArrowIcon'

type BlueprintStatus = 'Completed' | 'Draft' | 'Syncing'

interface FeatureGroups {
  listingOptimizationAgents: string[]
  reviewGenerationAgents: string[]
  reviewResponseAgents: string[]
  templates: string[]
}

type BusinessDeployStatus = 'Completed' | 'In progress' | 'Failed'

interface BlueprintRow {
  name: string
  lastUpdatedBy: string
  status: BlueprintStatus
  features: number
  featureGroups: FeatureGroups
  businesses: number
  businessNames: string[]
  businessStatuses: Record<string, BusinessDeployStatus>
  businessFeatureStatuses: Record<string, Record<string, BusinessDeployStatus>>
  sourceAccount: string
  updatedOn: string
}

interface FeatureSection {
  label: string
  items: string[]
}

function getFeatureSections(featureGroups: FeatureGroups): FeatureSection[] {
  return [
    { label: 'Listing optimization agents', items: featureGroups.listingOptimizationAgents },
    { label: 'Review generation agents', items: featureGroups.reviewGenerationAgents },
    { label: 'Review response agents', items: featureGroups.reviewResponseAgents },
    { label: 'Templates', items: featureGroups.templates },
  ].filter((s) => s.items.length > 0)
}

function flattenFeatures(featureGroups: FeatureGroups): string[] {
  return getFeatureSections(featureGroups).flatMap((s) => s.items)
}

const FEATURE_SECTION_NOTES: Record<string, string> = {
  'Listing optimization agents':
    'This agent will be created for each selected business using its default configuration.',
  'Review generation agents':
    'This agent will be created for each selected business. If an agent with the same name already exists, a copy will be created with "- Copy" appended to the name.',
  'Review response agents':
    'This agent will be created for each selected business. If an agent with the same name already exists, a copy will be created with "- Copy" appended to the name.',
  Templates:
    'This template will be created for each selected business. If a template with the same name already exists, a copy will be created with "- Copy" appended to the template name. If no template with the same name exists, the template will be created with the exact same name.',
}

const FEATURE_ITEM_NOTES: Record<string, string> = {
  'Listing Health Optimizer': 'Will be activated automatically once copied.',
  'Post-Visit Review Generator':
    'Needs Post-Visit Review Request template. A copy of the template will be created and associated with the agent. Will be activated automatically once copied.',
  'AI Review Responder': 'Requires Approval Workflow configuration at each business level. Will be activated once configured.',
  'Post-Visit Review Request': 'Ready to use once copied.',
}

function generateBusinessFeatureStatuses(
  businessNames: string[],
  features: string[],
): Record<string, Record<string, BusinessDeployStatus>> {
  const result: Record<string, Record<string, BusinessDeployStatus>> = {}
  businessNames.forEach((business, bi) => {
    const featureStatuses: Record<string, BusinessDeployStatus> = {}
    features.forEach((feature, fi) => {
      const idx = bi * features.length + fi
      featureStatuses[feature] = idx % 11 === 10 ? 'Failed' : idx % 7 === 6 ? 'In progress' : 'Completed'
    })
    result[business] = featureStatuses
  })
  return result
}

function aggregateStatus(featureStatuses: Record<string, BusinessDeployStatus>): BusinessDeployStatus {
  const values = Object.values(featureStatuses)
  if (values.includes('Failed')) return 'Failed'
  if (values.includes('In progress')) return 'In progress'
  return 'Completed'
}

function generateBusinessStatuses(
  businessNames: string[],
  features: string[],
): { statuses: Record<string, BusinessDeployStatus>; featureStatuses: Record<string, Record<string, BusinessDeployStatus>> } {
  const featureStatuses = generateBusinessFeatureStatuses(businessNames, features)
  const statuses: Record<string, BusinessDeployStatus> = {}
  businessNames.forEach((business) => {
    statuses[business] = aggregateStatus(featureStatuses[business])
  })
  return { statuses, featureStatuses }
}

function DeployStatusChip({ status }: { status: BusinessDeployStatus }) {
  const styles: Record<BusinessDeployStatus, string> = {
    Completed: 'bg-[#f1faf0] text-[#377e2c]',
    'In progress': 'bg-[#fef3d6] text-[#c69204]',
    Failed: 'bg-[#fef6f5] text-[#de1b0c]',
  }
  return (
    <span className={`inline-flex items-center rounded-sm px-sm py-[2px] text-small ${styles[status]}`}>
      {status}
    </span>
  )
}

function ViewStatusAccordion({
  row,
  expandedBusiness,
  onToggleExpand,
  onRetry,
  onRetryFeature,
}: {
  row: BlueprintRow
  expandedBusiness: string | null
  onToggleExpand: (business: string) => void
  onRetry: (business: string) => void
  onRetryFeature: (business: string, feature: string) => void
}) {
  const businesses = Object.keys(row.businessStatuses).sort((a, b) =>
    parseBusinessLabel(a).title.localeCompare(parseBusinessLabel(b).title),
  )
  const features = flattenFeatures(row.featureGroups)

  return (
    <div>
      <div className="flex items-center px-md py-sm">
        <span className="flex-1 text-small text-text-secondary">Businesses</span>
        <span className="w-[140px] shrink-0 text-small text-text-secondary">Status</span>
      </div>
      {businesses.map((business) => {
        const status = row.businessStatuses[business]
        const { title, code } = parseBusinessLabel(business)
        const expanded = expandedBusiness === business
        return (
          <div key={business} className="border-t border-border">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onToggleExpand(business)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onToggleExpand(business)
                }
              }}
              className={`group/row flex w-full cursor-pointer items-center gap-xs px-md py-sm text-left hover:bg-surface-hover ${
                expanded ? 'bg-surface-hover' : ''
              }`}
            >
              <Icon name={expanded ? 'expand_less' : 'expand_more'} size={18} className="shrink-0 text-text-icon" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-body text-text-primary">{title}</span>
                <span className="truncate text-small text-text-tertiary">{code}</span>
              </span>
              <span className="flex w-[140px] shrink-0 items-center gap-xs">
                <DeployStatusChip status={status} />
                {status === 'Failed' && (
                  <button
                    type="button"
                    aria-label="Retry"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRetry(business)
                    }}
                    className="flex size-7 shrink-0 items-center justify-center rounded-sm text-text-icon opacity-0 hover:bg-surface-l2 group-hover/row:opacity-100"
                  >
                    <Icon name="sync" size={16} />
                  </button>
                )}
              </span>
            </div>
            {expanded && (
              <div className="bg-surface-l2 pl-[42px] pr-md">
                {features.map((feature, fi) => {
                  const featureStatus = row.businessFeatureStatuses[business]?.[feature] ?? status
                  return (
                    <div
                      key={feature}
                      className={`group/feature flex items-center py-sm ${
                        fi < features.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <span className="min-w-0 flex-1 truncate text-body text-text-primary">{feature}</span>
                      <span className="flex w-[140px] shrink-0 items-center gap-xs">
                        <DeployStatusChip status={featureStatus} />
                        {featureStatus === 'Failed' && (
                          <button
                            type="button"
                            aria-label="Retry"
                            onClick={(e) => {
                              e.stopPropagation()
                              onRetryFeature(business, feature)
                            }}
                            className="flex size-7 shrink-0 items-center justify-center rounded-sm text-text-icon opacity-0 hover:bg-surface-hover group-hover/feature:opacity-100"
                          >
                            <Icon name="sync" size={16} />
                          </button>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const LISTING_OPTIMIZATION_AGENTS = ['Listing Health Optimizer', 'Optimization 2', 'Optimization 3']
const REVIEW_GENERATION_AGENTS = ['Post-Visit Review Generator', 'Generation - follow-up', 'Generation - reminder']
const REVIEW_RESPONSE_AGENTS = ['AI Review Responder', 'Review response - negative', 'Review response - neutral']

const TEMPLATE_NAMES = [
  'Post-Visit Review Request',
  'Review response template',
  'Thank you template',
  'Listing update template',
  'Escalation template',
]

const TEMPLATE_PREVIEWS: Record<string, string> = {
  'Post-Visit Review Request': 'Hi [Customer Name], thanks for visiting [Business Name]. Mind leaving us a quick review? It really helps.',
  'Review response template': 'Thank you for sharing your feedback, [Customer Name]. We appreciate you taking the time to let us know.',
  'Thank you template': 'Hi [Customer Name], just a note to say thank you for choosing [Business Name]. We hope to see you again soon.',
  'Listing update template': 'Hi [Customer Name], our business hours and details have been updated — take a look and let us know if you have questions.',
  'Escalation template': "Hi [Customer Name], we're sorry to hear about your experience. A member of our team will reach out shortly to make it right.",
}

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: 'reviews', label: 'Reviews', count: TEMPLATE_NAMES.length },
  { id: 'referrals', label: 'Referrals', count: 120, disabled: true },
  { id: 'surveys', label: 'Surveys', count: 120, disabled: true },
  { id: 'cx', label: 'Customer experience', count: 100, disabled: true },
  { id: 'custom', label: 'Custom', count: 100, disabled: true },
]

const TEMPLATE_ITEMS: TemplateItem[] = TEMPLATE_NAMES.map((name) => ({
  id: name,
  category: 'reviews',
  title: name,
  preview: TEMPLATE_PREVIEWS[name] ?? '',
}))

const ALL_AGENT_NAMES = [...LISTING_OPTIMIZATION_AGENTS, ...REVIEW_GENERATION_AGENTS, ...REVIEW_RESPONSE_AGENTS]

const BUSINESS_NAME_POOL = [
  'Bright Smiles Dental', 'Pearl White Dentistry', 'Gentle Care Dental', 'Smile Studio', 'Crown Dental Group',
  'Lumen Healthcare', 'Kareo Dental', 'Athenahealth Clinic', 'DrChrono Medical', 'NextGen Family Care',
  'Cerner Wellness Center', 'Allscripts Urgent Care', 'Meditech Group', 'Epic Health Partners', 'McKesson Care Center',
  'Clearview Dental Office', 'Coastal Dental Practice', 'Elite Dental Care', 'Family Dental Center', 'Harmony Dental Spa',
  'Precision Dental Arts', 'Premier Dental Solutions', 'Summit Dental Partners', 'Valley Dental Clinic', 'Apex Dental Associates',
  'Riverside Dental Group', 'Sunrise Family Dentistry', 'Maple Grove Dental', 'Union Square Dental', 'Willow Creek Dental Care',
]

const BUSINESS_NAMES = BUSINESS_NAME_POOL.map((name, i) => `${100000000000000 + i} ${name}`)

function take<T>(pool: T[], count: number, offset: number): T[] {
  return Array.from({ length: count }, (_, i) => pool[(offset + i) % pool.length])
}

function buildRow(
  name: string,
  lastUpdatedBy: string,
  status: BlueprintStatus,
  counts: { listing: number; generation: number; response: number; templates: number },
  businesses: number,
  sourceAccount: string,
  updatedOn: string,
  offset: number,
): BlueprintRow {
  const featureGroups: FeatureGroups = {
    listingOptimizationAgents: take(LISTING_OPTIMIZATION_AGENTS, counts.listing, offset),
    reviewGenerationAgents: take(REVIEW_GENERATION_AGENTS, counts.generation, offset),
    reviewResponseAgents: take(REVIEW_RESPONSE_AGENTS, counts.response, offset),
    templates: take(TEMPLATE_NAMES, counts.templates, offset),
  }
  const features =
    featureGroups.listingOptimizationAgents.length +
    featureGroups.reviewGenerationAgents.length +
    featureGroups.reviewResponseAgents.length +
    featureGroups.templates.length
  const businessNames = take(BUSINESS_NAMES, businesses, offset)
  const { statuses, featureStatuses } = generateBusinessStatuses(businessNames, flattenFeatures(featureGroups))
  return {
    name,
    lastUpdatedBy,
    status,
    features,
    featureGroups,
    businesses,
    businessNames,
    businessStatuses: statuses,
    businessFeatureStatuses: featureStatuses,
    sourceAccount,
    updatedOn,
  }
}

const INITIAL_DATA: BlueprintRow[] = [
  buildRow('Review Management Essentials', 'Adam', 'Completed', { listing: 1, generation: 1, response: 1, templates: 1 }, 20, 'Lakeside Autogroup', 'Sep 10, 2026', 0),
  buildRow('Customer Engagement Pack', 'Adam', 'Completed', { listing: 1, generation: 1, response: 1, templates: 2 }, 10, 'Lakeside Autogroup', 'Sep 04, 2026', 1),
  buildRow('Reputation Growth Setup', 'Adam', 'Draft', { listing: 1, generation: 2, response: 1, templates: 1 }, 30, 'Lakeside Autogroup', 'Sep 01, 2026', 2),
  buildRow('Social & Reviews Starter', 'Adam', 'Syncing', { listing: 1, generation: 1, response: 2, templates: 1 }, 10, 'Lakeside Autogroup', 'Oct 20, 2026', 3),
  buildRow('Complete Reputation Automation', 'Adam', 'Completed', { listing: 2, generation: 1, response: 1, templates: 2 }, 30, 'Lakeside Autogroup', 'Oct 15, 2026', 4),
]

const FILTER_FIELDS: FilterField[] = [
  { id: 'features', label: 'Features', options: [...ALL_AGENT_NAMES, ...TEMPLATE_NAMES].map((l) => ({ value: l, label: l })) },
  { id: 'businesses', label: 'Businesses', options: BUSINESS_NAMES.map((l) => ({ value: l, label: l })) },
  { id: 'updatedOn', label: 'Updated on', type: 'date-range' },
]

function today(): string {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

const BUSINESS_SELECT_OPTIONS: SelectOption[] = BUSINESS_NAMES.map((name) => {
  const { title, code } = parseBusinessLabel(name)
  return { value: name, label: title, subLabel: code }
})

const AGENT_SELECT_OPTIONS: SelectOption[] = [
  ...LISTING_OPTIMIZATION_AGENTS.map((name) => ({ value: name, label: name, group: 'Listing optimization agents' })),
  ...REVIEW_GENERATION_AGENTS.map((name) => ({ value: name, label: name, group: 'Review generation agents' })),
  ...REVIEW_RESPONSE_AGENTS.map((name) => ({ value: name, label: name, group: 'Review response agents' })),
]

function parseBusinessLabel(name: string): { title: string; code: string } {
  const match = name.match(/^(\S+)\s+(.*)$/)
  return match ? { code: match[1], title: match[2] } : { code: '', title: name }
}

function ChevronCell({ value, active, onToggle }: { value: number; active: boolean; onToggle: (rect: DOMRect) => void }) {
  return (
    <div className="flex items-center gap-xs">
      <span>{value}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onToggle(e.currentTarget.getBoundingClientRect())
        }}
        className={`flex size-5 items-center justify-center rounded-sm text-text-icon hover:bg-surface-l2 ${
          active ? '' : 'opacity-0 group-hover/row:opacity-100'
        }`}
      >
        <Icon name="expand_more" size={16} />
      </button>
    </div>
  )
}

function Checkbox({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return (
    <span
      className={`flex size-[18px] shrink-0 items-center justify-center rounded-[2px] border transition-colors ${
        checked
          ? disabled
            ? 'border-control-disabled bg-control-disabled'
            : 'border-primary bg-primary'
          : 'border-control-border bg-surface'
      }`}
    >
      {checked && <Icon name="check" size={14} weight={500} className="text-white" />}
    </span>
  )
}

interface CellMenuState {
  key: string
  rowName: string
  column: 'features' | 'businesses'
  top: number
  left: number
}

interface ColumnDef {
  key: string
  label: string
  sortable?: boolean
  locked?: boolean
  render?: (value: unknown, row: unknown) => ReactNode
}

const DEFAULT_COLUMN_ORDER = ['name', 'updatedOn', 'sourceAccount', 'features', 'businesses']

interface BlueprintsScreenProps {
  onBack: () => void
}

export function BlueprintsScreen({ onBack }: BlueprintsScreenProps) {
  const [rows, setRows] = useState<BlueprintRow[]>(INITIAL_DATA)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const [columnOrder, setColumnOrder] = useState<string[]>(DEFAULT_COLUMN_ORDER)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_COLUMN_ORDER)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingRowName, setEditingRowName] = useState<string | null>(null)
  const [cellMenu, setCellMenu] = useState<CellMenuState | null>(null)
  const [deployRowName, setDeployRowName] = useState<string | null>(null)
  const [deployStep, setDeployStep] = useState<'select' | 'note'>('select')
  const [deploySelected, setDeploySelected] = useState<string[]>([])
  const [deploySearch, setDeploySearch] = useState('')
  const [expandedNoteItems, setExpandedNoteItems] = useState<string[]>([])
  const [viewStatusRowName, setViewStatusRowName] = useState<string | null>(null)
  const [expandedStatusBusiness, setExpandedStatusBusiness] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'duplicate'; rowName: string } | null>(null)
  const [deployConfirmOpen, setDeployConfirmOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  function showToast(message: string) {
    setToastMessage(message)
    setToastVisible(true)
  }

  const filtered = search.trim()
    ? rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
    : rows

  const activeCellRow = cellMenu ? rows.find((r) => r.name === cellMenu.rowName) : undefined
  const deployRow = deployRowName ? rows.find((r) => r.name === deployRowName) : undefined
  const viewStatusRow = viewStatusRowName ? rows.find((r) => r.name === viewStatusRowName) : undefined
  const editingRow = editingRowName ? rows.find((r) => r.name === editingRowName) : undefined

  useEffect(() => {
    if (deployRow) {
      setDeploySelected([])
      setDeploySearch('')
      setDeployStep('select')
      setDeployConfirmOpen(false)
      setExpandedNoteItems([])
    }
  }, [deployRow])

  useEffect(() => {
    setExpandedStatusBusiness(null)
  }, [viewStatusRowName])

  const filteredBusinessOptions = useMemo(
    () => BUSINESS_NAMES.filter((b) => b.toLowerCase().includes(deploySearch.trim().toLowerCase())),
    [deploySearch],
  )
  const alreadyDeployed = deployRow?.businessNames ?? []
  const addableOptions = filteredBusinessOptions.filter((b) => !alreadyDeployed.includes(b))
  const allSelected = addableOptions.length > 0 && addableOptions.every((b) => deploySelected.includes(b))

  const COLUMN_DEFS: ColumnDef[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      locked: true,
      render: (_: unknown, row: unknown) => {
        const r = row as BlueprintRow
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setEditingRowName(r.name)
              setDrawerOpen(true)
            }}
            className="flex flex-col text-left"
          >
            <span className="text-body text-text-primary group-hover/row:text-primary">{r.name}</span>
            <span className="text-small text-text-secondary">Last updated by {r.lastUpdatedBy}</span>
          </button>
        )
      },
    },
    { key: 'updatedOn', label: 'Updated on', sortable: true },
    { key: 'sourceAccount', label: 'Source account', sortable: true },
    {
      key: 'features',
      label: 'Features',
      sortable: true,
      render: (_: unknown, row: unknown) => {
        const r = row as BlueprintRow
        const key = `${r.name}-features`
        return (
          <ChevronCell
            value={r.features}
            active={cellMenu?.key === key}
            onToggle={(rect) =>
              setCellMenu((prev) =>
                prev?.key === key ? null : { key, rowName: r.name, column: 'features', top: rect.bottom + 4, left: rect.left },
              )
            }
          />
        )
      },
    },
    {
      key: 'businesses',
      label: 'Businesses',
      sortable: true,
      render: (_: unknown, row: unknown) => {
        const r = row as BlueprintRow
        const key = `${r.name}-businesses`
        return (
          <ChevronCell
            value={r.businesses}
            active={cellMenu?.key === key}
            onToggle={(rect) =>
              setCellMenu((prev) =>
                prev?.key === key ? null : { key, rowName: r.name, column: 'businesses', top: rect.bottom + 4, left: rect.left },
              )
            }
          />
        )
      },
    },
  ]

  const DEF_BY_KEY = new Map(COLUMN_DEFS.map((c) => [c.key, c]))
  const columns = columnOrder
    .filter((k) => visibleColumns.includes(k))
    .map((k) => DEF_BY_KEY.get(k))
    .filter((c): c is ColumnDef => Boolean(c))
  const columnOptions: ColumnOption[] = columnOrder.map((k) => ({
    key: k,
    label: DEF_BY_KEY.get(k)?.label ?? k,
    locked: DEF_BY_KEY.get(k)?.locked,
  }))

  const rowMenuItems: RowMenuItem<Record<string, unknown>>[] = [
    {
      label: 'Deploy',
      onClick: (row) => setDeployRowName((row as unknown as BlueprintRow).name),
      disabled: (row) => {
        const r = row as unknown as BlueprintRow
        return r.status === 'Syncing' || r.businessNames.length >= BUSINESS_NAMES.length
      },
      description: (row) => {
        const r = row as unknown as BlueprintRow
        return r.status === 'Syncing' ? 'Creating managed package..' : 'No new business'
      },
    },
    {
      label: 'View status',
      onClick: (row) => setViewStatusRowName((row as unknown as BlueprintRow).name),
      visible: (row) => (row as unknown as BlueprintRow).status !== 'Draft',
    },
    {
      label: 'Delete',
      onClick: (row) => setConfirmAction({ type: 'delete', rowName: (row as unknown as BlueprintRow).name }),
      variant: 'danger',
    },
    {
      label: 'Duplicate',
      onClick: (row) => setConfirmAction({ type: 'duplicate', rowName: (row as unknown as BlueprintRow).name }),
    },
  ]

  const CONFIRM_COPY: Record<'delete' | 'duplicate', { title: string; description: string; confirmLabel: string }> = {
    delete: {
      title: 'Delete this managed package?',
      description: 'This permanently deletes the managed package. Businesses that already received it keep their current features, but won’t get future updates from it.',
      confirmLabel: 'Delete',
    },
    duplicate: {
      title: 'Duplicate this managed package?',
      description: 'This creates an exact copy of this managed package, including its source account and selected features',
      confirmLabel: 'Duplicate',
    },
  }

  function runConfirmedAction() {
    if (!confirmAction) return
    const { type, rowName } = confirmAction

    if (type === 'delete') {
      setRows((prev) => prev.filter((r) => r.name !== rowName))
      showToast('Managed package deleted')
    } else if (type === 'duplicate') {
      setRows((prev) => {
        const source = prev.find((r) => r.name === rowName)
        if (!source) return prev
        const copyName = `${source.name} copy`
        return [
          { ...source, name: copyName, status: 'Draft', updatedOn: today(), businesses: 0, businessNames: [], businessStatuses: {}, businessFeatureStatuses: {} },
          ...prev,
        ]
      })
      showToast('Managed package duplicated')
    }

    setConfirmAction(null)
  }

  const FEATURE_SECTIONS: FeatureSection[] = activeCellRow ? getFeatureSections(activeCellRow.featureGroups) : []

  function toggleBusiness(name: string) {
    if (alreadyDeployed.includes(name)) return
    setDeploySelected((prev) => (prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]))
  }

  function toggleAllBusinesses() {
    setDeploySelected((prev) =>
      allSelected ? prev.filter((b) => !addableOptions.includes(b)) : Array.from(new Set([...prev, ...addableOptions])),
    )
  }

  function deploy() {
    setRows((prev) =>
      prev.map((r) => {
        if (r.name !== deployRowName) return r
        const businessNames = [...r.businessNames, ...deploySelected]
        const { statuses, featureStatuses } = generateBusinessStatuses(deploySelected, flattenFeatures(r.featureGroups))
        return {
          ...r,
          businessNames,
          businesses: businessNames.length,
          businessStatuses: { ...r.businessStatuses, ...statuses },
          businessFeatureStatuses: { ...r.businessFeatureStatuses, ...featureStatuses },
          updatedOn: today(),
        }
      }),
    )
    setDeployConfirmOpen(false)
    setDeployRowName(null)
    showToast('Managed package deployed')
  }

  function retryBusiness(rowName: string, businessName: string) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.name !== rowName) return r
        const resetFeatures: Record<string, BusinessDeployStatus> = {}
        Object.keys(r.businessFeatureStatuses[businessName] ?? {}).forEach((feature) => {
          resetFeatures[feature] = 'Completed'
        })
        return {
          ...r,
          businessStatuses: { ...r.businessStatuses, [businessName]: 'Completed' },
          businessFeatureStatuses: { ...r.businessFeatureStatuses, [businessName]: resetFeatures },
        }
      }),
    )
  }

  function retryFeature(rowName: string, businessName: string, feature: string) {
    setRows((prev) =>
      prev.map((r) => {
        if (r.name !== rowName) return r
        const updatedFeatures = { ...(r.businessFeatureStatuses[businessName] ?? {}), [feature]: 'Completed' as BusinessDeployStatus }
        return {
          ...r,
          businessStatuses: { ...r.businessStatuses, [businessName]: aggregateStatus(updatedFeatures) },
          businessFeatureStatuses: { ...r.businessFeatureStatuses, [businessName]: updatedFeatures },
        }
      }),
    )
  }

  return (
    <div className="flex h-full flex-col">
      <TopNav title="Settings" initials="S" />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-xs bg-surface px-2xl pt-lg pb-0">
            <Link as="button" onClick={onBack} className="text-body">
              Settings
            </Link>
            <Icon name="chevron_right" size={16} className="text-text-tertiary" />
            <span className="text-body text-text-primary">Managed packages</span>
          </div>

          {/* Header bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between bg-surface px-2xl py-xl">
            <div className="flex flex-col gap-xs">
              <h1 className="text-h3 text-text-primary">Managed packages</h1>
              <p className="text-small text-text-secondary">
                Build a feature in your source account once and apply it to other businesses
              </p>
            </div>

            <div className="flex items-center gap-sm">
              <HeaderSearchField open={searchOpen} value={search} onOpenChange={setSearchOpen} onChange={setSearch} placeholder="Search managed packages…" />
              <button
                type="button"
                onClick={() => {
                  setEditingRowName(null)
                  setDrawerOpen(true)
                }}
                className="flex h-9 items-center rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover"
              >
                Create a new managed package
              </button>
              <button
                type="button"
                aria-label="Customize columns"
                onClick={() => setCustomizeOpen(true)}
                className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
              >
                <Icon name="view_column" size={20} />
              </button>
              <button
                type="button"
                aria-label="Filter"
                onClick={() => setFilterOpen((o) => !o)}
                className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
              >
                <Icon name="filter_list" size={20} />
              </button>
            </div>
          </div>

          {/* Info banner */}
          {!bannerDismissed && (
            <div className="mx-2xl mb-md flex items-start gap-sm rounded-sm bg-primary/5 px-md py-sm">
              <Icon name="info" size={18} className="mt-0.5 shrink-0 text-primary" />
              <p className="flex-1 text-small text-text-primary">
                When the source account is updated the managed package will automatically get synced and deploy the changes to businesses
              </p>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                className="shrink-0 text-text-icon hover:text-text-primary"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          )}

          {/* Table */}
          <div className="px-2xl">
            <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} rowMenuItems={rowMenuItems} />
          </div>
        </div>

        <FilterPanel open={filterOpen} fields={FILTER_FIELDS} onClose={() => setFilterOpen(false)} />
      </div>

      {/* Feature / business breakdown popover */}
      {cellMenu && activeCellRow && (
        <>
          <div className="fixed inset-0 z-[105]" onClick={() => setCellMenu(null)} />
          <div
            className={`fixed z-[110] flex flex-col overflow-hidden rounded-sm border border-border bg-surface shadow-dropdown ${
              cellMenu.column === 'businesses' ? 'w-[240px]' : 'max-h-[320px] w-[232px]'
            }`}
            style={{ top: cellMenu.top, left: cellMenu.left }}
          >
            <div className="px-lg pb-sm pt-md">
              <span className="text-small text-text-tertiary">{cellMenu.column === 'features' ? 'Features' : 'Businesses'}</span>
            </div>
            {cellMenu.column === 'features' ? (
              <div className="flex min-w-0 flex-col gap-xs overflow-y-auto px-lg pb-md">
                {FEATURE_SECTIONS.map((section) => (
                  <div key={section.label} className="min-w-0">
                    <p className="px-md pb-xs pt-sm text-small text-text-tertiary">{section.label}</p>
                    {section.items.map((item) => (
                      <p key={item} className="min-w-0 truncate rounded-sm py-sm pl-md pr-sm text-body text-text-primary" title={item}>{item}</p>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex max-h-[306px] min-w-0 flex-col gap-xs overflow-y-auto px-lg pb-md">
                {activeCellRow.businessNames.map((item) => {
                  const { title, code } = parseBusinessLabel(item)
                  return (
                    <div key={item} className="flex min-w-0 flex-col gap-xs rounded-sm py-sm pl-md pr-sm hover:bg-surface-hover" title={item}>
                      <p className="min-w-0 truncate text-body text-text-primary">{title}</p>
                      <p className="min-w-0 truncate text-small text-text-tertiary">{code}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Deploy — select businesses drawer */}
      <div className={`fixed inset-0 z-[100] ${deployRowName ? '' : 'pointer-events-none'}`} aria-hidden={!deployRowName}>
        <div
          onClick={() => setDeployRowName(null)}
          className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${deployRowName ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[650px] max-w-[92vw] flex-col bg-surface shadow-dropdown transition-transform duration-200 ${
            deployRowName ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex shrink-0 items-center justify-between px-2xl pb-lg pt-2xl">
            <div className="flex items-center gap-sm">
              <button
                type="button"
                aria-label="Back"
                onClick={() => setDeployRowName(null)}
                className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
              >
                <BackArrowIcon />
              </button>
              <h2 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">Deploy</h2>
            </div>
            {deployStep === 'select' ? (
              <button
                type="button"
                disabled={deploySelected.length === 0}
                onClick={() => setDeployStep('note')}
                className={`rounded-sm px-lg py-[7px] text-body font-medium transition-colors ${
                  deploySelected.length > 0
                    ? 'bg-primary text-white hover:bg-primary-hover'
                    : 'cursor-not-allowed bg-surface-selected text-text-tertiary'
                }`}
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDeployConfirmOpen(true)}
                className="rounded-sm bg-primary px-lg py-[7px] text-body font-medium text-white transition-colors hover:bg-primary-hover"
              >
                Deploy
              </button>
            )}
          </div>

          {deployStep === 'select' ? (
            <div className="flex flex-1 flex-col gap-md overflow-y-auto px-2xl pb-2xl pt-md">
              <label className="text-small text-text-primary">Select businesses</label>

              <div className="flex h-9 shrink-0 items-center gap-sm rounded-sm border border-border-selected bg-surface px-md">
                <Icon name="search" size={20} className="text-text-icon" />
                <input
                  value={deploySearch}
                  onChange={(e) => setDeploySearch(e.target.value)}
                  placeholder="Search"
                  className="min-w-0 flex-1 bg-transparent text-body text-text-primary outline-none placeholder:text-text-tertiary"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <button type="button" onClick={toggleAllBusinesses} className="flex items-center gap-sm py-sm text-left">
                  <Checkbox checked={allSelected} />
                  <span className="text-body text-text-primary">Select all</span>
                </button>
                {filteredBusinessOptions.map((name) => {
                  const locked = alreadyDeployed.includes(name)
                  const { title, code } = parseBusinessLabel(name)
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleBusiness(name)}
                      disabled={locked}
                      className={`flex items-start gap-sm py-sm text-left ${locked ? 'cursor-not-allowed' : ''}`}
                    >
                      <span className="mt-[3px]">
                        <Checkbox checked={locked || deploySelected.includes(name)} disabled={locked} />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className={`min-w-0 truncate text-body ${locked ? 'text-text-tertiary' : 'text-text-primary'}`}>{title}</span>
                        <span className="min-w-0 truncate text-small text-text-tertiary">{code}</span>
                      </span>
                    </button>
                  )
                })}
                {filteredBusinessOptions.length === 0 && (
                  <p className="text-body text-text-tertiary">No businesses found.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-lg overflow-y-auto px-2xl pb-2xl pt-md">
              <label className="text-small text-text-primary">Please note</label>
              {deployRow &&
                getFeatureSections(deployRow.featureGroups).map((section, index, sections) => (
                  <div
                    key={section.label}
                    className={`flex flex-col gap-md ${
                      index < sections.length - 1 ? 'border-b border-border pb-lg' : ''
                    }`}
                  >
                    <p className="text-[11px] uppercase tracking-wide text-text-tertiary">{section.label}</p>
                    {section.items.map((item) => {
                      const noteExpanded = expandedNoteItems.includes(item)
                      return (
                        <div key={item} className="flex flex-col">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedNoteItems((prev) =>
                                prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
                              )
                            }
                            className="flex items-center gap-xs py-xs text-left"
                          >
                            <Icon
                              name={noteExpanded ? 'expand_less' : 'expand_more'}
                              size={18}
                              className="shrink-0 text-text-icon"
                            />
                            <p className="text-body text-text-primary">{item}</p>
                          </button>
                          {noteExpanded && (
                            <p className="pl-[26px] text-body text-text-secondary">
                              {FEATURE_ITEM_NOTES[item] ?? FEATURE_SECTION_NOTES[section.label]}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
            </div>
          )}
        </aside>
      </div>

      {/* View status drawer */}
      <div className={`fixed inset-0 z-[100] ${viewStatusRowName ? '' : 'pointer-events-none'}`} aria-hidden={!viewStatusRowName}>
        <div
          onClick={() => setViewStatusRowName(null)}
          className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${viewStatusRowName ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[650px] max-w-[92vw] flex-col bg-surface shadow-dropdown transition-transform duration-200 ${
            viewStatusRowName ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex shrink-0 items-center gap-sm px-2xl pb-lg pt-2xl">
            <button
              type="button"
              aria-label="Back"
              onClick={() => setViewStatusRowName(null)}
              className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
            >
              <BackArrowIcon />
            </button>
            <h2 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">Status</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-2xl pb-2xl">
            {viewStatusRow && (
              <ViewStatusAccordion
                row={viewStatusRow}
                expandedBusiness={expandedStatusBusiness}
                onToggleExpand={(business) =>
                  setExpandedStatusBusiness((prev) => (prev === business ? null : business))
                }
                onRetry={(business) => retryBusiness(viewStatusRowName!, business)}
                onRetryFeature={(business, feature) => retryFeature(viewStatusRowName!, business, feature)}
              />
            )}
          </div>
        </aside>
      </div>

      {/* Sync / Delete / Duplicate confirm modal */}
      {confirmAction && (
        <ConfirmModal
          open
          title={CONFIRM_COPY[confirmAction.type].title}
          description={CONFIRM_COPY[confirmAction.type].description}
          confirmLabel={CONFIRM_COPY[confirmAction.type].confirmLabel}
          onClose={() => setConfirmAction(null)}
          onConfirm={runConfirmedAction}
        />
      )}

      {/* Deploy (from drawer) confirm modal */}
      <ConfirmModal
        open={deployConfirmOpen}
        title="Deploy updates to businesses?"
        description="This will apply the latest changes from your source account to every business selected"
        confirmLabel="Deploy"
        onClose={() => setDeployConfirmOpen(false)}
        onConfirm={deploy}
      />

      {/* Create / edit managed package drawer */}
      <FormDrawer
        open={drawerOpen}
        title={editingRow ? editingRow.name : 'New managed package'}
        fields={[
          { key: 'name', label: 'Name', type: 'text', placeholder: 'Example: Positive review agent package' },
          { key: 'sourceAccount', label: 'Source account', type: 'select', options: BUSINESS_SELECT_OPTIONS },
          { key: 'agents', label: 'Agents', type: 'select', options: AGENT_SELECT_OPTIONS, multi: true },
          { key: 'templates', label: 'Templates', type: 'template-modal', templateCategories: TEMPLATE_CATEGORIES, templateItems: TEMPLATE_ITEMS },
        ]}
        submitLabel="Save"
        requiredKeys={['name', 'sourceAccount']}
        initialValues={
          editingRow
            ? {
                name: editingRow.name,
                sourceAccount: editingRow.sourceAccount,
                agents: [
                  ...editingRow.featureGroups.listingOptimizationAgents,
                  ...editingRow.featureGroups.reviewGenerationAgents,
                  ...editingRow.featureGroups.reviewResponseAgents,
                ].join(','),
                templates: editingRow.featureGroups.templates.join(','),
              }
            : undefined
        }
        onClose={() => setDrawerOpen(false)}
        onSubmit={(values) => {
          const selectedAgents = values.agents ? values.agents.split(',').filter(Boolean) : []
          const selectedTemplates = values.templates ? values.templates.split(',').filter(Boolean) : []
          const featureGroups: FeatureGroups = {
            listingOptimizationAgents: selectedAgents.filter((a) => LISTING_OPTIMIZATION_AGENTS.includes(a)),
            reviewGenerationAgents: selectedAgents.filter((a) => REVIEW_GENERATION_AGENTS.includes(a)),
            reviewResponseAgents: selectedAgents.filter((a) => REVIEW_RESPONSE_AGENTS.includes(a)),
            templates: selectedTemplates,
          }
          const features = selectedAgents.length + selectedTemplates.length
          const sourceAccountName = parseBusinessLabel(values.sourceAccount).title

          if (editingRowName) {
            setRows((prev) =>
              prev.map((r) =>
                r.name === editingRowName
                  ? { ...r, name: values.name, sourceAccount: sourceAccountName, featureGroups, features, updatedOn: today() }
                  : r,
              ),
            )
          } else {
            setRows((prev) => [
              {
                name: values.name,
                lastUpdatedBy: 'You',
                status: 'Draft',
                features,
                featureGroups,
                businesses: 0,
                businessNames: [],
                businessStatuses: {},
                businessFeatureStatuses: {},
                sourceAccount: sourceAccountName,
                updatedOn: today(),
              },
              ...prev,
            ])
            showToast('Managed package created')
          }
          setDrawerOpen(false)
          setEditingRowName(null)
        }}
      />

      <CustomizeColumnsDrawer
        open={customizeOpen}
        options={columnOptions}
        visibleKeys={visibleColumns}
        onClose={() => setCustomizeOpen(false)}
        onSave={(orderedKeys, visibleKeys) => {
          setColumnOrder(orderedKeys)
          setVisibleColumns(visibleKeys)
        }}
        onRestoreDefault={() => {
          setColumnOrder(DEFAULT_COLUMN_ORDER)
          setVisibleColumns(DEFAULT_COLUMN_ORDER)
        }}
      />

      <Toast message={toastMessage} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  )
}
