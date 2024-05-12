import { Roboto_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const satoshi = localFont({
  src: './fonts/Satoshi-Variable.woff2',
  variable: '--font-satoshi',
  weight: '300 900',
  display: 'swap',
  style: 'normal',
})

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  adjustFontFallback: false,
})
