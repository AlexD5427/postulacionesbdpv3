import type { Convocatoria } from '../types';
import { CONVOCATORIAS } from './convocatorias';

/**
 * ---------------------------------------------------------------------------
 * ADAPTADOR DE FUENTE DE DATOS
 * ---------------------------------------------------------------------------
 * La interfaz nunca importa la base de datos directamente: siempre pasa por
 * aqui. Para conectar la base institucional basta implementar el caso
 * correspondiente y definir las variables de entorno de .env.example.
 *
 *   DATA_SOURCE=seed      -> datos semilla del repositorio (por defecto)
 *   DATA_SOURCE=http      -> API REST institucional (CONVOCATORIAS_API_URL)
 *   DATA_SOURCE=postgres  -> conexion directa (DATABASE_URL) [pendiente]
 * ---------------------------------------------------------------------------
 */

export type DataSourceKind = 'seed' | 'http' | 'postgres';

export function currentSource(): DataSourceKind {
  const raw = (process.env.DATA_SOURCE || 'seed').toLowerCase();
  return raw === 'http' || raw === 'postgres' ? raw : 'seed';
}

async function fetchHttp(): Promise<Convocatoria[]> {
  const url = process.env.CONVOCATORIAS_API_URL;
  if (!url) return CONVOCATORIAS;
  try {
    const res = await fetch(url, {
      headers: process.env.CONVOCATORIAS_API_TOKEN
        ? { Authorization: `Bearer ${process.env.CONVOCATORIAS_API_TOKEN}` }
        : undefined,
      // Se revalida cada 5 minutos: las convocatorias cambian pocas veces al dia.
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Convocatoria[];
    return Array.isArray(data) && data.length ? data : CONVOCATORIAS;
  } catch {
    // Degradacion elegante: si la fuente falla, la pagina sigue viva con semillas.
    return CONVOCATORIAS;
  }
}

export async function listarConvocatorias(): Promise<Convocatoria[]> {
  switch (currentSource()) {
    case 'http':
      return fetchHttp();
    case 'postgres':
      // TODO(BDP): implementar consulta con el driver oficial cuando exista DATABASE_URL.
      return CONVOCATORIAS;
    default:
      return CONVOCATORIAS;
  }
}

export async function obtenerConvocatoria(slug: string): Promise<Convocatoria | undefined> {
  const todas = await listarConvocatorias();
  return todas.find((c) => c.slug === slug);
}
