import type { L, Locale } from './types';

/** Une clases condicionalmente sin dependencias externas. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** Resuelve un valor localizable con fallback a espanol. */
export function pick<T>(value: L<T> | undefined, locale: Locale): T | undefined {
  if (!value) return undefined;
  const direct = value[locale as Exclude<Locale, 'es'>] as T | undefined;
  return (locale === 'es' ? value.es : direct) ?? value.es;
}

export function pickText(value: L<string> | undefined, locale: Locale): string {
  return pick(value, locale) ?? '';
}

export function pickList(value: L<string[]> | undefined, locale: Locale): string[] {
  return pick(value, locale) ?? [];
}

const BCP47: Record<Locale, string> = {
  es: 'es-BO',
  en: 'en-US',
  qu: 'qu-BO',
  ay: 'ay-BO',
};

export function bcp47(locale: Locale): string {
  return BCP47[locale] ?? 'es-BO';
}

/**
 * Formatea fechas. Quechua y Aymara no tienen datos de Intl garantizados,
 * por eso caen a es-BO para el formato numerico pero conservan su idioma en la UI.
 */
export function formatDate(iso: string, locale: Locale, opts?: Intl.DateTimeFormatOptions): string {
  const intlLocale = locale === 'en' ? 'en-US' : 'es-BO';
  try {
    return new Intl.DateTimeFormat(intlLocale, opts ?? { day: '2-digit', month: 'long', year: 'numeric' }).format(
      new Date(iso),
    );
  } catch {
    return iso.slice(0, 10);
  }
}

export function formatBob(value: number, locale: Locale): string {
  const intlLocale = locale === 'en' ? 'en-US' : 'es-BO';
  try {
    return new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: 'BOB',
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `Bs ${Math.round(value).toLocaleString('es-BO')}`;
  }
}

export function daysUntil(iso: string, from: Date = new Date()): number {
  const target = new Date(iso).getTime();
  const base = new Date(from.toDateString()).getTime();
  return Math.ceil((target - base) / 86_400_000);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function initials(nombre: string, apellido?: string): string {
  const a = (nombre || '').trim().charAt(0);
  const b = (apellido || '').trim().charAt(0);
  return (a + b).toUpperCase() || 'BDP';
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Genera un archivo .ics para agregar una fecha clave al calendario. */
export function buildIcs(input: { titulo: string; descripcion: string; fechaIso: string; url?: string }): string {
  const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const start = new Date(input.fechaIso);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BDP SAM//Talento//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid('bdp')}@bdp.com.bo`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${input.titulo.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${input.descripcion.replace(/\n/g, ' ')}`,
    input.url ? `URL:${input.url}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}

export function downloadTextFile(filename: string, content: string, mime = 'text/plain;charset=utf-8'): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 KB';
  const kb = bytes / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
}
