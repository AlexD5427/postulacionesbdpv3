'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useA11y } from '@/components/providers/A11yProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { CONVOCATORIAS } from '@/lib/data/convocatorias';
import { LOCALES, LOCALE_META } from '@/lib/i18n/config';
import { normalize } from '@/lib/utils';

interface Comando {
  id: string;
  etiqueta: string;
  grupo: string;
  accion: () => void;
}

/**
 * Paleta de comandos (Ctrl/Cmd + K).
 * Busca convocatorias, navega y ejecuta acciones de idioma y accesibilidad
 * sin usar el mouse.
 */
export function CommandPalette() {
  const router = useRouter();
  const { t, locale, setLocale, tl } = useI18n();
  const { settings, set, setPanelAbierto, leerPagina } = useA11y();
  const [abierto, setAbierto] = useState(false);
  const [query, setQuery] = useState('');
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const atajo = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setAbierto((v) => !v);
      }
      if (event.key === 'Escape') setAbierto(false);
    };
    window.addEventListener('keydown', atajo);
    return () => window.removeEventListener('keydown', atajo);
  }, []);

  useEffect(() => {
    const abrir = () => setAbierto(true);
    window.addEventListener('bdp-open-command', abrir);
    return () => window.removeEventListener('bdp-open-command', abrir);
  }, []);

  const comandos = useMemo<Comando[]>(() => {
    const ir = (href: string) => () => {
      setAbierto(false);
      router.push(href);
    };

    const navegacion: Comando[] = [
      { id: 'n-home', etiqueta: t('nav.home'), grupo: t('nav.menu'), accion: ir('/') },
      { id: 'n-conv', etiqueta: t('nav.convocatorias'), grupo: t('nav.menu'), accion: ir('/convocatorias') },
      { id: 'n-bolsa', etiqueta: t('nav.bolsa'), grupo: t('nav.menu'), accion: ir('/bolsa') },
      { id: 'n-eval', etiqueta: t('nav.evaluaciones'), grupo: t('nav.menu'), accion: ir('/evaluaciones') },
      { id: 'n-rec', etiqueta: t('nav.recursos'), grupo: t('nav.menu'), accion: ir('/recursos') },
      { id: 'n-panel', etiqueta: t('nav.panel'), grupo: t('nav.menu'), accion: ir('/panel') },
      { id: 'n-login', etiqueta: t('nav.login'), grupo: t('nav.menu'), accion: ir('/login') },
    ];

    const puestos: Comando[] = CONVOCATORIAS.map((c) => ({
      id: `c-${c.slug}`,
      etiqueta: tl(c.titulo) ?? c.titulo.es,
      grupo: t('nav.convocatorias'),
      accion: ir(`/convocatorias/${c.slug}`),
    }));

    const idiomas: Comando[] = LOCALES.filter((l) => l !== locale).map((l) => ({
      id: `l-${l}`,
      etiqueta: `${t('lang.change')}: ${LOCALE_META[l].endonimo}`,
      grupo: t('lang.label'),
      accion: () => {
        setLocale(l);
        setAbierto(false);
      },
    }));

    const acciones: Comando[] = [
      {
        id: 'a-panel',
        etiqueta: t('a11y.open'),
        grupo: t('a11y.title'),
        accion: () => {
          setAbierto(false);
          setPanelAbierto(true);
        },
      },
      {
        id: 'a-contrast',
        etiqueta: t('a11y.contrast'),
        grupo: t('a11y.title'),
        accion: () => {
          set('contrasteAlto', !settings.contrasteAlto);
          setAbierto(false);
        },
      },
      {
        id: 'a-read',
        etiqueta: t('a11y.ttsRead'),
        grupo: t('a11y.title'),
        accion: () => {
          setAbierto(false);
          setTimeout(() => leerPagina(locale), 120);
        },
      },
      {
        id: 'a-motion',
        etiqueta: t('a11y.reduceMotion'),
        grupo: t('a11y.title'),
        accion: () => {
          set('movimientoReducido', !settings.movimientoReducido);
          setAbierto(false);
        },
      },
    ];

    return [...navegacion, ...puestos, ...idiomas, ...acciones];
  }, [t, tl, locale, router, setLocale, set, setPanelAbierto, leerPagina, settings.contrasteAlto, settings.movimientoReducido]);

  const filtrados = useMemo(() => {
    if (!query.trim()) return comandos.slice(0, 9);
    const q = normalize(query);
    return comandos.filter((c) => normalize(c.etiqueta).includes(q) || normalize(c.grupo).includes(q)).slice(0, 12);
  }, [comandos, query]);

  useEffect(() => setIndice(0), [query, abierto]);

  const teclas = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIndice((i) => Math.min(filtrados.length - 1, i + 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIndice((i) => Math.max(0, i - 1));
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      filtrados[indice]?.accion();
    }
  };

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="cmdk-backdrop no-print"
          onClick={() => setAbierto(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.div
            className="cmdk"
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.commandHint')}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <input
              autoFocus
              className="cmdk__input"
              placeholder={`${t('nav.commandHint')}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={teclas}
              aria-label={t('common.search')}
            />
            <div className="cmdk__list">
              {filtrados.length === 0 && (
                <p style={{ padding: '1rem', color: 'rgba(255,255,255,.5)', fontSize: 'var(--fs-sm)' }}>
                  {t('jobs.empty')}
                </p>
              )}
              {filtrados.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  className="cmdk__item"
                  data-active={i === indice ? 'true' : 'false'}
                  onMouseEnter={() => setIndice(i)}
                  onClick={c.accion}
                >
                  <span style={{ flex: 1 }}>{c.etiqueta}</span>
                  <kbd>{c.grupo}</kbd>
                </button>
              ))}
            </div>
            <div className="cmdk__hint">
              <span>
                <kbd className="kbd">&#8593;</kbd> <kbd className="kbd">&#8595;</kbd> {t('common.next')}
              </span>
              <span>
                <kbd className="kbd">Enter</kbd> {t('common.continue')}
              </span>
              <span>
                <kbd className="kbd">Esc</kbd> {t('common.close')}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Dispara la apertura de la paleta desde cualquier boton. */
export function abrirPaleta() {
  window.dispatchEvent(new Event('bdp-open-command'));
}
