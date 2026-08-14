'use client';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from '@/lib/storage';
import { hashPassword, validEmail, type StoredAccount } from '@/lib/auth';
import type { Usuario } from '@/lib/types';
import { uid } from '@/lib/utils';
export function usuarioVacio(parcial: Partial<Usuario> = {}): Usuario { return { id: uid('u'), nombre: '', apellido: '', email: '', telefono: '', ci: '', ciudad: 'La Paz', departamento: 'La Paz', profesion: '', resumen: '', areasInteres: [], habilidades: [], idiomas: [{ nombre: 'Espanol', nivel: 'nativo' }], experiencia: [], educacion: [], nivelEducativo: 'licenciatura', experienciaAnios: 0, modalidadPreferida: 'indiferente', expectativaSalarial: 0, disponibilidadInmediata: true, visibleEnBolsa: true, documentos: [], creadoEn: new Date().toISOString(), ...parcial }; }
interface AuthValue { usuario: Usuario | null; autenticado: boolean; login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>; register: (datos: Partial<Usuario> & { email: string; password: string }) => Promise<{ ok: boolean; error?: string }>; logout: () => void; actualizar: (parcial: Partial<Usuario>) => void; }
const AuthContext = createContext<AuthValue | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { value: usuario, setValue: setUsuario } = usePersistentState<Usuario | null>('usuario', null);
  const { value: cuentas, setValue: setCuentas } = usePersistentState<Record<string, StoredAccount>>('cuentas', {});
  const login = useCallback<AuthValue['login']>(async (email, password) => { const correo = email.trim().toLowerCase(); if (!validEmail(correo)) return { ok: false, error: 'auth.error.email' }; if (password.length < 8) return { ok: false, error: 'auth.error.password' }; const cuenta = cuentas[correo]; if (!cuenta) return { ok: false, error: 'auth.error.email' }; if ((await hashPassword(password)) !== cuenta.passwordHash) return { ok: false, error: 'auth.error.password' }; setUsuario(cuenta.usuario); return { ok: true }; }, [cuentas, setUsuario]);
  const register = useCallback<AuthValue['register']>(async ({ password, ...datos }) => { const correo = (datos.email || '').trim().toLowerCase(); if (!validEmail(correo)) return { ok: false, error: 'auth.error.email' }; if (!password || password.length < 8) return { ok: false, error: 'auth.error.password' }; if (cuentas[correo]) return { ok: false, error: 'auth.error.email' }; const nuevo = usuarioVacio({ ...datos, email: correo }); const passwordHash = await hashPassword(password); setCuentas((prev) => ({ ...prev, [correo]: { usuario: nuevo, passwordHash } })); setUsuario(nuevo); return { ok: true }; }, [cuentas, setCuentas, setUsuario]);
  const logout = useCallback(() => setUsuario(null), [setUsuario]);
  const actualizar = useCallback<AuthValue['actualizar']>((parcial) => { setUsuario((prev) => { if (!prev) return prev; const actualizado = { ...prev, ...parcial }; setCuentas((prevCuentas) => prevCuentas[actualizado.email] ? { ...prevCuentas, [actualizado.email]: { ...prevCuentas[actualizado.email], usuario: actualizado } } : prevCuentas); return actualizado; }); }, [setCuentas, setUsuario]);
  const value = useMemo<AuthValue>(() => ({ usuario, autenticado: !!usuario, login, register, logout, actualizar }), [usuario, login, register, logout, actualizar]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthValue { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider'); return ctx; }
