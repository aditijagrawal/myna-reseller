import { IconProps } from './Icon.types'

export function Icon({ name, size = 20, fill = false, weight = 400, className = '' }: IconProps) {
  return (
    <span
      aria-hidden
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: `${size}px`,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  )
}
