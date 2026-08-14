'use client';

import Link from 'next/link';
import { BdpMark } from '@/components/brand/BdpLogo';
import { useI18n } from '@/components/providers/I18nProvider';
import { AndeanPattern, ArtPanel, Aurora, Caustics, MeshGrid } from '@/components/ui/backgrounds';
import { GlassCard } from '@/components/ui/glass';
import { Reveal, SplitLines } from '@/components/ui/motion';

/**
 * Contenedor de las pantallas de identidad.
 * La pagina de referencia no tiene login, asi que el patron se construye desde
 * su lenguaje: mitad editorial con arte a sangre, mitad panel de vidrio.
 */
export function AuthShell({
  titulo,
  subtitulo,
  children,
  pie,
}: {
  titulo: string;
  subtitulo: string;
  children: React.ReactNode;
  pie: React.ReactNode;
}) {
  const { t } = useI18n();

  return (
    <section
      className="section"
      data-surface="dark"
      style={{ minHeight: '100svh', display: 'grid', alignItems: 'center', paddingTop: 'calc(var(--header-h, 84px) + 3rem)' }}
    >
      <Aurora />
      <MeshGrid />
      <AndeanPattern />

      <div className="container">
        <div className="split" style={{ alignItems: 'center' }}>
          {/* Columna editorial */}
          <div className="hide-sm">
            <Reveal>
              <BdpMark className="brand__mark" />
            </Reveal>
            <h1 className="display" style={{ marginTop: '1.4rem' }}>
              <SplitLines lines={[titulo]} />
            </h1>
            <Reveal delay={0.14}>
              <p className="lead mt-sm">{subtitulo}</p>
            </Reveal>

            <Reveal delay={0.24} className="mt-lg">
              <div style={{ position: 'relative' }}>
                <ArtPanel variante="agro" forma="wide" label={t('brand.claim')} />
                <Caustics />
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="faint mt-md" style={{ fontSize: 'var(--fs-xs)' }}>
                {t('auth.demoNote')}
              </p>
            </Reveal>
          </div>

          {/* Panel de formulario */}
          <Reveal delay={0.1} variant="scale">
            <GlassCard variant="pad-lg" edge refract hover={false}>
              <div className="hide-lg" style={{ marginBottom: '1.2rem' }}>
                <h2 className="h3">{titulo}</h2>
                <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                  {subtitulo}
                </p>
              </div>
              {children}
              <div className="rule" style={{ marginBlock: '1.5rem' }} />
              <div className="center" style={{ fontSize: 'var(--fs-sm)' }}>
                {pie}
              </div>
              <p className="faint center mt-sm" style={{ fontSize: 'var(--fs-xs)' }}>
                <Link href="/" className="link-underline">
                  {t('nav.home')}
                </Link>
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
