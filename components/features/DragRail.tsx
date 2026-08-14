'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/utils';

/**
 * Riel horizontal arrastrable ("arrastra para ver mas").
 * - Arrastre con mouse y con dedo (scroll nativo en tactil).
 * - Rueda vertical convertida en avance horizontal cuando el cursor esta dentro.
 * - Navegacion por teclado: flechas izquierda/derecha mueven una tarjeta.
 * - data-lenis-prevent evita que el scroll suave global capture el gesto.
 */
export function DragRail({
  children,
  className,
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const estado = useRef({ activo: false, inicioX: 0, inicioScroll: 0, movido: false });

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === 'touch') return; // el navegador ya hace scroll nativo
    const el = ref.current;
    if (!el) return;
    estado.current = { activo: true, inicioX: event.clientX, inicioScroll: el.scrollLeft, movido: false };
    setArrastrando(true);
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !estado.current.activo) return;
    const delta = event.clientX - estado.current.inicioX;
    if (Math.abs(delta) > 4) estado.current.movido = true;
    el.scrollLeft = estado.current.inicioScroll - delta;
  }, []);

  const terminar = useCallback(() => {
    estado.current.activo = false;
    setArrastrando(false);
  }, []);

  // Evita que un arrastre se interprete como clic en la tarjeta.
  const onClickCapture = useCallback((event: React.MouseEvent) => {
    if (estado.current.movido) {
      event.preventDefault();
      event.stopPropagation();
      estado.current.movido = false;
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const alInicio = el.scrollLeft <= 0;
      const alFinal = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
      // Si el riel ya llego al borde, se devuelve el gesto a la pagina.
      if ((event.deltaY < 0 && alInicio) || (event.deltaY > 0 && alFinal)) return;
      event.preventDefault();
      el.scrollLeft += event.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const el = ref.current;
    if (!el) return;
    const paso = el.clientWidth * 0.42;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      el.scrollBy({ left: paso, behavior: 'smooth' });
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      el.scrollBy({ left: -paso, behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={ref}
      className={cx('drag-rail', className)}
      data-lenis-prevent
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={terminar}
      onPointerLeave={terminar}
      onClickCapture={onClickCapture}
      style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
        cursor: arrastrando ? 'grabbing' : 'grab',
        scrollSnapType: 'x proximity',
      }}
    >
      <div className="drag-rail__track">{children}</div>
    </div>
  );
}

export function DragHint({ label }: { label: string }) {
  return (
    <span className="drag-hint">
      <svg width="26" height="10" viewBox="0 0 26 10" fill="none" aria-hidden="true">
        <path d="M0 5h24m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      {label}
    </span>
  );
}
