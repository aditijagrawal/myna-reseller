import { useState } from 'react'
import { BackArrowIcon } from '../../assets/BackArrowIcon'
import { Icon } from '../Icon/Icon'
import type { IntakeFormPreviewDrawerProps } from './IntakeFormPreviewDrawer.types'

const COLLAPSED_SECTIONS = ['Insurance', 'Consent', 'Medical history', 'Social history'] as const

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-small text-text-tertiary">{label}</p>
      <p className="text-body text-text-primary">{value}</p>
    </div>
  )
}

export function IntakeFormPreviewDrawer({
  open,
  patient,
  onClose,
}: IntakeFormPreviewDrawerProps) {
  const [basicOpen, setBasicOpen] = useState(true)

  if (!patient) return null

  const { basicDetails: d } = patient

  return (
    <div className={`fixed inset-0 z-[100] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-[650px] max-w-[92vw] flex-col bg-surface shadow-dropdown transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-center gap-sm px-2xl pb-lg pt-2xl">
          <button
            type="button"
            aria-label="Back"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
          >
            <BackArrowIcon />
          </button>
          <h2 className="text-[16px] leading-6 tracking-[-0.32px] text-text-primary">Intake details</h2>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-2xl pb-2xl">
          <div className="flex flex-col items-center pb-xl pt-md">
            <span className="flex size-16 items-center justify-center rounded-full bg-chip-success-bg text-h3 text-chip-success-text">
              {patient.initials}
            </span>
            <h3 className="mt-md text-h3 text-text-primary">{patient.name}</h3>
            <div className="mt-md flex items-center gap-sm">
              {(['send', 'chat', 'mail'] as const).map((icon) => (
                <button
                  key={icon}
                  type="button"
                  aria-label={icon}
                  className="flex size-9 items-center justify-center rounded-sm border border-border-selected bg-surface text-text-icon hover:bg-surface-l2"
                >
                  <Icon name={icon} size={20} />
                </button>
              ))}
            </div>
          </div>

          <div
            className="rounded-md px-lg py-md"
            style={{ background: '#F9F7FD', border: '1px solid #B090E0' }}
          >
            <div className="flex items-center gap-xs">
              <span style={{ color: '#B090E0' }} className="flex items-center"><Icon name="auto_awesome" size={16} /></span>
              <span className="text-body text-text-primary">AI summary</span>
            </div>
            <ul className="mt-sm space-y-xs text-body text-text-secondary">
              {patient.aiSummary.map((line) => (
                <li key={line} className="flex items-start gap-sm">
                  <span className="mt-[2px] shrink-0 text-text-tertiary">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-lg border-t border-border">
            <button
              type="button"
              onClick={() => setBasicOpen((o) => !o)}
              className="flex w-full items-center justify-between py-lg text-left"
            >
              <span className="text-body text-text-primary">Basic details</span>
              <Icon name={basicOpen ? 'expand_less' : 'expand_more'} size={20} className="text-text-icon" />
            </button>
            {basicOpen && (
              <div className="grid grid-cols-2 gap-x-lg gap-y-lg pb-lg">
                <DetailField label="Age" value={d.age} />
                <DetailField label="Gender" value={d.gender} />
                <DetailField label="Phone number" value={d.phone} />
                <DetailField label="Email" value={d.email} />
                <DetailField label="Emergency contact" value={d.emergencyContact} />
                <DetailField label="Relationship" value={d.emergencyRelationship} />
                <DetailField label="Emergency contact phone number" value={d.emergencyPhone} />
                <DetailField label="Emergency contact email" value={d.emergencyEmail} />
              </div>
            )}
          </div>

          {COLLAPSED_SECTIONS.map((section) => (
            <div key={section} className="border-t border-border">
              <button
                type="button"
                className="flex w-full items-center justify-between py-lg text-left"
              >
                <span className="text-body text-text-primary">{section}</span>
                <Icon name="expand_more" size={20} className="text-text-icon" />
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
