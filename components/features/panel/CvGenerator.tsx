'use client';

import { useState } from 'react';
import { BdpMark } from '@/components/brand/BdpLogo';
import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { Aurora } from '@/components/ui/backgrounds';
import { GlassButton, GlassCard, GlassLink } from '@/components/ui/glass';
import { Reveal } from '@/components/ui/motion';
import { formatBob } from '@/lib/utils';

/**
 * Generador de hoja de vida.
 * Se imprime con el dialogo nativo del navegador (Ctrl+P o el boton), que
 * permite "Guardar como PDF" sin dependencias externas. Los estilos de
 * impresion viven en globals.css bajo @media print.
 */
export function CvGenerator() {
  const { t, locale } = useI18n();
  const { usuario } = useAuth();
  const [incluirContacto, setIncluirContacto] = useState(true);
  const [incluirSalario, setIncluirSalario] = useState(false);

  if (!usuario) {
    return (
      <section className="section" data-surface="dark" style={{ minHeight: '70svh', display: 'grid', placeItems: 'center' }}>
        <Aurora />
        <div className="container center">
          <GlassCard variant="pad-lg" hover={false} style={{ maxWidth: '44ch', marginInline: 'auto' }}>
            <h1 className="h3">{t('panel.needLogin')}</h1>
            <GlassLink href="/login" variant="primary" arrow className="mt-md">
              {t('nav.login')}
            </GlassLink>
          </GlassCard>
        </div>
      </section>
    );
  }

  const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.trim() || usuario.email;

  return (
    <section className="section" data-surface="dark" style={{ paddingTop: 'calc(var(--header-h, 84px) + 3rem)' }}>
      <Aurora />
      <div className="container container--narrow">
        {/* --- Controles (no se imprimen) ------------------------------- */}
        <div className="no-print">
          <Reveal>
            <div className="between">
              <div>
                <h1 className="h2">{t('panel.cv.title')}</h1>
                <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                  {t('panel.cv.body')}
                </p>
              </div>
              <div className="row gap-xs">
                <GlassLink href="/panel" variant="quiet" size="sm" swap={false}>
                  {t('common.back')}
                </GlassLink>
                <GlassButton variant="primary" swap={false} onClick={() => window.print()}>
                  {t('panel.cv.print')}
                </GlassButton>
              </div>
            </div>
          </Reveal>

          <GlassCard variant="pad" hover={false} className="mt-md">
            <div className="row gap-md">
              <label className="switch">
                <input type="checkbox" checked={incluirContacto} onChange={(e) => setIncluirContacto(e.target.checked)} />
                <span>{t('footer.contact')}</span>
              </label>
              <label className="switch">
                <input type="checkbox" checked={incluirSalario} onChange={(e) => setIncluirSalario(e.target.checked)} />
                <span>{t('profile.salaryExpectation')}</span>
              </label>
            </div>
          </GlassCard>
        </div>

        {/* --- Documento ------------------------------------------------ */}
        <Reveal delay={0.1} className="mt-lg">
          <article className="cv" aria-label={t('panel.cv.title')}>
            <header style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <BdpMark className="cv__logo" />
              <div style={{ flex: 1 }}>
                <h2>{nombreCompleto}</h2>
                <p style={{ color: '#4a5568', fontSize: '0.9rem' }}>
                  {usuario.profesion || t('profile.profession')}
                  {usuario.experienciaAnios > 0 && ` · ${usuario.experienciaAnios} ${t('profile.experienceYears').toLowerCase()}`}
                </p>
                {incluirContacto && (
                  <p style={{ color: '#4a5568', fontSize: '0.82rem', marginTop: '0.3rem' }}>
                    {[usuario.email, usuario.telefono, `${usuario.ciudad}, ${usuario.departamento}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}
              </div>
            </header>

            {usuario.resumen && (
              <section className="cv__section">
                <h3>{t('profile.about')}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{usuario.resumen}</p>
              </section>
            )}

            {usuario.experiencia.length > 0 && (
              <section className="cv__section">
                <h3>{t('profile.experience')}</h3>
                {usuario.experiencia.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: '0.9rem' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{exp.cargo || '—'}</p>
                    <p style={{ color: '#4a5568', fontSize: '0.84rem' }}>
                      {exp.empresa}
                      {(exp.desde || exp.hasta) && ` · ${exp.desde || ''} — ${exp.hasta || t('profile.current')}`}
                    </p>
                    {exp.descripcion && (
                      <p style={{ fontSize: '0.86rem', marginTop: '0.25rem', lineHeight: 1.55 }}>{exp.descripcion}</p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {usuario.educacion.length > 0 && (
              <section className="cv__section">
                <h3>{t('profile.educationTitle')}</h3>
                {usuario.educacion.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: '0.7rem' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.92rem' }}>{edu.titulo || '—'}</p>
                    <p style={{ color: '#4a5568', fontSize: '0.84rem' }}>
                      {edu.institucion}
                      {edu.anio && ` · ${edu.anio}`} · {t(`profile.education.${edu.nivel}`)}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {usuario.habilidades.length > 0 && (
              <section className="cv__section">
                <h3>{t('profile.skills')}</h3>
                <p style={{ fontSize: '0.88rem' }}>{usuario.habilidades.join(' · ')}</p>
              </section>
            )}

            {usuario.idiomas.length > 0 && (
              <section className="cv__section">
                <h3>{t('profile.languages')}</h3>
                <p style={{ fontSize: '0.88rem' }}>
                  {usuario.idiomas.map((i) => `${i.nombre} (${i.nivel})`).join(' · ')}
                </p>
              </section>
            )}

            {incluirSalario && usuario.expectativaSalarial > 0 && (
              <section className="cv__section">
                <h3>{t('profile.salaryExpectation')}</h3>
                <p style={{ fontSize: '0.88rem' }}>{formatBob(usuario.expectativaSalarial, locale)}</p>
              </section>
            )}

            <footer className="cv__section" style={{ color: '#718096', fontSize: '0.72rem' }}>
              {t('brand.name')} · {t('brand.full')}
            </footer>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
