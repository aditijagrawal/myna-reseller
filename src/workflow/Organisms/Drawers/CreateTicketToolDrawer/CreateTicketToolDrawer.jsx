import React, { useState } from 'react';
import './CreateTicketToolDrawer.css';

/* Sample business-level users/roles. At reseller scope this is shown
   read-only (the reseller can't know a business's own team); at business
   scope it becomes a real, selectable multiselect. */
const SAMPLE_ASSIGNEES = [
  { id: 'role-manager', label: 'Manager', kind: 'Role' },
  { id: 'role-frontdesk', label: 'Front desk lead', kind: 'Role' },
  { id: 'user-ashley', label: 'Ashley P.', kind: 'User' },
  { id: 'user-marco', label: 'Marco R.', kind: 'User' },
  { id: 'user-dana', label: 'Dana K.', kind: 'User' },
];

function NativeDrawer({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: 650,
          maxWidth: '95vw',
          height: '100%',
          overflowY: 'auto',
          background: '#fff',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.14)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function CreateTicketToolDrawer({
  isOpen,
  onClose,
  locked = true,
  initialAssignees = [],
  configured = false,
  onConfigured,
}) {
  const [selectedAssignees, setSelectedAssignees] = useState(initialAssignees);

  const toggleAssignee = (id) => {
    setSelectedAssignees((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const saveDisabled = locked || selectedAssignees.length === 0;
  const handleSave = () => {
    if (saveDisabled) return;
    onConfigured?.(selectedAssignees);
    onClose();
  };

  const selectedLabels = SAMPLE_ASSIGNEES.filter((a) => selectedAssignees.includes(a.id)).map((a) => a.label);
  const placeholder = selectedLabels.length > 0 ? selectedLabels.join(', ') : 'Choose users or roles to assign this ticket to';

  return (
    <NativeDrawer isOpen={isOpen} onClose={onClose}>
      <div className="ctd">
        <div className="ctd__header">
          <div className="ctd__header-left">
            <button type="button" className="ctd__back" onClick={onClose} aria-label="Back">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            </button>
            <span className="ctd__title">Create ticket in Birdeye</span>
          </div>
          <button
            type="button"
            className={`ctd__save${saveDisabled ? ' ctd__save--disabled' : ''}`}
            onClick={handleSave}
            disabled={saveDisabled}
          >
            Save
          </button>
        </div>

        <div className="ctd__body">
          <span className="ctd__label">
            Assign ticket to<span className="ctd__required"> *</span>
          </span>

          {locked ? (
            <>
              <div className="ctd__field" aria-disabled="true">
                <span className="ctd__field-placeholder">Choose users or roles to assign this ticket to</span>
              </div>

              <div className="ctd__locked-note">
                <span className="material-symbols-outlined ctd__locked-icon">lock</span>
                <span>Users and roles can only be configured at the business level — each business manages its own team. Log in to the individual business account to choose who tickets should be assigned to.</span>
              </div>
            </>
          ) : (
            <>
              {configured && (
                <div className="ctd__configured-note">
                  <span className="material-symbols-outlined ctd__configured-icon">check_circle</span>
                  <span>Configured for this business. Update the selection and save to change it.</span>
                </div>
              )}

              <div className="ctd__field ctd__field--active">
                <span className="ctd__field-placeholder ctd__field-placeholder--active">{placeholder}</span>
              </div>

              <div className="ctd__panel ctd__panel--active">
                <div className="ctd__options">
                  {SAMPLE_ASSIGNEES.map((a) => {
                    const checked = selectedAssignees.includes(a.id);
                    return (
                      <button
                        type="button"
                        key={a.id}
                        className="ctd__option ctd__option--active"
                        onClick={() => toggleAssignee(a.id)}
                      >
                        <span className={`ctd__checkbox${checked ? ' ctd__checkbox--checked' : ''}`}>
                          {checked && (
                            <span className="material-symbols-outlined" style={{ fontSize: 14, lineHeight: 1 }}>check</span>
                          )}
                        </span>
                        <span>{a.label}</span>
                        <span className="ctd__kind">{a.kind}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </NativeDrawer>
  );
}
