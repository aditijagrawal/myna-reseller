import React, { useState } from 'react';
import { FormInput, TextArea } from '../../../elemental-stubs';
import LocationsDrawer from '../../../RHSDrawer/LocationsDrawer.jsx';
import { RESELLER_BUSINESSES } from '../../../../data/agentWorkflows';
import styles from './AgentDetailsBody.module.css';

const DEFAULT_LOCATIONS = [
  { id: '1001', name: '1001 - Mountain view, CA' },
  { id: '1002', name: '1002 - Seattle, WA' },
  { id: '1004', name: '1004 - Chicago, IL' },
  { id: '1006', name: '1006 - Las Vegas, NV' },
  { id: '1007', name: '1007 - Austin, TX' },
  { id: '1008', name: '1008 - New York, NY' },
  { id: '1009', name: '1009 - Miami, FL' },
  { id: '1010', name: '1010 - Denver, CO' },
  { id: '1011', name: '1011 - Portland, OR' },
  { id: '1012', name: '1012 - Phoenix, AZ' },
];

const VISIBLE_COUNT = 4;

/* Normalise — stored as strings OR as { id, name } objects */
const normalise = (raw) => (raw || []).map((l) => (typeof l === 'string' ? { id: l, name: l } : l));

/* One entity picker (Businesses OR Locations) — chips + edit button + its own drawer. */
function EntityChipsField({ label, entities, entityNoun, selected, onSave, viewOnly }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [showAllChips, setShowAllChips] = useState(false);

  const chips = normalise(selected);
  const visibleChips = showAllChips ? chips : chips.slice(0, VISIBLE_COUNT);
  const overflowCount = chips.length - VISIBLE_COUNT;

  const handleRemoveChip = (id) => onSave(chips.filter((c) => c.id !== id));

  if (showDrawer) {
    return (
      <LocationsDrawer
        selectedIds={chips.map((c) => c.id)}
        onBack={() => setShowDrawer(false)}
        onSave={(sel) => { onSave(sel); setShowDrawer(false); }}
        title={label}
        entities={entities}
        description={`Choose the ${entityNoun}s this agent will work for. Select by`}
        selectByOptions={[{ label: label.replace(/s$/, ''), value: entityNoun }]}
        entityNoun={entityNoun}
        entityNounPlural={`${entityNoun}s`}
      />
    );
  }

  return (
    <div className={styles.locationsField}>
      <div className={styles.locationsLabel}>
        <span className={styles.locationsLabelText}>{label}</span>
        <span className={styles.locationsRequired}>*</span>
        {!viewOnly && (
          <button
            className={styles.locationsEditBtn}
            type="button"
            onClick={() => setShowDrawer(true)}
            title={`Edit ${label.toLowerCase()}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16, lineHeight: 1, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
              edit
            </span>
          </button>
        )}
      </div>

      <div className={styles.chipsRow}>
        {visibleChips.map((chip) => (
          <span key={chip.id} className={styles.locationChip}>
            <span className={styles.locationChipName}>{chip.name}</span>
            {!viewOnly && (
              <button
                type="button"
                className={styles.locationChipClose}
                onClick={() => handleRemoveChip(chip.id)}
                title="Remove"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 12, lineHeight: 1, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                  close
                </span>
              </button>
            )}
          </span>
        ))}
      </div>

      {!showAllChips && overflowCount > 0 && (
        <button className={styles.moreLink} type="button" onClick={() => setShowAllChips(true)}>
          + {overflowCount} more
        </button>
      )}
    </div>
  );
}

export default function AgentDetailsBody({ values: externalValues, onChange, viewOnly = false, viewerRole = { type: 'reseller' } }) {
  const [internalValues, setInternalValues] = useState({
    agentName: '',
    goals: '',
    outcomes: '',
    locations: [],
  });

  const values = externalValues ?? internalValues;

  /* Business mode — the agent is scoped to reseller businesses, not just locations */
  const isBusinessMode = Array.isArray(values.businesses);
  const isBusinessViewer = viewerRole?.type === 'business';
  // A business can never rename the agent or edit its goals/outcomes — those
  // are reseller-owned structure. Locations stays editable regardless (see
  // the field below) since each business manages its own locations.
  const structureReadOnly = viewOnly || isBusinessViewer;

  /* Generic text-field setter */
  const set = onChange
    ? (field) => (e) => onChange(field, e.target.value)
    : (field) => (e) => setInternalValues((v) => ({ ...v, [field]: e.target.value }));

  const updateField = (field) => (updated) => {
    if (onChange) {
      onChange(field, updated);
    } else {
      setInternalValues((v) => ({ ...v, [field]: updated }));
    }
  };

  return (
    <div className={styles.body}>
      <FormInput
        name="agentName"
        type="text"
        label="Agent name"
        value={values.agentName}
        onChange={set('agentName')}
        required
        readOnly={structureReadOnly}
      />
      <TextArea
        name="goals"
        label="Goals"
        value={values.goals}
        onChange={set('goals')}
        required
        noFloatingLabel
        rows={6}
        readOnly={structureReadOnly}
      />
      <TextArea
        name="outcomes"
        label="Outcomes"
        value={values.outcomes}
        onChange={set('outcomes')}
        noFloatingLabel
        rows={structureReadOnly ? 12 : 6}
        readOnly={structureReadOnly}
      />

      {isBusinessMode && !isBusinessViewer && (
        /* Reseller scope: pick which businesses this agent runs for, and
           optionally narrow further to specific locations across them. */
        <EntityChipsField
          label="Businesses"
          entityNoun="business"
          entities={RESELLER_BUSINESSES}
          selected={values.businesses}
          onSave={updateField('businesses')}
          viewOnly={viewOnly}
        />
      )}

      {/* Locations — same field/behavior for every viewer, including a
          business logged into their own account (isBusinessMode or not). */}
      <EntityChipsField
        label="Locations"
        entityNoun="location"
        entities={DEFAULT_LOCATIONS}
        selected={values.locations && values.locations.length > 0 ? values.locations : DEFAULT_LOCATIONS}
        onSave={updateField('locations')}
        viewOnly={viewOnly}
      />
    </div>
  );
}
