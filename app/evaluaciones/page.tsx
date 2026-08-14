import type { Metadata } from 'next';
import { QuizSimulator } from '@/components/features/QuizSimulator';

export const metadata: Metadata = {
  title: 'Simulador de evaluaciones',
  description:
    'Practica con el banco de preguntas de razonamiento, financiero, normativa, ofimatica y competencias antes de tu evaluacion en el BDP.',
};

export default function EvaluacionesPage() {
  return <QuizSimulator />;
}
