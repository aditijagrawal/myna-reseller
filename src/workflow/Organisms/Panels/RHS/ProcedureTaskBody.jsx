import React, { useState, useEffect } from 'react';
import {
  getProcedureById,
  getProceduresByIds,
  resolveProcedurePanelText,
  isCustomProcedureId,
} from '../../../services/procedureService';
import { ProcedureListCard } from '../../../../components/ProcedureListCard/ProcedureListCard';
import styles from './ProcedureTaskBody.module.css';

export default function ProcedureTaskBody({
  initialValues = {},
  onFieldChange,
  onSelectProcedure,
  viewOnly = false,
  product = 'automotive',
}) {
  const [procedureIds, setProcedureIds] = useState(initialValues.procedureIds ?? []);
  const overrides = initialValues.procedureOverrides || {};

  useEffect(() => {
    setProcedureIds(initialValues.procedureIds ?? []);
  }, [initialValues.procedureIds]);

  const procedures = procedureIds.map((id) => {
    const found = getProcedureById(id);
    if (found) return found;
    if (isCustomProcedureId(id)) return { id, name: 'Custom', whenToUse: '' };
    return null;
  }).filter(Boolean);
  const handleRemove = (id) => {
    const next = procedureIds.filter((pid) => pid !== id);
    setProcedureIds(next);
    onFieldChange?.('procedureIds', next);
  };

  const handleDuplicate = (id) => {
    const next = [...procedureIds, id];
    setProcedureIds(next);
    onFieldChange?.('procedureIds', next);
  };

  return (
    <div
      className={styles.body}
      style={viewOnly ? { pointerEvents: 'auto' } : undefined}
    >
      <div className={styles.list}>
        {procedures.map((p) => {
          const { name, whenToUse } = resolveProcedurePanelText(p, overrides, product);
          return (
            <ProcedureListCard
              key={p.id}
              title={name}
              description={whenToUse}
              onClick={() => onSelectProcedure?.(p.id)}
              onEdit={!viewOnly ? () => onSelectProcedure?.(p.id) : undefined}
              onDuplicate={!viewOnly ? () => handleDuplicate(p.id) : undefined}
              onRemove={!viewOnly ? () => handleRemove(p.id) : undefined}
            />
          );
        })}
      </div>

    </div>
  );
}
