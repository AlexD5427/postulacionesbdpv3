'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useA11y, type Paleta } from '@/components/providers/A11yProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { EASE_OUT } from '@/lib/ease';
import { LOCALE_META } from '@/lib/i18n/config';

const PALETAS: Paleta[] = ['default', 'deuteranopia', 'protanopia', 'tritanopia', 'monochrome'];

/** Boton flotante permanente de accesibilidad. */
export function AccessibilityFab() {
  const { setPanelAbierto, panelAbierto } = useA11y();
  const { t } = useI18n();

  return (
    <button
      type="button"
      className="a11y-fab no-print"
      onClick={() => setPanelAbierto(!panelAbierto)}
      aria-label={t('a11y.open')}
      aria-expanded={panelAbierto}
      title={`${t('a11y.open')} (Alt+A)`}
    >
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="4.4" r="2.1" fill="currentColor" />
        <path
          d="M4 8.4h16M12 8.4v6m0 0-3.2 6.2M12 14.4l3.2 6.2"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

export function AccessibilityPanel() {
  const {
    settings,
    set,
    reset,
    panelAbierto,
    setPanelAbierto,
    ttsSoportado,
    hablando,
    leerPagina,
    leerSeleccion,
    detenerLectura,
    vozNativaDisponible,
  } = useA11y();
  const { t, locale } = useI18n();

  // Atajos globales: Alt+A abre el panel, Alt+L lee la pagina, Esc cierra.
  useEffect(() => {
    const atajo = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        setPanelAbierto(!panelAbierto);
      }
      if (event.altKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        if (hablando) detenerLectura();
        else leerPagina(locale);
      }
      if (event.key === 'Escape' && panelAbierto) setPanelAbierto(false);
    };
    window.addEventListener('keydown', atajo);
    return () => window.removeEventListener('keydown', atajo);
  }, [panelAbierto, setPanelAbierto, hablando, detenerLectura, leerPagina, locale]);

  return (
    <AnimatePresence>
      {panelAbierto && (
        <>
          <motion.div
            key="backdrop"
            onClick={() => setPanelAbierto(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 955, background: 'rgba(3,7,15,.5)' }}
            aria-hidden="true"
          />
          <motion.aside
            key="panel"
            className="a11y-panel no-print"
            role="dialog"
            aria-modal="true"
            aria-label={t('a11y.title')}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
          >
            <div className="between" style={{ marginBottom: '0.4rem' }}>
              <h2 className="h3" style={{ color: '#fff' }}>
                {t('a11y.title')}
              </h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setPanelAbierto(false)}
                aria-label={t('common.close')}
              >
                &#10005;
              </button>
            </div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'rgba(238,244,252,.6)' }}>{t('a11y.subtitle')}</p>

            {/* --- Vision y color ------------------------------------------ */}
            <section className="a11y-group">
              <h3 className="a11y-group__title">{t('a11y.group.vision')}</h3>
              <div className="a11y-rows">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.contrasteAlto}
                    onChange={(e) => set('contrasteAlto', e.target.checked)}
                  />
                  <span>{t('a11y.contrast')}</span>
                </label>

                <div className="field">
                  <span className="field__label">{t('a11y.palette')}</span>
                  <div className="a11y-options">
                    {PALETAS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        className="chip"
                        aria-pressed={settings.paleta === p}
                        onClick={() => set('paleta', p)}
                      >
                        {t(`a11y.palette.${p}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* --- Texto y lectura ----------------------------------------- */}
            <section className="a11y-group">
              <h3 className="a11y-group__title">{t('a11y.group.text')}</h3>
              <div className="a11y-rows">
                <div className="field">
                  <span className="field__label">
                    {t('a11y.textSize')} · {Math.round(settings.escalaTexto * 100)}%
                  </span>
                  <input
                    className="range"
                    type="range"
                    min={0.9}
                    max={1.5}
                    step={0.05}
                    value={settings.escalaTexto}
                    onChange={(e) => set('escalaTexto', Number(e.target.value))}
                    aria-label={t('a11y.textSize')}
                  />
                </div>

                <div className="field">
                  <span className="field__label">{t('a11y.lineHeight')}</span>
                  <input
                    className="range"
                    type="range"
                    min={1}
                    max={1.6}
                    step={0.05}
                    value={settings.escalaLinea}
                    onChange={(e) => set('escalaLinea', Number(e.target.value))}
                    aria-label={t('a11y.lineHeight')}
                  />
                </div>

                <div className="field">
                  <span className="field__label">{t('a11y.letterSpacing')}</span>
                  <input
                    className="range"
                    type="range"
                    min={0}
                    max={0.12}
                    step={0.01}
                    value={settings.escalaLetra}
                    onChange={(e) => set('escalaLetra', Number(e.target.value))}
                    aria-label={t('a11y.letterSpacing')}
                  />
                </div>

                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.fuenteLegible}
                    onChange={(e) => set('fuenteLegible', e.target.checked)}
                  />
                  <span>{t('a11y.legibleFont')}</span>
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.subrayarEnlaces}
                    onChange={(e) => set('subrayarEnlaces', e.target.checked)}
                  />
                  <span>{t('a11y.underlineLinks')}</span>
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.guiaLectura}
                    onChange={(e) => set('guiaLectura', e.target.checked)}
                  />
                  <span>{t('a11y.readingGuide')}</span>
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.cursorGrande}
                    onChange={(e) => set('cursorGrande', e.target.checked)}
                  />
                  <span>{t('a11y.bigCursor')}</span>
                </label>
              </div>
            </section>

            {/* --- Movimiento ---------------------------------------------- */}
            <section className="a11y-group">
              <h3 className="a11y-group__title">{t('a11y.group.motion')}</h3>
              <div className="a11y-rows">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.movimientoReducido}
                    onChange={(e) => set('movimientoReducido', e.target.checked)}
                  />
                  <span>{t('a11y.reduceMotion')}</span>
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.fondosPausados}
                    onChange={(e) => set('fondosPausados', e.target.checked)}
                  />
                  <span>{t('a11y.pauseAnimations')}</span>
                </label>
              </div>
            </section>

            {/* --- Lectura por voz ----------------------------------------- */}
            <section className="a11y-group">
              <h3 className="a11y-group__title">{t('a11y.group.voice')}</h3>
              {!ttsSoportado ? (
                <p style={{ fontSize: 'var(--fs-sm)', color: 'rgba(238,244,252,.6)' }}>{t('a11y.ttsUnsupported')}</p>
              ) : (
                <div className="a11y-rows">
                  <div className="a11y-options">
                    <button type="button" className="chip" onClick={() => leerPagina(locale)}>
                      {t('a11y.ttsRead')}
                    </button>
                    <button type="button" className="chip" onClick={() => leerSeleccion(locale)}>
                      {t('a11y.ttsSelection')}
                    </button>
                    <button type="button" className="chip" onClick={detenerLectura} aria-pressed={hablando}>
                      {t('a11y.ttsStop')}
                    </button>
                  </div>

                  <div className="field">
                    <span className="field__label">
                      {t('a11y.ttsRate')} · {settings.velocidadVoz.toFixed(1)}x
                    </span>
                    <input
                      className="range"
                      type="range"
                      min={0.6}
                      max={1.8}
                      step={0.1}
                      value={settings.velocidadVoz}
                      onChange={(e) => set('velocidadVoz', Number(e.target.value))}
                      aria-label={t('a11y.ttsRate')}
                    />
                  </div>

                  {!vozNativaDisponible(locale) && (locale === 'qu' || locale === 'ay') && (
                    <p style={{ fontSize: 'var(--fs-xs)', color: 'rgba(238,244,252,.6)' }}>
                      {t('a11y.ttsNoNativeVoice')} ({LOCALE_META[locale].ttsFallback})
                    </p>
                  )}
                </div>
              )}
            </section>

            {/* --- Atajos -------------------------------------------------- */}
            <section className="a11y-group">
              <h3 className="a11y-group__title">{t('a11y.shortcuts')}</h3>
              <div className="a11y-rows" style={{ fontSize: 'var(--fs-sm)', color: 'rgba(238,244,252,.72)' }}>
                <div className="between">
                  <span>{t('a11y.shortcut.search')}</span>
                  <span>
                    <kbd className="kbd">Ctrl</kbd> <kbd className="kbd">K</kbd>
                  </span>
                </div>
                <div className="between">
                  <span>{t('a11y.shortcut.a11y')}</span>
                  <span>
                    <kbd className="kbd">Alt</kbd> <kbd className="kbd">A</kbd>
                  </span>
                </div>
                <div className="between">
                  <span>{t('a11y.shortcut.read')}</span>
                  <span>
                    <kbd className="kbd">Alt</kbd> <kbd className="kbd">L</kbd>
                  </span>
                </div>
              </div>
            </section>

            <button type="button" className="btn btn--ghost btn--block" onClick={reset} style={{ marginTop: '1.2rem' }}>
              <span>{t('a11y.reset')}</span>
            </button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
