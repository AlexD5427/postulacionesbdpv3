'use client';

import { useMemo, useState } from 'react';
import { ConvocatoriaCard } from '@/components/features/ConvocatoriaCard';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCandidato } from '@/components/providers/CandidatoProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { AndeanPattern, Aurora, MeshGrid } from '@/components/ui/backgrounds';
import { GlassButton, GlassCard } from '@/components/ui/glass';
import { Reveal, SplitLines } from '@/components/ui/motion';
import { calcularMatch } from '@/lib/match';
import type { Convocatoria, Modalidad, Seniority, TipoConvocatoria } from '@/lib/types';
import { daysUntil, normalize } from '@/lib/utils';

type Orden = 'recent' | 'closing' | 'match' | 'salary';

interface Filtros {
  areas: string[];
  ciudades: string[];
  modalidades: Modalidad[];
  tipos: TipoConvocatoria[];
  niveles: Seniority[];
}

const VACIO: Filtros = { areas: [], ciudades: [], modalidades: [], tipos: [], niveles: [] };

function alternar<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}

/** Grupo de filtros en forma de chips conmutables. */
function GrupoFiltro<T extends string>({
  titulo,
  opciones,
  activos,
  etiqueta,
  onToggle,
}: {
  titulo: string;
  opciones: T[];
  activos: T[];
  etiqueta?: (valor: T) => string;
  onToggle: (valor: T) => void;
}) {
  return (
    <div className="field">
      <span className="field__label">{titulo}</span>
      <div className="row gap-xs">
        {opciones.map((opcion) => (
          <button
            key={opcion}
            type="button"
            className="chip"
            aria-pressed={activos.includes(opcion)}
            onClick={() => onToggle(opcion)}
          >
            {etiqueta ? etiqueta(opcion) : opcion}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ConvocatoriasExplorer({ convocatorias }: { convocatorias: Convocatoria[] }) {
  const { t, tl } = useI18n();
  const { usuario } = useAuth();
  const { guardarBusqueda, busquedas, eliminarBusqueda, comparar, alternarComparar } = useCandidato();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [filtros, setFiltros] = useState<Filtros>(VACIO);
  const [orden, setOrden] = useState<Orden>('recent');
  const [panelFiltros, setPanelFiltros] = useState(false);

  const areas = useMemo(() => Array.from(new Set(convocatorias.map((c) => c.area))).sort(), [convocatorias]);
  const ciudades = useMemo(() => Array.from(new Set(convocatorias.map((c) => c.ciudad))).sort(), [convocatorias]);
  const modalidades: Modalidad[] = ['presencial', 'hibrido', 'remoto'];
  const tipos: TipoConvocatoria[] = ['planta', 'consultoria', 'pasantia', 'joven-profesional'];
  const niveles: Seniority[] = ['inicial', 'intermedio', 'senior', 'jefatura'];

  const resultados = useMemo(() => {
    const q = normalize(query.trim());

    const filtradas = convocatorias.filter((c) => {
      if (filtros.areas.length && !filtros.areas.includes(c.area)) return false;
      if (filtros.ciudades.length && !filtros.ciudades.includes(c.ciudad)) return false;
      if (filtros.modalidades.length && !filtros.modalidades.includes(c.modalidad)) return false;
      if (filtros.tipos.length && !filtros.tipos.includes(c.tipo)) return false;
      if (filtros.niveles.length && !filtros.niveles.includes(c.seniority)) return false;
      if (!q) return true;

      // Busqueda sobre titulo, resumen, area, ciudad y competencias.
      const bolsa = [
        tl(c.titulo) ?? c.titulo.es,
        tl(c.resumen) ?? c.resumen.es,
        c.area,
        c.ciudad,
        c.codigo,
        ...c.competencias,
      ]
        .join(' ')
        .toString();
      return normalize(bolsa).includes(q);
    });

    const ordenadas = [...filtradas];
    switch (orden) {
      case 'closing':
        ordenadas.sort((a, b) => daysUntil(a.cierra) - daysUntil(b.cierra));
        break;
      case 'match':
        ordenadas.sort((a, b) => calcularMatch(usuario, b).score - calcularMatch(usuario, a).score);
        break;
      case 'salary':
        ordenadas.sort((a, b) => b.salarioMax - a.salarioMax);
        break;
      default:
        ordenadas.sort((a, b) => new Date(b.publicada).getTime() - new Date(a.publicada).getTime());
    }
    return ordenadas;
  }, [convocatorias, filtros, orden, query, tl, usuario]);

  const activos =
    filtros.areas.length +
    filtros.ciudades.length +
    filtros.modalidades.length +
    filtros.tipos.length +
    filtros.niveles.length;

  return (
    <>
      <section className="page-head" data-surface="dark">
        <Aurora />
        <MeshGrid />
        <div className="container">
          <Reveal>
            <p className="eyebrow">{t('brand.tagline')}</p>
          </Reveal>
          <h1 className="display" style={{ marginTop: '1rem' }}>
            <SplitLines lines={[t('jobs.title')]} />
          </h1>
          <Reveal delay={0.14}>
            <p className="lead mt-sm">{t('jobs.subtitle')}</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight" data-surface="dark">
        <AndeanPattern />
        <div className="container">
          {/* --- Barra de busqueda y orden ------------------------------- */}
          <GlassCard variant="pad" edge hover={false}>
            <div className="row gap-sm" style={{ alignItems: 'flex-end' }}>
              <div className="field" style={{ flex: '2 1 280px' }}>
                <label className="field__label" htmlFor="buscar">
                  {t('common.search')}
                </label>
                <input
                  id="buscar"
                  className="input"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('jobs.searchPlaceholder')}
                />
              </div>

              <div className="field" style={{ flex: '1 1 200px' }}>
                <label className="field__label" htmlFor="orden">
                  {t('jobs.sort')}
                </label>
                <select
                  id="orden"
                  className="select"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as Orden)}
                >
                  <option value="recent">{t('jobs.sort.recent')}</option>
                  <option value="closing">{t('jobs.sort.closing')}</option>
                  <option value="match">{t('jobs.sort.match')}</option>
                  <option value="salary">{t('jobs.sort.salary')}</option>
                </select>
              </div>

              <GlassButton
                variant="ghost"
                onClick={() => setPanelFiltros((v) => !v)}
                aria-expanded={panelFiltros}
                swap={false}
              >
                {t('jobs.filters')}
                {activos > 0 && <span className="badge">{activos}</span>}
              </GlassButton>
            </div>

            {panelFiltros && (
              <div className="stack gap-md" style={{ marginTop: '1.4rem' }}>
                <div className="rule" />
                <GrupoFiltro
                  titulo={t('jobs.filter.area')}
                  opciones={areas}
                  activos={filtros.areas}
                  onToggle={(v) => setFiltros((f) => ({ ...f, areas: alternar(f.areas, v) }))}
                />
                <GrupoFiltro
                  titulo={t('jobs.filter.city')}
                  opciones={ciudades}
                  activos={filtros.ciudades}
                  onToggle={(v) => setFiltros((f) => ({ ...f, ciudades: alternar(f.ciudades, v) }))}
                />
                <GrupoFiltro
                  titulo={t('jobs.filter.mode')}
                  opciones={modalidades}
                  activos={filtros.modalidades}
                  etiqueta={(v) => t(`jobs.mode.${v}`)}
                  onToggle={(v) => setFiltros((f) => ({ ...f, modalidades: alternar(f.modalidades, v) }))}
                />
                <GrupoFiltro
                  titulo={t('jobs.filter.type')}
                  opciones={tipos}
                  activos={filtros.tipos}
                  etiqueta={(v) => t(`jobs.type.${v}`)}
                  onToggle={(v) => setFiltros((f) => ({ ...f, tipos: alternar(f.tipos, v) }))}
                />
                <GrupoFiltro
                  titulo={t('jobs.filter.seniority')}
                  opciones={niveles}
                  activos={filtros.niveles}
                  etiqueta={(v) => t(`jobs.seniority.${v}`)}
                  onToggle={(v) => setFiltros((f) => ({ ...f, niveles: alternar(f.niveles, v) }))}
                />

                <div className="row gap-sm">
                  <GlassButton variant="quiet" swap={false} onClick={() => setFiltros(VACIO)}>
                    {t('common.clear')}
                  </GlassButton>
                  <GlassButton
                    variant="ghost"
                    swap={false}
                    onClick={() => {
                      guardarBusqueda({
                        nombre: query.trim() || `${t('jobs.filters')} (${activos})`,
                        query,
                        filtros: {
                          areas: filtros.areas,
                          ciudades: filtros.ciudades,
                          modalidades: filtros.modalidades,
                          tipos: filtros.tipos,
                          niveles: filtros.niveles,
                        },
                      });
                      toast(t('jobs.savedSearch.created'));
                    }}
                  >
                    {t('jobs.saveSearch')}
                  </GlassButton>
                </div>
              </div>
            )}
          </GlassCard>

          {/* --- Busquedas guardadas ------------------------------------- */}
          {busquedas.length > 0 && (
            <div className="row gap-xs mt-md" aria-label={t('jobs.savedSearches')}>
              <span className="field__label">{t('jobs.savedSearches')}</span>
              {busquedas.map((b) => (
                <span className="chip" key={b.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(b.query);
                      setFiltros({
                        areas: b.filtros.areas ?? [],
                        ciudades: b.filtros.ciudades ?? [],
                        modalidades: (b.filtros.modalidades ?? []) as Modalidad[],
                        tipos: (b.filtros.tipos ?? []) as TipoConvocatoria[],
                        niveles: (b.filtros.niveles ?? []) as Seniority[],
                      });
                      setPanelFiltros(true);
                    }}
                  >
                    {b.nombre}
                  </button>
                  <button type="button" onClick={() => eliminarBusqueda(b.id)} aria-label={t('common.remove')}>
                    &#10005;
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* --- Conteo y comparador ------------------------------------- */}
          <div className="between mt-lg">
            <p className="muted" style={{ fontSize: 'var(--fs-sm)' }} role="status" aria-live="polite">
              <b className="num">{resultados.length}</b> {t('common.results')}
            </p>
            {comparar.length > 0 && (
              <a href="/panel?tab=comparar" className="chip chip--active">
                {t('panel.tab.comparar')}: {comparar.length}
              </a>
            )}
          </div>

          {/* --- Resultados ---------------------------------------------- */}
          {resultados.length === 0 ? (
            <div className="empty mt-md">
              <p className="h4">{t('jobs.empty')}</p>
              <p className="muted" style={{ fontSize: 'var(--fs-sm)', maxWidth: '42ch' }}>
                {t('jobs.emptyHint')}
              </p>
              <GlassButton variant="ghost" swap={false} onClick={() => { setFiltros(VACIO); setQuery(''); }}>
                {t('common.clear')}
              </GlassButton>
            </div>
          ) : (
            <div className="grid cols-2 gap-md mt-md">
              {resultados.map((conv, i) => (
                <Reveal key={conv.id} delay={(i % 2) * 0.08}>
                  <div style={{ height: '100%', position: 'relative' }}>
                    <ConvocatoriaCard conv={conv} indice={i} />
                    <button
                      type="button"
                      className="chip"
                      aria-pressed={comparar.includes(conv.slug)}
                      onClick={() => {
                        const agregada = alternarComparar(conv.slug);
                        toast(agregada ? t('jobs.compareAdd') : t('common.remove'), agregada ? 'ok' : 'warn');
                      }}
                      style={{ marginTop: '0.6rem' }}
                    >
                      {t('jobs.compareAdd')}
                    </button>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
