'use client';

import { useMemo, useState } from 'react';
import { useI18n } from '@/components/providers/I18nProvider';
import { AndeanPattern, ArtPanel, Aurora, MeshGrid } from '@/components/ui/backgrounds';
import { GlassCard, GlassLink } from '@/components/ui/glass';
import { Reveal, SplitLines } from '@/components/ui/motion';
import { RECURSOS, TEMAS_RECURSOS } from '@/lib/data/recursos';

export default function RecursosPage() {
  const { t, tl } = useI18n();
  const [tema, setTema] = useState<string>('todos');

  const lista = useMemo(() => (tema === 'todos' ? RECURSOS : RECURSOS.filter((r) => r.tema === tema)), [tema]);

  return (
    <>
      <section className="page-head" data-surface="dark">
        <Aurora />
        <MeshGrid />
        <div className="container">
          <div className="split" style={{ alignItems: 'flex-end' }}>
            <div>
              <Reveal>
                <p className="eyebrow">{t('nav.recursos')}</p>
              </Reveal>
              <h1 className="display" style={{ marginTop: '0.9rem' }}>
                <SplitLines lines={[t('resources.title')]} />
              </h1>
              <Reveal delay={0.14}>
                <p className="lead mt-sm">{t('resources.subtitle')}</p>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <ArtPanel variante="ciudad" forma="wide" label={t('brand.tagline')} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tight" data-surface="light">
        <Aurora blobs={2} />
        <AndeanPattern />
        <div className="container">
          <div className="field">
            <span className="field__label">{t('resources.filter')}</span>
            <div className="row gap-xs">
              <button type="button" className="chip" aria-pressed={tema === 'todos'} onClick={() => setTema('todos')}>
                {t('common.all')}
              </button>
              {TEMAS_RECURSOS.map((x) => (
                <button key={x} type="button" className="chip" aria-pressed={tema === x} onClick={() => setTema(x)}>
                  {x}
                </button>
              ))}
            </div>
          </div>

          <div className="grid cols-3 gap-md mt-lg">
            {lista.map((recurso, i) => (
              <Reveal key={recurso.id} delay={(i % 3) * 0.08}>
                <GlassCard variant="solid" edge sheen className="pillar" style={{ minHeight: 0, height: '100%' }}>
                  <div className="between">
                    <span className="badge">{t(`resources.type.${recurso.tipo}`)}</span>
                    <span className="faint" style={{ fontSize: 'var(--fs-xs)' }}>
                      {recurso.minutos} {t('resources.minutes')}
                    </span>
                  </div>
                  <h2 className="pillar__title" style={{ fontSize: 'clamp(1.15rem, 1.7vw, 1.5rem)' }}>
                    {tl(recurso.titulo)}
                  </h2>
                  <p className="pillar__body">{tl(recurso.resumen)}</p>
                  <span className="pillar__foot">{recurso.tema}</span>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          <Reveal className="center mt-xl">
            <GlassLink href="/evaluaciones" variant="primary" size="lg" arrow>
              {t('quiz.start')}
            </GlassLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
