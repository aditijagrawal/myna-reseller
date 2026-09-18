import { useState } from 'react'
import { Icon } from '../Icon/Icon'
import type { ViewerContextSwitcherProps } from './ViewerContextSwitcher.types'

export function ViewerContextSwitcher({ viewerRole, businesses, onChange }: ViewerContextSwitcherProps) {
  const [open, setOpen] = useState(false)

  const currentLabel = viewerRole.type === 'reseller' ? 'Reseller' : viewerRole.name

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-sm rounded-sm border border-border-selected bg-surface px-md text-body text-text-primary hover:bg-surface-l2"
      >
        <span className="text-text-secondary">Viewing as:</span>
        <span>{currentLabel}</span>
        <Icon name="expand_more" size={18} className="text-text-icon" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+4px)] z-20 max-h-[360px] min-w-[220px] overflow-y-auto rounded-sm border border-border bg-surface py-xs shadow-dropdown">
            <button
              type="button"
              onClick={() => { onChange({ type: 'reseller' }); setOpen(false) }}
              className={`block w-full px-md py-sm text-left text-body hover:bg-surface-hover ${
                viewerRole.type === 'reseller' ? 'text-text-primary' : 'text-text-secondary'
              }`}
            >
              Reseller
            </button>
            <span className="mx-md my-xs block h-px bg-border" />
            {businesses.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => { onChange({ type: 'business', id: b.id, name: b.name }); setOpen(false) }}
                className={`block w-full px-md py-sm text-left text-body hover:bg-surface-hover ${
                  viewerRole.type === 'business' && viewerRole.id === b.id ? 'text-text-primary' : 'text-text-secondary'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
