'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistentState } from '@/lib/storage';
import type { Usuario } from '@/lib/types';
import { uid } from '@/lib/utils';

/**
 * ---------------------------------------------------------------------------
 * SESION EN MODO DEMOSTRACION
 * ---------------------------------------------------------------------------
 * No hay backend de autenticacion en este repositorio: la sesion vive en el
 * navegador para que toda la experiencia sea navegable y evaluable.
 * Para produccion, reemplazar login/register por llamadas al proveedor de
 * identidad institucional (SSO / OAuth) manteniendo esta misma interfaz.
 * ---------------------------------------------------------------------------
 */

export function usuarioVacio(parcial: Partial<Usuario> = {}): Usuario {
  return {
    id: uid('u'),
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    ci: '',
    ciudad: 'La Paz',
    departamento: 'La Paz',
    profesion: '',
    resumen: '',
    areasInteres: [],
    habilidades: [],
    idiomas: [{ nombre: 'Espanol', nivel: 'nativo' }],
    experiencia: [],
    educacion: [],
    nivelEducativo: 'licenciatura',
    experienciaAnios: 0,
    modalidadPreferida: 'indiferente',
    expectativaSalarial: 0,
    disponibilidadInmediata: true,
    visibleEnBolsa: true,
    documentos: [],
    creadoEn: new Date().toISOString(),
    ...parcial,
  };
}

interface AuthValue {
  usuario: Usuario | null;
  autenticado: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (datos: Partial<Usuario> & { email: string; password: string }) => { ok: boolean; error?: string };
  logout: () => void;
  actualizar: (parcial: Partial<Usuario>) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { value: usuario, setValue: setUsuario } = usePersistentState<Usuario | null>('usuario', null);
  const { value: cuentas, setValue: setCuentas } = usePersistentState<Record<string, Usuario>>('cuentas', {});

  const login = useCallback<AuthValue['login']>(
    (email, password) => {
      const correo = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) return { ok: false, error: 'auth.error.email' };
      if (password.length < 8) return { ok: false, error: 'auth.error.password' };

      const existente = cuentas[correo];
      if (existente) {
        setUsuario(existente);
        return { ok: true };
      }
      // En modo demo, iniciar sesion con un correo nuevo crea el perfil base.
      const nuevo = usuarioVacio({ email: correo, nombre: correo.split('@')[0] });
      setCuentas((prev) => ({ ...prev, [correo]: nuevo }));
      setUsuario(nuevo);
      return { ok: true };
    },
    [cuentas, setCuentas, setUsuario],
  );

  const register = useCallback<AuthValue['register']>(
    ({ password, ...datos }) => {
      const correo = (datos.email || '').trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) return { ok: false, error: 'auth.error.email' };
      if (!password || password.length < 8) return { ok: false, error: 'auth.error.password' };

      const nuevo = usuarioVacio({ ...datos, email: correo });
      setCuentas((prev) => ({ ...prev, [correo]: nuevo }));
      setUsuario(nuevo);
      return { ok: true };
    },
    [setCuentas, setUsuario],
  );

  const logout = useCallback(() => setUsuario(null), [setUsuario]);

  const actualizar = useCallback<AuthValue['actualizar']>(
    (parcial) => {
      setUsuario((prev) => {
        if (!prev) return prev;
        const actualizado = { ...prev, ...parcial };
        setCuentas((cuentasPrev) => ({ ...cuentasPrev, [actualizado.email]: actualizado }));
        return actualizado;
      });
    },
    [setCuentas, setUsuario],
  );

  const value = useMemo<AuthValue>(
    () => ({ usuario, autenticado: !!usuario, login, register, logout, actualizar }),
    [usuario, login, register, logout, actualizar],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
