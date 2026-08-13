'use client';

import Link from 'next/link';
import { useCallback, useRef } from 'react';
import { cx } from '@/lib/utils';

/* ==========================================================================
   Seguimiento del cursor: alimenta el reflejo especular del vidrio
   ========================================================================== */

function useSpecular<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  const onMouseMove = useCallback((event: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  return { ref, onMouseMove } as const;
}

/* ==========================================================================
   GlassCard: panel de vidrio liquido
   ========================================================================== */

export function GlassCard({
  children,
  className,
  variant,
  edge = false,
  sheen = false,
  refract = false,
  hover = true,
  as: Tag = 'div',
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'pad' | 'pad-lg' | 'frost' | 'solid';
  /** Borde de luz animado */
  edge?: boolean;
  /** Barrido especular al pasar el cursor */
  sheen?: boolean;
  /** Capa de refraccion liquida detras del vidrio */
  refract?: boolean;
  hover?: boolean;
  as?: 'div' | 'article' | 'section' | 'li' | 'aside';
} & React.HTMLAttributes<HTMLElement>) {
  const { ref, onMouseMove } = useSpecular<HTMLDivElement>();

  return (
    // @ts-expect-error - Tag dinamico controlado por la union de `as`
    <Tag
      ref={ref}
      onMouseMove={onMouseMove}
      className={cx(
        'glass',
        variant && `glass--${variant}`,
        hover && 'glass-hover',
        edge && 'liquid-edge',
        sheen && 'sheen',
        refract && 'refract',
        className,
      )}
      {...rest}
    >
      {refract && <span className="refract__layer" aria-hidden="true" />}
      {sheen && <span className="sheen__bar" aria-hidden="true" />}
      {children}
    </Tag>
  );
}

/* ==========================================================================
   Botones magneticos
   ========================================================================== */

function useMagnet<T extends HTMLElement>(fuerza = 0.28) {
  const ref = useRef<T | null>(null);

  const onMouseMove = useCallback(
    (event: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      el.style.setProperty('--tx', `${dx * fuerza}px`);
      el.style.setProperty('--ty', `${dy * fuerza}px`);
    },
    [fuerza],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--tx', '0px');
    el.style.setProperty('--ty', '0px');
  }, []);

  return { ref, onMouseMove, onMouseLeave } as const;
}

type Variante = 'primary' | 'institutional' | 'ghost' | 'quiet';
type Tamano = 'sm' | 'md' | 'lg';

interface BotonBase {
  children: React.ReactNode;
  /** Segunda etiqueta que sube al hacer hover */
  swap?: boolean;
  variant?: Variante;
  size?: Tamano;
  arrow?: boolean;
  block?: boolean;
  className?: string;
}

function clasesBoton({ variant, size, block, swap, className }: BotonBase) {
  return cx(
    'btn',
    variant && `btn--${variant}`,
    size && size !== 'md' && `btn--${size}`,
    block && 'btn--block',
    swap && 'btn--swap',
    className,
  );
}

function Contenido({ children, swap, arrow }: Pick<BotonBase, 'children' | 'swap' | 'arrow'>) {
  return (
    <>
      {swap ? (
        <span className="btn__labels">
          <span>{children}</span>
          <span aria-hidden="true">{children}</span>
        </span>
      ) : (
        <span>{children}</span>
      )}
      {arrow && (
        <span className="btn__arrow" aria-hidden="true">
          &#8594;
        </span>
      )}
    </>
  );
}

export function GlassButton({
  children,
  swap = true,
  variant,
  size = 'md',
  arrow = false,
  block = false,
  className,
  ...rest
}: BotonBase & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { ref, onMouseMove, onMouseLeave } = useMagnet<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={clasesBoton({ children, variant, size, block, swap, className })}
      {...rest}
    >
      <Contenido swap={swap} arrow={arrow}>
        {children}
      </Contenido>
    </button>
  );
}

export function GlassLink({
  children,
  href,
  swap = true,
  variant,
  size = 'md',
  arrow = false,
  block = false,
  className,
  ...rest
}: BotonBase & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const { ref, onMouseMove, onMouseLeave } = useMagnet<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={clasesBoton({ children, variant, size, block, swap, className })}
      {...rest}
    >
      <Contenido swap={swap} arrow={arrow}>
        {children}
      </Contenido>
    </Link>
  );
}

/* ==========================================================================
   Tilt: inclinacion 3D suave
   ========================================================================== */

export function Tilt({
  children,
  className,
  intensidad = 6,
}: {
  children: React.ReactNode;
  className?: string;
  intensidad?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const mover = (event: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--ry', `${px * intensidad}deg`);
    el.style.setProperty('--rx', `${-py * intensidad}deg`);
  };

  const salir = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
  };

  return (
    <div ref={ref} className={cx('tilt', className)} onMouseMove={mover} onMouseLeave={salir}>
      {children}
    </div>
  );
}
