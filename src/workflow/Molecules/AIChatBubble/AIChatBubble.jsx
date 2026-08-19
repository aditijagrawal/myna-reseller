import React from 'react';
// ai-avatar SVG stub — @birdeye/elemental not available in MYNA
const aiAvatar = 'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%220 0 24 24%22%3E%3Ccircle cx%3D%2212%22 cy%3D%2212%22 r%3D%2212%22 fill%3D%22%231976d2%22%2F%3E%3C%2Fsvg%3E';
import './AIChatBubble.css';

export default function AIChatBubble({ message, options = [], onOptionSelect }) {
  return (
    <div className="ai-chat-bubble">
      <div className="ai-chat-bubble__avatar">
        <img src={aiAvatar} alt="" width={20} height={20} />
      </div>
      <div className="ai-chat-bubble__body">
        <p className="ai-chat-bubble__message">{message}</p>
        {options.length > 0 && (
          <div className="ai-chat-bubble__options">
            {options.map((opt, i) => (
              <button
                key={i}
                className="ai-chat-bubble__option"
                onClick={() => onOptionSelect?.(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
