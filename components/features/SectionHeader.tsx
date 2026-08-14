'use client';

import { Reveal, SplitLines } from '@/components/ui/motion';
import { cx } from '@/lib/utils';

/**
 * Encabezado de seccion editorial: cejilla, titulo animado por lineas y
 * bajada opcional. Unifica el ritmo tipografico de toda la pagina.
 */
export function SectionHeader({
  eyebrow,
  titleLines,
  lead,
  align = 'left',
  aside,
  className,
}: {
  eyebrow?: string;
  titleLines: React.ReactNode[];
  lead?: string;
  align?: 'left' | 'center';
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('section-head', align === 'center' && 'center', className)}>
      <div className="between" style={{ alignItems: 'flex-end' }}>
        <div style={{ maxWidth: '20ch', flex: '1 1 340px' }}>
          {eyebrow && (
            <Reveal>
              <p className="eyebrow">{eyebrow}</p>
            </Reveal>
          )}
          <h2 className="h2" style={{ marginTop: '1rem' }}>
            <SplitLines lines={titleLines} />
          </h2>
        </div>

        {(lead || aside) && (
          <div style={{ flex: '1 1 320px', maxWidth: '46ch' }}>
            {lead && (
              <Reveal delay={0.12}>
                <p className="lead">{lead}</p>
              </Reveal>
            )}
            {aside}
          </div>
        )}
      </div>
    </div>
  );
}
