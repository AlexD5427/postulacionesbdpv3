import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import './glass.css';
import './components.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { AccessibilityFab, AccessibilityPanel } from '@/components/AccessibilityPanel';
import { CommandPalette } from '@/components/CommandPalette';
import { Dock } from '@/components/Dock';
import { Footer } from '@/components/Footer';
import { Preloader } from '@/components/Preloader';
import { SiteHeader } from '@/components/SiteHeader';
import { SmoothScroll } from '@/components/SmoothScroll';
import { SvgFilters } from '@/components/SvgFilters';
import { GrainOverlay } from '@/components/ui/backgrounds';
import { CursorGlow, ScrollProgress } from '@/components/ui/chrome';
import { SkipLink } from '@/components/SkipLink';

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://postulaciones-bdp.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BDP Talento | Trabaja en BDP S.A.M.',
    template: '%s | BDP Talento',
  },
  description:
    'Plataforma centralizada de talento del Banco de Desarrollo Productivo S.A.M. Convocatorias vigentes, perfil profesional unico, bolsa de talento y preparacion de evaluaciones. Disponible en espanol, ingles, quechua y aymara.',
  applicationName: 'BDP Talento',
  keywords: [
    'BDP',
    'Banco de Desarrollo Productivo',
    'empleo Bolivia',
    'convocatorias',
    'bolsa de talento',
    'banca de desarrollo',
  ],
  authors: [{ name: 'Banco de Desarrollo Productivo S.A.M.' }],
  openGraph: {
    type: 'website',
    locale: 'es_BO',
    alternateLocale: ['en_US'],
    title: 'BDP Talento | Trabaja en BDP S.A.M.',
    description:
      'Convocatorias vigentes, perfil profesional unico y bolsa de talento del Banco de Desarrollo Productivo S.A.M.',
    siteName: 'BDP Talento',
  },
  twitter: { card: 'summary_large_image', title: 'BDP Talento' },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050b16' },
    { media: '(prefers-color-scheme: light)', color: '#004282' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-BO" className={`${display.variable} ${sans.variable}`} data-surface="dark" suppressHydrationWarning>
      <body data-surface="dark">
        <AppProviders>
          <SvgFilters />
          <SkipLink />
          <Preloader />
          <SmoothScroll />
          <ScrollProgress />
          <CursorGlow />
          <GrainOverlay />

          <SiteHeader />

          <main id="contenido" tabIndex={-1}>
            {children}
          </main>

          <Footer />

          <Dock />
          <AccessibilityFab />
          <AccessibilityPanel />
          <CommandPalette />
        </AppProviders>
      </body>
    </html>
  );
}
