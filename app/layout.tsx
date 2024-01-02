import type { Metadata } from 'next'
import {inter} from './fonts'
import './globals.css'
import Script from 'next/script'
import { ToastContainer } from 'react-toastify';

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
    
    <html lang="en" className='bg-[#e0e0e0] scroll-smooth' style={{scrollBehavior:'smooth'}}>
     

      <body className={inter.className}>
      <ToastContainer />
        {children}</body>
    </html>
  )
}
