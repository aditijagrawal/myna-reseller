import React, { useState } from 'react';
import './ShareToSocialToolDrawer.css';

/* Sample business-level review layouts. At reseller scope these are shown
   read-only (layouts are built from each business's own brand assets); at
   business scope they become real, selectable options. */
const SAMPLE_LAYOUTS = [
  { id: 'layout-quote-card', label: 'Quote card' },
  { id: 'layout-star-banner', label: 'Star rating banner' },
  { id: 'layout-photo-overlay', label: 'Photo overlay' },
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

export default function ShareToSocialToolDrawer({
  isOpen,
  onClose,
  locked = true,
  initialBackgroundImage = '',
  initialLayout = '',
  configured = false,
  onConfigured,
}) {
  const [backgroundImage, setBackgroundImage] = useState(initialBackgroundImage);
  const [layout, setLayout] = useState(initialLayout);

  const saveDisabled = locked || !backgroundImage || !layout;
  const handleSave = () => {
    if (saveDisabled) return;
    onConfigured?.({ backgroundImage, layout });
    onClose();
  };

  return (
    <NativeDrawer isOpen={isOpen} onClose={onClose}>
      <div className="stsd">
        <div className="stsd__header">
          <div className="stsd__header-left">
            <button type="button" className="stsd__back" onClick={onClose} aria-label="Back">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            </button>
            <span className="stsd__title">Share review to social</span>
          </div>
          <button
            type="button"
            className={`stsd__save${saveDisabled ? ' stsd__save--disabled' : ''}`}
            onClick={handleSave}
            disabled={saveDisabled}
          >
            Save
          </button>
        </div>

        <div className="stsd__body">
          {locked ? (
            <div className="stsd__locked-note">
              <span className="material-symbols-outlined stsd__locked-icon">lock</span>
              <span>Brand assets and layouts can only be configured at the business level — each business uses its own logo, colors, and imagery. Log in to the individual business account to set these up.</span>
            </div>
          ) : configured && (
            <div className="stsd__configured-note">
              <span className="material-symbols-outlined stsd__configured-icon">check_circle</span>
              <span>Configured for this business. Change the selection and save to update it.</span>
            </div>
          )}

          <div className="stsd__section">
            <span className="stsd__label">
              Background image<span className="stsd__required"> *</span>
            </span>
            {locked ? (
              <div className="stsd__upload" aria-disabled="true">
                <span className="material-symbols-outlined stsd__upload-icon">upload</span>
                <span className="stsd__upload-text">Upload a background image</span>
              </div>
            ) : (
              <button
                type="button"
                className="stsd__upload stsd__upload--active"
                onClick={() => setBackgroundImage('brand-background.png')}
              >
                <span className="material-symbols-outlined stsd__upload-icon">
                  {backgroundImage ? 'image' : 'upload'}
                </span>
                <span className="stsd__upload-text">{backgroundImage || 'Upload a background image'}</span>
              </button>
            )}
          </div>

          <div className="stsd__section">
            <span className="stsd__label">
              Choose review layout<span className="stsd__required"> *</span>
            </span>
            {locked ? (
              <div className="stsd__field" aria-disabled="true">
                <span className="stsd__field-placeholder">Choose a review layout</span>
                <span className="material-symbols-outlined stsd__field-chevron">keyboard_arrow_down</span>
              </div>
            ) : (
              <div className="stsd__panel stsd__panel--active">
                {SAMPLE_LAYOUTS.map((opt) => {
                  const selected = layout === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      className="stsd__radio-option stsd__radio-option--active"
                      onClick={() => setLayout(opt.id)}
                    >
                      <span className={`stsd__radio-dot${selected ? ' stsd__radio-dot--checked' : ''}`} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </NativeDrawer>
  );
}
