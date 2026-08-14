import type { Metadata } from 'next';
import { ConvocatoriasExplorer } from '@/components/features/ConvocatoriasExplorer';
import { listarConvocatorias } from '@/lib/data/source';

export const metadata: Metadata = {
  title: 'Convocatorias vigentes',
  description:
    'Convocatorias vigentes del Banco de Desarrollo Productivo S.A.M. Filtra por area, ciudad, modalidad y nivel, y postula con tu perfil unico.',
};

// Se revalida cada 5 minutos para reflejar cambios de la base institucional.
export const revalidate = 300;

export default async function ConvocatoriasPage() {
  // La lista se resuelve en el servidor (semilla o base institucional) y viaja
  // como prop: el cliente solo filtra y ordena.
  const convocatorias = await listarConvocatorias();
  return <ConvocatoriasExplorer convocatorias={convocatorias} />;
}
