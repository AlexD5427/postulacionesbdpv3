import type { Pregunta } from '../types';

/**
 * Banco de preguntas del simulador de evaluaciones.
 * Contenido de practica de elaboracion propia: no reproduce examenes oficiales.
 */
export const PREGUNTAS: Pregunta[] = [
  {
    id: 'p-01',
    categoria: 'financiero',
    dificultad: 1,
    enunciado: {
      es: 'Un productor solicita Bs 120.000 a 4 anos con cuota fija anual y tasa del 8%. Que concepto explica que la primera cuota tenga mas interes que capital?',
      en: 'A producer requests BOB 120,000 over 4 years with a fixed annual payment at 8%. Which concept explains why the first payment carries more interest than principal?',
    },
    opciones: {
      es: ['Amortizacion decreciente del capital', 'Sistema de amortizacion frances', 'Capitalizacion continua', 'Tasa nominal anual'],
      en: ['Decreasing principal amortization', 'French amortization system', 'Continuous compounding', 'Nominal annual rate'],
    },
    correcta: 1,
    explicacion: {
      es: 'En el sistema frances la cuota es constante: al inicio el saldo es mayor, por lo que el componente de interes es mas alto y el de capital menor.',
      en: 'In the French system the installment is constant: at the beginning the outstanding balance is larger, so the interest share is higher and the principal share lower.',
    },
  },
  {
    id: 'p-02',
    categoria: 'financiero',
    dificultad: 2,
    enunciado: {
      es: 'Una unidad productiva tiene activo corriente de Bs 480.000 y pasivo corriente de Bs 300.000. Cual es su razon corriente?',
      en: 'A productive unit has current assets of BOB 480,000 and current liabilities of BOB 300,000. What is its current ratio?',
    },
    opciones: { es: ['0,63', '1,60', '1,80', '2,40'], en: ['0.63', '1.60', '1.80', '2.40'] },
    correcta: 1,
    explicacion: {
      es: 'Razon corriente = activo corriente / pasivo corriente = 480.000 / 300.000 = 1,60.',
      en: 'Current ratio = current assets / current liabilities = 480,000 / 300,000 = 1.60.',
    },
  },
  {
    id: 'p-03',
    categoria: 'razonamiento',
    dificultad: 1,
    enunciado: {
      es: 'Serie: 3, 6, 12, 24, ... Cual es el siguiente termino?',
      en: 'Series: 3, 6, 12, 24, ... What is the next term?',
    },
    opciones: { es: ['30', '36', '48', '60'], en: ['30', '36', '48', '60'] },
    correcta: 2,
    explicacion: {
      es: 'Cada termino se duplica: 24 x 2 = 48.',
      en: 'Each term doubles: 24 x 2 = 48.',
    },
  },
  {
    id: 'p-04',
    categoria: 'razonamiento',
    dificultad: 2,
    enunciado: {
      es: 'Si todas las cooperativas del programa recibieron asistencia tecnica y algunas ademas recibieron credito, que se puede afirmar con certeza?',
      en: 'If every cooperative in the program received technical assistance and some also received credit, what can be stated with certainty?',
    },
    opciones: {
      es: [
        'Todas las cooperativas con credito recibieron asistencia tecnica',
        'Ninguna cooperativa sin credito recibio asistencia',
        'Todas las cooperativas recibieron credito',
        'La asistencia tecnica depende del credito',
      ],
      en: [
        'Every cooperative with credit received technical assistance',
        'No cooperative without credit received assistance',
        'Every cooperative received credit',
        'Technical assistance depends on credit',
      ],
    },
    correcta: 0,
    explicacion: {
      es: 'Si el universo completo recibio asistencia, cualquier subconjunto (las que tienen credito) tambien la recibio.',
      en: 'If the whole set received assistance, any subset (those with credit) received it as well.',
    },
  },
  {
    id: 'p-05',
    categoria: 'normativa',
    dificultad: 2,
    enunciado: {
      es: 'Cual es el organismo que regula y supervisa a las entidades de intermediacion financiera en Bolivia?',
      en: 'Which body regulates and supervises financial intermediation entities in Bolivia?',
    },
    opciones: { es: ['ASFI', 'INE', 'AITB', 'SENASAG'], en: ['ASFI', 'INE', 'AITB', 'SENASAG'] },
    correcta: 0,
    explicacion: {
      es: 'La Autoridad de Supervision del Sistema Financiero (ASFI) regula y supervisa el sistema financiero boliviano.',
      en: 'The Financial System Supervision Authority (ASFI) regulates and supervises the Bolivian financial system.',
    },
  },
  {
    id: 'p-06',
    categoria: 'normativa',
    dificultad: 3,
    enunciado: {
      es: 'En la gestion de riesgo de cumplimiento, que significa aplicar el enfoque basado en riesgo al conocer al cliente?',
      en: 'In compliance risk management, what does applying a risk based approach to know your customer mean?',
    },
    opciones: {
      es: [
        'Solicitar la misma documentacion a todos los clientes',
        'Graduar la debida diligencia segun el nivel de riesgo del cliente',
        'Rechazar clientes de sectores rurales',
        'Delegar la verificacion al area comercial',
      ],
      en: [
        'Requesting the same documents from every client',
        'Scaling due diligence according to the client risk level',
        'Rejecting clients from rural sectors',
        'Delegating verification to the commercial area',
      ],
    },
    correcta: 1,
    explicacion: {
      es: 'El enfoque basado en riesgo exige intensificar la debida diligencia donde el riesgo es mayor y simplificarla donde es menor, sin excluir sectores.',
      en: 'A risk based approach requires enhanced due diligence where risk is higher and simplified due diligence where it is lower, without excluding sectors.',
    },
  },
  {
    id: 'p-07',
    categoria: 'ofimatica',
    dificultad: 1,
    enunciado: {
      es: 'Que funcion de hoja de calculo permite traer un dato de otra tabla usando una clave comun?',
      en: 'Which spreadsheet function retrieves data from another table using a common key?',
    },
    opciones: { es: ['CONTAR.SI', 'BUSCARV o CONSULTAV', 'CONCATENAR', 'PROMEDIO'], en: ['COUNTIF', 'VLOOKUP or XLOOKUP', 'CONCATENATE', 'AVERAGE'] },
    correcta: 1,
    explicacion: {
      es: 'BUSCARV (o su version moderna CONSULTAV/XLOOKUP) busca un valor clave y devuelve el dato asociado.',
      en: 'VLOOKUP (or the modern XLOOKUP) searches a key value and returns the associated data.',
    },
  },
  {
    id: 'p-08',
    categoria: 'ofimatica',
    dificultad: 2,
    enunciado: {
      es: 'Necesitas un reporte que se actualice al cambiar los datos de origen y permita agrupar por agencia y mes. Cual es la herramienta adecuada?',
      en: 'You need a report that refreshes when source data changes and groups by branch and month. Which is the right tool?',
    },
    opciones: {
      es: ['Tabla dinamica', 'Formato condicional', 'Validacion de datos', 'Comentarios de celda'],
      en: ['Pivot table', 'Conditional formatting', 'Data validation', 'Cell comments'],
    },
    correcta: 0,
    explicacion: {
      es: 'La tabla dinamica resume, agrupa y se actualiza con los datos de origen.',
      en: 'A pivot table summarizes, groups and refreshes with the source data.',
    },
  },
  {
    id: 'p-09',
    categoria: 'competencias',
    dificultad: 2,
    enunciado: {
      es: 'Un cliente productivo llega molesto porque su tramite se retraso por un documento faltante. Cual es la mejor primera accion?',
      en: 'A productive client arrives upset because their process was delayed by a missing document. What is the best first action?',
    },
    opciones: {
      es: [
        'Explicar que el reglamento no admite excepciones',
        'Escuchar, confirmar el estado real del tramite y ofrecer un plan concreto',
        'Derivarlo de inmediato a otra ventanilla',
        'Pedirle que presente un reclamo escrito',
      ],
      en: [
        'Explain that the rules allow no exceptions',
        'Listen, confirm the actual status and offer a concrete plan',
        'Immediately redirect them to another desk',
        'Ask them to file a written complaint',
      ],
    },
    correcta: 1,
    explicacion: {
      es: 'La escucha activa mas informacion verificada y un compromiso concreto resuelve el problema y protege la relacion con el cliente.',
      en: 'Active listening plus verified information and a concrete commitment solves the problem and protects the client relationship.',
    },
  },
  {
    id: 'p-10',
    categoria: 'competencias',
    dificultad: 1,
    enunciado: {
      es: 'Trabajas en una agencia donde varios clientes hablan aymara y tu no. Que actitud refleja mejor el servicio publico?',
      en: 'You work at a branch where several clients speak Aymara and you do not. Which attitude best reflects public service?',
    },
    opciones: {
      es: [
        'Pedirles que vengan acompanados de un traductor',
        'Atender solo en espanol por eficiencia',
        'Usar los materiales en aymara disponibles y coordinar apoyo de un colega bilingue',
        'Derivar todos los casos a otra agencia',
      ],
      en: [
        'Ask them to come with a translator',
        'Serve only in Spanish for efficiency',
        'Use available Aymara materials and coordinate support from a bilingual colleague',
        'Redirect every case to another branch',
      ],
    },
    correcta: 2,
    explicacion: {
      es: 'El servicio publico debe adaptarse al usuario: usar recursos disponibles y apoyo bilingue garantiza el acceso sin trasladar la carga al cliente.',
      en: 'Public service must adapt to the user: using available resources and bilingual support guarantees access without shifting the burden to the client.',
    },
  },
  {
    id: 'p-11',
    categoria: 'financiero',
    dificultad: 3,
    enunciado: {
      es: 'Una cartera crece 20% y la mora pasa de 2,0% a 2,4%. Que puede concluirse con la informacion disponible?',
      en: 'A portfolio grows 20% and delinquency moves from 2.0% to 2.4%. What can be concluded with the available data?',
    },
    opciones: {
      es: [
        'La cartera en mora crecio mas rapido que la cartera total',
        'La cartera en mora se mantuvo igual',
        'La colocacion fue irresponsable',
        'El indicador mejoro en terminos absolutos',
      ],
      en: [
        'Non performing loans grew faster than the total portfolio',
        'Non performing loans stayed the same',
        'Lending was irresponsible',
        'The indicator improved in absolute terms',
      ],
    },
    correcta: 0,
    explicacion: {
      es: 'Si el ratio sube mientras el denominador crece 20%, el numerador (mora) crecio en mayor proporcion. Juzgar la calidad de colocacion requiere mas informacion.',
      en: 'If the ratio rises while the denominator grows 20%, the numerator grew proportionally more. Judging lending quality requires more information.',
    },
  },
  {
    id: 'p-12',
    categoria: 'razonamiento',
    dificultad: 3,
    enunciado: {
      es: 'Cuatro agencias colocaron: A el doble que B, C la mitad que A y D tanto como B y C juntas. Si B coloco 40, cuanto coloco D?',
      en: 'Four branches lent: A twice B, C half of A, and D as much as B and C together. If B lent 40, how much did D lend?',
    },
    opciones: { es: ['60', '80', '100', '120'], en: ['60', '80', '100', '120'] },
    correcta: 1,
    explicacion: {
      es: 'B = 40, A = 80, C = 40, D = B + C = 80.',
      en: 'B = 40, A = 80, C = 40, D = B + C = 80.',
    },
  },
];

export const CATEGORIAS_QUIZ = ['razonamiento', 'financiero', 'normativa', 'ofimatica', 'competencias'] as const;

export function preguntasPorCategoria(categoria: string | 'todas'): Pregunta[] {
  if (categoria === 'todas') return PREGUNTAS;
  return PREGUNTAS.filter((p) => p.categoria === categoria);
}
