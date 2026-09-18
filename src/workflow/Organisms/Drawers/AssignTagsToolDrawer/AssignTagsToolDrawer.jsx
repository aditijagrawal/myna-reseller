import React, { useState } from 'react';
import './AssignTagsToolDrawer.css';

/* Sample business-level tag library. At reseller scope this is shown
   read-only (the reseller can't know a business's own tags); at business
   scope it becomes a real, selectable multiselect. */
const SAMPLE_TAGS = [
  'Already Addressed',
  'Ashley',
  'Asiya',
  "Can't Respond",
  'Corrina',
  'Eva',
  'Maria',
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

export default function AssignTagsToolDrawer({
  isOpen,
  onClose,
  locked = true,
  initialTags = [],
  configured = false,
  onConfigured,
}) {
  const [selectedTags, setSelectedTags] = useState(initialTags);
  const [dirty, setDirty] = useState(false);

  const toggleTag = (tag) => {
    setDirty(true);
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const saveDisabled = locked || selectedTags.length === 0;
  const handleSave = () => {
    if (saveDisabled) return;
    onConfigured?.(selectedTags);
    onClose();
  };

  const placeholder = selectedTags.length > 0
    ? selectedTags.join(', ')
    : 'Choose tags that should be added to the reviews';

  return (
    <NativeDrawer isOpen={isOpen} onClose={onClose}>
      <div className="atd">
        <div className="atd__header">
          <div className="atd__header-left">
            <button type="button" className="atd__back" onClick={onClose} aria-label="Back">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            </button>
            <span className="atd__title">Assign tags</span>
          </div>
          <button
            type="button"
            className={`atd__save${saveDisabled ? ' atd__save--disabled' : ''}`}
            onClick={handleSave}
            disabled={saveDisabled}
          >
            Save
          </button>
        </div>

        <div className="atd__body">
          <span className="atd__label">
            Tags to add<span className="atd__required"> *</span>
          </span>

          {locked ? (
            <>
              {/* Multiselect trigger — collapsed + disabled at reseller level */}
              <div className="atd__field" aria-disabled="true">
                <span className="atd__field-placeholder">Choose tags that should be added to the reviews</span>
                <div className="atd__field-actions">
                  <button type="button" className="atd__field-btn" disabled aria-label="Expand">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>keyboard_arrow_down</span>
                  </button>
                  <button type="button" className="atd__field-btn atd__field-btn--plain" disabled aria-label="Insert variable">
                    {'{x}'}
                  </button>
                </div>
              </div>

              <div className="atd__locked-note">
                <span className="material-symbols-outlined atd__locked-icon">lock</span>
                <span>Tags can only be configured at the business level — each business maintains its own tag library. Log in to the individual business account to choose the tags this agent should apply.</span>
              </div>
            </>
          ) : (
            <>
              {configured && (
                <div className="atd__configured-note">
                  <span className="material-symbols-outlined atd__configured-icon">check_circle</span>
                  <span>Configured for this business. Update the selection and save to change it.</span>
                </div>
              )}

              {/* Multiselect trigger — live at business level */}
              <div className="atd__field atd__field--active">
                <span className="atd__field-placeholder atd__field-placeholder--active">{placeholder}</span>
              </div>

              <div className="atd__panel atd__panel--active">
                <div className="atd__options">
                  {SAMPLE_TAGS.map((tag) => {
                    const checked = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        className="atd__option atd__option--active"
                        onClick={() => toggleTag(tag)}
                      >
                        <span className={`atd__checkbox${checked ? ' atd__checkbox--checked' : ''}`}>
                          {checked && (
                            <span className="material-symbols-outlined" style={{ fontSize: 14, lineHeight: 1 }}>check</span>
                          )}
                        </span>
                        <span>{tag}</span>
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
