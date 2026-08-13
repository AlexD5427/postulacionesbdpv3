'use client';

import { cx } from '@/lib/utils';

/**
 * ---------------------------------------------------------------------------
 * MARCA BDP S.A.M.
 * ---------------------------------------------------------------------------
 * El SVG oficial entregado llegó como fragmento (metadatos de Inkscape y un
 * unico path de una letra), insuficiente para reconstruir el logotipo completo.
 * Se construyo entonces un emblema institucional propio que respeta el color
 * oficial #004282 y la idea de desarrollo productivo: tres barras ascendentes
 * (crecimiento) bajo un arco que evoca el vuelo del condor y el surco andino.
 *
 * Para sustituirlo por el logotipo oficial basta reemplazar el contenido de
 * <BdpMark /> con los paths reales; el resto de la interfaz no cambia.
 * Ver docs/MARCA.md.
 * ---------------------------------------------------------------------------
 */

export const BDP_AZUL = '#004282';

interface MarkProps {
  className?: string;
  /** Usa degradado institucional en lugar de color plano */
  gradient?: boolean;
  /** Color del arco superior */
  accent?: string;
  title?: string;
}

export function BdpMark({ className, gradient = true, accent = '#E0BD51', title = 'BDP S.A.M.' }: MarkProps) {
  return (
    <svg
      className={cx('bdp-mark', className)}
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bdp-mark-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0A5596" />
          <stop offset="55%" stopColor={BDP_AZUL} />
          <stop offset="100%" stopColor="#001C3D" />
        </linearGradient>
        <linearGradient id="bdp-mark-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="48%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Contenedor: cuadrado con esquinas suaves, lenguaje de vidrio */}
      <rect x="1" y="1" width="62" height="62" rx="17" fill={gradient ? 'url(#bdp-mark-bg)' : BDP_AZUL} />
      <rect x="1" y="1" width="62" height="62" rx="17" fill="url(#bdp-mark-shine)" />
      <rect
        x="1.75"
        y="1.75"
        width="60.5"
        height="60.5"
        rx="16.25"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />

      {/* Arco: condor / surco */}
      <path
        d="M13 25.5C20.5 12.5 43.5 12.5 51 22"
        fill="none"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Barras ascendentes: desarrollo productivo */}
      <rect x="16" y="38" width="8" height="12" rx="4" fill="#ffffff" fillOpacity="0.82" />
      <rect x="28" y="31" width="8" height="19" rx="4" fill="#ffffff" fillOpacity="0.92" />
      <rect x="40" y="24" width="8" height="26" rx="4" fill={accent} />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** Muestra el texto junto al emblema */
  withText?: boolean;
  tagline?: string;
  name?: string;
}

export function BdpLogo({ className, withText = true, name = 'BDP Talento', tagline }: LogoProps) {
  return (
    <span className={cx('brand', className)}>
      <BdpMark className="brand__mark" />
      {withText && (
        <span className="brand__text">
          <span className="brand__name">{name}</span>
          {tagline && <span className="brand__tag">{tagline}</span>}
        </span>
      )}
    </span>
  );
}

/** Emblema en trazo, usado por el preloader para animar el dibujado. */
export function BdpMarkOutline({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="60" height="60" rx="16.5" fill="none" stroke="#ffffff" strokeWidth="1.5" />
      <path d="M13 25.5C20.5 12.5 43.5 12.5 51 22" fill="none" stroke="#E0BD51" strokeWidth="3" strokeLinecap="round" />
      <rect x="16" y="38" width="8" height="12" rx="4" fill="none" stroke="#ffffff" strokeWidth="1.6" />
      <rect x="28" y="31" width="8" height="19" rx="4" fill="none" stroke="#ffffff" strokeWidth="1.6" />
      <rect x="40" y="24" width="8" height="26" rx="4" fill="none" stroke="#E0BD51" strokeWidth="1.6" />
    </svg>
  );
}
