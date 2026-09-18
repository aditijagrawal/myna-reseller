import { useEffect, useMemo, useState } from 'react'
import {
  ConfirmModal,
  DataTable,
  FilterPanel,
  FormDrawer,
  HeaderSearchField,
  Icon,
  Link,
  Toast,
  TopNav,
  type FilterField,
  type RowMenuItem,
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
  sourceAccount: string
  updatedOn: string
}

interface FeatureSection {
  label: string
  items: string[]
}

function getFeatureSections(row: BlueprintRow): FeatureSection[] {
  return [
    { label: 'Listing optimization agents', items: row.featureGroups.listingOptimizationAgents },
    { label: 'Review generation agents', items: row.featureGroups.reviewGenerationAgents },
    { label: 'Review response agents', items: row.featureGroups.reviewResponseAgents },
    { label: 'Templates', items: row.featureGroups.templates },
  ].filter((s) => s.items.length > 0)
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

function generateBusinessStatuses(names: string[]): Record<string, BusinessDeployStatus> {
  const result: Record<string, BusinessDeployStatus> = {}
  names.forEach((name, i) => {
    result[name] = i % 5 === 4 ? 'Failed' : i % 4 === 3 ? 'In progress' : 'Completed'
  })
  return result
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
  return {
    name,
    lastUpdatedBy,
    status,
    features,
    featureGroups,
    businesses,
    businessNames,
    businessStatuses: generateBusinessStatuses(businessNames),
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

interface BlueprintsScreenProps {
  onBack: () => void
}

export function BlueprintsScreen({ onBack }: BlueprintsScreenProps) {
  const [rows, setRows] = useState<BlueprintRow[]>(INITIAL_DATA)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingRowName, setEditingRowName] = useState<string | null>(null)
  const [cellMenu, setCellMenu] = useState<CellMenuState | null>(null)
  const [deployRowName, setDeployRowName] = useState<string | null>(null)
  const [deployStep, setDeployStep] = useState<'select' | 'note'>('select')
  const [deploySelected, setDeploySelected] = useState<string[]>([])
  const [deploySearch, setDeploySearch] = useState('')
  const [viewStatusRowName, setViewStatusRowName] = useState<string | null>(null)
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
    }
  }, [deployRow])

  const filteredBusinessOptions = useMemo(
    () => BUSINESS_NAMES.filter((b) => b.toLowerCase().includes(deploySearch.trim().toLowerCase())),
    [deploySearch],
  )
  const alreadyDeployed = deployRow?.businessNames ?? []
  const addableOptions = filteredBusinessOptions.filter((b) => !alreadyDeployed.includes(b))
  const allSelected = addableOptions.length > 0 && addableOptions.every((b) => deploySelected.includes(b))

  const columns = [
    {
      key: 'name' as const,
      label: 'Name',
      sortable: true,
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
    {
      key: 'features' as const,
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
      key: 'businesses' as const,
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
    { key: 'sourceAccount' as const, label: 'Source account', sortable: true },
    { key: 'updatedOn' as const, label: 'Updated on', sortable: true },
  ]

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
        return r.status === 'Syncing' ? 'Creating blueprint..' : 'No new business'
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
      title: 'Delete this blueprint?',
      description: 'This only deletes the blueprint. Businesses that already received it keep their copies as-is.',
      confirmLabel: 'Delete',
    },
    duplicate: {
      title: 'Duplicate this blueprint?',
      description: 'This creates an exact copy of this blueprint, including its source account and selected features',
      confirmLabel: 'Duplicate',
    },
  }

  function runConfirmedAction() {
    if (!confirmAction) return
    const { type, rowName } = confirmAction

    if (type === 'delete') {
      setRows((prev) => prev.filter((r) => r.name !== rowName))
      showToast('Blueprint deleted')
    } else if (type === 'duplicate') {
      setRows((prev) => {
        const source = prev.find((r) => r.name === rowName)
        if (!source) return prev
        const copyName = `${source.name} copy`
        return [
          { ...source, name: copyName, status: 'Draft', updatedOn: today(), businesses: 0, businessNames: [], businessStatuses: {} },
          ...prev,
        ]
      })
      showToast('Blueprint duplicated')
    }

    setConfirmAction(null)
  }

  const FEATURE_SECTIONS: FeatureSection[] = activeCellRow ? getFeatureSections(activeCellRow) : []

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
        return {
          ...r,
          businessNames,
          businesses: businessNames.length,
          businessStatuses: { ...r.businessStatuses, ...generateBusinessStatuses(deploySelected) },
          updatedOn: today(),
        }
      }),
    )
    setDeployConfirmOpen(false)
    setDeployRowName(null)
    showToast('Blueprint deployed')
  }

  function retryBusiness(rowName: string, businessName: string) {
    setRows((prev) =>
      prev.map((r) =>
        r.name === rowName
          ? { ...r, businessStatuses: { ...r.businessStatuses, [businessName]: 'Completed' } }
          : r,
      ),
    )
  }

  return (
    <div className="flex h-full flex-col">
      <TopNav initials="S" />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-xs bg-surface px-2xl pt-lg pb-0">
            <Link as="button" onClick={onBack} className="text-body">
              Settings
            </Link>
            <Icon name="chevron_right" size={16} className="text-text-tertiary" />
            <span className="text-body text-text-primary">Blueprints</span>
          </div>

          {/* Header bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between bg-surface px-2xl py-xl">
            <div className="flex flex-col gap-xs">
              <h1 className="text-h3 text-text-primary">Blueprints</h1>
              <p className="text-small text-text-secondary">
                Build a feature in your source account once and apply it to other businesses
              </p>
            </div>

            <div className="flex items-center gap-sm">
              <HeaderSearchField open={searchOpen} value={search} onOpenChange={setSearchOpen} onChange={setSearch} placeholder="Search blueprints…" />
              <button
                type="button"
                onClick={() => {
                  setEditingRowName(null)
                  setDrawerOpen(true)
                }}
                className="flex h-9 items-center rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover"
              >
                Create a new blueprint
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
                When the source account is updated the blueprint will automatically get synced and deploy the changes to businesses
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
              <h2 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">{deployRowName}</h2>
              {deployStep === 'note' && <Icon name="info" size={20} className="text-text-icon" />}
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
                getFeatureSections(deployRow).map((section) => (
                  <div key={section.label} className="flex flex-col gap-md">
                    <p className="text-small text-text-tertiary">{section.label}</p>
                    {section.items.map((item) => (
                      <div key={item} className="flex flex-col gap-xs">
                        <p className="text-body text-text-primary">{item}</p>
                        <p className="text-body text-text-secondary">
                          {FEATURE_ITEM_NOTES[item] ?? FEATURE_SECTION_NOTES[section.label]}
                        </p>
                      </div>
                    ))}
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
            <h2 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">{viewStatusRowName}</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-2xl pb-2xl">
            {viewStatusRow && (
              <DataTable
                columns={[
                  { key: 'business', label: 'Businesses', sortable: true },
                  {
                    key: 'status',
                    label: 'Status',
                    sortable: true,
                    render: (v) => <DeployStatusChip status={v as BusinessDeployStatus} />,
                  },
                ]}
                data={Object.entries(viewStatusRow.businessStatuses).map(([business, status]) => ({ business, status }))}
                rowAction={{
                  icon: 'sync',
                  label: 'Retry',
                  visible: (row) => (row as unknown as { status: BusinessDeployStatus }).status === 'Failed',
                  onClick: (row) => retryBusiness(viewStatusRowName!, (row as unknown as { business: string }).business),
                }}
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

      {/* Create / edit blueprint drawer */}
      <FormDrawer
        open={drawerOpen}
        title={editingRow ? editingRow.name : 'New blueprint'}
        fields={[
          { key: 'name', label: 'Name', type: 'text', placeholder: 'Example: Positive review agent blueprint' },
          { key: 'sourceAccount', label: 'Source account', type: 'select', options: BUSINESS_NAMES },
          { key: 'agents', label: 'Agents', type: 'select', options: ALL_AGENT_NAMES },
          { key: 'templates', label: 'Templates', type: 'select', options: TEMPLATE_NAMES },
        ]}
        submitLabel="Save"
        requiredKeys={['name', 'sourceAccount']}
        initialValues={
          editingRow
            ? {
                name: editingRow.name,
                sourceAccount: editingRow.sourceAccount,
                agents:
                  editingRow.featureGroups.listingOptimizationAgents[0] ??
                  editingRow.featureGroups.reviewGenerationAgents[0] ??
                  editingRow.featureGroups.reviewResponseAgents[0] ??
                  '',
                templates: editingRow.featureGroups.templates[0] ?? '',
              }
            : undefined
        }
        onClose={() => setDrawerOpen(false)}
        onSubmit={(values) => {
          const agent = values.agents
          const isListing = LISTING_OPTIMIZATION_AGENTS.includes(agent)
          const isGeneration = REVIEW_GENERATION_AGENTS.includes(agent)
          const isResponse = REVIEW_RESPONSE_AGENTS.includes(agent)
          const featureGroups: FeatureGroups = {
            listingOptimizationAgents: isListing ? [agent] : [],
            reviewGenerationAgents: isGeneration ? [agent] : [],
            reviewResponseAgents: isResponse ? [agent] : [],
            templates: values.templates ? [values.templates] : [],
          }
          const features = (agent ? 1 : 0) + (values.templates ? 1 : 0)

          if (editingRowName) {
            setRows((prev) =>
              prev.map((r) =>
                r.name === editingRowName
                  ? { ...r, name: values.name, sourceAccount: values.sourceAccount, featureGroups, features, updatedOn: today() }
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
                sourceAccount: values.sourceAccount,
                updatedOn: today(),
              },
              ...prev,
            ])
            showToast('Blueprint created')
          }
          setDrawerOpen(false)
          setEditingRowName(null)
        }}
      />

      <Toast message={toastMessage} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  )
}
