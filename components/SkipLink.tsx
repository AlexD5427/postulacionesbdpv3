'use client';

import { useI18n } from '@/components/providers/I18nProvider';

/** Primer elemento enfocable de la pagina: salta directo al contenido. */
export function SkipLink() {
  const { t } = useI18n();
  return (
    <a href="#contenido" className="skip-link">
      {t('nav.skip')}
    </a>
  );
}
