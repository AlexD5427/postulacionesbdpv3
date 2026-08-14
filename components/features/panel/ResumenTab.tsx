'use client';

import { ConvocatoriaCard } from '@/components/features/ConvocatoriaCard';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCandidato } from '@/components/providers/CandidatoProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { GlassButton, GlassCard } from '@/components/ui/glass';
import { Counter, Reveal } from '@/components/ui/motion';
import { calcularMatch, recomendar } from '@/lib/match';
import type { Convocatoria, Usuario } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface Props {
  usuario: Usuario;
  convocatorias: Convocatoria[];
  completitud: { total: number; bloques: Array<{ key: string; ok: boolean; peso: number }> };
  onIr: (tab: 'perfil' | 'guardadas' | 'alertas' | 'documentos' | 'agenda' | 'comparar' | 'resumen') => void;
}

export function ResumenTab({ usuario, convocatorias, completitud, onIr }: Props) {
  const { t, locale } = useI18n();
  const { actualizar } = useAuth();
  const { guardadas, notificaciones, marcarTodasLeidas, noLeidas } = useCandidato();

  const recomendadas = recomendar(usuario, convocatorias, 4);
  const altas = convocatorias.filter((c) => calcularMatch(usuario, c).score >= 60).length;

  return (
    <div className="stack gap-lg">
      {/* --- Metricas rapidas -------------------------------------------- */}
      <div className="tiles">
        {[
          { label: t('panel.tile.completeness'), valor: completitud.total, sufijo: '%' },
          { label: t('panel.tile.saved'), valor: guardadas.length, sufijo: '' },
          { label: t('panel.tile.matches'), valor: altas, sufijo: '' },
          { label: t('panel.tile.docs'), valor: usuario.documentos.length, sufijo: '' },
        ].map((tile, i) => (
          <Reveal key={tile.label} delay={i * 0.07}>
            <GlassCard variant="pad" edge className="tile">
              <span className="tile__label">{tile.label}</span>
              <span className="tile__value">
                <Counter to={tile.valor} suffix={tile.sufijo} />
              </span>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      {/* --- Completitud del perfil -------------------------------------- */}
      <Reveal>
        <GlassCard variant="pad-lg" hover={false}>
          <div className="between">
            <div>
              <h2 className="h3">{t('panel.completeness.title')}</h2>
              <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                {t('panel.completeness.body')}
              </p>
            </div>
            <span className="tile__value num">{completitud.total}%</span>
          </div>

          <div className="progress" style={{ marginBlock: '1rem' }}>
            <i style={{ width: `${completitud.total}%` }} />
          </div>

          <ul className="grid cols-3 gap-xs">
            {completitud.bloques.map((b) => (
              <li key={b.key} className="row" style={{ fontSize: 'var(--fs-sm)' }}>
                <span aria-hidden="true" style={{ color: b.ok ? 'var(--ok)' : 'var(--fg-faint)' }}>
                  {b.ok ? '\u2713' : '\u25cb'}
                </span>
                <span className={b.ok ? '' : 'faint'}>{t(b.key)}</span>
              </li>
            ))}
          </ul>

          <GlassButton variant="primary" arrow className="mt-md" onClick={() => onIr('perfil')}>
            {t('panel.tab.perfil')}
          </GlassButton>
        </GlassCard>
      </Reveal>

      {/* --- Visibilidad en la bolsa ------------------------------------- */}
      <Reveal delay={0.06}>
        <GlassCard variant="pad" hover={false}>
          <div className="between">
            <div style={{ maxWidth: '52ch' }}>
              <h3 className="h4">{t('panel.visibility.title')}</h3>
              <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                {t('panel.visibility.body')}
              </p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={usuario.visibleEnBolsa}
                onChange={(e) => actualizar({ visibleEnBolsa: e.target.checked })}
              />
              <span className="sr-only">{t('pool.optIn')}</span>
            </label>
          </div>
        </GlassCard>
      </Reveal>

      {/* --- Notificaciones ---------------------------------------------- */}
      <Reveal delay={0.1}>
        <GlassCard variant="pad" hover={false}>
          <div className="between">
            <h3 className="h4">
              {t('notif.title')} {noLeidas > 0 && <span className="badge">{noLeidas}</span>}
            </h3>
            {notificaciones.length > 0 && (
              <GlassButton variant="quiet" size="sm" swap={false} onClick={marcarTodasLeidas}>
                {t('notif.markAll')}
              </GlassButton>
            )}
          </div>

          {notificaciones.length === 0 ? (
            <p className="muted mt-sm" style={{ fontSize: 'var(--fs-sm)' }}>
              {t('notif.empty')}
            </p>
          ) : (
            <ul className="stack gap-xs mt-sm">
              {notificaciones.slice(0, 5).map((n) => (
                <li className="list-row" key={n.id}>
                  <span className="dot" style={{ color: n.leida ? 'var(--fg-faint)' : 'var(--accent)' }} aria-hidden="true" />
                  <div className="list-row__main">
                    <p className="list-row__title">{typeof n.titulo === 'string' ? n.titulo : n.titulo.es}</p>
                    <p className="list-row__sub">{typeof n.cuerpo === 'string' ? n.cuerpo : n.cuerpo.es}</p>
                  </div>
                  <span className="faint" style={{ fontSize: 'var(--fs-xs)' }}>
                    {formatDate(n.fecha, locale, { day: '2-digit', month: 'short' })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </Reveal>

      {/* --- Recomendaciones --------------------------------------------- */}
      <div>
        <Reveal>
          <div className="between">
            <div>
              <h2 className="h3">{t('panel.recommended')}</h2>
              <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                {t('panel.recommended.body')}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid cols-2 gap-md mt-md">
          {recomendadas.map(({ conv }, i) => (
            <Reveal key={conv.id} delay={(i % 2) * 0.08}>
              <ConvocatoriaCard conv={conv} indice={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
