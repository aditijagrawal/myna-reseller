/**
 * InitiateVoiceCallDrawer
 *
 * Configuration drawer for the "Initiate voice call" tool in the healthcare Reminder agent.
 * Sections: phone number, call from, call mode, calling window, retry settings, voicemail config.
 */
import { useState } from 'react'
interface Props {
  open: boolean
  onClose: () => void
}

const font = '"Roboto", Arial, sans-serif'

// ─── Local helpers ────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, color: '#212121', marginBottom: 4, fontFamily: font }}>
      {children}
    </div>
  )
}

function InfoIcon() {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontSize: 14, color: '#9e9e9e', verticalAlign: 'middle', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
    >
      info
    </span>
  )
}

function SelectField({
  label,
  value,
  options,
  placeholder,
  showInfo,
}: {
  label?: string
  value: string
  options: string[]
  placeholder?: string
  showInfo?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState(value)
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <Label>{label}</Label>
          {showInfo && <InfoIcon />}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%', height: 36, borderRadius: 4, border: '1px solid #e5e9f0',
          background: '#fff', padding: '0 12px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', fontSize: 14, color: val ? '#212121' : '#9e9e9e',
          fontFamily: font, cursor: 'pointer',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {val || placeholder || 'Select'}
        </span>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#555', flexShrink: 0, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
          expand_more
        </span>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 1200 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1210,
            background: '#fff', border: '1px solid #e5e9f0', borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)', marginTop: 2, overflow: 'hidden',
          }}>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { setVal(opt); setOpen(false) }}
                style={{
                  display: 'block', width: '100%', padding: '8px 12px', textAlign: 'left',
                  border: 'none', background: opt === val ? '#e3f2fd' : 'none',
                  fontSize: 14, fontFamily: font, color: '#212121', cursor: 'pointer',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Checkbox({ label, checked }: { label: string; checked?: boolean }) {
  const [on, setOn] = useState(checked ?? false)
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
      fontSize: 13, color: '#212121', fontFamily: font,
    }}>
      <div
        onClick={() => setOn(!on)}
        style={{
          width: 16, height: 16, borderRadius: 3, flexShrink: 0,
          border: `2px solid ${on ? '#1976d2' : '#9e9e9e'}`,
          background: on ? '#1976d2' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}
      >
        {on && (
          <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#fff', fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
            check
          </span>
        )}
      </div>
      {label}
    </label>
  )
}

// ─── Variable chip (phone number) ────────────────────────────────────────────

function VarChip({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', height: 28, gap: 0,
      borderRadius: 4, border: '1px solid #e5e9f0', overflow: 'hidden',
      fontFamily: font, fontSize: 12, flexShrink: 0,
    }}>
      <div style={{ width: 6, alignSelf: 'stretch', background: '#1976d2', flexShrink: 0 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 8px' }}>
        <span style={{ color: '#1976d2', fontSize: 13, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }} className="material-symbols-outlined">
          data_object
        </span>
        <span style={{ color: '#212121' }}>{label}</span>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#9e9e9e', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
              close
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Textarea with variable insert button ────────────────────────────────────

function VarTextarea({ placeholder, defaultValue }: { placeholder?: string; defaultValue?: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <textarea
        defaultValue={defaultValue}
        placeholder={placeholder}
        style={{
          width: '100%', minHeight: 96, borderRadius: 4, border: '1px solid #e5e9f0',
          padding: '8px 12px 32px 12px', fontSize: 13, fontFamily: font, color: '#212121',
          resize: 'vertical', boxSizing: 'border-box', lineHeight: '20px', outline: 'none',
        }}
      />
      <button
        type="button"
        style={{
          position: 'absolute', bottom: 8, left: 8,
          background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center',
        }}
        title="Insert variable"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#1976d2', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
          data_object
        </span>
      </button>
    </div>
  )
}

// ─── SectionLabel ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: '#212121', fontFamily: font, marginBottom: 8 }}>
      {children}
    </div>
  )
}

// ─── Main drawer ─────────────────────────────────────────────────────────────

