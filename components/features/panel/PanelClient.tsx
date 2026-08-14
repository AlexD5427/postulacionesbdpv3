'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { AgendaTab } from './AgendaTab';
import { AlertasTab } from './AlertasTab';
import { CompararTab } from './CompararTab';
import { DocumentosTab } from './DocumentosTab';
import { GuardadasTab } from './GuardadasTab';
import { PerfilTab } from './PerfilTab';
import { ResumenTab } from './ResumenTab';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCandidato } from '@/components/providers/CandidatoProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { AndeanPattern, Aurora, MeshGrid } from '@/components/ui/backgrounds';
import { GlassCard, GlassLink } from '@/components/ui/glass';
import { Reveal, SplitLines } from '@/components/ui/motion';
import { completitudPerfil } from '@/lib/match';
import type { Convocatoria } from '@/lib/types';

const TABS = ['resumen', 'perfil', 'guardadas', 'alertas', 'documentos', 'agenda', 'comparar'] as const;
type Tab = (typeof TABS)[number];

export function PanelClient({ convocatorias }: { convocatorias: Convocatoria[] }) {
  const { t } = useI18n();
  const { usuario, autenticado } = useAuth();
  const { guardadas, alertas, comparar } = useCandidato();
  const router = useRouter();
  const params = useSearchParams();

  const solicitado = params.get('tab');
  const tab: Tab = (TABS as readonly string[]).includes(solicitado ?? '') ? (solicitado as Tab) : 'resumen';

  const irA = useCallback(
    (destino: Tab) => {
      router.replace(destino === 'resumen' ? '/panel' : `/panel?tab=${destino}`, { scroll: false });
    },
    [router],
  );

  const completitud = useMemo(() => completitudPerfil(usuario), [usuario]);

  const conteos: Partial<Record<Tab, number>> = {
    guardadas: guardadas.length,
    alertas: alertas.filter((a) => a.activa).length,
    documentos: usuario?.documentos.length ?? 0,
    comparar: comparar.length,
  };

  /* --- Sin sesion ---------------------------------------------------- */
  if (!autenticado || !usuario) {
    return (
      <section className="section" data-surface="dark" style={{ minHeight: '80svh', display: 'grid', placeItems: 'center' }}>
        <Aurora />
        <div className="container center">
          <GlassCard variant="pad-lg" edge hover={false} style={{ maxWidth: '46ch', marginInline: 'auto' }}>
            <h1 className="h3">{t('panel.needLogin')}</h1>
            <div className="row gap-sm mt-md" style={{ justifyContent: 'center' }}>
              <GlassLink href="/login" variant="primary" arrow>
                {t('nav.login')}
              </GlassLink>
              <GlassLink href="/registro" variant="ghost">
                {t('nav.register')}
              </GlassLink>
            </div>
          </GlassCard>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-head" data-surface="dark">
        <Aurora />
        <MeshGrid />
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t('panel.subtitle')}</p>
          </Reveal>
          <h1 className="display" style={{ marginTop: '0.9rem' }}>
            <SplitLines lines={[`${t('panel.greeting')}, ${usuario.nombre || usuario.email.split('@')[0]}`]} />
          </h1>
        </div>
      </section>

      <section className="section section--tight" data-surface="dark">
        <AndeanPattern />
        <div className="container">
          <div className="panel-layout">
            {/* --- Navegacion lateral ------------------------------------ */}
            <GlassCard as="nav" className="side-nav sticky-col" hover={false} aria-label={t('panel.title')}>
              {TABS.map((clave) => (
                <button
                  key={clave}
                  type="button"
                  className="side-nav__item"
                  aria-current={tab === clave ? 'true' : undefined}
                  onClick={() => irA(clave)}
                >
                  {t(`panel.tab.${clave}`)}
                  {!!conteos[clave] && <span className="side-nav__count num">{conteos[clave]}</span>}
                </button>
              ))}
              <div className="rule" style={{ marginBlock: '0.5rem' }} />
              <GlassLink href="/panel/cv" variant="quiet" size="sm" swap={false} className="side-nav__item">
                {t('panel.tab.cv')}
              </GlassLink>
            </GlassCard>

            {/* --- Contenido --------------------------------------------- */}
            <div>
              {tab === 'resumen' && (
                <ResumenTab usuario={usuario} convocatorias={convocatorias} completitud={completitud} onIr={irA} />
              )}
              {tab === 'perfil' && <PerfilTab usuario={usuario} completitud={completitud} />}
              {tab === 'guardadas' && <GuardadasTab convocatorias={convocatorias} />}
              {tab === 'alertas' && <AlertasTab convocatorias={convocatorias} />}
              {tab === 'documentos' && <DocumentosTab usuario={usuario} />}
              {tab === 'agenda' && <AgendaTab convocatorias={convocatorias} />}
              {tab === 'comparar' && <CompararTab convocatorias={convocatorias} />}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
