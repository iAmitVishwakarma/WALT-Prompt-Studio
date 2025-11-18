import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/providers/AuthProvider';
import {ProjectProvider} from '@/components/providers/ProjectProvider';

// ============================================
// FONT CONFIGURATIONS
// ============================================

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// ============================================
// VIEWPORT CONFIG (New Standard)
// ============================================

export const viewport = {
  themeColor: '#4F46E5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

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
        url: '/og-image.png', 
        width: 1200,
        height: 630,
        alt: 'WALT Prompt Studio',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'WALT Prompt Studio',
    description: 'AI-powered prompt optimizer and vault',
    creator: '@waltstudio', 
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
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

// ============================================
// ROOT LAYOUT COMPONENT
// ============================================

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
        <ProjectProvider>
        <Navbar />
        <main className="relative">
          {children}
        </main>
        </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}