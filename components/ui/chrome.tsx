'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useA11y } from '@/components/providers/A11yProvider';

/** Barra de progreso de lectura en el borde superior. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

/** Halo que sigue al cursor: refuerza la sensacion de luz sobre vidrio. */
export function CursorGlow() {
  const { settings } = useA11y();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    if (settings.movimientoReducido) return;
    // Se desactiva en dispositivos tactiles: no hay cursor que seguir.
    if (window.matchMedia('(hover: none)').matches) return;

    let raf = 0;
    let destino = { x: 0, y: 0 };
    const mover = (event: MouseEvent) => {
      destino = { x: event.clientX, y: event.clientY };
      setActivo(true);
    };
    const salir = () => setActivo(false);
    const loop = () => {
      setPos((prev) => ({ x: prev.x + (destino.x - prev.x) * 0.12, y: prev.y + (destino.y - prev.y) * 0.12 }));
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', mover);
    document.addEventListener('mouseleave', salir);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', mover);
      document.removeEventListener('mouseleave', salir);
      cancelAnimationFrame(raf);
    };
  }, [settings.movimientoReducido]);

  if (settings.movimientoReducido) return null;

  return (
    <div
      className="cursor-glow"
      data-active={activo ? 'true' : 'false'}
      aria-hidden="true"
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)` }}
    />
  );
}

/** Indicador de scroll del hero. */
export function ScrollCue({ label }: { label: string }) {
  return (
    <span className="scroll-cue" aria-hidden="true">
      <span>{label}</span>
      <span className="scroll-cue__line" />
    </span>
  );
}
