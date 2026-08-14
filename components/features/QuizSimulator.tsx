'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCandidato } from '@/components/providers/CandidatoProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { AndeanPattern, Aurora, MeshGrid } from '@/components/ui/backgrounds';
import { GlassButton, GlassCard } from '@/components/ui/glass';
import { Counter, Reveal, SplitLines } from '@/components/ui/motion';
import { CATEGORIAS_QUIZ, preguntasPorCategoria } from '@/lib/data/preguntas';
import { formatDate } from '@/lib/utils';

type Fase = 'inicio' | 'jugando' | 'resultado';
type Categoria = (typeof CATEGORIAS_QUIZ)[number] | 'todas';

const LETRAS = ['A', 'B', 'C', 'D'];

export function QuizSimulator() {
  const { t, tl, locale } = useI18n();
  const { practicas, registrarPractica } = useCandidato();

  const [fase, setFase] = useState<Fase>('inicio');
  const [categoria, setCategoria] = useState<Categoria>('todas');
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<number | null>(null);
  const [comprobada, setComprobada] = useState(false);
  const [correctas, setCorrectas] = useState(0);
  const [segundos, setSegundos] = useState(0);

  const preguntas = useMemo(() => {
    const base = preguntasPorCategoria(categoria);
    // Orden aleatorio estable durante la practica.
    return [...base].sort(() => Math.random() - 0.5);
  }, [categoria, fase === 'jugando']); // eslint-disable-line react-hooks/exhaustive-deps

  const actual = preguntas[indice];

  /* --- Cronometro ----------------------------------------------------- */
  useEffect(() => {
    if (fase !== 'jugando') return;
    const id = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [fase]);

  const comenzar = useCallback(() => {
    setIndice(0);
    setElegida(null);
    setComprobada(false);
    setCorrectas(0);
    setSegundos(0);
    setFase('jugando');
  }, []);

  const comprobar = () => {
    if (elegida === null || !actual) return;
    setComprobada(true);
    if (elegida === actual.correcta) setCorrectas((c) => c + 1);
  };

  const siguiente = () => {
    if (indice + 1 >= preguntas.length) {
      registrarPractica({ categoria, correctas, total: preguntas.length, segundos });
      setFase('resultado');
      return;
    }
    setIndice((i) => i + 1);
    setElegida(null);
    setComprobada(false);
  };

  const reloj = `${String(Math.floor(segundos / 60)).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`;
  const mejor = practicas.length ? Math.max(...practicas.map((p) => Math.round((p.correctas / p.total) * 100))) : 0;

  /** Estado visual de cada opcion segun si ya se comprobo. */
  const estadoOpcion = (i: number): string => {
    if (!comprobada) return elegida === i ? 'selected' : 'idle';
    if (i === actual?.correcta) return 'correct';
    if (i === elegida) return 'wrong';
    return 'idle';
  };

  return (
    <>
      <section className="page-head" data-surface="dark">
        <Aurora />
        <MeshGrid />
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t('nav.evaluaciones')}</p>
          </Reveal>
          <h1 className="display" style={{ marginTop: '0.9rem' }}>
            <SplitLines lines={[t('quiz.title')]} />
          </h1>
          <Reveal delay={0.14}>
            <p className="lead mt-sm">{t('quiz.subtitle')}</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight" data-surface="dark">
        <AndeanPattern />
        <div className="container container--narrow">
          {/* ---------------------------- INICIO ---------------------- */}
          {fase === 'inicio' && (
            <Reveal>
              <GlassCard variant="pad-lg" edge refract hover={false}>
                <div className="field">
                  <span className="field__label">{t('quiz.category')}</span>
                  <div className="row gap-xs">
                    <button type="button" className="chip" aria-pressed={categoria === 'todas'} onClick={() => setCategoria('todas')}>
                      {t('common.all')}
                    </button>
                    {CATEGORIAS_QUIZ.map((c) => (
                      <button key={c} type="button" className="chip" aria-pressed={categoria === c} onClick={() => setCategoria(c)}>
                        {t(`quiz.category.${c}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="between mt-lg">
                  <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                    <b className="num">{preguntasPorCategoria(categoria).length}</b> {t('quiz.question').toLowerCase()}
                  </p>
                  <GlassButton variant="primary" arrow onClick={comenzar}>
                    {t('quiz.start')}
                  </GlassButton>
                </div>

                {practicas.length > 0 && (
                  <>
                    <div className="rule" style={{ marginBlock: '1.6rem' }} />
                    <div className="between">
                      <h2 className="h4">{t('quiz.history')}</h2>
                      <span className="badge">
                        {t('quiz.bestScore')}: {mejor}%
                      </span>
                    </div>
                    <ul className="stack gap-xs mt-sm">
                      {practicas.slice(0, 5).map((p) => (
                        <li className="list-row" key={p.id}>
                          <span className="badge badge--neutral">
                            {Math.round((p.correctas / p.total) * 100)}%
                          </span>
                          <div className="list-row__main">
                            <p className="list-row__title">
                              {p.categoria === 'todas' ? t('common.all') : t(`quiz.category.${p.categoria}`)}
                            </p>
                            <p className="list-row__sub">
                              {p.correctas}/{p.total} {t('quiz.correctAnswers')} ·{' '}
                              {formatDate(p.fecha, locale, { day: '2-digit', month: 'short' })}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </GlassCard>
            </Reveal>
          )}

          {/* ---------------------------- JUGANDO --------------------- */}
          {fase === 'jugando' && actual && (
            <GlassCard variant="pad-lg" edge hover={false}>
              <div className="between">
                <span className="mono faint">
                  {t('quiz.question')} {indice + 1} {t('common.of')} {preguntas.length}
                </span>
                <span className="row gap-xs">
                  <span className="badge badge--neutral">{t(`quiz.category.${actual.categoria}`)}</span>
                  <span className="mono" aria-label={t('quiz.timer')}>
                    {reloj}
                  </span>
                </span>
              </div>

              <div
                className="progress"
                style={{ marginBlock: '1rem' }}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={preguntas.length}
                aria-valuenow={indice + 1}
                aria-label={t('quiz.progressLabel')}
              >
                <i style={{ width: `${((indice + 1) / preguntas.length) * 100}%` }} />
              </div>

              <div className="quiz">
                <h2 className="quiz__q">{tl(actual.enunciado)}</h2>

                <div className="stack gap-xs" role="radiogroup" aria-label={t('quiz.question')}>
                  {(tl(actual.opciones) ?? []).map((opcion, i) => (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={elegida === i}
                      className="quiz__opt"
                      data-state={estadoOpcion(i)}
                      disabled={comprobada}
                      onClick={() => setElegida(i)}
                    >
                      <span className="quiz__key">{LETRAS[i]}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>{opcion}</span>
                    </button>
                  ))}
                </div>

                {comprobada && (
                  <GlassCard variant="pad" hover={false}>
                    <p className="field__label">{t('quiz.explanation')}</p>
                    <p className="muted" style={{ fontSize: 'var(--fs-sm)', marginTop: '0.4rem' }}>
                      {tl(actual.explicacion)}
                    </p>
                  </GlassCard>
                )}

                <div className="between">
                  <span className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                    <b className="num">{correctas}</b> {t('quiz.correctAnswers')}
                  </span>
                  {comprobada ? (
                    <GlassButton variant="primary" arrow onClick={siguiente}>
                      {indice + 1 >= preguntas.length ? t('common.finish') : t('common.next')}
                    </GlassButton>
                  ) : (
                    <GlassButton variant="institutional" onClick={comprobar} disabled={elegida === null}>
                      {t('quiz.check')}
                    </GlassButton>
                  )}
                </div>
              </div>
            </GlassCard>
          )}

          {/* ---------------------------- RESULTADO ------------------- */}
          {fase === 'resultado' && (
            <Reveal variant="scale">
              <GlassCard variant="pad-lg" edge refract hover={false} className="center">
                <p className="eyebrow eyebrow--plain">{t('quiz.result')}</p>
                <p className="hero-type" style={{ fontSize: 'clamp(3.4rem, 12vw, 7rem)', marginBlock: '0.6rem' }}>
                  <Counter to={Math.round((correctas / preguntas.length) * 100)} suffix="%" />
                </p>
                <p className="lead" style={{ marginInline: 'auto' }}>
                  {correctas} / {preguntas.length} {t('quiz.correctAnswers')} · {reloj}
                </p>
                <div className="row gap-sm mt-lg" style={{ justifyContent: 'center' }}>
                  <GlassButton variant="primary" arrow onClick={comenzar}>
                    {t('quiz.retry')}
                  </GlassButton>
                  <GlassButton variant="ghost" swap={false} onClick={() => setFase('inicio')}>
                    {t('common.back')}
                  </GlassButton>
                </div>
              </GlassCard>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
