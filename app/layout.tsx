import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'MercadoLibre - Checkout',
  description: 'Flujo de checkout de MercadoLibre Argentina',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased bg-[#EBEBEB]`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
