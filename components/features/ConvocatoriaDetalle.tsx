'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ConvocatoriaCard, MatchRing } from '@/components/features/ConvocatoriaCard';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCandidato } from '@/components/providers/CandidatoProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { AndeanPattern, ArtPanel, Aurora, MeshGrid } from '@/components/ui/backgrounds';
import { GlassButton, GlassCard } from '@/components/ui/glass';
import { Reveal, SplitLines } from '@/components/ui/motion';
import { calcularMatch } from '@/lib/match';
import type { Convocatoria } from '@/lib/types';
import { buildIcs, daysUntil, downloadTextFile, formatBob, formatDate } from '@/lib/utils';

export function ConvocatoriaDetalle({ conv, similares }: { conv: Convocatoria; similares: Convocatoria[] }) {
  const { t, tl, locale } = useI18n();
  const { usuario, autenticado } = useAuth();
  const { esGuardada, alternarGuardada, registrarPostulacion, yaPostulo, agregarNotificacion } = useCandidato();
  const { toast } = useToast();
  const router = useRouter();

  const match = calcularMatch(usuario, conv);
  const dias = daysUntil(conv.cierra);
  const postulada = yaPostulo(conv.slug);

  const postular = () => {
    if (!autenticado) {
      toast(t('job.needProfile'), 'warn');
      router.push('/login');
      return;
    }
    registrarPostulacion(conv.slug);
    agregarNotificacion({
      tipo: 'convocatoria',
      titulo: t('job.applied'),
      cuerpo: `${tl(conv.titulo)} · ${conv.codigo}`,
    });
    toast(t('job.applied'));
  };

  const compartir = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const datos = { title: `${tl(conv.titulo)} | BDP Talento`, text: tl(conv.resumen) ?? '', url };
    try {
      if (navigator.share) await navigator.share(datos);
      else {
        await navigator.clipboard.writeText(url);
        toast(t('common.copied'));
      }
    } catch {
      /* el usuario cancelo el dialogo del sistema */
    }
  };

  const agendar = () => {
    downloadTextFile(
      `${conv.codigo}-cierre.ics`,
      buildIcs({
        titulo: `${t('showcase.closes')}: ${tl(conv.titulo)}`,
        descripcion: `${conv.codigo} · ${t('brand.full')}`,
        fechaIso: conv.cierra,
      }),
      'text/calendar;charset=utf-8',
    );
    toast(t('panel.agenda.addToCalendar'));
  };

  return (
    <>
      {/* ============================ CABECERA ============================ */}
      <section className="page-head" data-surface="dark">
        <Aurora />
        <MeshGrid />
        <div className="container">
          <Reveal>
            <p className="eyebrow">
              <Link href="/convocatorias" className="link-underline">
                {t('jobs.title')}
              </Link>{' '}
              · {conv.codigo}
            </p>
          </Reveal>

          <div className="split" style={{ alignItems: 'flex-end', marginTop: '1.2rem' }}>
            <div>
              <h1 className="display">
                <SplitLines lines={[tl(conv.titulo) ?? '']} />
              </h1>
              <Reveal delay={0.15}>
                <p className="lead mt-sm">{tl(conv.resumen)}</p>
              </Reveal>

              <Reveal delay={0.24} className="row gap-xs mt-md">
                <span className="badge">{t(`jobs.type.${conv.tipo}`)}</span>
                <span className="badge badge--neutral">{t(`jobs.seniority.${conv.seniority}`)}</span>
                <span className="badge badge--neutral">{t(`jobs.mode.${conv.modalidad}`)}</span>
                {dias >= 0 && dias <= 7 && (
                  <span className="badge badge--danger">
                    {t('showcase.closesIn')} {dias} {t('common.days')}
                  </span>
                )}
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <ArtPanel variante="vidrio" forma="wide" label={conv.ciudad} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================ CUERPO ============================== */}
      <section className="section section--tight" data-surface="dark">
        <AndeanPattern />
        <div className="container">
          <div className="panel-layout">
            {/* --- Columna lateral fija ---------------------------------- */}
            <div className="sticky-col stack gap-sm">
              <GlassCard variant="pad" edge hover={false}>
                <div className="stack gap-sm">
                  {[
                    { k: 'job.area', v: conv.area },
                    { k: 'job.location', v: `${conv.ciudad}, ${conv.departamento}` },
                    { k: 'job.vacancies', v: String(conv.vacantes) },
                    { k: 'showcase.salary', v: `${formatBob(conv.salarioMin, locale)} - ${formatBob(conv.salarioMax, locale)}` },
                    { k: 'job.published', v: formatDate(conv.publicada, locale) },
                    { k: 'showcase.closes', v: formatDate(conv.cierra, locale) },
                    { k: 'job.applicants', v: String(conv.postulantes) },
                  ].map((fila) => (
                    <div className="between" key={fila.k} style={{ gap: '0.8rem' }}>
                      <span className="faint" style={{ fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                        {t(fila.k)}
                      </span>
                      <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, textAlign: 'right' }}>{fila.v}</span>
                    </div>
                  ))}
                </div>

                <div className="stack gap-xs mt-md">
                  <GlassButton variant="primary" block arrow onClick={postular} disabled={postulada}>
                    {postulada ? t('job.applied') : autenticado ? t('job.applyWithProfile') : t('job.apply')}
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    block
                    swap={false}
                    onClick={() => {
                      const ahora = alternarGuardada(conv.slug);
                      toast(ahora ? t('jobs.saved') : t('jobs.unsave'), ahora ? 'ok' : 'warn');
                    }}
                  >
                    {esGuardada(conv.slug) ? t('jobs.unsave') : t('jobs.save')}
                  </GlassButton>
                  <div className="row gap-xs">
                    <GlassButton variant="quiet" swap={false} onClick={compartir}>
                      {t('job.share')}
                    </GlassButton>
                    <GlassButton variant="quiet" swap={false} onClick={agendar}>
                      {t('panel.agenda.addToCalendar')}
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>

              {/* Compatibilidad explicable */}
              <GlassCard variant="pad" hover={false}>
                <p className="field__label">{t('job.matchWhy')}</p>
                {usuario ? (
                  <>
                    <div className="row gap-sm" style={{ marginBlock: '0.9rem' }}>
                      <MatchRing valor={match.score} grande />
                      <p className="muted" style={{ fontSize: 'var(--fs-sm)', flex: 1, minWidth: 0 }}>
                        {t('match.title')}
                      </p>
                    </div>
                    <ul className="stack gap-xs">
                      {match.razones.map((r) => (
                        <li className="between" key={r.key} style={{ fontSize: 'var(--fs-sm)' }}>
                          <span className={r.cumple ? '' : 'faint'}>
                            <span aria-hidden="true" style={{ color: r.cumple ? 'var(--ok)' : 'var(--fg-faint)' }}>
                              {r.cumple ? '\u2713' : '\u25cb'}
                            </span>{' '}
                            {t(r.key)}
                            {r.detalle ? ` (${r.detalle})` : ''}
                          </span>
                          <span className="mono">+{r.peso}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="muted mt-sm" style={{ fontSize: 'var(--fs-sm)' }}>
                    {t('match.completeProfile')}
                  </p>
                )}
              </GlassCard>
            </div>

            {/* --- Contenido principal ---------------------------------- */}
            <div className="stack gap-lg">
              <Reveal>
                <GlassCard variant="pad-lg" hover={false}>
                  <h2 className="h3">{t('job.description')}</h2>
                  <div className="stack gap-sm mt-sm">
                    {(tl(conv.descripcion) ?? []).map((p, i) => (
                      <p className="muted" key={i} style={{ lineHeight: 1.7 }}>
                        {p}
                      </p>
                    ))}
                  </div>
                </GlassCard>
              </Reveal>

              <Reveal delay={0.08}>
                <GlassCard variant="pad-lg" hover={false}>
                  <h2 className="h3">{t('job.requirements')}</h2>
                  <ul className="timeline mt-md">
                    {(tl(conv.requisitos) ?? []).map((r, i) => (
                      <li className="timeline__item" key={i}>
                        <span className="timeline__dot">{i + 1}</span>
                        <p style={{ paddingTop: '0.35rem' }}>{r}</p>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </Reveal>

              <Reveal delay={0.12}>
                <GlassCard variant="pad-lg" hover={false}>
                  <h2 className="h3">{t('job.competencies')}</h2>
                  <div className="row gap-xs mt-sm">
                    {conv.competencias.map((c) => (
                      <span className="chip" key={c}>
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="rule" style={{ marginBlock: '1.6rem' }} />

                  <h2 className="h3">{t('job.benefits')}</h2>
                  <ul className="stack gap-xs mt-sm">
                    {(tl(conv.beneficios) ?? []).map((b, i) => (
                      <li className="row" key={i} style={{ alignItems: 'flex-start' }}>
                        <span aria-hidden="true" style={{ color: 'var(--accent)' }}>
                          &#9679;
                        </span>
                        <span className="muted" style={{ flex: 1, minWidth: 0 }}>
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ SIMILARES =========================== */}
      {similares.length > 0 && (
        <section className="section" data-surface="deep">
          <Aurora blobs={2} />
          <div className="container">
            <Reveal>
              <p className="eyebrow">{t('job.similar')}</p>
            </Reveal>
            <div className="grid cols-3 gap-md mt-md">
              {similares.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.1}>
                  <ConvocatoriaCard conv={c} indice={i} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
