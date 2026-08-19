import React, { useState, useRef, useEffect } from 'react';



import { FormInput, TabHeader, TextArea, Toggle, Tooltip, DrawerHeader, Button } from '../../../../elemental-stubs';


const font = '"Inter", sans-serif';

const COLORS = {
  primary: '#212121',
  secondary: '#555',
  tertiary: '#8f8f8f',
  divider: '#eaeaea',
  border: '#cccccc',
  accent: '#1976d2',
  white: '#ffffff',
  required: '#de1b0c',
  selectedBg: '#ecf5fd',
  connected: '#4cae3d',
  expired: '#de1b0c',
};

const ACCOUNTS = [
  { id: 'william',   email: 'william@ben.com',   status: 'connected', statusLabel: 'Connected' },
  { id: 'marketing', email: 'marketing@ben.com',  status: 'connected', statusLabel: 'Connected' },
  { id: 'admin',     email: 'admin@ben.com',      status: 'expired',   statusLabel: 'The access token is expired, reconnect to get the valid token' },
  { id: 'sales',     email: 'sales@ben.com',      status: 'connected', statusLabel: 'Connected' },
  { id: 'rupa',      email: 'rupa@ben.com',       status: 'expired',   statusLabel: 'The access token is expired, reconnect to get the valid token' },
];

const DEFAULT_FIELDS = [
  { id: 'name',             label: 'Name',             checked: true, mandatory: true,  locked: true  },
  { id: 'mobile',           label: 'Mobile',           checked: true, mandatory: true,  locked: true  },
  { id: 'email',            label: 'Email',            checked: true, mandatory: true,  locked: true  },
  { id: 'location',         label: 'Location',         checked: true, mandatory: false, locked: false },
  { id: 'appointment_date', label: 'Appointment date', checked: true, mandatory: false, locked: false },
  { id: 'provider',         label: 'Provider',         checked: true, mandatory: false, locked: false },
  { id: 'appointment_type', label: 'Appointment type', checked: true, mandatory: false, locked: false },
];

const AI_RULES_MAX = 300;

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.tertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.tertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CloseSmallIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.secondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function StatusDot({ status }) {
  return (
    <div style={{
      width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
      background: status === 'connected' ? COLORS.connected : COLORS.expired,
      border: `2px solid ${COLORS.white}`,
      boxSizing: 'content-box',
    }} />
  );
}

