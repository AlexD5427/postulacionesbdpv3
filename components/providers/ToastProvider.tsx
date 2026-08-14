'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { uid } from '@/lib/utils';

type ToastTipo = 'ok' | 'warn' | 'danger';

interface Toast {
  id: string;
  mensaje: string;
  tipo: ToastTipo;
}

interface ToastValue {
  toast: (mensaje: string, tipo?: ToastTipo) => void;
}

const ToastContext = createContext<ToastValue | null>(null);

const ICONOS: Record<ToastTipo, string> = { ok: '\u2713', warn: '!', danger: '\u00d7' };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((mensaje: string, tipo: ToastTipo = 'ok') => {
    const nuevo: Toast = { id: uid('t'), mensaje, tipo };
    setToasts((prev) => [...prev.slice(-3), nuevo]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== nuevo.id)), 4800);
  }, []);

  const value = useMemo<ToastValue>(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              className={`toast toast--${t.tipo}`}
              initial={{ opacity: 0, x: 40, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.94 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="toast__icon" aria-hidden="true">
                {ICONOS[t.tipo]}
              </span>
              <span>{t.mensaje}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}
