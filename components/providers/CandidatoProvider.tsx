'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { useAuth } from './AuthProvider';
import { usePersistentState } from '@/lib/storage';
import type { AlertaGuardada, BusquedaGuardada, Notificacion } from '@/lib/types';
import { uid } from '@/lib/utils';

export interface PracticaQuiz { id: string; fecha: string; categoria: string; correctas: number; total: number; segundos: number; }
interface CandidatoValue {
  guardadas: string[]; alternarGuardada: (slug: string) => boolean; esGuardada: (slug: string) => boolean;
  comparar: string[]; alternarComparar: (slug: string) => boolean; limpiarComparar: () => void;
  alertas: AlertaGuardada[]; crearAlerta: (a: Omit<AlertaGuardada, 'id'|'creadaEn'>) => void; eliminarAlerta: (id: string) => void; alternarAlerta: (id: string) => void;
  busquedas: BusquedaGuardada[]; guardarBusqueda: (b: Omit<BusquedaGuardada, 'id'|'creadaEn'>) => void; eliminarBusqueda: (id: string) => void;
  postulaciones: string[]; registrarPostulacion: (slug: string) => void; yaPostulo: (slug: string) => boolean;
  practicas: PracticaQuiz[]; registrarPractica: (p: Omit<PracticaQuiz, 'id'|'fecha'>) => void;
  notificaciones: import('@/lib/types').Notificacion[]; agregarNotificacion: (n: Omit<import('@/lib/types').Notificacion, 'id'|'fecha'|'leida'>) => void; marcarTodasLeidas: () => void; noLeidas: number;
}
const CandidatoContext = createContext<CandidatoValue | null>(null);

export function CandidatoProvider({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  const scope = usuario?.id || 'guest';
  const key = (name: string) => `candidate:${scope}:${name}`;
  const { value: guardadas, setValue: setGuardadas } = usePersistentState<string[]>(key('guardadas'), []);
  const { value: comparar, setValue: setComparar } = usePersistentState<string[]>(key('comparar'), []);
  const { value: alertas, setValue: setAlertas } = usePersistentState<AlertaGuardada[]>(key('alertas'), []);
  const { value: busquedas, setValue: setBusquedas } = usePersistentState<BusquedaGuardada[]>(key('busquedas'), []);
  const { value: postulaciones, setValue: setPostulaciones } = usePersistentState<string[]>(key('postulaciones'), []);
  const { value: practicas, setValue: setPracticas } = usePersistentState<PracticaQuiz[]>(key('practicas'), []);
  const { value: notificaciones, setValue: setNotificaciones } = usePersistentState<import('@/lib/types').Notificacion[]>(key('notificaciones'), []);
  const esGuardada = useCallback((slug: string) => guardadas.includes(slug), [guardadas]);
  const alternarGuardada = useCallback((slug: string) => { const exists = guardadas.includes(slug); setGuardadas((p) => exists ? p.filter((s) => s !== slug) : [...p, slug]); return !exists; }, [guardadas, setGuardadas]);
  const alternarComparar = useCallback((slug: string) => { const exists = comparar.includes(slug); if (!exists && comparar.length >= 3) return false; setComparar((p) => exists ? p.filter((s) => s !== slug) : [...p, slug]); return !exists; }, [comparar, setComparar]);
  const limpiarComparar = useCallback(() => setComparar([]), [setComparar]);
  const agregarNotificacion = useCallback<CandidatoValue['agregarNotificacion']>((n) => setNotificaciones((p) => [{ ...n, id: uid('n'), fecha: new Date().toISOString(), leida: false }, ...p].slice(0, 30)), [setNotificaciones]);
  const crearAlerta = useCallback<CandidatoValue['crearAlerta']>((a) => setAlertas((p) => [...p, { ...a, id: uid('a'), creadaEn: new Date().toISOString() }]), [setAlertas]);
  const eliminarAlerta = useCallback((id: string) => setAlertas((p) => p.filter((a) => a.id !== id)), [setAlertas]);
  const alternarAlerta = useCallback((id: string) => setAlertas((p) => p.map((a) => a.id === id ? { ...a, activa: !a.activa } : a)), [setAlertas]);
  const guardarBusqueda = useCallback<CandidatoValue['guardarBusqueda']>((b) => setBusquedas((p) => [...p.slice(-9), { ...b, id: uid('b'), creadaEn: new Date().toISOString() }]), [setBusquedas]);
  const eliminarBusqueda = useCallback((id: string) => setBusquedas((p) => p.filter((b) => b.id !== id)), [setBusquedas]);
  const registrarPostulacion = useCallback((slug: string) => setPostulaciones((p) => p.includes(slug) ? p : [...p, slug]), [setPostulaciones]);
  const yaPostulo = useCallback((slug: string) => postulaciones.includes(slug), [postulaciones]);
  const registrarPractica = useCallback<CandidatoValue['registrarPractica']>((p) => setPracticas((prev) => [{ ...p, id: uid('q'), fecha: new Date().toISOString() }, ...prev].slice(0, 20)), [setPracticas]);
  const marcarTodasLeidas = useCallback(() => setNotificaciones((p) => p.map((n) => ({ ...n, leida: true }))), [setNotificaciones]);
  const value = useMemo<CandidatoValue>(() => ({ guardadas, alternarGuardada, esGuardada, comparar, alternarComparar, limpiarComparar, alertas, crearAlerta, eliminarAlerta, alternarAlerta, busquedas, guardarBusqueda, eliminarBusqueda, postulaciones, registrarPostulacion, yaPostulo, practicas, registrarPractica, notificaciones, agregarNotificacion, marcarTodasLeidas, noLeidas: notificaciones.filter((n) => !n.leida).length }), [guardadas, alternarGuardada, esGuardada, comparar, alternarComparar, limpiarComparar, alertas, crearAlerta, eliminarAlerta, alternarAlerta, busquedas, guardarBusqueda, eliminarBusqueda, postulaciones, registrarPostulacion, yaPostulo, practicas, registrarPractica, notificaciones, agregarNotificacion, marcarTodasLeidas]);
  return <CandidatoContext.Provider value={value}>{children}</CandidatoContext.Provider>;
}
export function useCandidato(): CandidatoValue { const ctx = useContext(CandidatoContext); if (!ctx) throw new Error('useCandidato debe usarse dentro de CandidatoProvider'); return ctx; }
