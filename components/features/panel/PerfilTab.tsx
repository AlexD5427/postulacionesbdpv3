'use client';

import { useState } from 'react';
import { TagInput } from './TagInput';
import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { GlassButton, GlassCard } from '@/components/ui/glass';
import { Reveal } from '@/components/ui/motion';
import { AREAS, DEPARTAMENTOS } from '@/lib/data/convocatorias';
import type { Educacion, Experiencia, Modalidad, NivelEducativo, Usuario } from '@/lib/types';
import { uid } from '@/lib/utils';

const HABILIDADES_SUGERIDAS = [
  'Analisis financiero',
  'Excel avanzado',
  'SQL',
  'Python',
  'Riesgo crediticio',
  'Normativa ASFI',
  'Atencion al cliente',
  'Redaccion tecnica',
  'Power BI',
  'Liderazgo',
  'Credito rural',
  'Quechua',
  'Aymara',
];

export function PerfilTab({
  usuario,
  completitud,
}: {
  usuario: Usuario;
  completitud: { total: number };
}) {
  const { t } = useI18n();
  const { actualizar } = useAuth();
  const { toast } = useToast();
  const [borrador, setBorrador] = useState<Usuario>(usuario);

  const set = <K extends keyof Usuario>(campo: K, valor: Usuario[K]) =>
    setBorrador((prev) => ({ ...prev, [campo]: valor }));

  const guardar = (event: React.FormEvent) => {
    event.preventDefault();
    actualizar(borrador);
    toast(t('profile.updated'));
  };

  /* --- Experiencia ---------------------------------------------------- */
  const agregarExperiencia = () =>
    set('experiencia', [
      ...borrador.experiencia,
      { id: uid('exp'), cargo: '', empresa: '', desde: '', hasta: '', descripcion: '' },
    ]);

  const editarExperiencia = (id: string, campo: keyof Experiencia, valor: string) =>
    set(
      'experiencia',
      borrador.experiencia.map((e) => (e.id === id ? { ...e, [campo]: valor } : e)),
    );

  /* --- Educacion ------------------------------------------------------ */
  const agregarEducacion = () =>
    set('educacion', [
      ...borrador.educacion,
      { id: uid('edu'), titulo: '', institucion: '', nivel: 'licenciatura', anio: '' },
    ]);

  const editarEducacion = (id: string, campo: keyof Educacion, valor: string) =>
    set(
      'educacion',
      borrador.educacion.map((e) => (e.id === id ? { ...e, [campo]: valor } : e)),
    );

  return (
    <form onSubmit={guardar} className="stack gap-lg">
      {/* --- Datos personales -------------------------------------------- */}
      <Reveal>
        <GlassCard variant="pad-lg" hover={false}>
          <div className="between">
            <h2 className="h3">{t('profile.basics')}</h2>
            <span className="badge">{completitud.total}%</span>
          </div>

          <div className="grid cols-2 gap-sm mt-md">
            <div className="field">
              <label className="field__label" htmlFor="p-nombre">
                {t('auth.name')}
              </label>
              <input id="p-nombre" className="input" value={borrador.nombre} onChange={(e) => set('nombre', e.target.value)} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="p-apellido">
                {t('auth.lastname')}
              </label>
              <input id="p-apellido" className="input" value={borrador.apellido} onChange={(e) => set('apellido', e.target.value)} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="p-email">
                {t('auth.email')}
              </label>
              <input id="p-email" className="input" type="email" value={borrador.email} readOnly aria-readonly="true" />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="p-tel">
                {t('auth.phone')}
              </label>
              <input id="p-tel" className="input" type="tel" value={borrador.telefono} onChange={(e) => set('telefono', e.target.value)} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="p-ci">
                {t('auth.ci')}
              </label>
              <input id="p-ci" className="input" value={borrador.ci} onChange={(e) => set('ci', e.target.value)} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="p-ciudad">
                {t('auth.city')}
              </label>
              <input id="p-ciudad" className="input" value={borrador.ciudad} onChange={(e) => set('ciudad', e.target.value)} />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="p-depto">
                {t('jobs.filter.city')}
              </label>
              <select id="p-depto" className="select" value={borrador.departamento} onChange={(e) => set('departamento', e.target.value)}>
                {DEPARTAMENTOS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="p-profesion">
                {t('profile.profession')}
              </label>
              <input id="p-profesion" className="input" value={borrador.profesion} onChange={(e) => set('profesion', e.target.value)} />
            </div>
          </div>

          <div className="field" style={{ marginTop: '1rem' }}>
            <label className="field__label" htmlFor="p-resumen">
              {t('profile.about')}
            </label>
            <textarea
              id="p-resumen"
              className="textarea"
              value={borrador.resumen}
              onChange={(e) => set('resumen', e.target.value)}
              placeholder={t('profile.aboutHint')}
            />
            <span className="field__hint">
              {borrador.resumen.length} / 400 · {t('profile.aboutHint')}
            </span>
          </div>
        </GlassCard>
      </Reveal>

      {/* --- Preferencias ------------------------------------------------ */}
      <Reveal delay={0.06}>
        <GlassCard variant="pad-lg" hover={false}>
          <h2 className="h3">{t('profile.preferredMode')}</h2>
          <div className="grid cols-3 gap-sm mt-md">
            <div className="field">
              <label className="field__label" htmlFor="p-mod">
                {t('jobs.filter.mode')}
              </label>
              <select
                id="p-mod"
                className="select"
                value={borrador.modalidadPreferida}
                onChange={(e) => set('modalidadPreferida', e.target.value as Modalidad | 'indiferente')}
              >
                {(['indiferente', 'presencial', 'hibrido', 'remoto'] as const).map((m) => (
                  <option key={m} value={m}>
                    {t(`jobs.mode.${m}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="p-nivel">
                {t('profile.educationLevel')}
              </label>
              <select
                id="p-nivel"
                className="select"
                value={borrador.nivelEducativo}
                onChange={(e) => set('nivelEducativo', e.target.value as NivelEducativo)}
              >
                {(['tecnico', 'licenciatura', 'maestria'] as const).map((n) => (
                  <option key={n} value={n}>
                    {t(`profile.education.${n}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="p-anios">
                {t('profile.experienceYears')}
              </label>
              <input
                id="p-anios"
                className="input"
                type="number"
                min={0}
                max={50}
                value={borrador.experienciaAnios}
                onChange={(e) => set('experienciaAnios', Number(e.target.value))}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="p-salario">
                {t('profile.salaryExpectation')}
              </label>
              <input
                id="p-salario"
                className="input"
                type="number"
                min={0}
                step={100}
                value={borrador.expectativaSalarial}
                onChange={(e) => set('expectativaSalarial', Number(e.target.value))}
              />
            </div>

            <label className="switch" style={{ alignSelf: 'end' }}>
              <input
                type="checkbox"
                checked={borrador.disponibilidadInmediata}
                onChange={(e) => set('disponibilidadInmediata', e.target.checked)}
              />
              <span>{t('profile.availability')}</span>
            </label>
          </div>

          <div className="stack gap-md mt-md">
            <TagInput
              label={t('profile.skills')}
              hint={t('profile.skillsHint')}
              valores={borrador.habilidades}
              onChange={(v) => set('habilidades', v)}
              sugerencias={HABILIDADES_SUGERIDAS}
            />
            <TagInput
              label={t('profile.interests')}
              valores={borrador.areasInteres}
              onChange={(v) => set('areasInteres', v)}
              sugerencias={AREAS}
            />
          </div>
        </GlassCard>
      </Reveal>

      {/* --- Experiencia laboral ---------------------------------------- */}
      <Reveal delay={0.1}>
        <GlassCard variant="pad-lg" hover={false}>
          <div className="between">
            <h2 className="h3">{t('profile.experience')}</h2>
            <GlassButton variant="ghost" size="sm" swap={false} type="button" onClick={agregarExperiencia}>
              + {t('profile.addExperience')}
            </GlassButton>
          </div>

          {borrador.experiencia.length === 0 ? (
            <p className="muted mt-sm" style={{ fontSize: 'var(--fs-sm)' }}>
              {t('common.none')}
            </p>
          ) : (
            <div className="stack gap-md mt-md">
              {borrador.experiencia.map((exp) => (
                <div key={exp.id} className="glass glass--sm glass--pad" style={{ position: 'relative' }}>
                  <div className="grid cols-2 gap-sm">
                    <div className="field">
                      <span className="field__label">{t('profile.position')}</span>
                      <input className="input" value={exp.cargo} onChange={(e) => editarExperiencia(exp.id, 'cargo', e.target.value)} />
                    </div>
                    <div className="field">
                      <span className="field__label">{t('profile.company')}</span>
                      <input className="input" value={exp.empresa} onChange={(e) => editarExperiencia(exp.id, 'empresa', e.target.value)} />
                    </div>
                    <div className="field">
                      <span className="field__label">{t('profile.from')}</span>
                      <input className="input" type="month" value={exp.desde} onChange={(e) => editarExperiencia(exp.id, 'desde', e.target.value)} />
                    </div>
                    <div className="field">
                      <span className="field__label">{t('profile.to')}</span>
                      <input className="input" type="month" value={exp.hasta} onChange={(e) => editarExperiencia(exp.id, 'hasta', e.target.value)} />
                    </div>
                  </div>
                  <div className="field" style={{ marginTop: '0.6rem' }}>
                    <span className="field__label">{t('job.description')}</span>
                    <textarea
                      className="textarea"
                      style={{ minHeight: '5rem' }}
                      value={exp.descripcion}
                      onChange={(e) => editarExperiencia(exp.id, 'descripcion', e.target.value)}
                    />
                  </div>
                  <GlassButton
                    variant="quiet"
                    size="sm"
                    swap={false}
                    type="button"
                    onClick={() => set('experiencia', borrador.experiencia.filter((e) => e.id !== exp.id))}
                  >
                    {t('common.remove')}
                  </GlassButton>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </Reveal>

      {/* --- Formacion academica ---------------------------------------- */}
      <Reveal delay={0.14}>
        <GlassCard variant="pad-lg" hover={false}>
          <div className="between">
            <h2 className="h3">{t('profile.educationTitle')}</h2>
            <GlassButton variant="ghost" size="sm" swap={false} type="button" onClick={agregarEducacion}>
              + {t('profile.addEducation')}
            </GlassButton>
          </div>

          {borrador.educacion.length === 0 ? (
            <p className="muted mt-sm" style={{ fontSize: 'var(--fs-sm)' }}>
              {t('common.none')}
            </p>
          ) : (
            <div className="stack gap-md mt-md">
              {borrador.educacion.map((edu) => (
                <div key={edu.id} className="glass glass--sm glass--pad">
                  <div className="grid cols-2 gap-sm">
                    <div className="field">
                      <span className="field__label">{t('profile.degree')}</span>
                      <input className="input" value={edu.titulo} onChange={(e) => editarEducacion(edu.id, 'titulo', e.target.value)} />
                    </div>
                    <div className="field">
                      <span className="field__label">{t('profile.institution')}</span>
                      <input className="input" value={edu.institucion} onChange={(e) => editarEducacion(edu.id, 'institucion', e.target.value)} />
                    </div>
                    <div className="field">
                      <span className="field__label">{t('profile.educationLevel')}</span>
                      <select
                        className="select"
                        value={edu.nivel}
                        onChange={(e) => editarEducacion(edu.id, 'nivel', e.target.value)}
                      >
                        {(['tecnico', 'licenciatura', 'maestria'] as const).map((n) => (
                          <option key={n} value={n}>
                            {t(`profile.education.${n}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <span className="field__label">{t('profile.year')}</span>
                      <input className="input" value={edu.anio} onChange={(e) => editarEducacion(edu.id, 'anio', e.target.value)} inputMode="numeric" />
                    </div>
                  </div>
                  <GlassButton
                    variant="quiet"
                    size="sm"
                    swap={false}
                    type="button"
                    onClick={() => set('educacion', borrador.educacion.filter((e) => e.id !== edu.id))}
                  >
                    {t('common.remove')}
                  </GlassButton>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </Reveal>

      {/* --- Guardar ----------------------------------------------------- */}
      <div className="row gap-sm">
        <GlassButton type="submit" variant="primary" arrow>
          {t('common.save')}
        </GlassButton>
        <GlassButton type="button" variant="quiet" swap={false} onClick={() => setBorrador(usuario)}>
          {t('common.cancel')}
        </GlassButton>
      </div>
    </form>
  );
}
