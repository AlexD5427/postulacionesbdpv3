'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { BdpMarkOutline } from '@/components/brand/BdpLogo';
import { useI18n } from '@/components/providers/I18nProvider';
import { useA11y } from '@/components/providers/A11yProvider';

const CLAVE_SESION = 'bdp-preloader-visto';
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Animacion de bienvenida: "Trabaja en BDP S.A.M." con el emblema dibujandose.
 * Aparece una vez por sesion, se puede saltar con clic o tecla y respeta la
 * preferencia de movimiento reducido (en ese caso no se muestra).
 */
export function Preloader() {
  const { t } = useI18n();
  const { settings } = useA11y();
  const [visible, setVisible] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setListo(true);
    if (settings.movimientoReducido) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (sessionStorage.getItem(CLAVE_SESION)) return;
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

  if (!listo) return null;

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
          exit={{ clipPath: 'inset(0 0 100% 0)', opacity: 1 }}
          transition={{ duration: 1.05, ease: EASE }}
        >
          {/* Halos de luz que se expanden detras del emblema */}
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
            transition={{ duration: 2.2, ease: EASE }}
          />

          <div className="preloader__inner">
            <motion.div
              initial={{ scale: 0.86, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
              >
                <BdpMarkOutline className="preloader__logo" />
              </motion.div>
            </motion.div>

            <h1 className="preloader__title">
              {palabras.map((palabra, i) => (
                <span className="w" key={`${palabra}-${i}`}>
                  <motion.span
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.35 + i * 0.11, ease: EASE }}
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
              transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            >
              {t('brand.tagline')}
            </motion.p>

            <div className="preloader__bar">
              <motion.i
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] }}
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
