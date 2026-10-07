import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

import { GoogleTag } from '@/components/analytics/google-tag';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import {
  BRAND_COLOR,
  getSiteUrl,
  MAIN_CONTENT_ID,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
} from '@/lib/site';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: 'education',
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: BRAND_COLOR,
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    // data-scroll-behavior tells Next.js to suspend the CSS smooth scrolling
    // (globals.css) during route changes, so new pages start at the top instead
    // of animating partway down.
    <html lang='en' data-scroll-behavior='smooth'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {/* WCAG 2.4.1: lets keyboard users skip the repeated navigation. */}
        <a
          href={`#${MAIN_CONTENT_ID}`}
          className='sr-only rounded-lg bg-navy px-4 py-3 font-semibold text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:ring-2 focus:ring-brand focus:outline-hidden'
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className='min-h-screen w-full bg-surface focus:outline-hidden'
        >
          {children}
        </main>
        <SiteFooter />
        <GoogleTag />
      </body>
    </html>
  );
}
