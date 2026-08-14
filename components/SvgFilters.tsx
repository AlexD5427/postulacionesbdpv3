/**
 * Filtros SVG globales usados por la capa de vidrio liquido.
 * Se inyectan una sola vez en el layout y se referencian desde CSS
 * con filter: url(#bdp-liquid).
 */
export function SvgFilters() {
  return (
    <svg aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        {/* Refraccion liquida: turbulencia + desplazamiento */}
        <filter id="bdp-liquid" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={2} seed={7} result="ruido">
            <animate
              attributeName="baseFrequency"
              dur="26s"
              values="0.012 0.02; 0.02 0.012; 0.012 0.02"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale={26} xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="1.4" />
        </filter>

        {/* Grano suave reutilizable */}
        <filter id="bdp-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={3} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>

        {/* Brillo especular para bordes de vidrio */}
        <filter id="bdp-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
