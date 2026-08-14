'use client';

import { ConvocatoriaCard } from '@/components/features/ConvocatoriaCard';
import { useCandidato } from '@/components/providers/CandidatoProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { GlassLink } from '@/components/ui/glass';
import { Reveal } from '@/components/ui/motion';
import type { Convocatoria } from '@/lib/types';

export function GuardadasTab({ convocatorias }: { convocatorias: Convocatoria[] }) {
  const { t } = useI18n();
  const { guardadas, postulaciones } = useCandidato();

  const lista = convocatorias.filter((c) => guardadas.includes(c.slug));
  const postuladas = convocatorias.filter((c) => postulaciones.includes(c.slug));

  return (
    <div className="stack gap-lg">
      <div>
        <h2 className="h3">{t('panel.tab.guardadas')}</h2>
        {lista.length === 0 ? (
          <div className="empty mt-md">
            <p>{t('panel.saved.empty')}</p>
            <GlassLink href="/convocatorias" variant="ghost" size="sm" arrow>
              {t('showcase.all')}
            </GlassLink>
          </div>
        ) : (
          <div className="grid cols-2 gap-md mt-md">
            {lista.map((conv, i) => (
              <Reveal key={conv.id} delay={(i % 2) * 0.08}>
                <ConvocatoriaCard conv={conv} indice={i} />
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {postuladas.length > 0 && (
        <div>
          <h2 className="h3">{t('job.applied')}</h2>
          <ul className="stack gap-xs mt-md">
            {postuladas.map((conv) => (
              <li className="list-row" key={conv.id}>
                <span className="badge badge--jade">{conv.codigo}</span>
                <div className="list-row__main">
                  <p className="list-row__title">{conv.titulo.es}</p>
                  <p className="list-row__sub">
                    {conv.area} · {conv.ciudad}
                  </p>
                </div>
                <GlassLink href={`/convocatorias/${conv.slug}`} variant="quiet" size="sm" swap={false}>
                  {t('common.view')}
                </GlassLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
