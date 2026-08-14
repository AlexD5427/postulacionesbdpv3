'use client';

import { MatchRing } from '@/components/features/ConvocatoriaCard';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCandidato } from '@/components/providers/CandidatoProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { GlassButton, GlassCard, GlassLink } from '@/components/ui/glass';
import { Reveal } from '@/components/ui/motion';
import { calcularMatch } from '@/lib/match';
import type { Convocatoria } from '@/lib/types';
import { formatBob, formatDate } from '@/lib/utils';

/** Comparador lado a lado de hasta tres convocatorias. */
export function CompararTab({ convocatorias }: { convocatorias: Convocatoria[] }) {
  const { t, tl, locale } = useI18n();
  const { comparar, alternarComparar, limpiarComparar } = useCandidato();
  const { usuario } = useAuth();

  const seleccionadas = convocatorias.filter((c) => comparar.includes(c.slug));
  const disponibles = convocatorias.filter((c) => !comparar.includes(c.slug));

  const filas: Array<{ label: string; valor: (c: Convocatoria) => React.ReactNode }> = [
    { label: t('job.code'), valor: (c) => c.codigo },
    { label: t('job.area'), valor: (c) => c.area },
    { label: t('job.location'), valor: (c) => `${c.ciudad}, ${c.departamento}` },
    { label: t('jobs.filter.mode'), valor: (c) => t(`jobs.mode.${c.modalidad}`) },
    { label: t('jobs.filter.type'), valor: (c) => t(`jobs.type.${c.tipo}`) },
    { label: t('jobs.filter.seniority'), valor: (c) => t(`jobs.seniority.${c.seniority}`) },
    { label: t('profile.experienceYears'), valor: (c) => `${c.experienciaAnios}` },
    { label: t('profile.educationLevel'), valor: (c) => t(`profile.education.${c.educacionMinima}`) },
    { label: t('showcase.salary'), valor: (c) => `${formatBob(c.salarioMin, locale)} - ${formatBob(c.salarioMax, locale)}` },
    { label: t('job.vacancies'), valor: (c) => `${c.vacantes}` },
    { label: t('showcase.closes'), valor: (c) => formatDate(c.cierra, locale) },
    {
      label: t('job.competencies'),
      valor: (c) => (
        <span className="row gap-xs" style={{ justifyContent: 'flex-start' }}>
          {c.competencias.map((x) => (
            <span className="chip" key={x} style={{ fontSize: '0.68rem' }}>
              {x}
            </span>
          ))}
        </span>
      ),
    },
  ];

  return (
    <div className="stack gap-lg">
      <Reveal>
        <GlassCard variant="pad-lg" hover={false}>
          <div className="between">
            <div>
              <h2 className="h3">{t('panel.compare.title')}</h2>
              <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                {t('panel.compare.body')}
              </p>
            </div>
            {comparar.length > 0 && (
              <GlassButton variant="quiet" swap={false} onClick={limpiarComparar}>
                {t('common.clear')}
              </GlassButton>
            )}
          </div>

          {/* Selector rapido */}
          {comparar.length < 3 && (
            <div className="field mt-md">
              <span className="field__label">{t('panel.compare.pick')}</span>
              <div className="row gap-xs">
                {disponibles.slice(0, 8).map((c) => (
                  <button type="button" className="chip" key={c.id} onClick={() => alternarComparar(c.slug)}>
                    + {tl(c.titulo)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </Reveal>

      {seleccionadas.length < 2 ? (
        <div className="empty">
          <p>{t('panel.compare.empty')}</p>
          <GlassLink href="/convocatorias" variant="ghost" size="sm" arrow>
            {t('showcase.all')}
          </GlassLink>
        </div>
      ) : (
        <GlassCard variant="pad" hover={false} className="glass--clip">
          <div style={{ overflowX: 'auto' }} data-lenis-prevent>
            <table style={{ minWidth: `${220 + seleccionadas.length * 230}px` }}>
              <caption className="sr-only">{t('panel.compare.title')}</caption>
              <thead>
                <tr>
                  <th scope="col" style={{ textAlign: 'left', padding: '0.8rem', width: '200px' }}>
                    <span className="field__label">{t('job.overview')}</span>
                  </th>
                  {seleccionadas.map((c) => (
                    <th scope="col" key={c.id} style={{ textAlign: 'left', padding: '0.8rem', verticalAlign: 'top' }}>
                      <div className="stack gap-xs">
                        {usuario && <MatchRing valor={calcularMatch(usuario, c).score} />}
                        <span className="h4">{tl(c.titulo)}</span>
                        <button type="button" className="chip" onClick={() => alternarComparar(c.slug)}>
                          {t('common.remove')}
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filas.map((fila) => (
                  <tr key={fila.label} style={{ borderTop: '1px solid var(--line)' }}>
                    <th scope="row" style={{ textAlign: 'left', padding: '0.8rem', fontWeight: 600, fontSize: 'var(--fs-sm)', color: 'var(--fg-muted)' }}>
                      {fila.label}
                    </th>
                    {seleccionadas.map((c) => (
                      <td key={c.id} style={{ padding: '0.8rem', fontSize: 'var(--fs-sm)', verticalAlign: 'top' }}>
                        {fila.valor(c)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr style={{ borderTop: '1px solid var(--line)' }}>
                  <th scope="row" />
                  {seleccionadas.map((c) => (
                    <td key={c.id} style={{ padding: '0.8rem' }}>
                      <GlassLink href={`/convocatorias/${c.slug}`} variant="ghost" size="sm" arrow>
                        {t('common.view')}
                      </GlassLink>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
