'use client';

import { useCallback, useEffect, useState } from 'react';

const PREFIX = 'bdp-talento:';

export function readLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLS<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('bdp-storage', { detail: { key } }));
  } catch {
    /* cuota llena o modo privado: se ignora silenciosamente */
  }
}

export function removeLS(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(PREFIX + key);
    window.dispatchEvent(new CustomEvent('bdp-storage', { detail: { key } }));
  } catch {
    /* noop */
  }
}

/**
 * Estado persistente e hidratacion segura para SSR:
 * siempre arranca con el valor por defecto y sincroniza tras montar,
 * evitando desajustes de hidratacion en Next.js.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(readLS<T>(key, initial));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    writeLS(key, value);
  }, [key, value, hydrated]);

  useEffect(() => {
    const sync = (event: Event) => {
      const detail = (event as CustomEvent<{ key: string }>).detail;
      if (detail && detail.key !== key) return;
      setValue(readLS<T>(key, initial));
    };
    window.addEventListener('storage', sync);
    window.addEventListener('bdp-storage', sync as EventListener);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('bdp-storage', sync as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const reset = useCallback(() => setValue(initial), [initial]);

  return { value, setValue, hydrated, reset } as const;
}
