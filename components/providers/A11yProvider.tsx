'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePersistentState } from '@/lib/storage';
import { LOCALE_META } from '@/lib/i18n/config';
import type { Locale } from '@/lib/types';

export type Paleta = 'default' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'monochrome';

export interface A11ySettings {
  contrasteAlto: boolean;
  paleta: Paleta;
  escalaTexto: number; // 0.9 - 1.5
  escalaLinea: number; // 1 - 1.6
  escalaLetra: number; // 0 - 0.12 (em)
  fuenteLegible: boolean;
  subrayarEnlaces: boolean;
  guiaLectura: boolean;
  cursorGrande: boolean;
  movimientoReducido: boolean;
  fondosPausados: boolean;
  velocidadVoz: number;
}

export const A11Y_DEFAULTS: A11ySettings = {
  contrasteAlto: false,
  paleta: 'default',
  escalaTexto: 1,
  escalaLinea: 1,
  escalaLetra: 0,
  fuenteLegible: false,
  subrayarEnlaces: false,
  guiaLectura: false,
  cursorGrande: false,
  movimientoReducido: false,
  fondosPausados: false,
  velocidadVoz: 1,
};

interface A11yValue {
  settings: A11ySettings;
  set: <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => void;
  reset: () => void;
  panelAbierto: boolean;
  setPanelAbierto: (open: boolean) => void;
  // --- Lector de voz ---
  ttsSoportado: boolean;
  hablando: boolean;
  leerTexto: (texto: string, locale: Locale) => void;
  leerPagina: (locale: Locale) => void;
  leerSeleccion: (locale: Locale) => void;
  detenerLectura: () => void;
  vozNativaDisponible: (locale: Locale) => boolean;
}

