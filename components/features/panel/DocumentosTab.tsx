'use client';

import { useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { GlassButton, GlassCard } from '@/components/ui/glass';
import { Reveal } from '@/components/ui/motion';
import { DOCUMENTOS_SUGERIDOS } from '@/lib/data/recursos';
import type { Usuario } from '@/lib/types';
import { formatBytes, formatDate, uid } from '@/lib/utils';

/**
 * Centro de documentos.
 * IMPORTANTE: en esta version solo se registra la ficha del archivo (nombre,
 * tipo, tamano y fecha). El contenido binario no se almacena ni se envia a
 * ningun servidor: cuando exista el bucket institucional, sustituir `subir` por
 * la carga real y guardar la URL devuelta.
 */
export function DocumentosTab({ usuario }: { usuario: Usuario }) {
  const { t, locale } = useI18n();
  const { actualizar } = useAuth();
  const { toast } = useToast();
  const input = useRef<HTMLInputElement>(null);

  const subir = (archivos: FileList | null, clave = 'otros') => {
    if (!archivos?.length) return;
    const nuevos = Array.from(archivos).map((archivo) => ({
      id: uid('doc'),
      nombre: archivo.name,
      tipo: archivo.type || 'application/octet-stream',
      tamano: archivo.size,
      subidoEn: new Date().toISOString(),
      requerido: DOCUMENTOS_SUGERIDOS.find((d) => d.clave === clave)?.requerido ?? false,
      clave,
    }));
    actualizar({ documentos: [...usuario.documentos, ...nuevos] });
    toast(`${nuevos.length} ${t('panel.tab.documentos').toLowerCase()} · ${t('common.saved')}`);
  };

  const cargados = new Set(usuario.documentos.map((d) => d.clave));

  return (
    <div className="stack gap-lg">
      <Reveal>
        <GlassCard variant="pad-lg" hover={false}>
          <div className="between">
            <div>
              <h2 className="h3">{t('panel.docs.title')}</h2>
              <p className="muted" style={{ fontSize: 'var(--fs-sm)' }}>
                {t('panel.docs.body')}
              </p>
            </div>
            <GlassButton variant="primary" swap={false} onClick={() => input.current?.click()}>
              + {t('panel.docs.upload')}
            </GlassButton>
          </div>

          <input
            ref={input}
            type="file"
            multiple
            className="sr-only"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => {
              subir(e.target.files);
              e.target.value = '';
            }}
            aria-label={t('panel.docs.upload')}
          />

          {/* Lista de verificacion de respaldos sugeridos */}
          <div className="mt-md">
            <p className="field__label">{t('panel.docs.checklist')}</p>
            <ul className="stack gap-xs mt-sm">
              {DOCUMENTOS_SUGERIDOS.map((doc) => (
                <li className="list-row" key={doc.clave}>
                  <span
                    aria-hidden="true"
                    style={{ color: cargados.has(doc.clave) ? 'var(--ok)' : 'var(--fg-faint)', fontWeight: 700 }}
                  >
                    {cargados.has(doc.clave) ? '\u2713' : '\u25cb'}
                  </span>
                  <div className="list-row__main">
                    <p className="list-row__title">{doc.nombre}</p>
                    {doc.requerido && <p className="list-row__sub">{t('panel.docs.required')}</p>}
                  </div>
                  <label className="btn btn--sm btn--ghost" style={{ cursor: 'pointer' }}>
                    <span>{t('common.add')}</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => {
                        subir(e.target.files, doc.clave);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </Reveal>

      <div>
        <h3 className="h4">{t('panel.tile.docs')}</h3>
        {usuario.documentos.length === 0 ? (
          <div className="empty mt-sm">
            <p>{t('panel.docs.empty')}</p>
          </div>
        ) : (
          <ul className="stack gap-xs mt-sm">
            {usuario.documentos.map((doc) => (
              <li className="list-row" key={doc.id}>
                <span className="badge badge--neutral">{doc.nombre.split('.').pop()?.toUpperCase()}</span>
                <div className="list-row__main">
                  <p className="list-row__title">{doc.nombre}</p>
                  <p className="list-row__sub">
                    {formatBytes(doc.tamano)} · {formatDate(doc.subidoEn, locale, { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <GlassButton
                  variant="quiet"
                  size="sm"
                  swap={false}
                  onClick={() => actualizar({ documentos: usuario.documentos.filter((d) => d.id !== doc.id) })}
                >
                  {t('common.remove')}
                </GlassButton>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
