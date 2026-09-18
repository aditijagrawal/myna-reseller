import { useState } from 'react'
import {
  DataTable,
  Icon,
  Toast,
  TopNav,
  type Column,
} from '../components'
import { RESELLER_BUSINESSES } from '../data/agentWorkflows'

interface AssetItem {
  id: string
  label: string
}

interface AssetSubgroup {
  id: string
  label: string
  items: AssetItem[]
}

interface AssetGroup {
  id: string
  label: string
  subgroups?: AssetSubgroup[]
  items?: AssetItem[]
}

// Sample asset catalog for Phase 1 — agents only, ordered Reviews AI first,
// then Social AI, matching the reseller snapshot rollout order.
const ASSET_GROUPS: AssetGroup[] = [
  {
    id: 'agents',
    label: 'Agents',
    subgroups: [
      {
        id: 'agents-reviews',
        label: 'Reviews',
        items: [
          { id: 'review-response-positive', label: 'Review response agent — Positive review flow' },
          { id: 'review-response-negative', label: 'Review response agent — Negative review flow' },
          { id: 'review-generation-clinic', label: 'Review generation agent — Clinic visit flow' },
        ],
      },
      {
        id: 'agents-social',
        label: 'Social',
        items: [
          { id: 'social-publishing-google', label: 'Social publishing agent — Google publishing flow' },
          { id: 'social-publishing-instagram', label: 'Social publishing agent — Instagram publishing flow' },
          { id: 'social-engagement-likes', label: 'Social engagement agent — Increase likes' },
          { id: 'social-engagement-comments', label: 'Social engagement agent — Increase comments' },
        ],
      },
    ],
  },
  {
    id: 'templates',
    label: 'Templates',
    subgroups: [
      {
        id: 'templates-review',
        label: 'Review templates',
        items: [
          { id: 'tpl-post-visit-review-request', label: 'Post-visit review request' },
          { id: 'tpl-patient-followup-review', label: 'Patient follow-up review' },
          { id: 'tpl-review-reminder', label: 'Review reminder' },
        ],
      },
      {
        id: 'templates-survey',
        label: 'Survey templates',
        items: [
          { id: 'tpl-patient-satisfaction-survey', label: 'Patient satisfaction survey' },
          { id: 'tpl-post-visit-feedback-survey', label: 'Post-visit feedback survey' },
          { id: 'tpl-nps-survey', label: 'NPS survey' },
        ],
      },
      {
        id: 'templates-messaging',
        label: 'Messaging templates',
        items: [
          { id: 'tpl-appointment-reminder', label: 'Appointment reminder' },
          { id: 'tpl-appointment-confirmation', label: 'Appointment confirmation' },
          { id: 'tpl-missed-appointment-followup', label: 'Missed appointment follow-up' },
        ],
      },
    ],
  },
  {
    id: 'custom-roles',
    label: 'Custom roles',
    items: [
      { id: 'role-location-manager', label: 'Location manager' },
      { id: 'role-marketing-manager', label: 'Marketing manager' },
      { id: 'role-front-desk-manager', label: 'Front desk manager' },
    ],
  },
  {
    id: 'custom-fields',
    label: 'Custom fields',
    items: [
      { id: 'field-patient-type', label: 'Patient type' },
      { id: 'field-membership-status', label: 'Membership status' },
      { id: 'field-customer-category', label: 'Customer category' },
    ],
  },
]

function countSelectedInGroup(group: AssetGroup, selected: Set<string>): number {
  const itemIds = group.items ? group.items.map((i) => i.id) : (group.subgroups ?? []).flatMap((sg) => sg.items.map((i) => i.id))
  return itemIds.filter((id) => selected.has(id)).length
}

function summarizeAssets(selected: Set<string>): string {
  const categoryLabels: string[] = []
  ASSET_GROUPS.forEach((group) => {
    const groupItemIds = group.items
      ? group.items.map((i) => i.id)
      : (group.subgroups ?? []).flatMap((sg) => sg.items.map((i) => i.id))
    if (groupItemIds.some((id) => selected.has(id))) categoryLabels.push(group.label)
  })
  return `${selected.size} asset${selected.size === 1 ? '' : 's'} (${categoryLabels.join(', ')})`
}

