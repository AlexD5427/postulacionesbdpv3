'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCandidato } from '@/components/providers/CandidatoProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { GlassButton, GlassCard } from '@/components/ui/glass';
import { Reveal } from '@/components/ui/motion';
import type { AlertaGuardada, Convocatoria, Modalidad } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const FRECUENCIAS: AlertaGuardada['frecuencia'][] = ['inmediata', 'diaria', 'semanal'];
const MODALIDADES: Modalidad[] = ['presencial', 'hibrido', 'remoto'];

function alternar<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor) ? lista.filter((v) => v !== valor) : [...lista, valor];
}

export function AlertasTab({ convocatorias }: { convocatorias: Convocatoria[] }) {
  const { t, locale } = useI18n();
  const { usuario } = useAuth();
  const { alertas, crearAlerta, eliminarAlerta, alternarAlerta, agregarNotificacion } = useCandidato();
  const { toast } = useToast();

  const areas = useMemo(() => Array.from(new Set(convocatorias.map((c) => c.area))).sort(), [convocatorias]);
  const ciudades = useMemo(() => Array.from(new Set(convocatorias.map((c) => c.ciudad))).sort(), [convocatorias]);

  const [nombre, setNombre] = useState('');
  const [seleccionAreas, setAreas] = useState<string[]>([]);
  const [seleccionCiudades, setCiudades] = useState<string[]>([]);
  const [seleccionModalidades, setModalidades] = useState<Modalidad[]>([]);
  const [frecuencia, setFrecuencia] = useState<AlertaGuardada['frecuencia']>('inmediata');

  /** Cuantas convocatorias vigentes calzarian hoy con los criterios elegidos. */
  const coincidenciasPrevias = useMemo(
    () =>
      convocatorias.filter((c) => {
        if (seleccionAreas.length && !seleccionAreas.includes(c.area)) return false;
        if (seleccionCiudades.length && !seleccionCiudades.includes(c.ciudad)) return false;
        if (seleccionModalidades.length && !seleccionModalidades.includes(c.modalidad)) return false;
        return true;
      }).length,
    [convocatorias, seleccionAreas, seleccionCiudades, seleccionModalidades],
  );

  const crear = (event: React.FormEvent) => {
    event.preventDefault();
    crearAlerta({
      nombre: nombre.trim() || `${t('panel.alerts.title')} ${alertas.length + 1}`,
      areas: seleccionAreas,
      ciudades: seleccionCiudades,
      modalidades: seleccionModalidades,
      frecuencia,
      email: usuario?.email ?? '',
      activa: true,
    });
    agregarNotificacion({
      tipo: 'sistema',
      titulo: t('panel.alerts.created'),
      cuerpo: `${coincidenciasPrevias} ${t('common.results')}`,
    });
    toast(t('panel.alerts.created'));
    setNombre('');
    setAreas([]);
    setCiudades([]);
    setModalidades([]);
  };

  return (
    <div className="stack gap-lg">
      <Reveal>
        <GlassCard variant="pad-lg" hover={false}>
          <h2 className="h3">{t('panel.alerts.title')}</h2>
          <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
            {t('panel.alerts.body')}
          </p>

          <form onSubmit={crear} className="stack gap-md mt-md">
            <div className="grid cols-2 gap-sm">
              <div className="field">
                <label className="field__label" htmlFor="a-nombre">
                  {t('panel.alerts.name')}
                </label>
                <input id="a-nombre" className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="a-frec">
                  {t('panel.alerts.frequency')}
                </label>
                <select
                  id="a-frec"
                  className="select"
                  value={frecuencia}
                  onChange={(e) => setFrecuencia(e.target.value as AlertaGuardada['frecuencia'])}
                >
                  {FRECUENCIAS.map((f) => (
                    <option key={f} value={f}>
                      {t(`panel.alerts.frequency.${f}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <span className="field__label">{t('jobs.filter.area')}</span>
              <div className="row gap-xs">
                {areas.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className="chip"
                    aria-pressed={seleccionAreas.includes(a)}
                    onClick={() => setAreas((prev) => alternar(prev, a))}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <span className="field__label">{t('jobs.filter.city')}</span>
              <div className="row gap-xs">
                {ciudades.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="chip"
                    aria-pressed={seleccionCiudades.includes(c)}
                    onClick={() => setCiudades((prev) => alternar(prev, c))}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <span className="field__label">{t('jobs.filter.mode')}</span>
              <div className="row gap-xs">
                {MODALIDADES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className="chip"
                    aria-pressed={seleccionModalidades.includes(m)}
                    onClick={() => setModalidades((prev) => alternar(prev, m))}
                  >
                    {t(`jobs.mode.${m}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="between">
              <p className="muted" style={{ fontSize: 'var(--fs-sm)' }} aria-live="polite">
                <b className="num">{coincidenciasPrevias}</b> {t('common.results')} ({t('common.today')})
              </p>
              <GlassButton type="submit" variant="primary" arrow>
                {t('panel.alerts.create')}
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      </Reveal>

      {alertas.length === 0 ? (
        <div className="empty">
          <p>{t('panel.alerts.empty')}</p>
        </div>
      ) : (
        <ul className="stack gap-xs">
          {alertas.map((a) => (
            <li className="list-row" key={a.id}>
              <div className="list-row__main">
                <p className="list-row__title">{a.nombre}</p>
                <p className="list-row__sub">
                  {[
                    a.areas.join(', '),
                    a.ciudades.join(', '),
                    a.modalidades.map((m) => t(`jobs.mode.${m}`)).join(', '),
                  ]
                    .filter(Boolean)
                    .join(' · ') || t('common.all')}
                </p>
                <p className="list-row__sub faint">
                  {t(`panel.alerts.frequency.${a.frecuencia}`)} · {formatDate(a.creadaEn, locale, { day: '2-digit', month: 'short' })}
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" checked={a.activa} onChange={() => alternarAlerta(a.id)} />
                <span className="sr-only">{a.nombre}</span>
              </label>
              <GlassButton variant="quiet" size="sm" swap={false} onClick={() => eliminarAlerta(a.id)}>
                {t('common.remove')}
              </GlassButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