const A11yContext = createContext<A11yValue | null>(null);

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const { value: settings, setValue } = usePersistentState<A11ySettings>('a11y', A11Y_DEFAULTS);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [hablando, setHablando] = useState(false);
  const [voces, setVoces] = useState<SpeechSynthesisVoice[]>([]);
  const guiaRef = useRef<HTMLDivElement | null>(null);

  const ttsSoportado = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const set = useCallback(
    <K extends keyof A11ySettings>(key: K, value: A11ySettings[K]) => {
      setValue((prev) => ({ ...prev, [key]: value }));
    },
    [setValue],
  );

  const reset = useCallback(() => setValue(A11Y_DEFAULTS), [setValue]);

  /* --- Aplica los ajustes al documento -------------------------------- */
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.contrast = settings.contrasteAlto ? 'high' : 'normal';
    root.dataset.palette = settings.paleta;
    root.dataset.font = settings.fuenteLegible ? 'legible' : 'default';
    root.dataset.links = settings.subrayarEnlaces ? 'underline' : 'default';
    root.dataset.cursor = settings.cursorGrande ? 'large' : 'default';
    root.dataset.motion = settings.movimientoReducido ? 'reduced' : 'full';
    root.dataset.backgrounds = settings.fondosPausados ? 'paused' : 'live';
    root.style.setProperty('--text-scale', String(settings.escalaTexto));
    root.style.setProperty('--line-scale', String(settings.escalaLinea));
    root.style.setProperty('--letter-scale', `${settings.escalaLetra}em`);
  }, [settings]);

  /* --- Guia de lectura ------------------------------------------------ */
  useEffect(() => {
    if (!settings.guiaLectura) {
      guiaRef.current?.remove();
      guiaRef.current = null;
      return;
    }
    const guia = document.createElement('div');
    guia.className = 'reading-guide';
    guia.setAttribute('aria-hidden', 'true');
    document.body.appendChild(guia);
    guiaRef.current = guia;

    const mover = (event: MouseEvent) => {
      guia.style.top = `${event.clientY - 21}px`;
    };
    window.addEventListener('mousemove', mover);
    return () => {
      window.removeEventListener('mousemove', mover);
      guia.remove();
      guiaRef.current = null;
    };
  }, [settings.guiaLectura]);

  /* --- Catalogo de voces --------------------------------------------- */
  useEffect(() => {
    if (!ttsSoportado) return;
    const cargar = () => setVoces(window.speechSynthesis.getVoices());
    cargar();
    window.speechSynthesis.addEventListener('voiceschanged', cargar);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', cargar);
  }, [ttsSoportado]);

  const vozNativaDisponible = useCallback(
    (locale: Locale) => voces.some((v) => v.lang.toLowerCase().startsWith(locale)),
    [voces],
  );

  const elegirVoz = useCallback(
    (locale: Locale) => {
      const nativa = voces.find((v) => v.lang.toLowerCase().startsWith(locale));
      if (nativa) return nativa;
      const fallback = LOCALE_META[locale]?.ttsFallback ?? 'es-BO';
      return (
        voces.find((v) => v.lang.toLowerCase() === fallback.toLowerCase()) ??
        voces.find((v) => v.lang.toLowerCase().startsWith(fallback.slice(0, 2))) ??
        voces[0]
      );
    },
    [voces],
  );

  const detenerLectura = useCallback(() => {
    if (!ttsSoportado) return;
    window.speechSynthesis.cancel();
    setHablando(false);
  }, [ttsSoportado]);

  const leerTexto = useCallback(
    (texto: string, locale: Locale) => {
      if (!ttsSoportado || !texto.trim()) return;
      window.speechSynthesis.cancel();
      // Se trocea el texto: los motores cortan enunciados muy largos.
      const trozos = texto
        .replace(/\s+/g, ' ')
        .match(/[^.!?]+[.!?]?/g)
        ?.reduce<string[]>((acc, frase) => {
          const ultimo = acc[acc.length - 1];
          if (ultimo && (ultimo + frase).length < 220) acc[acc.length - 1] = ultimo + frase;
          else acc.push(frase);
          return acc;
        }, []) ?? [texto];

      const voz = elegirVoz(locale);
      trozos.forEach((trozo, index) => {
        const utter = new SpeechSynthesisUtterance(trozo.trim());
        if (voz) voz && (utter.voice = voz);
        utter.lang = voz?.lang ?? LOCALE_META[locale]?.ttsFallback ?? 'es-BO';
        utter.rate = settings.velocidadVoz;
        utter.pitch = 1;
        if (index === 0) utter.onstart = () => setHablando(true);
        if (index === trozos.length - 1) {
          utter.onend = () => setHablando(false);
          utter.onerror = () => setHablando(false);
        }
        window.speechSynthesis.speak(utter);
      });
    },
    [elegirVoz, settings.velocidadVoz, ttsSoportado],
  );

  const leerPagina = useCallback(
    (locale: Locale) => {
      const main = document.getElementById('contenido') ?? document.querySelector('main');
      if (!main) return;
      const texto = (main as HTMLElement).innerText.slice(0, 6000);
      leerTexto(texto, locale);
    },
    [leerTexto],
  );

  const leerSeleccion = useCallback(
    (locale: Locale) => {
      const seleccion = window.getSelection()?.toString() ?? '';
      if (seleccion.trim()) leerTexto(seleccion, locale);
      else leerPagina(locale);
    },
    [leerPagina, leerTexto],
  );

  // Detiene la voz al abandonar la pagina
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const value = useMemo<A11yValue>(
    () => ({
      settings,
      set,
      reset,
      panelAbierto,
      setPanelAbierto,
      ttsSoportado,
      hablando,
      leerTexto,
      leerPagina,
      leerSeleccion,
      detenerLectura,
      vozNativaDisponible,
    }),
    [
      settings,
      set,
      reset,
      panelAbierto,
      ttsSoportado,
      hablando,
      leerTexto,
      leerPagina,
      leerSeleccion,
      detenerLectura,
      vozNativaDisponible,
    ],
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y(): A11yValue {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error('useA11y debe usarse dentro de A11yProvider');
  return ctx;
}
