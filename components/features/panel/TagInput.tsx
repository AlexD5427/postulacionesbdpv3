'use client';

import { useState } from 'react';
import { useI18n } from '@/components/providers/I18nProvider';

/**
 * Entrada de etiquetas: escribir y presionar Enter agrega, Retroceso elimina la
 * ultima cuando el campo esta vacio. Anuncia los cambios a lectores de pantalla.
 */
export function TagInput({
  label,
  hint,
  valores,
  onChange,
  sugerencias = [],
}: {
  label: string;
  hint?: string;
  valores: string[];
  onChange: (valores: string[]) => void;
  sugerencias?: string[];
}) {
  const { t } = useI18n();
  const [borrador, setBorrador] = useState('');

  const agregar = (valor: string) => {
    const limpio = valor.trim();
    if (!limpio) return;
    if (valores.some((v) => v.toLowerCase() === limpio.toLowerCase())) return;
    onChange([...valores, limpio]);
    setBorrador('');
  };

  const disponibles = sugerencias.filter((s) => !valores.some((v) => v.toLowerCase() === s.toLowerCase()));

  return (
    <div className="field">
      <span className="field__label">{label}</span>

      <div className="row gap-xs" role="list" aria-live="polite">
        {valores.map((valor) => (
          <span className="chip chip--active" key={valor} role="listitem">
            {valor}
            <button
              type="button"
              onClick={() => onChange(valores.filter((v) => v !== valor))}
              aria-label={`${t('common.remove')}: ${valor}`}
            >
              &#10005;
            </button>
          </span>
        ))}
      </div>

      <input
        className="input"
        value={borrador}
        onChange={(e) => setBorrador(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            agregar(borrador);
          }
          if (e.key === 'Backspace' && !borrador && valores.length) {
            onChange(valores.slice(0, -1));
          }
        }}
        placeholder={hint}
        aria-label={label}
      />
      {hint && <span className="field__hint">{hint}</span>}

      {disponibles.length > 0 && (
        <div className="row gap-xs" style={{ marginTop: '0.4rem' }}>
          {disponibles.slice(0, 8).map((s) => (
            <button type="button" className="chip" key={s} onClick={() => agregar(s)}>
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
