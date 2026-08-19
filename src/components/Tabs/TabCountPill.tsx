import { TabCountPillProps } from './TabCountPill.types'

export function TabCountPill({ count, className = '' }: TabCountPillProps) {
  return (
    <span
      className={`rounded-full bg-surface-selected px-[6px] py-px text-small font-medium leading-[18px] text-text-secondary ${className}`.trim()}
    >
      {count}
    </span>
  )
}
