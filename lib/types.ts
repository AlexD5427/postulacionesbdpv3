/**
 * Tipos centrales de la Plataforma de Talento BDP S.A.M.
 */

export type Locale = 'es' | 'en' | 'qu' | 'ay';

/** Valor localizable. `es` es obligatorio y funciona como fallback. */
export type L<T> = { es: T } & Partial<Record<Exclude<Locale, 'es'>, T>>;

export type Modalidad = 'presencial' | 'hibrido' | 'remoto';
export type TipoConvocatoria = 'planta' | 'consultoria' | 'pasantia' | 'joven-profesional';
export type NivelEducativo = 'tecnico' | 'licenciatura' | 'maestria';
export type Seniority = 'inicial' | 'intermedio' | 'senior' | 'jefatura';

export interface Convocatoria {
  id: string;
  codigo: string;
  slug: string;
  titulo: L<string>;
  resumen: L<string>;
  descripcion: L<string[]>;
  requisitos: L<string[]>;
  beneficios: L<string[]>;
  area: string;
  ciudad: string;
  departamento: string;
  modalidad: Modalidad;
  tipo: TipoConvocatoria;
  seniority: Seniority;
  educacionMinima: NivelEducativo;
  experienciaAnios: number;
  competencias: string[];
  vacantes: number;
  salarioMin: number;
  salarioMax: number;
  publicada: string; // ISO
  cierra: string; // ISO
  destacada: boolean;
  postulantes: number;
}

export interface Pregunta {
  id: string;
  categoria: 'razonamiento' | 'financiero' | 'normativa' | 'ofimatica' | 'competencias';
  dificultad: 1 | 2 | 3;
  enunciado: L<string>;
  opciones: L<string[]>;
  correcta: number;
  explicacion: L<string>;
}

export interface Recurso {
  id: string;
  tipo: 'guia' | 'plantilla' | 'video' | 'articulo';
  tema: string;
  minutos: number;
  titulo: L<string>;
  resumen: L<string>;
}

export interface Experiencia {
  id: string;
  cargo: string;
  empresa: string;
  desde: string;
  hasta: string;
  descripcion: string;
}

export interface Educacion {
  id: string;
  titulo: string;
  institucion: string;
  nivel: NivelEducativo;
  anio: string;
}

export interface IdiomaPerfil {
  nombre: string;
  nivel: 'basico' | 'intermedio' | 'avanzado' | 'nativo';
}

export interface DocumentoPerfil {
  id: string;
  nombre: string;
  tipo: string;
  tamano: number;
  subidoEn: string;
  requerido: boolean;
  clave: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  ci: string;
  ciudad: string;
  departamento: string;
  profesion: string;
  resumen: string;
  areasInteres: string[];
  habilidades: string[];
  idiomas: IdiomaPerfil[];
  experiencia: Experiencia[];
  educacion: Educacion[];
  nivelEducativo: NivelEducativo;
  experienciaAnios: number;
  modalidadPreferida: Modalidad | 'indiferente';
  expectativaSalarial: number;
  disponibilidadInmediata: boolean;
  visibleEnBolsa: boolean;
  documentos: DocumentoPerfil[];
  creadoEn: string;
}

export interface MatchReason {
  key: string;
  detalle?: string;
  peso: number;
  cumple: boolean;
}

export interface MatchResult {
  score: number;
  razones: MatchReason[];
}

export interface AlertaGuardada {
  id: string;
  nombre: string;
  areas: string[];
  ciudades: string[];
  modalidades: Modalidad[];
  frecuencia: 'diaria' | 'semanal' | 'inmediata';
  email: string;
  creadaEn: string;
  activa: boolean;
}

export interface BusquedaGuardada {
  id: string;
  nombre: string;
  query: string;
  filtros: Record<string, string[]>;
  creadaEn: string;
}

export interface Notificacion {
  id: string;
  titulo: L<string> | string;
  cuerpo: L<string> | string;
  fecha: string;
  leida: boolean;
  tipo: 'convocatoria' | 'perfil' | 'recurso' | 'sistema';
}
