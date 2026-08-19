import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type LinkBaseProps = {
  className?: string
  children?: ReactNode
}

export type LinkAsAnchorProps = LinkBaseProps & {
  as?: 'a'
} & AnchorHTMLAttributes<HTMLAnchorElement>

export type LinkAsButtonProps = LinkBaseProps & {
  as: 'button'
} & ButtonHTMLAttributes<HTMLButtonElement>

export type LinkProps = LinkAsAnchorProps | LinkAsButtonProps
