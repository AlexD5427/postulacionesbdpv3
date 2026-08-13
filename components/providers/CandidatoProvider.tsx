'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from '@/lib/storage';
import type { AlertaGuardada, BusquedaGuardada, Notificacion } from '@/lib/types';
import { uid } from '@/lib/utils';

export interface PracticaQuiz {
  id: string;
  fecha: string;
  categoria: string;
  correctas: number;
  total: number;
  segundos: number;
}

interface CandidatoValue {
  guardadas: string[];
  alternarGuardada: (slug: string) => boolean;
  esGuardada: (slug: string) => boolean;

  comparar: string[];
  alternarComparar: (slug: string) => boolean;
  limpiarComparar: () => void;

  alertas: AlertaGuardada[];
  crearAlerta: (alerta: Omit<AlertaGuardada, 'id' | 'creadaEn'>) => void;
  eliminarAlerta: (id: string) => void;
  alternarAlerta: (id: string) => void;

  busquedas: BusquedaGuardada[];
  guardarBusqueda: (busqueda: Omit<BusquedaGuardada, 'id' | 'creadaEn'>) => void;
  eliminarBusqueda: (id: string) => void;

  postulaciones: string[];
  registrarPostulacion: (slug: string) => void;
  yaPostulo: (slug: string) => boolean;

  practicas: PracticaQuiz[];
  registrarPractica: (practica: Omit<PracticaQuiz, 'id' | 'fecha'>) => void;

  notificaciones: Notificacion[];
  agregarNotificacion: (n: Omit<Notificacion, 'id' | 'fecha' | 'leida'>) => void;
  marcarTodasLeidas: () => void;
  noLeidas: number;
}

const CandidatoContext = createContext<CandidatoValue | null>(null);

export function CandidatoProvider({ children }: { children: React.ReactNode }) {
  const { value: guardadas, setValue: setGuardadas } = usePersistentState<string[]>('guardadas', []);
  const { value: comparar, setValue: setComparar } = usePersistentState<string[]>('comparar', []);
  const { value: alertas, setValue: setAlertas } = usePersistentState<AlertaGuardada[]>('alertas', []);
  const { value: busquedas, setValue: setBusquedas } = usePersistentState<BusquedaGuardada[]>('busquedas', []);
  const { value: postulaciones, setValue: setPostulaciones } = usePersistentState<string[]>('postulaciones', []);
  const { value: practicas, setValue: setPracticas } = usePersistentState<PracticaQuiz[]>('practicas', []);
  const { value: notificaciones, setValue: setNotificaciones } = usePersistentState<Notificacion[]>(
    'notificaciones',
    [],
  );

  const esGuardada = useCallback((slug: string) => guardadas.includes(slug), [guardadas]);

  const alternarGuardada = useCallback(
    (slug: string) => {
      const yaEsta = guardadas.includes(slug);
      setGuardadas((prev) => (yaEsta ? prev.filter((s) => s !== slug) : [...prev, slug]));
      return !yaEsta;
    },
    [guardadas, setGuardadas],
  );

  const alternarComparar = useCallback(
    (slug: string) => {
      const yaEsta = comparar.includes(slug);
      if (!yaEsta && comparar.length >= 3) return false;
      setComparar((prev) => (yaEsta ? prev.filter((s) => s !== slug) : [...prev, slug]));
      return !yaEsta;
    },
    [comparar, setComparar],
  );

  const limpiarComparar = useCallback(() => setComparar([]), [setComparar]);

  const agregarNotificacion = useCallback<CandidatoValue['agregarNotificacion']>(
    (n) => {
      setNotificaciones((prev) =>
        [{ ...n, id: uid('n'), fecha: new Date().toISOString(), leida: false }, ...prev].slice(0, 30),
      );
    },
    [setNotificaciones],
  );

  const crearAlerta = useCallback<CandidatoValue['crearAlerta']>(
    (alerta) => {
      setAlertas((prev) => [...prev, { ...alerta, id: uid('a'), creadaEn: new Date().toISOString() }]);
    },
    [setAlertas],
  );

  const eliminarAlerta = useCallback(
    (id: string) => setAlertas((prev) => prev.filter((a) => a.id !== id)),
    [setAlertas],
  );

  const alternarAlerta = useCallback(
    (id: string) => setAlertas((prev) => prev.map((a) => (a.id === id ? { ...a, activa: !a.activa } : a))),
    [setAlertas],
  );

  const guardarBusqueda = useCallback<CandidatoValue['guardarBusqueda']>(
    (busqueda) => {
      setBusquedas((prev) => [...prev.slice(-9), { ...busqueda, id: uid('b'), creadaEn: new Date().toISOString() }]);
    },
    [setBusquedas],
  );

  const eliminarBusqueda = useCallback(
    (id: string) => setBusquedas((prev) => prev.filter((b) => b.id !== id)),
    [setBusquedas],
  );

  const registrarPostulacion = useCallback(
    (slug: string) => setPostulaciones((prev) => (prev.includes(slug) ? prev : [...prev, slug])),
    [setPostulaciones],
  );

  const yaPostulo = useCallback((slug: string) => postulaciones.includes(slug), [postulaciones]);

  const registrarPractica = useCallback<CandidatoValue['registrarPractica']>(
    (practica) => {
      setPracticas((prev) => [{ ...practica, id: uid('q'), fecha: new Date().toISOString() }, ...prev].slice(0, 20));
    },
    [setPracticas],
  );

  const marcarTodasLeidas = useCallback(
    () => setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true }))),
    [setNotificaciones],
  );

  const value = useMemo<CandidatoValue>(
    () => ({
      guardadas,
      alternarGuardada,
      esGuardada,
      comparar,
      alternarComparar,
      limpiarComparar,
      alertas,
      crearAlerta,
      eliminarAlerta,
      alternarAlerta,
      busquedas,
      guardarBusqueda,
      eliminarBusqueda,
      postulaciones,
      registrarPostulacion,
      yaPostulo,
      practicas,
      registrarPractica,
      notificaciones,
      agregarNotificacion,
      marcarTodasLeidas,
      noLeidas: notificaciones.filter((n) => !n.leida).length,
    }),
    [
      guardadas,
      alternarGuardada,
      esGuardada,
      comparar,
      alternarComparar,
      limpiarComparar,
      alertas,
      crearAlerta,
      eliminarAlerta,
      alternarAlerta,
      busquedas,
      guardarBusqueda,
      eliminarBusqueda,
      postulaciones,
      registrarPostulacion,
      yaPostulo,
      practicas,
      registrarPractica,
      notificaciones,
      agregarNotificacion,
      marcarTodasLeidas,
    ],
  );

  return <CandidatoContext.Provider value={value}>{children}</CandidatoContext.Provider>;
}

export function useCandidato(): CandidatoValue {
  const ctx = useContext(CandidatoContext);
  if (!ctx) throw new Error('useCandidato debe usarse dentro de CandidatoProvider');
  return ctx;
}
