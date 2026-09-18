import React, { useState, useEffect } from 'react';
import { FormInput, TextArea } from '../../../elemental-stubs';
import { subscribeToCustomTools } from '../../../services/agentService';
import birdeyeLogoUrl from '../../../../assets/birdeye-logo.svg';
import styles from './EntityTaskBody.module.css';

export default function EntityTaskBody({ initialValues = {}, onFieldChange, onOpenTool, onSwapTool, viewOnly = false, businessEditableToolIds = [] }) {
  const [taskName, setTaskName] = useState(initialValues.taskName ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [selectedTools, setSelectedTools] = useState(initialValues.selectedTools ?? []);
  const [allTools, setAllTools] = useState([]);

  useEffect(() => {
    const unsub = subscribeToCustomTools((tools) => setAllTools(tools));
    return unsub;
  }, []);

  const handleTaskName = (e) => {
    const val = e.target.value;
    setTaskName(val);
    onFieldChange?.('taskName', val);
  };

  const handleDescription = (e) => {
    const val = e.target.value;
    setDescription(val);
    onFieldChange?.('description', val);
  };

  const handleRemoveTool = (toolId) => {
    const next = selectedTools.filter((id) => id !== toolId);
    setSelectedTools(next);
    onFieldChange?.('selectedTools', next);
  };

  const displayedTools = allTools.filter((t) => selectedTools.includes(t.id));

  return (
    <div className={styles.formContainer}>
      <FormInput
        name="taskName"
        type="text"
        label="Task name"
        placeholder="Enter name"
        value={taskName}
        onChange={handleTaskName}
        required
        readOnly={viewOnly}
      />
      <TextArea
        name="description"
        label="Description"
        placeholder="Enter description"
        value={description}
        onChange={handleDescription}
        noFloatingLabel
        readOnly={viewOnly}
      />

      <div className={styles.toolsSection}>
        <div className={styles.sectionLabelWrapper}>
          <span className={styles.sectionLabelText}>Tools</span>
          <span className={`material-symbols-outlined ${styles.sectionLabelIcon}`}>info</span>
        </div>

        <div className={styles.addBox}>
          {displayedTools.map((tool) => {
            const isBusinessEditable = viewOnly && businessEditableToolIds.includes(tool.id);
            const isInert = viewOnly && !isBusinessEditable;
            // Ancestor RHS panel has pointer-events:none while frozen — re-enable
            // just this row so a business can still reach its own fields.
            const rowStyle = isBusinessEditable
              ? { cursor: 'pointer', pointerEvents: 'auto', background: '#eef6ff', border: '1px solid #bcdcff' }
              : { cursor: isInert ? 'default' : (onOpenTool ? 'pointer' : 'default') };
            return (
            <div
              key={tool.id}
              className={styles.toolRow}
              onClick={isInert ? undefined : () => onOpenTool?.(tool.id)}
              style={rowStyle}
              title={isBusinessEditable ? 'You can configure this — click to edit' : undefined}
            >
              <div className={styles.toolRowMain}>
                <div className={styles.toolIconWrap}>
                  {tool.isBirdeye ? (
                    <img src={birdeyeLogoUrl} alt="Birdeye" style={{ width: 16, height: 16 }} />
                  ) : tool.icon ? (
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16, color: '#555', fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                    >
                      {tool.icon}
                    </span>
                  ) : tool.iconDataUrl ? (
                    <img src={tool.iconDataUrl} alt={tool.name} className={styles.toolIconImg} />
                  ) : (
                    <span className={`material-symbols-outlined ${styles.toolIconFallback}`}>build</span>
                  )}
                </div>
                <span className={styles.toolName}>{tool.name}</span>
                {isBusinessEditable && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                      marginLeft: 8,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: '#1967d2',
                      color: '#fff',
                      fontSize: 11,
                      lineHeight: '16px',
                      fontFamily: 'Roboto, sans-serif',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 12, lineHeight: 1 }}>edit</span>
                    You can edit
                  </span>
                )}
              </div>
              <div className={styles.toolRowActions} style={isBusinessEditable ? { pointerEvents: 'auto' } : undefined}>
                {(!viewOnly || isBusinessEditable) && (
                  <button
                    type="button"
                    className={styles.toolActionBtn}
                    onClick={(e) => { e.stopPropagation(); onOpenTool?.(tool.id); }}
                    title="Edit tool configuration"
                    style={isBusinessEditable ? { pointerEvents: 'auto' } : undefined}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16, lineHeight: 1, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                      edit
                    </span>
                  </button>
                )}
                {!viewOnly && (
                  <button
                    type="button"
                    className={styles.toolActionBtn}
                    onClick={(e) => { e.stopPropagation(); onSwapTool?.(); }}
                    title="Replace tool"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16, lineHeight: 1, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
                      swap_horiz
                    </span>
                  </button>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
