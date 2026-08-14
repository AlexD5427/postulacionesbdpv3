'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { AndeanPattern, ArtPanel, Aurora, Caustics, MeshGrid } from '@/components/ui/backgrounds';
import { GlassCard, GlassLink } from '@/components/ui/glass';
import { Counter, Parallax, Reveal, ScrollScale, SplitLines } from '@/components/ui/motion';
import { completitudPerfil } from '@/lib/match';

export default function BolsaPage() {
  const { t } = useI18n();
  const { usuario, autenticado, actualizar } = useAuth();
  const { toast } = useToast();
  const completitud = completitudPerfil(usuario);

  return (
    <>
      <section className="page-head" data-surface="deep">
        <Aurora />
        <MeshGrid />
        <AndeanPattern />
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t('nav.bolsa')}</p>
          </Reveal>
          <h1 className="display" style={{ marginTop: '0.9rem' }}>
            <SplitLines lines={[t('pool.title')]} />
          </h1>
          <Reveal delay={0.14}>
            <p className="lead mt-sm">{t('pool.subtitle')}</p>
          </Reveal>
        </div>
      </section>

      <section className="section" data-surface="dark">
        <Aurora blobs={2} />
        <div className="container">
          <div className="split">
            <div>
              <Reveal>
                <GlassCard variant="pad-lg" edge refract hover={false}>
                  <h2 className="h3">{t('panel.visibility.title')}</h2>
                  <p className="muted mt-sm" style={{ fontSize: 'var(--fs-sm)' }}>
                    {t('panel.visibility.body')}
                  </p>

                  {autenticado && usuario ? (
                    <>
                      <div className="between mt-lg">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={usuario.visibleEnBolsa}
                            onChange={(e) => {
                              actualizar({ visibleEnBolsa: e.target.checked });
                              toast(e.target.checked ? t('pool.optIn') : t('common.saved'));
                            }}
                          />
                          <span>{t('pool.optIn')}</span>
                        </label>
                        <span className="badge">{completitud.total}%</span>
                      </div>
                      <p className="field__hint mt-sm">{t('pool.optInHint')}</p>

                      <div className="progress" style={{ marginTop: '1rem' }}>
                        <i style={{ width: `${completitud.total}%` }} />
                      </div>
                      <GlassLink href="/panel?tab=perfil" variant="primary" arrow className="mt-md">
                        {t('panel.completeness.title')}
                      </GlassLink>
                    </>
                  ) : (
                    <div className="row gap-sm mt-lg">
                      <GlassLink href="/registro" variant="primary" arrow>
                        {t('cta.primary')}
                      </GlassLink>
                      <GlassLink href="/login" variant="ghost">
                        {t('nav.login')}
                      </GlassLink>
                    </div>
                  )}
                </GlassCard>
              </Reveal>

              <div className="tiles mt-md">
                {[
                  { label: t('stats.2.label'), valor: 4820, sufijo: '+' },
                  { label: t('stats.4.label'), valor: 14, sufijo: '' },
                  { label: t('stats.3.label'), valor: 62, sufijo: '' },
                ].map((tile, i) => (
                  <Reveal key={tile.label} delay={i * 0.08}>
                    <GlassCard variant="pad" className="tile">
                      <span className="tile__label">{tile.label}</span>
                      <span className="tile__value">
                        <Counter to={tile.valor} suffix={tile.sufijo} />
                      </span>
                    </GlassCard>
                  </Reveal>
                ))}
              </div>
            </div>

            <Parallax distance={50}>
              <ScrollScale>
                <div style={{ position: 'relative' }}>
                  <ArtPanel variante="cadena" forma="tall" label={t('brand.claim')} />
                  <Caustics />
                </div>
              </ScrollScale>
            </Parallax>
          </div>

          {/* Como funciona la bolsa */}
          <div className="grid cols-3 gap-md mt-xl">
            {[1, 2, 3].map((n, i) => (
              <Reveal key={n} delay={i * 0.1}>
                <GlassCard variant="pad" sheen className="tile" style={{ height: '100%' }}>
                  <span className="mono" style={{ color: 'var(--accent)' }}>
                    {String(n).padStart(2, '0')}
                  </span>
                  <h3 className="h4">{t(`concept.point.${n}.title`)}</h3>
                  <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                    {t(`concept.point.${n}.body`)}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
