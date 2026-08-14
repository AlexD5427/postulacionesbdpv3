import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PanelClient } from '@/components/features/panel/PanelClient';
import { CONVOCATORIAS } from '@/lib/data/convocatorias';

export const metadata: Metadata = {
  title: 'Mi panel',
  description: 'Tu espacio de talento en el BDP: perfil, convocatorias guardadas, alertas, documentos y agenda.',
  robots: { index: false, follow: false },
};

export default function PanelPage() {
  return (
    <Suspense fallback={<div className="section" aria-busy="true" />}>
      <PanelClient convocatorias={CONVOCATORIAS} />
    </Suspense>
  );
}