// Groups the given asset ids by their top-level category (Agents, Templates, ...)
// for the "Review what will be copied" step of the Load snapshot flow.
function getAssetGroupBreakdown(assetIds: string[]): { groupLabel: string; items: AssetItem[] }[] {
  return ASSET_GROUPS.map((group) => {
    const allItems = group.items ?? (group.subgroups ?? []).flatMap((sg) => sg.items)
    const items = allItems.filter((i) => assetIds.includes(i.id))
    return { groupLabel: group.label, items }
  }).filter((g) => g.items.length > 0)
}

// The Review response agent's flows that this Phase 2 prototype focuses on —
// used to decide whether to surface the "Requires setup in each business" section.
const REVIEW_RESPONSE_AGENT_ASSET_IDS = ['review-response-positive', 'review-response-negative']

// Template that ships as part of the Review generation agent — Clinic visit
// flow, used to demonstrate the template-conflict / auto-creation scenario.
const CLINIC_VISIT_TEMPLATE_LABEL = 'Clinic visit review request template'
const TEMPLATE_DEPENDENCIES: Record<string, string> = {
  'review-generation-clinic': CLINIC_VISIT_TEMPLATE_LABEL,
}

function AccordionHeader({
  label,
  count,
  expanded,
  onToggle,
}: {
  label: string
  count: number
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-sm py-sm text-left hover:bg-surface-hover"
    >
      <span className="text-body text-text-primary">{label}</span>
      <span className="flex items-center gap-sm">
        {count > 0 && <span className="text-small text-text-tertiary">{count} selected</span>}
        <Icon name={expanded ? 'expand_less' : 'expand_more'} size={20} className="text-text-icon" />
      </span>
    </button>
  )
}

