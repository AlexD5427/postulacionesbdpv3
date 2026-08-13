import type { Recurso } from '../types';

export const RECURSOS: Recurso[] = [
  {
    id: 'r-01',
    tipo: 'guia',
    tema: 'Postulacion',
    minutos: 6,
    titulo: { es: 'Como armar una hoja de vida para la banca publica', en: 'How to build a resume for public banking' },
    resumen: {
      es: 'Estructura, extension y evidencia: que revisa realmente un evaluador en los primeros 30 segundos.',
      en: 'Structure, length and evidence: what an evaluator really checks in the first 30 seconds.',
    },
  },
  {
    id: 'r-02',
    tipo: 'plantilla',
    tema: 'Postulacion',
    minutos: 3,
    titulo: { es: 'Plantilla de carta de presentacion', en: 'Cover letter template' },
    resumen: {
      es: 'Cuatro parrafos, un objetivo: conectar tu experiencia con el proposito productivo del banco.',
      en: 'Four paragraphs, one goal: connect your experience with the bank productive purpose.',
    },
  },
  {
    id: 'r-03',
    tipo: 'guia',
    tema: 'Evaluaciones',
    minutos: 8,
    titulo: { es: 'Que se evalua en una prueba de razonamiento', en: 'What a reasoning test measures' },
    resumen: {
      es: 'Tipos de items, manejo del tiempo y errores frecuentes que cuestan puntos evitables.',
      en: 'Item types, time management and frequent mistakes that cost avoidable points.',
    },
  },
  {
    id: 'r-04',
    tipo: 'articulo',
    tema: 'Banca de desarrollo',
    minutos: 7,
    titulo: { es: 'Que hace distinta a la banca de desarrollo', en: 'What makes development banking different' },
    resumen: {
      es: 'Mandato, sectores priorizados y por que el indicador clave no es solo la rentabilidad.',
      en: 'Mandate, priority sectors and why the key metric is not profitability alone.',
    },
  },
  {
    id: 'r-05',
    tipo: 'guia',
    tema: 'Entrevistas',
    minutos: 9,
    titulo: { es: 'Entrevista por competencias: metodo STAR', en: 'Competency interview: the STAR method' },
    resumen: {
      es: 'Situacion, tarea, accion y resultado. Como responder con evidencia y sin relleno.',
      en: 'Situation, task, action and result. How to answer with evidence and no filler.',
    },
  },
  {
    id: 'r-06',
    tipo: 'video',
    tema: 'Banca de desarrollo',
    minutos: 12,
    titulo: { es: 'Cadenas productivas priorizadas en Bolivia', en: 'Priority productive chains in Bolivia' },
    resumen: {
      es: 'Recorrido por los sectores que concentran el financiamiento productivo y su logica territorial.',
      en: 'A tour of the sectors concentrating productive financing and their territorial logic.',
    },
  },
  {
    id: 'r-07',
    tipo: 'plantilla',
    tema: 'Evaluaciones',
    minutos: 4,
    titulo: { es: 'Checklist de documentos de respaldo', en: 'Supporting documents checklist' },
    resumen: {
      es: 'Todo lo que conviene tener digitalizado antes de que se abra la convocatoria que esperas.',
      en: 'Everything worth having digitized before the opening you want goes live.',
    },
  },
  {
    id: 'r-08',
    tipo: 'articulo',
    tema: 'Postulacion',
    minutos: 5,
    titulo: { es: 'Errores que descartan una postulacion', en: 'Mistakes that disqualify an application' },
    resumen: {
      es: 'Requisitos excluyentes, documentos vencidos y datos inconsistentes: como evitarlos.',
      en: 'Excluding requirements, expired documents and inconsistent data: how to avoid them.',
    },
  },
  {
    id: 'r-09',
    tipo: 'guia',
    tema: 'Accesibilidad',
    minutos: 5,
    titulo: { es: 'Usa la plataforma con lector de voz y teclado', en: 'Use the platform with voice reader and keyboard' },
    resumen: {
      es: 'Atajos, lectura por voz y paletas de color: la plataforma se adapta a como lees.',
      en: 'Shortcuts, text to speech and color palettes: the platform adapts to how you read.',
    },
  },
];

export const TEMAS_RECURSOS = Array.from(new Set(RECURSOS.map((r) => r.tema))).sort();

export const DOCUMENTOS_SUGERIDOS = [
  { clave: 'ci', nombre: 'Cedula de identidad vigente', requerido: true },
  { clave: 'titulo', nombre: 'Titulo academico o certificado de egreso', requerido: true },
  { clave: 'cv', nombre: 'Hoja de vida actualizada', requerido: true },
  { clave: 'certificados', nombre: 'Certificados de trabajo', requerido: false },
  { clave: 'cursos', nombre: 'Cursos y capacitaciones', requerido: false },
  { clave: 'ruat', nombre: 'Certificado de no antecedentes', requerido: false },
];
