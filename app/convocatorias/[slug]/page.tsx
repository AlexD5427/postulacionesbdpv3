import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ConvocatoriaDetalle } from '@/components/features/ConvocatoriaDetalle';
import { CONVOCATORIAS } from '@/lib/data/convocatorias';
import { listarConvocatorias, obtenerConvocatoria } from '@/lib/data/source';

export const revalidate = 300;

export function generateStaticParams() {
  return CONVOCATORIAS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const conv = await obtenerConvocatoria(slug);
  if (!conv) return { title: 'Convocatoria' };
  return {
    title: conv.titulo.es,
    description: conv.resumen.es,
    openGraph: { title: `${conv.titulo.es} | BDP Talento`, description: conv.resumen.es },
  };
}

export default async function ConvocatoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const conv = await obtenerConvocatoria(slug);
  if (!conv) notFound();

  const todas = await listarConvocatorias();
  const similares = todas
    .filter((c) => c.slug !== conv.slug && (c.area === conv.area || c.seniority === conv.seniority))
    .slice(0, 3);

  return <ConvocatoriaDetalle conv={conv} similares={similares} />;
}
