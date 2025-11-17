/**
 * ============================================
 * ROOT LAYOUT
 * ============================================
 * 
 * Features:
 * - Global metadata (SEO)
 * - Font imports (Inter, Space Grotesk)
 * - Global CSS imports
 * - Navbar component
 * - Analytics placeholder
 */

import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

// ============================================
// FONT CONFIGURATIONS
// ============================================

// Inter - Body font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

// Space Grotesk - Display font (headlines)
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// ============================================
// METADATA (SEO)
// ============================================

export const metadata = {
  title: {
    default: 'WALT Prompt Studio - AI-Powered Prompt Optimizer',
    template: '%s | WALT Prompt Studio',
  },
  description:
    'Optimize your AI prompts with profession-aware frameworks (WALT, RACE, CCE). Save, version, and share your best prompts in the Vault.',
  keywords: [
    'AI prompts',
    'prompt engineering',
    'prompt optimizer',
    'ChatGPT prompts',
    'WALT framework',
    'prompt vault',
    'AI tools',
  ],
  authors: [{ name: 'WALT Studio Team' }],
  creator: 'WALT Studio',
  publisher: 'WALT Studio',
  
  // Open Graph (social media previews)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://waltprompt.studio',
    title: 'WALT Prompt Studio - AI-Powered Prompt Optimizer',
    description:
      'Optimize your AI prompts with profession-aware frameworks. Save and share your best prompts.',
    siteName: 'WALT Prompt Studio',
    images: [
      {
        url: '/og-image.png', // TODO: Create OG image (1200x630px)
        width: 1200,
        height: 630,
        alt: 'WALT Prompt Studio',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'WALT Prompt Studio',
    description: 'AI-powered prompt optimizer and vault',
    creator: '@waltstudio', // TODO: Replace with actual Twitter handle
    images: ['/og-image.png'],
  },
  
  // Additional metadata
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
  
  // Verification (add when ready)
  // verification: {
  //   google: 'your-google-site-verification-code',
  // },
  
  // Manifest for PWA (optional for v2)
  // manifest: '/manifest.json',
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Theme color (appears in mobile browser chrome)
  themeColor: '#4F46E5',
  
  // Viewport (responsive)
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

// ============================================
// ROOT LAYOUT COMPONENT
// ============================================

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* Additional head elements can go here */}
        {/* Example: Analytics script, Fonts preload, etc. */}
      </head>
      
      <body className="font-sans antialiased">
        {/* Global Navbar */}
        <Navbar />
        
        {/* Main content area */}
        <main className="relative">
          {children}
        </main>
        
        {/* Global Footer (optional - can be added later) */}
        {/* <Footer /> */}
        
        {/* Analytics Script Placeholder */}
        {/* TODO: Add Google Analytics, Plausible, or Vercel Analytics */}
        {/* Example:
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        */}
      </body>
    </html>
  );
}