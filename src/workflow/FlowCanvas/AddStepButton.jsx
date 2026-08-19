import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AddStepMenu from './AddStepMenu';
import './AddStepMenu.css';

/**
 * Shared canvas "+" control: blue hover + "Add step" tooltip, click opens AddStepMenu.
 */
export default function AddStepButton({
  className = '',
  isDraggingFromLHS = false,
  isDragOver = false,
  product = 'healthcare',
  agentName = '',
  onSelect,
  onDragOver,
  onDragLeave,
  onDrop,
}) {
  const btnRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  const updateAnchor = useCallback(() => {
    if (!btnRef.current) return null;
    const r = btnRef.current.getBoundingClientRect();
    setAnchorRect(r);
    setTooltipPos({
      top: r.top + r.height / 2,
      left: r.right + 8,
    });
    return r;
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function onScroll() {
      updateAnchor();
    }
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [menuOpen, updateAnchor]);

  function handleMouseEnter() {
    setHovered(true);
    updateAnchor();
  }

  function handleMouseLeave() {
    setHovered(false);
  }

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    const r = updateAnchor();
    setMenuOpen(true);
    if (r) setAnchorRect(r);
  }

  const btnClass = [
    'add-step-btn',
    'nodrag',
    'nopan',
    className,
    menuOpen ? 'add-step-btn--open' : '',
    isDraggingFromLHS ? 'add-step-btn--lhs-drag' : '',
    isDragOver ? 'add-step-btn--drop-target' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const showTooltip = hovered && !menuOpen && tooltipPos;

  return (
    <div className="add-step-btn-wrap">
      <button
        ref={btnRef}
        type="button"
        className={btnClass}
        aria-label="Add step"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <span className="material-symbols-outlined">add</span>
      </button>

      {showTooltip &&
        createPortal(
          <span
            className="add-step-tooltip"
            role="tooltip"
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: 'translateY(-50%)',
            }}
          >
            Add step
          </span>,
          document.body,
        )}

      <AddStepMenu
        open={menuOpen}
        anchorRect={anchorRect}
        anchorRef={btnRef}
        product={product}
        agentName={agentName}
        onClose={() => setMenuOpen(false)}
        onSelect={(payload) => {
          onSelect?.(payload);
          setMenuOpen(false);
        }}
      />
    </div>
  );
}
