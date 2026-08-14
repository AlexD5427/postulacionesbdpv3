'use client';

import { useCandidato } from '@/components/providers/CandidatoProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { GlassButton, GlassCard, GlassLink } from '@/components/ui/glass';
import { Reveal } from '@/components/ui/motion';
import type { Convocatoria } from '@/lib/types';
import { buildIcs, daysUntil, downloadTextFile, formatDate } from '@/lib/utils';

/** Fechas clave: cierres de las convocatorias guardadas o postuladas. */
export function AgendaTab({ convocatorias }: { convocatorias: Convocatoria[] }) {
  const { t, tl, locale } = useI18n();
  const { guardadas, postulaciones } = useCandidato();
  const { toast } = useToast();

  const relevantes = convocatorias
    .filter((c) => guardadas.includes(c.slug) || postulaciones.includes(c.slug))
    .sort((a, b) => new Date(a.cierra).getTime() - new Date(b.cierra).getTime());

  const descargarTodo = () => {
    // Un unico archivo con todos los cierres, para importar de una sola vez.
    const eventos = relevantes
      .map((c) =>
        buildIcs({
          titulo: `${t('showcase.closes')}: ${tl(c.titulo)}`,
          descripcion: `${c.codigo} · ${c.area} · ${c.ciudad}`,
          fechaIso: c.cierra,
        })
          .split('\r\n')
          .slice(4, -1)
          .join('\r\n'),
      )
      .join('\r\n');

    downloadTextFile(
      'bdp-fechas-clave.ics',
      ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BDP SAM//Talento//ES', 'CALSCALE:GREGORIAN', eventos, 'END:VCALENDAR'].join('\r\n'),
      'text/calendar;charset=utf-8',
    );
    toast(t('panel.agenda.addToCalendar'));
  };

  return (
    <div className="stack gap-lg">
      <Reveal>
        <GlassCard variant="pad-lg" hover={false}>
          <div className="between">
            <div>
              <h2 className="h3">{t('panel.agenda.title')}</h2>
              <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                {t('panel.agenda.body')}
              </p>
            </div>
            {relevantes.length > 0 && (
              <GlassButton variant="ghost" swap={false} onClick={descargarTodo}>
                {t('common.download')} .ics
              </GlassButton>
            )}
          </div>
        </GlassCard>
      </Reveal>

      {relevantes.length === 0 ? (
        <div className="empty">
          <p>{t('panel.saved.empty')}</p>
          <GlassLink href="/convocatorias" variant="ghost" size="sm" arrow>
            {t('showcase.all')}
          </GlassLink>
        </div>
      ) : (
        <ul className="timeline">
          {relevantes.map((c) => {
            const dias = daysUntil(c.cierra);
            return (
              <li className="timeline__item" key={c.id}>
                <span
                  className="timeline__dot"
                  style={{ color: dias <= 3 ? 'var(--danger)' : dias <= 7 ? 'var(--warn)' : 'var(--accent)' }}
                >
                  {dias >= 0 ? dias : '\u2715'}
                </span>
                <div>
                  <h3 className="timeline__title">{tl(c.titulo)}</h3>
                  <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                    {t('showcase.closes')}: {formatDate(c.cierra, locale)} · {c.codigo}
                  </p>
                  <div className="row gap-xs" style={{ marginTop: '0.5rem' }}>
                    <GlassLink href={`/convocatorias/${c.slug}`} variant="quiet" size="sm" swap={false}>
                      {t('common.view')}
                    </GlassLink>
                    <GlassButton
                      variant="quiet"
                      size="sm"
                      swap={false}
                      onClick={() => {
                        downloadTextFile(
                          `${c.codigo}-cierre.ics`,
                          buildIcs({
                            titulo: `${t('showcase.closes')}: ${tl(c.titulo)}`,
                            descripcion: `${c.codigo} · ${t('brand.full')}`,
                            fechaIso: c.cierra,
                          }),
                          'text/calendar;charset=utf-8',
                        );
                        toast(t('panel.agenda.addToCalendar'));
                      }}
                    >
                      {t('panel.agenda.addToCalendar')}
                    </GlassButton>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
