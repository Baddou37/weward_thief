import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { getLocale } from '@/lib/i18n/server'
import { LocaleProvider } from '@/components/locale-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { dictionaries } from '@/lib/i18n/dictionaries'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const m = dictionaries[locale].meta
  return {
    title: m.title,
    description: m.description,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} min-h-full bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100`}>
        <ThemeProvider>
          <LocaleProvider locale={locale}>{children}</LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
