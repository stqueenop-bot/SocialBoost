import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Header from '@/components/Header'
import QueryProvider from '@/components/QueryProvider'
import Schema, { OrganizationSchema } from '@/components/Schema'
import './globals.css'


const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fastxera — #1 Social Media Growth Service',
  description:
    'Grow your social media presence with real followers, likes, comments, and views. Fast delivery, best prices, 100% safe.',
  metadataBase: new URL('https://fastxera.com'),
  alternates: {
    canonical: '/',
  },
  keywords: [
    'Social Media Growth',
    'Buy Instagram Followers',
    'Buy YouTube Subscribers',
    'Buy Facebook Likes',
    'Buy Telegram Members',
    'SMM Panel India',
    'Fastxera',
  ],
  authors: [{ name: 'Fastxera Team' }],
  openGraph: {
    title: 'Fastxera — #1 Social Media Growth Service',
    description: 'Grow your social media presence with real followers, likes, comments, and views.',
    url: 'https://fastxera.com',
    siteName: 'Fastxera',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fastxera Social Media Growth',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fastxera — #1 Social Media Growth Service',
    description: 'Grow your social media presence with real followers, likes, comments, and views.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-amber-50/40 text-gray-900`}>
        <QueryProvider>
          <Schema data={OrganizationSchema} />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
