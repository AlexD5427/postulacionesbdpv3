import type { Locale } from '../types';

export const LOCALES: Locale[] = ['es', 'en', 'qu', 'ay'];

export const DEFAULT_LOCALE: Locale = 'es';

export interface LocaleMeta {
  code: Locale;
  /** Nombre en su propio idioma */
  endonimo: string;
  /** Nombre en espanol, para lectores de pantalla */
  nombre: string;
  corto: string;
  bcp47: string;
  /** Idioma usado para voz cuando el motor TTS no tiene la lengua nativa */
  ttsFallback: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  es: {
    code: 'es',
    endonimo: 'Espanol (Latinoamerica)',
    nombre: 'Espanol latinoamericano',
    corto: 'ES',
    bcp47: 'es-BO',
    ttsFallback: 'es-BO',
  },
  en: {
    code: 'en',
    endonimo: 'English',
    nombre: 'Ingles',
    corto: 'EN',
    bcp47: 'en-US',
    ttsFallback: 'en-US',
  },
  qu: {
    code: 'qu',
    endonimo: 'Runa simi (Quechua)',
    nombre: 'Quechua',
    corto: 'QU',
    bcp47: 'qu-BO',
    // La mayoria de motores de voz no traen quechua: leemos con fonetica espanola.
    ttsFallback: 'es-BO',
  },
  ay: {
    code: 'ay',
    endonimo: 'Aymar aru (Aymara)',
    nombre: 'Aymara',
    corto: 'AY',
    bcp47: 'ay-BO',
    ttsFallback: 'es-BO',
  },
};

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as string[]).includes(value);
}