function CheckboxRow({
  label,
  checked,
  onToggle,
  disabled,
  note,
}: {
  label: string
  checked: boolean
  onToggle: () => void
  disabled?: boolean
  note?: string
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      className={`flex w-full items-center gap-sm rounded-sm py-sm text-left ${
        disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-surface-hover'
      }`}
    >
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-[2px] border transition-colors ${
          checked ? 'border-primary bg-primary' : 'border-border-selected bg-surface'
        }`}
      >
        {checked && <Icon name="check" size={14} weight={500} className="text-white" />}
      </span>
      <span className="text-body text-text-primary">{label}</span>
      {note && <span className="ml-auto text-small text-text-tertiary">{note}</span>}
    </button>
  )
}

interface SnapshotRow {
  id: string
  name: string
  createdAt: string
  assetsSummary: string
  sourceAccountName: string
  assetIds: string[]
  // Businesses this snapshot has already been loaded to, accumulated across
  // every "Load snapshot to other accounts" run — drives the frozen
  // pre-selected rows the next time this snapshot is loaded.
  loadedBusinessIds?: string[]
  [key: string]: unknown
}

// Phase 1 only supports capturing snapshots from this single source account.
const SOURCE_ACCOUNT = { id: 'lakeside-autogroup', name: 'Lakeside Autogroup' }

interface CreateSnapshotDrawerProps {
  onClose: () => void
  onSave: (row: SnapshotRow) => void
}

function CreateSnapshotDrawer({ onClose, onSave }: CreateSnapshotDrawerProps) {
  const [step, setStep] = useState<'details' | 'assets'>('details')
  const [name, setName] = useState('')
  const [sourceAccountId, setSourceAccountId] = useState(SOURCE_ACCOUNT.id)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  const sourceAccountName = sourceAccountId === SOURCE_ACCOUNT.id ? SOURCE_ACCOUNT.name : ''

  const toggleItem = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSave = () => {
    onSave({
      id: `snap-${Date.now()}`,
      name,
      createdAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
      assetsSummary: summarizeAssets(selected),
      sourceAccountName,
      assetIds: Array.from(selected),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div className="relative flex h-full w-[650px] flex-col bg-surface shadow-modal">
        <div className="flex items-center gap-sm border-b border-border px-2xl py-lg">
          <button type="button" onClick={onClose} className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover" aria-label="Close">
            <Icon name="close" size={20} />
          </button>
          <h2 className="text-h3 text-text-primary">Create snapshot</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-2xl py-lg">
          {step === 'details' ? (
            <div className="flex flex-col gap-lg">
              <div className="flex flex-col gap-xs">
                <label className="text-body text-text-secondary">Snapshot name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a name for this snapshot"
                  className="h-9 rounded-sm border border-border-selected bg-surface px-md text-body text-text-primary outline-none focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-body text-text-secondary">Source account</label>
                <select
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  className="h-9 rounded-sm border border-border-selected bg-surface px-md text-body text-text-primary outline-none focus:border-primary"
                >
                  <option value={SOURCE_ACCOUNT.id}>{SOURCE_ACCOUNT.name}</option>
                </select>
                <span className="text-small text-text-tertiary">
                  The business this snapshot will be captured from.
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-xs">
              {ASSET_GROUPS.map((group) => {
                const expanded = expandedGroups.has(group.id)
                return (
                  <div key={group.id} className="border-b border-border pb-sm">
                    <AccordionHeader
                      label={group.label}
                      count={countSelectedInGroup(group, selected)}
                      expanded={expanded}
                      onToggle={() => toggleGroup(group.id)}
                    />
                    {expanded && (
                      group.subgroups
                        ? group.subgroups.map((sub) => (
                            <div key={sub.id} className="mb-md pl-md">
                              <p className="mb-xs text-small text-text-secondary">{sub.label}</p>
                              {sub.items.map((item) => (
                                <CheckboxRow key={item.id} label={item.label} checked={selected.has(item.id)} onToggle={() => toggleItem(item.id)} />
                              ))}
                            </div>
                          ))
                        : (group.items ?? []).map((item) => (
                            <div key={item.id} className="pl-md">
                              <CheckboxRow label={item.label} checked={selected.has(item.id)} onToggle={() => toggleItem(item.id)} />
                            </div>
                          ))
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-sm border-t border-border px-2xl py-lg">
          {step === 'details' ? (
            <button
              type="button"
              disabled={!name.trim() || !sourceAccountId}
              onClick={() => setStep('assets')}
              className={`flex h-9 items-center rounded-sm px-lg text-body text-white transition-colors ${
                !name.trim() || !sourceAccountId ? 'cursor-not-allowed bg-surface-selected text-text-tertiary' : 'bg-primary hover:bg-primary-hover'
              }`}
            >
              Continue
            </button>
          ) : (
            <>
              <button type="button" onClick={() => setStep('details')} className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover">
                Back
              </button>
              <button
                type="button"
                disabled={selected.size === 0}
                onClick={handleSave}
                className={`flex h-9 items-center rounded-sm px-lg text-body text-white transition-colors ${
                  selected.size === 0 ? 'cursor-not-allowed bg-surface-selected text-text-tertiary' : 'bg-primary hover:bg-primary-hover'
                }`}
              >
                Save snapshot
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface LoadSnapshotFlowProps {
  snapshot: SnapshotRow
  onClose: () => void
  onLoadSnapshot: (businessIds: string[]) => void
  onCopied: (businessCount: number) => void
}

function LoadSnapshotFlow({ snapshot, onClose, onLoadSnapshot, onCopied }: LoadSnapshotFlowProps) {
  const loadedBusinessIds = snapshot.loadedBusinessIds ?? []

  const [step, setStep] = useState<'select' | 'review' | 'conflicts' | 'templateConflict'>('select')
  const [selectedBusinessIds, setSelectedBusinessIds] = useState<Set<string>>(new Set(loadedBusinessIds))

  const toggleBusiness = (id: string) => {
    if (loadedBusinessIds.includes(id)) return
    setSelectedBusinessIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const assetGroups = getAssetGroupBreakdown(snapshot.assetIds)
  const requiresSetup = snapshot.assetIds.some((id) => REVIEW_RESPONSE_AGENT_ASSET_IDS.includes(id))
  // Demo scenario: the Review generation agent's Clinic visit flow ships a
  // template that may already exist in a selected business — the system
  // resolves this automatically rather than asking the reseller to choose.
  const hasTemplateConflict = snapshot.assetIds.includes('review-generation-clinic')

  const handleCopy = () => {
    onLoadSnapshot(Array.from(selectedBusinessIds))
    onCopied(selectedBusinessIds.size)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <div className="relative flex h-full w-[650px] flex-col bg-surface shadow-modal">
        <div className="flex items-center gap-sm border-b border-border px-2xl py-lg">
          <button type="button" onClick={onClose} className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover" aria-label="Close">
            <Icon name="close" size={20} />
          </button>
          <h2 className="text-h3 text-text-primary">Load snapshot to other accounts</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-2xl py-lg">
          {step === 'select' ? (
            <div className="flex flex-col gap-sm">
              <p className="mb-sm text-body text-text-secondary">
                Select the businesses to copy "{snapshot.name}" to.
              </p>
              {RESELLER_BUSINESSES.map((b) => {
                const isLoaded = loadedBusinessIds.includes(b.id)
                return (
                  <CheckboxRow
                    key={b.id}
                    label={b.name}
                    checked={selectedBusinessIds.has(b.id)}
                    onToggle={() => toggleBusiness(b.id)}
                    disabled={isLoaded}
                    note={isLoaded ? 'Already received this snapshot' : undefined}
                  />
                )
              })}
            </div>
          ) : step === 'review' ? (
            <div className="flex flex-col gap-lg">
              <p className="text-body text-text-secondary">
                All assets in this snapshot will be copied to the selected businesses.
              </p>
              {assetGroups.map((group) => (
                <div key={group.groupLabel}>
                  <p className="mb-xs text-body text-text-primary">{group.groupLabel}</p>
                  {group.items.map((item) => (
                    <div key={item.id} className="pl-md py-xs">
                      <p className="text-body text-text-secondary">{item.label}</p>
                      {TEMPLATE_DEPENDENCIES[item.id] && (
                        <p className="pl-md text-small text-text-tertiary">Includes: {TEMPLATE_DEPENDENCIES[item.id]}</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              {requiresSetup && (
                <div>
                  <p className="mb-xs text-body text-text-primary">Requires setup in each business</p>
                  <p className="pl-md py-xs text-body text-text-secondary">Approval workflow</p>
                  <p className="pl-md py-xs text-body text-text-secondary">Ticket ID / Ticket configuration</p>
                  <p className="mt-sm text-small text-text-tertiary">
                    These account-specific configurations will need to be set up separately in each business.
                  </p>
                </div>
              )}
            </div>
          ) : step === 'conflicts' ? (
            <div className="flex flex-col gap-md">
              <div className="flex items-center gap-sm">
                <Icon name="check_circle" size={20} fill className="text-chip-success-text" />
                <span className="text-body text-text-primary">Conflict handling</span>
              </div>
              <p className="text-body text-text-secondary">
                The snapshot is ready to be copied to the selected businesses.
              </p>
              <div className="flex flex-col gap-xs text-small text-text-tertiary">
                <p>Assets ready to copy: {snapshot.assetsSummary}</p>
                {requiresSetup && <p>Requires setup after copying: Approval workflow, Ticket ID / Ticket configuration</p>}
              </div>
            </div>
          ) : step === 'templateConflict' ? (
            <div className="flex flex-col gap-md">
              <div className="flex items-center gap-sm">
                <Icon name="check_circle" size={20} fill className="text-chip-success-text" />
                <span className="text-body text-text-primary">Conflict handling</span>
              </div>
              <p className="text-body text-text-secondary">
                The snapshot is ready to be copied to the selected businesses.
              </p>
              <p className="text-small text-text-tertiary">Assets ready to copy: {snapshot.assetsSummary}</p>
              <div>
                <p className="text-body text-text-secondary">
                  The Clinic Visit Review Request template will be created for each selected business:
                </p>
                <p className="pl-md py-xs text-body text-text-secondary">
                  • If a template with the same name already exists: A copy will be created with "- Copy" appended to the template name.
                </p>
                <p className="pl-md py-xs text-body text-text-secondary">
                  • If no template with the same name exists: The template will be created with the exact same name.
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-sm border-t border-border px-2xl py-lg">
          {step === 'select' ? (
            <button
              type="button"
              disabled={selectedBusinessIds.size === 0}
              onClick={() => setStep('review')}
              className={`flex h-9 items-center rounded-sm px-lg text-body text-white transition-colors ${
                selectedBusinessIds.size === 0 ? 'cursor-not-allowed bg-surface-selected text-text-tertiary' : 'bg-primary hover:bg-primary-hover'
              }`}
            >
              Continue
            </button>
          ) : step === 'review' ? (
            <>
              <button type="button" onClick={() => setStep('select')} className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover">
                Back
              </button>
              <button type="button" onClick={() => setStep(hasTemplateConflict ? 'templateConflict' : 'conflicts')} className="flex h-9 items-center rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover">
                Continue
              </button>
            </>
          ) : step === 'conflicts' ? (
            <>
              <button type="button" onClick={() => setStep('review')} className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover">
                Back
              </button>
              <button type="button" onClick={handleCopy} className="flex h-9 items-center rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover">
                Copy to selected businesses
              </button>
            </>
          ) : step === 'templateConflict' ? (
            <>
              <button type="button" onClick={() => setStep('review')} className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover">
                Back
              </button>
              <button type="button" onClick={handleCopy} className="flex h-9 items-center rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover">
                Copy to selected businesses
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// Pre-seeded so the Snapshots page has something to show on first visit.
const SEED_SNAPSHOTS: SnapshotRow[] = [
  {
    id: 'snap-seed-1',
    name: 'Review response rollout',
    createdAt: 'Sep 1, 2026, 10:15 AM',
    assetsSummary: '1 asset (Agents)',
    sourceAccountName: SOURCE_ACCOUNT.name,
    assetIds: ['review-response-positive'],
  },
  {
    id: 'snap-seed-2',
    name: 'Clinic visit rollout',
    createdAt: 'Sep 3, 2026, 2:40 PM',
    assetsSummary: '1 asset (Agents)',
    sourceAccountName: SOURCE_ACCOUNT.name,
    assetIds: ['review-generation-clinic'],
  },
]

interface SnapshotScreenProps {
  onLoadSnapshot: (businessIds: string[]) => void
}

export function SnapshotScreen({ onLoadSnapshot }: SnapshotScreenProps) {
  const [snapshots, setSnapshots] = useState<SnapshotRow[]>(SEED_SNAPSHOTS)
  const [showCreate, setShowCreate] = useState(false)
  const [loadingSnapshot, setLoadingSnapshot] = useState<SnapshotRow | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const columns: Column<SnapshotRow>[] = [
    { key: 'name', label: 'Snapshot name', width: 220, sortable: true },
    { key: 'createdAt', label: 'Created time', width: 200, sortable: true },
    { key: 'assetsSummary', label: 'Assets captured', width: 260, sortable: true },
    { key: 'sourceAccountName', label: 'Source account', width: 200, sortable: true },
  ]

  return (
    <div className="flex h-full flex-col">
      <TopNav initials="S" />
      <div className="flex h-16 items-center justify-between bg-surface px-2xl py-xl">
        <h1 className="text-h3 text-text-primary">Snapshots</h1>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex h-9 items-center rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover"
        >
          Create snapshot
        </button>
      </div>
      <div className="px-lg py-lg">
        <DataTable
          columns={columns}
          data={snapshots}
          scrollOnHover
          rowMenuItems={[
            {
              label: 'Refresh',
              onClick: () => {},
              description: 'Update the snapshot and apply the updated changes to the businesses this snapshot has already been copied to.',
            },
            { label: 'Load snapshot to other accounts', onClick: (row) => setLoadingSnapshot(row) },
            { label: 'Delete', onClick: (row) => setSnapshots((prev) => prev.filter((s) => s.id !== row.id)), variant: 'danger' },
          ]}
        />
      </div>

      {showCreate && (
        <CreateSnapshotDrawer
          onClose={() => setShowCreate(false)}
          onSave={(row) => {
            setSnapshots((prev) => [row, ...prev])
            setShowCreate(false)
            setToastMessage('Snapshot created successfully.')
            setToastVisible(true)
          }}
        />
      )}

      {loadingSnapshot && (
        <LoadSnapshotFlow
          snapshot={loadingSnapshot}
          onClose={() => setLoadingSnapshot(null)}
          onLoadSnapshot={(businessIds) => {
            const snapshotId = loadingSnapshot.id
            setSnapshots((prev) =>
              prev.map((s) =>
                s.id !== snapshotId
                  ? s
                  : { ...s, loadedBusinessIds: Array.from(new Set([...(s.loadedBusinessIds ?? []), ...businessIds])) },
              ),
            )
            onLoadSnapshot(businessIds)
          }}
          onCopied={(count) => {
            setLoadingSnapshot(null)
            setToastMessage(`Snapshot copied to ${count} business${count === 1 ? '' : 'es'}.`)
            setToastVisible(true)
          }}
        />
      )}

      <Toast message={toastMessage} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  )
}
