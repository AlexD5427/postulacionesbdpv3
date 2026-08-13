'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useA11y } from '@/components/providers/A11yProvider';

/**
 * Scroll suave con Lenis.
 * - Se carga de forma diferida para no bloquear la primera pintura.
 * - Si el usuario pide movimiento reducido, no se activa nada.
 * - Si la libreria falla, la pagina cae al scroll nativo sin romperse.
 */
export function SmoothScroll() {
  const { settings } = useA11y();
  const pathname = usePathname();

  useEffect(() => {
    if (settings.movimientoReducido) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lenis: { raf: (t: number) => void; destroy: () => void; scrollTo: (t: unknown, o?: unknown) => void } | null =
      null;
    let raf = 0;
    let cancelado = false;

    (async () => {
      try {
        const mod = await import('lenis');
        const Lenis = mod.default;
        if (cancelado) return;
        lenis = new Lenis({
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.7,
          wheelMultiplier: 1,
        }) as unknown as typeof lenis;

        const loop = (time: number) => {
          lenis?.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        // Se expone para que la navegacion por anclas use la misma inercia.
        (window as unknown as { __lenis?: unknown }).__lenis = lenis;
      } catch {
        document.documentElement.style.scrollBehavior = 'smooth';
      }
    })();

    return () => {
      cancelado = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    };
  }, [settings.movimientoReducido]);

  // Al cambiar de ruta, siempre arrancamos arriba.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
