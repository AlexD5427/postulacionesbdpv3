'use client';

import { useA11y } from '@/components/providers/A11yProvider';
import { cx } from '@/lib/utils';

/* ==========================================================================
   Aurora: manchas de luz a la deriva
   ========================================================================== */

export function Aurora({ className, blobs = 3 }: { className?: string; blobs?: 2 | 3 }) {
  const { settings } = useA11y();
  const estado = settings.fondosPausados ? ('paused' as const) : ('running' as const);

  return (
    <div className={cx('decor', className)} aria-hidden="true">
      <div className="aurora">
        <span className="aurora__blob aurora__blob--a" style={{ animationPlayState: estado }} />
        <span className="aurora__blob aurora__blob--b" style={{ animationPlayState: estado }} />
        {blobs === 3 && <span className="aurora__blob aurora__blob--c" style={{ animationPlayState: estado }} />}
      </div>
    </div>
  );
}

export function GrainOverlay() {
  const { settings } = useA11y();
  return (
    <div
      className="grain"
      aria-hidden="true"
      style={{ animationPlayState: settings.fondosPausados ? 'paused' : 'running' }}
    />
  );
}

export function MeshGrid({ className }: { className?: string }) {
  return <div className={cx('mesh', className)} aria-hidden="true" />;
}

export function AndeanPattern({ className }: { className?: string }) {
  return <div className={cx('andean', className)} aria-hidden="true" />;
}

export function Caustics({ className }: { className?: string }) {
  const { settings } = useA11y();
  return (
    <div
      className={cx('caustics', className)}
      aria-hidden="true"
      style={{ animationPlayState: settings.fondosPausados ? 'paused' : 'running' }}
    />
  );
}

export function Vignette() {
  return <div className="vignette" aria-hidden="true" />;
}

/* ==========================================================================
   ArtPanel: arte generativo en SVG
   --------------------------------------------------------------------------
   Sustituye la fotografia mientras el banco no aporte material propio.
   Si se pasa `src`, se muestra la imagen real y el SVG queda como respaldo.
   ========================================================================== */

export type ArtVariante = 'andes' | 'agro' | 'ciudad' | 'cadena' | 'vidrio';

interface ArtPanelProps {
  variante?: ArtVariante;
  label?: string;
  className?: string;
  forma?: 'tall' | 'wide' | 'square';
  src?: string;
  alt?: string;
}

export function ArtPanel({ variante = 'andes', label, className, forma = 'wide', src, alt }: ArtPanelProps) {
  return (
    <div className={cx('artframe', `artframe--${forma}`, className)}>
      {src ? (
        <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" />
      ) : (
        <ArtSvg variante={variante} />
      )}
      <Caustics />
      {label && <span className="artframe__label">{label}</span>}
    </div>
  );
}

function ArtSvg({ variante }: { variante: ArtVariante }) {
  return (
    <svg
      className="artframe__svg"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`cielo-${variante}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A5596" />
          <stop offset="55%" stopColor="#002D5E" />
          <stop offset="100%" stopColor="#050B16" />
        </linearGradient>
        <linearGradient id={`oro-${variante}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4E3AC" />
          <stop offset="100%" stopColor="#C9A227" />
        </linearGradient>
        <radialGradient id={`sol-${variante}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#F4E3AC" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#C9A227" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#cielo-${variante})`} />
      <circle cx="300" cy="78" r="70" fill={`url(#sol-${variante})`} />

      {variante === 'andes' && (
        <g>
          <path d="M0 230 L70 150 L120 195 L190 110 L260 200 L320 160 L400 235 L400 300 L0 300Z" fill="#001C3D" opacity="0.92" />
          <path d="M0 258 L90 196 L150 235 L230 170 L300 230 L400 190 L400 300 L0 300Z" fill="#03070F" opacity="0.9" />
          <path d="M190 110 L205 126 L190 134 L176 124Z" fill="#F4E3AC" opacity="0.85" />
          <g stroke="#8DC0EE" strokeWidth="0.6" opacity="0.35">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={0} y1={40 + i * 8} x2={400} y2={26 + i * 8} />
            ))}
          </g>
        </g>
      )}

      {variante === 'agro' && (
        <g>
          <path d="M0 210 Q100 180 200 208 T400 200 L400 300 L0 300Z" fill="#14785C" opacity="0.55" />
          <path d="M0 240 Q120 214 240 244 T400 236 L400 300 L0 300Z" fill="#001C3D" opacity="0.85" />
          <g stroke={`url(#oro-${variante})`} strokeWidth="1.4" opacity="0.8">
            {Array.from({ length: 16 }).map((_, i) => (
              <path key={i} d={`M${12 + i * 25} 300 C${16 + i * 25} 262 ${8 + i * 25} 248 ${14 + i * 25} 226`} fill="none" />
            ))}
          </g>
        </g>
      )}

      {variante === 'ciudad' && (
        <g>
          {Array.from({ length: 14 }).map((_, i) => {
            const h = 60 + ((i * 37) % 120);
            return (
              <g key={i}>
                <rect x={8 + i * 28} y={300 - h} width={20} height={h} fill="#001C3D" opacity="0.94" />
                {Array.from({ length: Math.floor(h / 22) }).map((__, j) => (
                  <rect key={j} x={12 + i * 28} y={300 - h + 8 + j * 22} width={5} height={5} fill="#F4E3AC" opacity={0.5} />
                ))}
              </g>
            );
          })}
        </g>
      )}

      {variante === 'cadena' && (
        <g fill="none" stroke="#8DC0EE" strokeWidth="1.2" opacity="0.7">
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i}>
              <circle cx={50 + i * 60} cy={150 + (i % 2 === 0 ? -28 : 28)} r={22} />
              <line x1={72 + i * 60} y1={150 + (i % 2 === 0 ? -28 : 28)} x2={88 + i * 60} y2={150 + (i % 2 === 0 ? 28 : -28)} />
            </g>
          ))}
          <circle cx={50} cy={122} r={30} stroke="#C9A227" opacity="0.9" />
        </g>
      )}

      {variante === 'vidrio' && (
        <g>
          <rect x="40" y="60" width="150" height="190" rx="22" fill="#ffffff" opacity="0.08" />
          <rect x="40" y="60" width="150" height="190" rx="22" fill="none" stroke="#ffffff" strokeOpacity="0.28" />
          <rect x="120" y="110" width="210" height="140" rx="22" fill="#ffffff" opacity="0.06" />
          <rect x="120" y="110" width="210" height="140" rx="22" fill="none" stroke="#C9A227" strokeOpacity="0.45" />
          <path d="M60 250 Q160 190 340 220" stroke="#8DC0EE" strokeWidth="1.2" fill="none" opacity="0.6" />
        </g>
      )}

      {/* Trama andina superpuesta, comun a todas las variantes */}
      <g stroke="#C9A227" strokeWidth="0.9" opacity="0.22" fill="none">
        <path d="M0 288 L20 272 L40 288 L60 272 L80 288 L100 272 L120 288 L140 272 L160 288 L180 272 L200 288 L220 272 L240 288 L260 272 L280 288 L300 272 L320 288 L340 272 L360 288 L380 272 L400 288" />
      </g>
    </svg>
  );
}
