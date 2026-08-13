'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/components/providers/I18nProvider';
import { LOCALES, LOCALE_META } from '@/lib/i18n/config';

/**
 * Selector de los 4 idiomas de la plataforma.
 * Cada opcion se muestra en su propio idioma (endonimo) y anuncia su estado
 * a los lectores de pantalla mediante role="radio" + aria-checked.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (event: MouseEvent) => {
      if (!contenedor.current?.contains(event.target as Node)) setAbierto(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', fuera);
      document.removeEventListener('keydown', escape);
    };
  }, [abierto]);

  return (
    <div className="lang" ref={contenedor}>
      <button
        type="button"
        className="lang__btn"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="true"
        aria-label={`${t('lang.change')}. ${t('lang.current')}: ${LOCALE_META[locale].nombre}`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        {LOCALE_META[locale].corto}
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            className="lang__menu"
            role="radiogroup"
            aria-label={t('lang.label')}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {LOCALES.map((code) => (
              <button
                key={code}
                type="button"
                role="radio"
                aria-checked={locale === code}
                className="lang__opt"
                onClick={() => {
                  setLocale(code);
                  setAbierto(false);
                }}
              >
                <span>
                  {LOCALE_META[code].endonimo}
                  <small>{LOCALE_META[code].corto}</small>
                </span>
                {locale === code && <span aria-hidden="true">&#10003;</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
