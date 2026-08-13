'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCandidato } from '@/components/providers/CandidatoProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { GlassCard } from '@/components/ui/glass';
import { calcularMatch } from '@/lib/match';
import type { Convocatoria } from '@/lib/types';
import { cx, daysUntil, formatBob, formatDate } from '@/lib/utils';

function Guardar({ slug }: { slug: string }) {
  const { esGuardada, alternarGuardada } = useCandidato();
  const { t } = useI18n();
  const { toast } = useToast();
  const guardada = esGuardada(slug);

  return (
    <button
      type="button"
      className="icon-btn"
      aria-pressed={guardada}
      aria-label={guardada ? t('jobs.unsave') : t('jobs.save')}
      title={guardada ? t('jobs.unsave') : t('jobs.save')}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        const ahora = alternarGuardada(slug);
        toast(ahora ? t('jobs.saved') : t('jobs.unsave'), ahora ? 'ok' : 'warn');
      }}
      style={{
        width: '2.2rem',
        height: '2.2rem',
        color: guardada ? 'var(--accent)' : 'var(--fg-muted)',
        borderColor: guardada ? 'currentColor' : 'var(--line)',
        background: 'var(--glass)',
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6 3h12v18l-6-4.2L6 21z"
          fill={guardada ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/** Anillo de compatibilidad reutilizable. */
export function MatchRing({ valor, grande = false }: { valor: number; grande?: boolean }) {
  const { t } = useI18n();
  return (
    <span
      className={cx('ring', grande && 'ring--lg')}
      style={{ ['--ring-value' as string]: valor }}
      role="img"
      aria-label={`${t('match.title')}: ${valor}%`}
      title={`${t('match.title')}: ${valor}%`}
    >
      <span>{valor}%</span>
    </span>
  );
}

interface Props {
  conv: Convocatoria;
  indice?: number;
  mostrarMatch?: boolean;
  className?: string;
}

export function ConvocatoriaCard({ conv, indice = 0, mostrarMatch = true, className }: Props) {
  const { t, tl, locale } = useI18n();
  const { usuario } = useAuth();
  const match = calcularMatch(usuario, conv);
  const dias = daysUntil(conv.cierra);
  const nueva = daysUntil(conv.publicada) >= -7;
  const porCerrar = dias <= 7 && dias >= 0;

  return (
    <GlassCard as="article" edge sheen className={cx('conv-card', className)}>
      <div className="conv-card__top">
        <div style={{ minWidth: 0 }}>
          <div className="row gap-xs" style={{ marginBottom: '0.7rem' }}>
            <span className="mono faint">{String(indice + 1).padStart(2, '0')}</span>
            {nueva && <span className="badge badge--jade">{t('showcase.new')}</span>}
            {porCerrar && <span className="badge badge--danger">{t('showcase.closing')}</span>}
            <span className="badge badge--neutral">{t(`jobs.type.${conv.tipo}`)}</span>
          </div>

          <h3 className="conv-card__title">
            <Link href={`/convocatorias/${conv.slug}`}>{tl(conv.titulo)}</Link>
          </h3>
        </div>

        <div className="row gap-xs" style={{ flexWrap: 'nowrap' }}>
          {mostrarMatch && usuario && <MatchRing valor={match.score} />}
          <Guardar slug={conv.slug} />
        </div>
      </div>

      <div className="conv-card__meta">
        <span>{conv.area}</span>
        <span>{conv.ciudad}</span>
        <span>{t(`jobs.mode.${conv.modalidad}`)}</span>
        <span>{t(`jobs.seniority.${conv.seniority}`)}</span>
      </div>

      <p className="muted" style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}>
        {tl(conv.resumen)}
      </p>

      <div className="row gap-xs" aria-label={t('job.competencies')}>
        {conv.competencias.slice(0, 3).map((c) => (
          <span className="chip" key={c}>
            {c}
          </span>
        ))}
        {conv.competencias.length > 3 && <span className="chip">+{conv.competencias.length - 3}</span>}
      </div>

      <div className="conv-card__foot">
        <div>
          <p className="conv-card__deadline">
            {t('showcase.closesIn')} <b>{dias >= 0 ? `${dias} ${t('common.days')}` : formatDate(conv.cierra, locale)}</b>
          </p>
          <p className="faint" style={{ fontSize: 'var(--fs-xs)' }}>
            {formatBob(conv.salarioMin, locale)} - {formatBob(conv.salarioMax, locale)}
          </p>
        </div>
        <Link href={`/convocatorias/${conv.slug}`} className="btn btn--sm btn--ghost">
          <span>{t('common.view')}</span>
        </Link>
      </div>
    </GlassCard>
  );
}
