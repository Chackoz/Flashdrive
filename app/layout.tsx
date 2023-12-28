import type { Metadata } from 'next'
import {inter} from './fonts'
import './globals.css'
import Script from 'next/script'


export const metadata: Metadata = {
  title: 'Flash Drive',
  description: 'F^2 AN',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    <html lang="en" className='bg-green-200 '>
      

      <body className={inter.className}>{children}</body>
    </html>
  )
}
