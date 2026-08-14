import type { Metadata } from 'next';
import { CvGenerator } from '@/components/features/panel/CvGenerator';

export const metadata: Metadata = {
  title: 'Hoja de vida',
  description: 'Genera tu hoja de vida institucional a partir de tu perfil de BDP Talento.',
  robots: { index: false, follow: false },
};

export default function CvPage() {
  return <CvGenerator />;
}
