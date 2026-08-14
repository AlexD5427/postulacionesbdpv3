'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { BdpMarkOutline } from '@/components/brand/BdpLogo';
import { useI18n } from '@/components/providers/I18nProvider';
import { useA11y } from '@/components/providers/A11yProvider';
import { EASE_OUT } from '@/lib/ease';

const CLAVE_SESION = 'bdp-preloader-visto';

/**
 * Animacion de bienvenida: "Trabaja en BDP S.A.M." con el emblema apareciendo.
 * - Se muestra una sola vez por sesion del navegador.
 * - Se puede saltar con clic, tecla o rueda.
 * - No aparece si el usuario pidio movimiento reducido.
 */
export function Preloader() {
  const { t } = useI18n();
  const { settings } = useA11y();
  const [visible, setVisible] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    if (settings.movimientoReducido) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      if (sessionStorage.getItem(CLAVE_SESION)) return;
    } catch {
      return; // modo privado sin sessionStorage: no bloqueamos la pagina
    }
    setVisible(true);
    document.documentElement.style.overflow = 'hidden';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cerrar = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem(CLAVE_SESION, '1');
    } catch {
      /* modo privado */
    }
    document.documentElement.style.overflow = '';
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(cerrar, 2900);
    const salir = () => cerrar();
    window.addEventListener('keydown', salir);
    window.addEventListener('wheel', salir, { passive: true });
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', salir);
      window.removeEventListener('wheel', salir);
    };
  }, [visible, cerrar]);

  if (!montado) return null;

  const palabras = t('brand.claim').split(' ');

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader"
          role="status"
          aria-live="polite"
          onClick={cerrar}
          initial={{ opacity: 1 }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 1.05, ease: EASE_OUT }}
        >
          {/* Halo de luz que se expande detras del emblema */}
          <motion.span
            aria-hidden="true"
            style={{
              position: 'absolute',
              width: '52vmax',
              height: '52vmax',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(10,85,150,.55), transparent 62%)',
              filter: 'blur(40px)',
            }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 2.2, ease: EASE_OUT }}
          />

          <div className="preloader__inner">
            <motion.div
              initial={{ scale: 0.86, opacity: 0, rotate: -8, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: EASE_OUT }}
            >
              <BdpMarkOutline className="preloader__logo" />
            </motion.div>

            <h1 className="preloader__title">
              {palabras.map((palabra, i) => (
                <span className="w" key={`${palabra}-${i}`}>
                  <motion.span
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.35 + i * 0.11, ease: EASE_OUT }}
                  >
                    {palabra}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="preloader__sub"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: EASE_OUT }}
            >
              {t('brand.tagline')}
            </motion.p>

            <div className="preloader__bar">
              <motion.i
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <button type="button" className="preloader__skip" onClick={cerrar}>
            {t('common.continue')}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
