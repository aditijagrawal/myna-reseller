import React, { useState, useRef, useEffect } from 'react';
import { TextArea } from '../../../elemental-stubs';
import '../../../Molecules/Conditions/Conditions.css';

const AGENT_OPTIONS = [
  { value: 'frontdesk-north', label: 'Front desk agent - North region' },
  { value: 'frontdesk-east',  label: 'Front desk agent - East region' },
  { value: 'frontdesk-west',  label: 'Front desk agent - West region' },
  { value: 'service-main',    label: 'Service coordinator - Main branch' },
  { value: 'sales-tier1',     label: 'Sales agent - Tier 1' },
];

const font = '"Roboto", arial, sans-serif';

function AgentSelect({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const selected = AGENT_OPTIONS.find((o) => o.value === value);

  return (
    <div className="tc-dropdown" ref={ref}>
      <button
        type="button"
        className={`tc-dropdown__trigger${open ? ' tc-dropdown__trigger--open' : ''}${disabled ? ' tc-dropdown__trigger--readonly' : ''}`}
        onClick={() => { if (!disabled) setOpen((o) => !o); }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`tc-dropdown__value${!selected ? ' tc-dropdown__value--placeholder' : ''}`}>
          {selected ? selected.label : 'Select agent'}
        </span>
        <span className="material-symbols-outlined tc-dropdown__chevron">expand_more</span>
      </button>

      {open && (
        <div className="tc-dropdown__menu" role="listbox">
          {AGENT_OPTIONS.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={`tc-dropdown__option${isSelected ? ' tc-dropdown__option--selected' : ''}`}
                onClick={() => { onChange(opt); setOpen(false); }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SubAgentBody({ initialValues = {}, onFieldChange, viewOnly = false }) {
  const [selectedAgent, setSelectedAgent] = useState(initialValues.selectedAgent ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');

  const handleAgentChange = (opt) => {
    setSelectedAgent(opt.value);
    onFieldChange?.('selectedAgent', opt.value);
    // Drive the canvas node title from the selected agent name
    onFieldChange?.('name', opt.label);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: font }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 400,
          lineHeight: '18px',
          letterSpacing: '-0.24px',
          color: '#212121',
          fontFamily: font,
        }}>
          Select agent
        </div>
        <AgentSelect
          value={selectedAgent}
          onChange={handleAgentChange}
          disabled={viewOnly}
        />
      </div>

      <TextArea
        name="subAgentDescription"
        label="Description"
        placeholder="Enter description"
        value={description}
        readOnly={viewOnly}
        required
        noFloatingLabel
        onChange={(e) => {
          setDescription(e.target.value);
          onFieldChange?.('description', e.target.value);
        }}
      />
    </div>
  );
}
