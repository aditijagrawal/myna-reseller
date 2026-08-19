import React, { useState, useRef, useEffect } from 'react';
import { DrawerHeader } from '../../../../elemental-stubs';
import { VariableIcon, ExpandIcon } from '../../../../Molecules/Inputs/PromptToolbarIcons.jsx';
import toolbarStyles from '../../../../Molecules/Inputs/UserPromptInput/UserPromptInput.module.css';

const font = '"Inter", sans-serif';

const COLORS = {
  white: '#ffffff',
  infoBg: '#e3f2fd',
  infoBorder: '#90caf9',
  infoText: '#1565c0',
  border: '#c5cad3',
  primary: '#212121',
  secondary: '#555',
  tertiary: '#8f8f8f',
  accent: '#1976d2',
};

const VARIABLES = [
  { label: 'First name', value: '[First name]' },
  { label: 'Last name', value: '[Last name]' },
  { label: 'Business name', value: '[Business name]' },
  { label: 'Business phone', value: '[Business phone]' },
  { label: 'Agent name', value: '[Agent name]' },
  { label: 'Appointment date', value: '[Appointment date]' },
  { label: 'Appointment time', value: '[Appointment time]' },
];

/* ── Variable picker dropdown ───────────────────────────────────────────── */
function VariablePicker({ anchorRef, onInsert, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        ref.current && !ref.current.contains(e.target) &&
        anchorRef?.current && !anchorRef.current.contains(e.target)
      ) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, anchorRef]);

  return (
    <div
      ref={ref}
      className={toolbarStyles.typePicker}
      style={{ bottom: 'calc(100% + 4px)', top: 'auto', left: 0 }}
    >
      {VARIABLES.map((v) => (
        <button
          key={v.value}
          type="button"
          className={toolbarStyles.typePickerItem}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { onInsert(v.value); onClose(); }}
        >
          <span
            className={toolbarStyles.typePickerSwatch}
            style={{ background: '#ecf5fd', fontSize: 11, color: COLORS.accent, fontFamily: '"Roboto", sans-serif' }}
          >
            {'{}'}
          </span>
          <span className={toolbarStyles.typePickerLabel}>{v.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ── Generate with AI inline panel ─────────────────────────────────────── */
function GeneratePanel({ onGenerate, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const generated =
      `Hi [First name], you've reached [Business name]. We're sorry we missed your call. ` +
      `Please leave a brief message and we'll get back to you as soon as possible. ` +
      `You can also reach us at [Business phone] during business hours. Thank you!`;
    setLoading(false);
    onGenerate(generated);
    onClose();
  };

  return (
    <div
      style={{
        borderTop: '1px solid #e5e9f0',
        padding: '10px 12px',
        background: '#fafafa',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}
    >
      <input
        type="text"
        placeholder="Describe the voicemail message you want…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); if (e.key === 'Escape') onClose(); }}
        disabled={loading}
        autoFocus
        style={{
          flex: 1,
          height: 30,
          padding: '0 10px',
          border: '1px solid #c5cad3',
          borderRadius: 4,
          fontFamily: '"Roboto", sans-serif',
          fontSize: 13,
          color: COLORS.primary,
          background: COLORS.white,
          outline: 'none',
        }}
        onFocus={(e) => { e.target.style.borderColor = COLORS.accent; }}
        onBlur={(e) => { e.target.style.borderColor = '#c5cad3'; }}
      />
      <button
        type="button"
        disabled={!prompt.trim() || loading}
        onClick={handleGenerate}
        style={{
          height: 30,
          padding: '0 12px',
          background: prompt.trim() && !loading ? COLORS.accent : '#f4f6f7',
          border: 'none',
          borderRadius: 4,
          cursor: prompt.trim() && !loading ? 'pointer' : 'not-allowed',
          fontFamily: '"Roboto", sans-serif',
          fontSize: 12,
          color: prompt.trim() && !loading ? '#fff' : COLORS.tertiary,
          whiteSpace: 'nowrap',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          transition: 'background 0.15s',
        }}
      >
        {loading ? 'Generating…' : 'Generate'}
      </button>
      <button
        type="button"
        onClick={onClose}
        style={{
          width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', cursor: 'pointer', color: COLORS.tertiary,
          fontSize: 18, lineHeight: 1, borderRadius: 4, padding: 0, flexShrink: 0,
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function VoicemailDetection({
  title = 'Voicemail detection',
  onBack,
  onSave,
}) {
  const [voicemailMessage, setVoicemailMessage] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const varBtnRef = useRef(null);

  const insertVariable = (variable) => {
    const el = document.getElementById('voicemail-message');
    if (!el) { setVoicemailMessage((p) => p + variable); return; }
    const start = el.selectionStart ?? voicemailMessage.length;
    const end = el.selectionEnd ?? voicemailMessage.length;
    const next = voicemailMessage.slice(0, start) + variable + voicemailMessage.slice(end);
    setVoicemailMessage(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + variable.length, start + variable.length);
    });
  };

  return (
    <div
      style={{
        width: 650,
        maxWidth: '100%',
        background: COLORS.white,
        fontFamily: font,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        textAlign: 'left',
        margin: 0,
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <DrawerHeader
        title={title}
        onBack={onBack}
        actions={[{ label: 'Save', onClick: onSave }]}
      />

      <div style={{ padding: '24px 30px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Input box — same structure as UserPromptInput */}
        <div className={toolbarStyles.inputBox}>
          <textarea
            id="voicemail-message"
            name="voicemail-message"
            value={voicemailMessage}
            rows={4}
            placeholder="Enter voicemail message…"
            onChange={(e) => setVoicemailMessage(e.target.value)}
            style={{
              padding: '8px 12px',
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              fontFamily: '"Roboto", sans-serif',
              fontSize: 14,
              color: COLORS.primary,
              lineHeight: '20px',
              background: 'transparent',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />

          {/* Toolbar — identical to Steps editor */}
          <div className={toolbarStyles.toolbar} style={{ position: 'relative' }}>
            <button
              ref={varBtnRef}
              type="button"
              className={`${toolbarStyles.toolbarBtn} ${pickerOpen ? toolbarStyles.toolbarBtnActive : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { setGenerateOpen(false); setPickerOpen((p) => !p); }}
              title="Add variable"
              aria-label="Add variable"
            >
              <VariableIcon />
            </button>
            <button
              type="button"
              className={`${toolbarStyles.toolbarBtn} ${generateOpen ? toolbarStyles.toolbarBtnActive : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { setPickerOpen(false); setGenerateOpen((p) => !p); }}
              title="Generate with AI"
              aria-label="Generate with AI"
            >
              <ExpandIcon />
            </button>

            {pickerOpen && (
              <VariablePicker
                anchorRef={varBtnRef}
                onInsert={insertVariable}
                onClose={() => setPickerOpen(false)}
              />
            )}
          </div>

          {generateOpen && (
            <GeneratePanel
              onGenerate={(text) => setVoicemailMessage(text)}
              onClose={() => setGenerateOpen(false)}
            />
          )}
        </div>

        {/* Info banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            padding: '10px 14px',
            background: COLORS.infoBg,
            border: `1px solid ${COLORS.infoBorder}`,
            borderRadius: 6,
          }}
        >
          <i className="icon_phoenix-info" style={{ fontSize: 16, color: COLORS.infoText, flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontSize: 13, lineHeight: '20px', color: COLORS.infoText, fontFamily: font }}>
            Leave blank to end the call immediately when voicemail is detected. If provided, this message will be played before ending the call.
          </span>
        </div>
      </div>
    </div>
  );
}
