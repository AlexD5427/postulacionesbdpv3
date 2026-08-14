'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Accordion } from '@/components/features/Accordion';
import { ConvocatoriaCard } from '@/components/features/ConvocatoriaCard';
import { DragHint, DragRail } from '@/components/features/DragRail';
import { SectionHeader } from '@/components/features/SectionHeader';
import { BdpMark } from '@/components/brand/BdpLogo';
import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { AndeanPattern, ArtPanel, Aurora, MeshGrid, Vignette } from '@/components/ui/backgrounds';
import { ScrollCue } from '@/components/ui/chrome';
import { GlassCard, GlassLink, Tilt } from '@/components/ui/glass';
import { Counter, Marquee, Parallax, Reveal, Rotator, ScrollScale, SplitLines } from '@/components/ui/motion';
import { CONVOCATORIAS, convocatoriasActivas } from '@/lib/data/convocatorias';
import { formatBob } from '@/lib/utils';

export default function HomePage() {
  const { t, tl, locale } = useI18n();
  const { autenticado } = useAuth();

  const activas = useMemo(() => convocatoriasActivas(), []);
  const destacada = useMemo(() => activas.find((c) => c.destacada) ?? activas[0], [activas]);

  const rotator = [t('hero.rotator.1'), t('hero.rotator.2'), t('hero.rotator.3'), t('hero.rotator.4')];

  const faq = [1, 2, 3, 4, 5].map((n) => ({ q: t(`faq.${n}.q`), a: t(`faq.${n}.a`) }));

  return (
    <>
      {/* ==================================================================
          HERO
          ================================================================== */}
      <section className="hero" data-surface="dark" aria-labelledby="hero-title">
        <div className="hero__bg" aria-hidden="true" />
        <Aurora />
        <MeshGrid />
        <Vignette />

        <div className="container">
          <div className="hero__grid">
            <div>
              <Reveal className="hero__eyebrow">
                <p className="eyebrow">{t('hero.eyebrow')}</p>
              </Reveal>

              <h1 className="hero__title" id="hero-title">
                <SplitLines
                  lines={[
                    t('hero.title.a'),
                    <>
                      {t('hero.title.b')} <span className="thin">{t('hero.title.c')}</span>
                    </>,
                    <Rotator words={rotator} key="rot" />,
                  ]}
                  step={0.13}
                />
              </h1>

              <Reveal delay={0.5}>
                <p className="lead" style={{ marginTop: '1.8rem' }}>
                  {t('hero.lead')}
                </p>
              </Reveal>

              <Reveal delay={0.62} className="hero__actions">
                <GlassLink href="/convocatorias" variant="primary" size="lg" arrow>
                  {t('hero.cta.primary')}
                </GlassLink>
                <GlassLink href={autenticado ? '/panel' : '/registro'} variant="ghost" size="lg">
                  {autenticado ? t('nav.panel') : t('hero.cta.secondary')}
                </GlassLink>
              </Reveal>
            </div>

            {/* Tarjeta de convocatoria destacada, flotando sobre el hero */}
            {destacada && (
              <Reveal delay={0.35} variant="scale">
                <Tilt intensidad={7}>
                  <GlassCard variant="pad" edge refract className="hero__card float">
                    <p className="eyebrow eyebrow--plain" style={{ color: 'var(--gold-400)' }}>
                      {t('hero.card.title')}
                    </p>
                    <h2 className="h3" style={{ marginTop: '0.8rem' }}>
                      {tl(destacada.titulo)}
                    </h2>
                    <div className="conv-card__meta" style={{ marginTop: '0.9rem' }}>
                      <span>{destacada.area}</span>
                      <span>{destacada.ciudad}</span>
                      <span>{t(`jobs.mode.${destacada.modalidad}`)}</span>
                    </div>
                    <p className="muted" style={{ fontSize: 'var(--fs-sm)', marginTop: '0.9rem' }}>
                      {tl(destacada.resumen)}
                    </p>
                    <div className="rule" style={{ margin: '1.2rem 0 1rem' }} />
                    <div className="between">
                      <div>
                        <p className="faint" style={{ fontSize: 'var(--fs-xs)' }}>
                          {t('showcase.salary')}
                        </p>
                        <p className="num" style={{ fontWeight: 600 }}>
                          {formatBob(destacada.salarioMin, locale)} - {formatBob(destacada.salarioMax, locale)}
                        </p>
                      </div>
                      <span className="badge">
                        {destacada.vacantes} {t('showcase.vacancies')}
                      </span>
                    </div>
                    <GlassLink
                      href={`/convocatorias/${destacada.slug}`}
                      variant="institutional"
                      block
                      arrow
                      className="mt-md"
                    >
                      {t('hero.card.cta')}
                    </GlassLink>
                  </GlassCard>
                </Tilt>
              </Reveal>
            )}
          </div>

          {/* Zocalo de cifras */}
          <div className="hero__footer">
            <div className="row gap-xl">
              {[1, 2, 3].map((n) => (
                <Reveal key={n} delay={0.7 + n * 0.08} className="hero__stat">
                  <b>{t(`hero.stat.${n}.value`)}</b>
                  <span>{t(`hero.stat.${n}.label`)}</span>
                </Reveal>
              ))}
            </div>
            <ScrollCue label={t('hero.scroll')} />
          </div>
        </div>
      </section>

      {/* ==================================================================
          CINTA TIPOGRAFICA
          ================================================================== */}
      <section className="section section--flush" data-surface="deep" style={{ paddingBlock: '2.6rem' }}>
        <AndeanPattern />
        <Marquee
          items={[t('brand.claim'), t('pillars.1.foot'), t('brand.tagline'), t('pillars.2.foot'), t('pillars.3.foot')]}
          duration={38}
        />
      </section>

      {/* ==================================================================
          TRES PILARES
          ================================================================== */}
      <section className="section" data-surface="light" aria-labelledby="pilares">
        <Aurora blobs={2} />
        <div className="container">
          <SectionHeader
            eyebrow={t('pillars.eyebrow')}
            titleLines={[t('pillars.title')]}
            lead={t('concept.body')}
          />

          <div className="grid cols-3 gap-md mt-xl">
            {[1, 2, 3].map((n, i) => (
              <Reveal key={n} delay={i * 0.12} as="div">
                <GlassCard variant="solid" edge sheen className="pillar" style={{ height: '100%' }}>
                  <span className="pillar__num">{String(n).padStart(2, '0')}</span>
                  <h3 className="pillar__title" id={n === 1 ? 'pilares' : undefined}>
                    {t(`pillars.${n}.title`)}
                  </h3>
                  <p className="pillar__body">{t(`pillars.${n}.body`)}</p>
                  <span className="pillar__foot">{t(`pillars.${n}.foot`)}</span>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          CONCEPTO (texto + arte con parallax)
          ================================================================== */}
      <section className="section" data-surface="dark" aria-labelledby="concepto">
        <Aurora />
        <div className="container">
          <div className="split">
            <div>
              <Reveal>
                <p className="eyebrow">{t('concept.eyebrow')}</p>
              </Reveal>
              <h2 className="h2" style={{ marginTop: '1.2rem' }} id="concepto">
                <SplitLines lines={[t('concept.title')]} />
              </h2>
              <Reveal delay={0.15}>
                <p className="lead" style={{ marginTop: '1.4rem' }}>
                  {t('concept.body')}
                </p>
              </Reveal>

              <div className="stack gap-md mt-lg">
                {[1, 2, 3].map((n, i) => (
                  <Reveal key={n} delay={0.2 + i * 0.1}>
                    <GlassCard variant="pad" className="row" style={{ alignItems: 'flex-start' }}>
                      <span className="mono" style={{ color: 'var(--accent)' }}>
                        {String(n).padStart(2, '0')}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 className="h4">{t(`concept.point.${n}.title`)}</h4>
                        <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                          {t(`concept.point.${n}.body`)}
                        </p>
                      </div>
                    </GlassCard>
                  </Reveal>
                ))}
              </div>
            </div>

            <Parallax distance={60}>
              <ScrollScale>
                <ArtPanel variante="andes" forma="tall" label={t('concept.location')} />
              </ScrollScale>
              <Reveal delay={0.2}>
                <p className="muted mt-sm" style={{ fontSize: 'var(--fs-sm)' }}>
                  {t('concept.location.sub')}
                </p>
              </Reveal>
            </Parallax>
          </div>
        </div>
      </section>

      {/* ==================================================================
          VITRINA DE CONVOCATORIAS (riel arrastrable)
          ================================================================== */}
      <section className="section" data-surface="deep" aria-labelledby="vitrina">
        <AndeanPattern />
        <div className="container">
          <SectionHeader
            eyebrow={t('showcase.eyebrow')}
            titleLines={[t('showcase.title')]}
            aside={
              <Reveal delay={0.15} className="row gap-md" style={{ marginTop: '0.6rem' }}>
                <DragHint label={t('showcase.drag')} />
                <GlassLink href="/convocatorias" variant="ghost" size="sm" arrow>
                  {t('showcase.all')}
                </GlassLink>
              </Reveal>
            }
          />
        </div>

        <Reveal delay={0.1} className="mt-xl">
          <DragRail ariaLabel={t('showcase.eyebrow')} className="full-bleed">
            {activas.map((conv, i) => (
              <div className="drag-rail__item" key={conv.id} style={{ scrollSnapAlign: 'center' }}>
                <ConvocatoriaCard conv={conv} indice={i} />
              </div>
            ))}
          </DragRail>
        </Reveal>
      </section>

      {/* ==================================================================
          BENEFICIOS DE LA PLATAFORMA
          ================================================================== */}
      <section className="section" data-surface="light" aria-labelledby="beneficios">
        <Aurora blobs={2} />
        <div className="container">
          <SectionHeader
            eyebrow={t('benefits.eyebrow')}
            titleLines={[t('benefits.title')]}
            lead={t('panel.recommended.body')}
          />

          <div className="grid cols-3 gap-md mt-xl" id="beneficios">
            {[1, 2, 3, 4, 5, 6].map((n, i) => (
              <Reveal key={n} delay={(i % 3) * 0.1}>
                <GlassCard variant="solid" sheen className="tile" style={{ height: '100%' }}>
                  <span className="mono" style={{ color: 'var(--accent-2)' }}>
                    {String(n).padStart(2, '0')}
                  </span>
                  <h3 className="h4" style={{ marginTop: '0.5rem' }}>
                    {t(`benefits.${n}.title`)}
                  </h3>
                  <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                    {t(`benefits.${n}.body`)}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          PROCESO EN CUATRO PASOS
          ================================================================== */}
      <section className="section" data-surface="dark" aria-labelledby="proceso">
        <Aurora />
        <div className="container">
          <div className="split">
            <div className="sticky-col">
              <Reveal>
                <p className="eyebrow">{t('process.eyebrow')}</p>
              </Reveal>
              <h2 className="h2" style={{ marginTop: '1.1rem' }} id="proceso">
                <SplitLines lines={[t('process.title')]} />
              </h2>
              <Reveal delay={0.2} className="mt-lg">
                <ArtPanel variante="cadena" forma="wide" label={t('brand.tagline')} />
              </Reveal>
            </div>

            <div className="timeline">
              {[1, 2, 3, 4].map((n, i) => (
                <Reveal key={n} delay={i * 0.1} className="timeline__item">
                  <span className="timeline__dot">{n}</span>
                  <div>
                    <h3 className="timeline__title">{t(`process.${n}.title`)}</h3>
                    <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                      {t(`process.${n}.body`)}
                    </p>
                  </div>
                </Reveal>
              ))}

              <Reveal delay={0.5}>
                <GlassLink href="/registro" variant="primary" arrow className="mt-md">
                  {t('cta.primary')}
                </GlassLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          METRICAS
          ================================================================== */}
      <section className="section section--tight" data-surface="deep" aria-labelledby="metricas">
        <MeshGrid />
        <div className="container">
          <Reveal>
            <p className="eyebrow" id="metricas">
              {t('stats.eyebrow')}
            </p>
          </Reveal>
          <div className="grid cols-4 gap-md mt-lg">
            {[
              { to: CONVOCATORIAS.length, label: t('stats.1.label'), suffix: '' },
              { to: 4820, label: t('stats.2.label'), suffix: '+' },
              { to: 62, label: t('stats.3.label'), suffix: '' },
              { to: 14, label: t('stats.4.label'), suffix: '' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <GlassCard variant="pad" edge className="tile">
                  <span className="tile__value">
                    <Counter to={s.to} suffix={s.suffix} />
                  </span>
                  <span className="tile__label">{s.label}</span>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          TESTIMONIOS
          ================================================================== */}
      <section className="section" data-surface="light" aria-labelledby="voces">
        <Aurora blobs={2} />
        <div className="container">
          <Reveal>
            <p className="eyebrow" id="voces">
              {t('quotes.eyebrow')}
            </p>
          </Reveal>

          <div className="grid cols-3 gap-md mt-lg">
            {[1, 2, 3].map((n, i) => (
              <Reveal key={n} delay={i * 0.12}>
                <GlassCard variant="pad-lg" sheen style={{ height: '100%' }}>
                  <p className="quote">{t(`quotes.${n}.text`)}</p>
                  <div className="quote-author">
                    <span className={n === 2 ? 'avatar avatar--gold' : 'avatar'}>
                      {t(`quotes.${n}.author`)
                        .split(' ')
                        .map((p) => p.charAt(0))
                        .join('')}
                    </span>
                    <span>
                      <b style={{ display: 'block', fontSize: 'var(--fs-sm)' }}>{t(`quotes.${n}.author`)}</b>
                      <span className="faint" style={{ fontSize: 'var(--fs-xs)' }}>
                        {t(`quotes.${n}.role`)}
                      </span>
                    </span>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          FAQ
          ================================================================== */}
      <section className="section" data-surface="dark" aria-labelledby="faq">
        <Aurora />
        <div className="container container--narrow">
          <SectionHeader eyebrow={t('faq.eyebrow')} titleLines={[t('faq.title')]} />
          <Reveal delay={0.1} className="mt-lg">
            <Accordion items={faq} />
          </Reveal>
        </div>
      </section>

      {/* ==================================================================
          CIERRE
          ================================================================== */}
      <section className="section" data-surface="deep" aria-labelledby="cierre">
        <Aurora />
        <AndeanPattern />
        <div className="container center">
          <Reveal variant="scale">
            <BdpMark className="mx-auto" style={{ width: 62, height: 62 }} />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow eyebrow--plain mt-md" id="cierre">
              {t('cta.eyebrow')}
            </p>
          </Reveal>
          <h2 className="display mt-sm">
            <SplitLines lines={[t('cta.title')]} />
          </h2>
          <Reveal delay={0.2}>
            <p className="lead mt-md" style={{ marginInline: 'auto' }}>
              {t('cta.body')}
            </p>
          </Reveal>
          <Reveal delay={0.3} className="row gap-sm mt-lg" style={{ justifyContent: 'center' }}>
            <GlassLink href="/registro" variant="primary" size="lg" arrow>
              {t('cta.primary')}
            </GlassLink>
            <GlassLink href="/convocatorias" variant="ghost" size="lg">
              {t('cta.secondary')}
            </GlassLink>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="faint mt-md" style={{ fontSize: 'var(--fs-xs)' }}>
              <Link href="/bolsa" className="link-underline">
                {t('pool.title')}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
