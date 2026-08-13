'use client';

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { DICTIONARIES } from '@/lib/i18n/dictionaries';
import { DEFAULT_LOCALE, LOCALE_META, isLocale } from '@/lib/i18n/config';
import { usePersistentState } from '@/lib/storage';
import type { L, Locale } from '@/lib/types';
import { pick } from '@/lib/utils';

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Traduce una clave. Si no existe, usa el fallback y por ultimo la clave. */
  t: (key: string, fallback?: string) => string;
  /** Resuelve un objeto localizable de datos (convocatorias, preguntas...). */
  tl: <T>(value: L<T> | undefined) => T | undefined;
  meta: typeof LOCALE_META;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { value: locale, setValue } = usePersistentState<Locale>('locale', DEFAULT_LOCALE);

  // Detecta el idioma del navegador la primera vez, sin sobreescribir la eleccion del usuario.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('bdp-talento:locale');
    if (stored) return;
    const nav = (navigator.language || '').slice(0, 2);
    if (isLocale(nav)) setValue(nav);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = LOCALE_META[locale]?.bcp47 ?? 'es-BO';
  }, [locale]);

  const t = useCallback(
    (key: string, fallback?: string) => DICTIONARIES[locale]?.[key] ?? DICTIONARIES.es[key] ?? fallback ?? key,
    [locale],
  );

  const tl = useCallback(<T,>(value: L<T> | undefined) => pick<T>(value, locale), [locale]);

  const value = useMemo<I18nValue>(
    () => ({ locale, setLocale: setValue, t, tl, meta: LOCALE_META }),
    [locale, setValue, t, tl],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n debe usarse dentro de I18nProvider');
  return ctx;
}
