import type {PropsWithChildren} from 'react'

type Align = 'left' | 'center' | 'right' | 'justify'

export function TextAlignDecorator(
  {align, children}: PropsWithChildren<{align: Align}>
) {
  const style: React.CSSProperties =
    align === 'justify' ? {textAlign: 'justify'} : {textAlign: align}
  // display:block => align działa na całym akapicie
  return <span style={{display: 'block', ...style}}>{children}</span>
}