function AccountDropdown({ selectedId, onSelect, onAddNew }) {
  const [search, setSearch] = useState('');

  const filtered = ACCOUNTS.filter((a) =>
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 20,
      background: COLORS.white,
      borderRadius: 4,
      boxShadow: '0 4px 8px rgba(33,33,33,0.18)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 8px' }}>
        <span style={{ fontSize: 12, lineHeight: '18px', color: COLORS.tertiary }}>Select account</span>
        <button
          type="button"
          onClick={onAddNew}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 12, lineHeight: '18px', color: COLORS.accent, fontFamily: font }}
        >
          Add new account
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '0 16px 4px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          border: `1px solid ${COLORS.border}`, borderRadius: 4,
          padding: '6px 12px', height: 36, boxSizing: 'border-box',
        }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1, border: 'none', outline: 'none', padding: 0,
              font: `400 14px/20px ${font}`, color: COLORS.primary,
              background: 'transparent',
            }}
          />
        </div>
      </div>

      {/* Account list */}
      <div style={{ maxHeight: 240, overflowY: 'auto', padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filtered.map((account) => {
          const isSelected = account.id === selectedId;
          const isExpired = account.status === 'expired';
          return (
            <div
              key={account.id}
              onClick={() => !isExpired && onSelect(account.id)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '8px 8px 8px 12px', borderRadius: 4,
                background: isSelected ? COLORS.selectedBg : 'transparent',
                cursor: isExpired ? 'default' : 'pointer',
              }}
            >
              <div style={{ paddingTop: 5, flexShrink: 0 }}>
                <StatusDot status={account.status} />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{
                  fontSize: 14, lineHeight: '20px',
                  color: isSelected ? COLORS.accent : COLORS.secondary,
                  fontWeight: isSelected ? 500 : 400,
                  wordBreak: 'break-all',
                }}>
                  {account.email}
                </span>
                <span style={{ fontSize: 12, lineHeight: '18px', color: COLORS.tertiary }}>
                  {account.statusLabel}
                </span>
              </div>
              {isSelected && (
                <div style={{ flexShrink: 0, paddingTop: 2 }}>
                  <CheckIcon />
                </div>
              )}
              {isExpired && (
                <div style={{ flexShrink: 0 }}>
                  <Button type="link" label="Reconnect" onClick={(e) => e.stopPropagation()} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LeadQualification({
  title = 'Lead Qualification',
  onBack,
  onSave,
}) {
  const [selectedAccountId, setSelectedAccountId] = useState('william');
  const [accountOpen, setAccountOpen] = useState(false);
  const [aiRules, setAiRules] = useState('');
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const dropdownRef = useRef(null);

  const selectedAccount = ACCOUNTS.find((a) => a.id === selectedAccountId);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    }
    if (accountOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountOpen]);

  const toggleFieldChecked = (id) =>
    setFields((prev) =>
      prev.map((f) => (f.id === id && !f.locked ? { ...f, checked: !f.checked } : f))
    );

  const toggleMandatory = (id) =>
    setFields((prev) =>
      prev.map((f) => (f.id === id && !f.locked ? { ...f, mandatory: !f.mandatory } : f))
    );

  return (
    <div style={{ width: 650, maxWidth: '100%', background: COLORS.white, fontFamily: font, display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
      <DrawerHeader
        title={title}
        onBack={onBack}
        actions={[{ label: 'Save', onClick: onSave }]}
      />

      <div style={{ padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: 25 }}>

        {/* Account settings */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 400, lineHeight: '20px', color: COLORS.primary }}>
            Account settings
          </p>

          {/* Select account */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }} ref={dropdownRef}>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ fontSize: 12, lineHeight: '18px', color: COLORS.primary }}>Select account</span>
              <span style={{ fontSize: 12, lineHeight: '18px', color: COLORS.required }}>*</span>
            </div>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setAccountOpen((o) => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 8px 8px 12px',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 4,
                  background: COLORS.white,
                  cursor: 'pointer',
                  font: `400 14px/20px ${font}`,
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                aria-haspopup="listbox"
                aria-expanded={accountOpen}
              >
                <span style={{ flex: 1, textAlign: 'left', color: COLORS.primary }}>
                  {selectedAccount ? selectedAccount.email : ''}
                </span>
                {selectedAccount && (
                  <span
                    role="button"
                    aria-label="Clear selection"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); setSelectedAccountId(null); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); setSelectedAccountId(null); } }}
                    style={{ display: 'flex', cursor: 'pointer' }}
                  >
                    <CloseSmallIcon />
                  </span>
                )}
                <ChevronDownIcon />
              </button>

              {accountOpen && (
                <AccountDropdown
                  selectedId={selectedAccountId}
                  onSelect={(id) => { setSelectedAccountId(id); setAccountOpen(false); }}
                  onAddNew={() => {}}
                />
              )}
            </div>
          </div>

          {/* AI rules textarea */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 12, lineHeight: '18px', color: COLORS.primary }}>AI rules for appointment booking</span>
                <span style={{ fontSize: 12, lineHeight: '18px', color: COLORS.required }}>*</span>
                <Tooltip
                  text="Rules that guide the AI when booking appointments (e.g. Do not give more than one appointment per patient)"
                  position="top"
                  display="inline-flex"
                  doNotTriggerMouseOverOnMount
                >
                  <i className="icon_phoenix-info" style={{ fontSize: 16, color: COLORS.tertiary, cursor: 'pointer' }} />
                </Tooltip>
              </div>
              <span style={{ fontSize: 12, lineHeight: '18px', color: COLORS.tertiary }}>
                {aiRules.length}/{AI_RULES_MAX}
              </span>
            </div>
            <textarea
              value={aiRules}
              maxLength={AI_RULES_MAX}
              onChange={(e) => setAiRules(e.target.value)}
              placeholder="Eg. Do not give more than one appointment per patient"
              style={{
                width: '100%', height: 120, boxSizing: 'border-box',
                padding: '6px 12px',
                border: `1px solid ${COLORS.border}`,
                borderRadius: 4,
                resize: 'vertical',
                font: `400 14px/20px ${font}`,
                color: COLORS.primary,
                background: COLORS.white,
                outline: 'none',
              }}
            />
          </div>
        </section>

        {/* Fields table */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 400, lineHeight: '20px', color: COLORS.primary }}>
            Select the fields required to schedule an appointment
          </p>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 16px',
              borderBottom: `1px solid ${COLORS.divider}`,
            }}>
              <span style={{ fontSize: 14, lineHeight: '20px', color: COLORS.secondary }}>Fields</span>
              <span style={{ fontSize: 14, lineHeight: '20px', color: COLORS.secondary }}>Mandatory</span>
            </div>

            {fields.map((f) => (
              <div
                key={f.id}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '18px 16px',
                  borderBottom: `1px solid ${COLORS.divider}`,
                  background: COLORS.white,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FormInput
                    type="checkbox"
                    name={`field-${f.id}`}
                    checked={f.checked}
                    disabled={f.locked}
                    onChange={() => toggleFieldChecked(f.id)}
                  />
                  <span style={{ fontSize: 14, lineHeight: '20px', color: COLORS.primary }}>{f.label}</span>
                </div>
                <Toggle
                  name={`mandatory-${f.id}`}
                  checked={f.mandatory}
                  disabled={f.locked}
                  roundedToggle
                  onChange={() => { if (!f.locked) toggleMandatory(f.id); }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
