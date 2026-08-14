'use client';

import { useI18n } from '@/components/providers/I18nProvider';
import { Aurora, MeshGrid } from '@/components/ui/backgrounds';
import { GlassCard, GlassLink } from '@/components/ui/glass';
import { Reveal, SplitLines } from '@/components/ui/motion';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <section
      className="section"
      data-surface="dark"
      style={{ minHeight: '84svh', display: 'grid', placeItems: 'center' }}
    >
      <Aurora />
      <MeshGrid />
      <div className="container center">
        <Reveal>
          <p className="hero-type" style={{ fontSize: 'clamp(5rem, 22vw, 15rem)', lineHeight: 0.82 }}>
            404
          </p>
        </Reveal>
        <GlassCard variant="pad-lg" edge hover={false} style={{ maxWidth: '48ch', marginInline: 'auto' }}>
          <h1 className="h3">
            <SplitLines lines={[t('error.404.title')]} />
          </h1>
          <p className="muted mt-sm" style={{ fontSize: 'var(--fs-sm)' }}>
            {t('error.404.body')}
          </p>
          <div className="row gap-sm mt-md" style={{ justifyContent: 'center' }}>
            <GlassLink href="/" variant="primary" arrow>
              {t('error.404.cta')}
            </GlassLink>
            <GlassLink href="/convocatorias" variant="ghost">
              {t('nav.convocatorias')}
            </GlassLink>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