export function InitiateVoiceCallDrawer({ open, onClose }: Props) {
  const [callMode, setCallMode] = useState<'subagent' | 'procedures'>('subagent')
  const [callingWindow, setCallingWindow] = useState<'business' | 'custom'>('custom')

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 990 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 640, background: '#fff', zIndex: 1000,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
        fontFamily: font,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: 56, borderBottom: '1px solid #e5e9f0', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', fontSize: 20, color: '#212121' }}
            >
              ←
            </button>
            <span style={{ fontSize: 14, color: '#212121', fontFamily: font }}>Initiate voice call</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              height: 36, padding: '0 20px', borderRadius: 4,
              border: 'none', background: '#1976d2',
              fontSize: 14, fontFamily: font, color: '#fff', cursor: 'pointer',
            }}
          >
            Save
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* ── 1. Phone number ── */}
          <div style={{ marginBottom: 24 }}>
            <SectionLabel>Phone number</SectionLabel>
            <div style={{
              minHeight: 36, borderRadius: 4, border: '1px solid #e5e9f0',
              padding: '4px 12px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6,
              background: '#fff',
            }}>
              <VarChip label="Contact.PhoneNumber" onRemove={() => {}} />
            </div>
          </div>

          {/* ── 2. Call from ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
              <SectionLabel>Call from</SectionLabel>
              <InfoIcon />
            </div>
            <SelectField
              placeholder="Select"
              value=""
              options={[
                'Front desk agent North region caller ID',
                '+1 (650) 555-0110 — Clinic main line',
                'Dynamic (match patient location)',
              ]}
            />
          </div>

          {/* ── 3. Call mode ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['subagent', 'procedures'] as const).map((mode) => {
                const sel = callMode === mode
                const modeLabel = mode === 'subagent' ? 'Call sub-agent' : 'Follow procedures'
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setCallMode(mode)}
                    style={{
                      flex: 1, height: 36, borderRadius: 4, cursor: 'pointer',
                      border: `1px solid ${sel ? '#1976d2' : '#e5e9f0'}`,
                      background: sel ? '#e3f2fd' : '#fff',
                      fontSize: 13, fontFamily: font,
                      color: sel ? '#1565c0' : '#616161',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${sel ? '#1976d2' : '#9e9e9e'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {sel && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1976d2' }} />}
                    </div>
                    {modeLabel}
                  </button>
                )
              })}
            </div>

            {callMode === 'subagent' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <SelectField
                  label="Select agent"
                  showInfo
                  value="Front desk agent North region"
                  options={['Front desk agent North region', 'Front desk agent South region']}
                />
                <div>
                  <Label>Configure initial message</Label>
                  <VarTextarea placeholder="Enter your message here" />
                </div>
              </div>
            )}

            {callMode === 'procedures' && (
              <SelectField
                label="Select procedure"
                value=""
                placeholder="Select"
                options={['Appointment confirmation', 'Reschedule appointment', 'Handle urgent concern']}
              />
            )}
          </div>

          {/* ── 4. Calling window ── */}
          <div style={{ marginBottom: 24 }}>
            <SectionLabel>Calling window</SectionLabel>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {(['business', 'custom'] as const).map((w) => {
                const sel = callingWindow === w
                const wLabel = w === 'business' ? 'During business hours' : 'Custom range'
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setCallingWindow(w)}
                    style={{
                      flex: 1, height: 36, borderRadius: 4, cursor: 'pointer',
                      border: `1px solid ${sel ? '#1976d2' : '#e5e9f0'}`,
                      background: sel ? '#e3f2fd' : '#fff',
                      fontSize: 13, fontFamily: font,
                      color: sel ? '#1565c0' : '#616161',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${sel ? '#1976d2' : '#9e9e9e'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {sel && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1976d2' }} />}
                    </div>
                    {wLabel}
                  </button>
                )
              })}
            </div>
            {callingWindow === 'custom' && (
              <div style={{ display: 'flex', gap: 12 }}>
                <SelectField label="From" value="9:00 AM" options={['8:00 AM', '9:00 AM', '10:00 AM']} />
                <SelectField label="To" value="10:00 PM" options={['8:00 PM', '9:00 PM', '10:00 PM']} />
              </div>
            )}
          </div>

          {/* ── 5. Retry settings ── */}
          <div style={{ marginBottom: 24 }}>
            <SectionLabel>Retry settings</SectionLabel>
            <div style={{ fontSize: 12, color: '#9e9e9e', marginBottom: 10, fontFamily: font }}>
              Enable automatic retry if customer does not connect on the first attempt
            </div>
            <div style={{ display: 'flex', gap: 24, marginBottom: 14 }}>
              <Checkbox label="No answer" checked />
              <Checkbox label="Call rejected" />
              <Checkbox label="Voice mail" checked />
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <SelectField label="Max attempts" value="2" options={['1', '2', '3', '4', '5']} />
            </div>
            <div>
              <Label>Interval between retries</Label>
              <div style={{ display: 'flex', gap: 12 }}>
                <SelectField value="24" options={['1', '2', '4', '12', '24']} />
                <SelectField value="Hours" options={['Minutes', 'Hours', 'Days']} />
              </div>
            </div>
          </div>

          {/* ── 6. Configure voice mail message ── */}
          <div style={{ marginBottom: 24 }}>
            <SectionLabel>Configure voice mail message</SectionLabel>
            <VarTextarea placeholder="Enter your message here" />
          </div>

        </div>
      </div>
    </>
  )
}
