import { INFO_CARD_LAYOUT } from './InfoCard.types'
import type { InfoCardProps } from './InfoCard.types'

export function InfoCard({
  title,
  description,
  actionLabel = 'Use agent',
  onAction,
}: InfoCardProps) {
  return (
    <div className={INFO_CARD_LAYOUT.root}>
      <h3 className={INFO_CARD_LAYOUT.title}>{title}</h3>
      <p className={INFO_CARD_LAYOUT.description}>{description}</p>
      <div className={INFO_CARD_LAYOUT.ctaWrap}>
        <button type="button" onClick={onAction} className={INFO_CARD_LAYOUT.cta}>
          {actionLabel}
        </button>
      </div>
    </div>
  )
}
