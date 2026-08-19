import React from 'react';

const font = '"Inter", arial, sans-serif';

export default function ChatPreview({
  agentName = 'Agent',
  replyButtons = [],
  resolutionButtonText = 'That helped 👍',
  escalationButtonText = 'Talk to human',
  fallbackDuringHours = '',
  fallbackAfterHours = '',
  previewType = 'agentName',
}) {
  const buttons = [];
  if (replyButtons.includes('resolution')) buttons.push(resolutionButtonText || 'That helped 👍');
  if (replyButtons.includes('escalation')) buttons.push(escalationButtonText || 'Talk to human');

  const fallbackText =
    previewType === 'fallbackDuringHours' ? fallbackDuringHours :
    previewType === 'fallbackAfterHours'  ? fallbackAfterHours  : '';

  return (
    <div style={{
      width: '100%',
      maxWidth: 320,
      margin: '0 auto',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(33,33,33,0.12)',
      fontFamily: font,
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
    }}>
      {/* Blue header */}
      <div style={{
        background: '#1976d2',
        padding: '20px 16px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{ height: 12, width: 160, background: 'rgba(255,255,255,0.55)', borderRadius: 6 }} />
        <div style={{ height: 9, width: '85%', background: 'rgba(255,255,255,0.35)', borderRadius: 6 }} />
      </div>

      {/* Chat body */}
      <div style={{ background: '#fff', padding: '24px 16px 16px', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 220 }}>
        {/* Message bubble */}
        <div style={{
          background: '#f0f0f0',
          borderRadius: '0 16px 16px 16px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          alignSelf: 'flex-start',
          maxWidth: '85%',
        }}>
          {(previewType === 'fallbackDuringHours' || previewType === 'fallbackAfterHours') && fallbackText ? (
            <span style={{ fontSize: 14, color: '#212121', lineHeight: '20px' }}>{fallbackText}</span>
          ) : (
            <>
              <div style={{ height: 10, background: '#d0d0d0', borderRadius: 6, width: 200 }} />
              <div style={{ height: 10, background: '#d0d0d0', borderRadius: 6, width: 130 }} />
            </>
          )}
        </div>

        {/* Reply buttons */}
        {previewType === 'replyButtons' && buttons.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {buttons.map((btn, i) => (
              <div key={i} style={{
                padding: '10px 18px',
                border: '1.5px solid #d0d0d0',
                borderRadius: 24,
                background: '#fff',
                fontSize: 14,
                fontFamily: font,
                color: '#212121',
                fontWeight: 500,
              }}>
                {btn}
              </div>
            ))}
          </div>
        )}

        {/* Avatar + name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#fff' }}>smart_toy</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#212121', fontFamily: font }}>
            {agentName || 'Agent'}
          </span>
          <span style={{ fontSize: 12, color: '#9e9e9e', fontFamily: font }}>• 09:12 PM</span>
        </div>
      </div>

      {/* Input bar */}
      <div style={{ background: '#fff', padding: '8px 12px 16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#f5f5f5',
          borderRadius: 28,
          padding: '12px 16px',
        }}>
          <span style={{ flex: 1, fontSize: 14, color: '#9e9e9e', fontFamily: font }}>Send a message</span>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#9e9e9e' }}>sentiment_satisfied</span>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#9e9e9e' }}>send</span>
        </div>
      </div>
    </div>
  );
}
