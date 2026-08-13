import type { Convocatoria, MatchResult, NivelEducativo, Usuario } from './types';
import { normalize } from './utils';

const NIVEL_ORDEN: Record<NivelEducativo, number> = {
  tecnico: 1,
  licenciatura: 2,
  maestria: 3,
};

/**
 * Motor de compatibilidad perfil <-> convocatoria.
 * Deliberadamente explicable: cada punto sumado tiene una razon visible en la UI
 * para que la persona sepa que mejorar. No sustituye la evaluacion oficial.
 */
export function calcularMatch(usuario: Usuario | null, conv: Convocatoria): MatchResult {
  if (!usuario) return { score: 0, razones: [] };

  const habilidadesUsuario = new Set(usuario.habilidades.map(normalize));
  const competencias = conv.competencias.map(normalize);
  const coincidencias = competencias.filter((c) => {
    for (const h of habilidadesUsuario) {
      if (h === c || h.includes(c) || c.includes(h)) return true;
    }
    return false;
  });

  const razones: MatchResult['razones'] = [];

  // 1. Habilidades (35 puntos)
  const ratioSkills = competencias.length ? coincidencias.length / competencias.length : 0;
  const puntosSkills = Math.round(ratioSkills * 35);
  razones.push({
    key: 'match.skills',
    detalle: `${coincidencias.length}/${competencias.length}`,
    peso: puntosSkills,
    cumple: coincidencias.length > 0,
  });

  // 2. Ciudad (15 puntos)
  const mismaCiudad = normalize(usuario.ciudad) === normalize(conv.ciudad);
  razones.push({ key: 'match.city', peso: mismaCiudad ? 15 : 0, cumple: mismaCiudad, detalle: conv.ciudad });

  // 3. Modalidad (10 puntos)
  const modalidadOk = usuario.modalidadPreferida === 'indiferente' || usuario.modalidadPreferida === conv.modalidad;
  razones.push({ key: 'match.mode', peso: modalidadOk ? 10 : 0, cumple: modalidadOk });

  // 4. Experiencia (18 puntos, proporcional)
  const expOk = usuario.experienciaAnios >= conv.experienciaAnios;
  const ratioExp = conv.experienciaAnios === 0 ? 1 : Math.min(1, usuario.experienciaAnios / conv.experienciaAnios);
  razones.push({
    key: 'match.experience',
    detalle: `${usuario.experienciaAnios}/${conv.experienciaAnios}`,
    peso: Math.round(ratioExp * 18),
    cumple: expOk,
  });

  // 5. Nivel educativo (12 puntos)
  const eduOk = NIVEL_ORDEN[usuario.nivelEducativo] >= NIVEL_ORDEN[conv.educacionMinima];
  razones.push({ key: 'match.education', peso: eduOk ? 12 : 0, cumple: eduOk });

  // 6. Area de interes declarada (6 puntos)
  const areaOk = usuario.areasInteres.map(normalize).includes(normalize(conv.area));
  razones.push({ key: 'match.area', peso: areaOk ? 6 : 0, cumple: areaOk, detalle: conv.area });

  // 7. Expectativa salarial dentro del rango (4 puntos)
  const salarioOk =
    usuario.expectativaSalarial === 0 ||
    (usuario.expectativaSalarial >= conv.salarioMin * 0.85 && usuario.expectativaSalarial <= conv.salarioMax * 1.1);
  razones.push({ key: 'match.salary', peso: salarioOk ? 4 : 0, cumple: salarioOk });

  const score = Math.min(100, razones.reduce((acc, r) => acc + r.peso, 0));

  return { score, razones: razones.sort((a, b) => b.peso - a.peso) };
}

/** Porcentaje de completitud del perfil, con bloques ponderados. */
export function completitudPerfil(usuario: Usuario | null): { total: number; bloques: Array<{ key: string; ok: boolean; peso: number }> } {
  if (!usuario) return { total: 0, bloques: [] };

  const bloques = [
    { key: 'profile.basics', ok: !!(usuario.nombre && usuario.apellido && usuario.email && usuario.telefono), peso: 15 },
    { key: 'profile.about', ok: usuario.resumen.trim().length > 60, peso: 12 },
    { key: 'profile.profession', ok: !!usuario.profesion, peso: 8 },
    { key: 'profile.educationTitle', ok: usuario.educacion.length > 0, peso: 15 },
    { key: 'profile.experience', ok: usuario.experiencia.length > 0, peso: 18 },
    { key: 'profile.skills', ok: usuario.habilidades.length >= 4, peso: 12 },
    { key: 'profile.interests', ok: usuario.areasInteres.length > 0, peso: 6 },
    { key: 'profile.languages', ok: usuario.idiomas.length > 0, peso: 6 },
    { key: 'panel.tab.documentos', ok: usuario.documentos.length > 0, peso: 8 },
  ];

  const total = bloques.reduce((acc, b) => acc + (b.ok ? b.peso : 0), 0);
  return { total, bloques };
}

/** Ordena convocatorias por compatibilidad descendente. */
export function recomendar(usuario: Usuario | null, convocatorias: Convocatoria[], limite = 4): Array<{ conv: Convocatoria; match: MatchResult }> {
  return convocatorias
    .map((conv) => ({ conv, match: calcularMatch(usuario, conv) }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limite);
}
