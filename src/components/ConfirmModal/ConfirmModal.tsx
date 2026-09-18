import { createPortal } from 'react-dom'
import { Icon } from '../Icon/Icon'
import type { ConfirmModalProps } from './ConfirmModal.types'

export function ConfirmModal({ open, title, description, confirmLabel, onConfirm, onClose }: ConfirmModalProps) {
  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative w-[600px] max-w-[92vw] rounded-md bg-surface p-xl shadow-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="flex items-center justify-between">
          <h2 id="confirm-modal-title" className="text-h3 text-text-primary">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-sm text-text-icon hover:bg-surface-hover"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        <p className="mt-lg text-body text-text-primary">{description}</p>

        <div className="mt-xl flex items-center justify-end gap-md">
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm px-md py-xs text-body text-text-action hover:bg-surface-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-9 items-center rounded-sm bg-primary px-lg text-body text-white transition-colors hover:bg-primary-hover"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
