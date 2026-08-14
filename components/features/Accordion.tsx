'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState } from 'react';

export interface AccordionItem {
  q: string;
  a: string;
}

/**
 * Acordeon accesible: un solo panel abierto, control por teclado nativo
 * (boton + aria-expanded + aria-controls) y animacion de altura fluida.
 */
export function Accordion({ items, inicial = 0 }: { items: AccordionItem[]; inicial?: number | null }) {
  const [abierto, setAbierto] = useState<number | null>(inicial);
  const baseId = useId();

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const activo = abierto === i;
        return (
          <div className="accordion__item" key={item.q} data-open={activo ? 'true' : 'false'}>
            <h3>
              <button
                type="button"
                className="accordion__trigger"
                aria-expanded={activo}
                aria-controls={`${baseId}-panel-${i}`}
                id={`${baseId}-trigger-${i}`}
                onClick={() => setAbierto(activo ? null : i)}
              >
                <span>{item.q}</span>
                <span className="accordion__icon" aria-hidden="true" />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {activo && (
                <motion.div
                  className="accordion__panel"
                  id={`${baseId}-panel-${i}`}
                  role="region"
                  aria-labelledby={`${baseId}-trigger-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="accordion__content">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
