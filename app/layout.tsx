import type { Metadata } from 'next'
import { twMerge } from 'tailwind-merge'

import { geistMono, geistSans } from '@/lib/fonts'

import { SidebarProvider } from '@/components/layout/SidebarProvider'
import { Sidebar } from '@/components/navigation/Sidebar'
import { MainContent } from '@/components/layout/MainContent'

import './globals.css'

export const metadata: Metadata = {
  title: 'Deckly',
  description: 'Flashcard app for learning',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={twMerge(
          'antialiased',
          geistSans.variable,
          geistMono.variable
        )}
      >
        <SidebarProvider>
          <Sidebar />
          <MainContent>{children}</MainContent>
        </SidebarProvider>
      </body>
    </html>
  )
}
