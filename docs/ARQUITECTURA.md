# Arquitectura

## 1. Panorama

```
Navegador
  |
  |-- App Router (Next.js 15)
  |     |-- Server Components  -> metadata, SSG/ISR, lectura de datos
  |     |-- Client Components  -> interaccion, animacion, estado del candidato
  |
  |-- AppProviders (contexto global)
  |     A11yProvider -> I18nProvider -> AuthProvider -> CandidatoProvider -> ToastProvider
  |
  |-- localStorage (namespace "bdp-talento:")
        sesion demo, idioma, ajustes de accesibilidad, guardadas, alertas,
        busquedas, documentos, practicas, notificaciones
```

Regla: **los datos se leen en el servidor, la interaccion vive en el cliente.**
El listado y el detalle de convocatorias son Server Components que reciben los
datos y los pasan como props a componentes cliente que filtran y ordenan.

---

## 2. Fuente de datos

La interfaz **nunca** importa una base de datos. Todo pasa por
`lib/data/source.ts`:

```ts
DATA_SOURCE=seed      // semillas del repositorio (por defecto)
DATA_SOURCE=http      // API REST institucional (CONVOCATORIAS_API_URL)
DATA_SOURCE=postgres  // conexion directa (DATABASE_URL) [pendiente]
```

```ts
export async function listarConvocatorias(): Promise<Convocatoria[]>;
export async function obtenerConvocatoria(slug: string): Promise<Convocatoria | undefined>;
```

### Como conectar la base institucional

1. Definir `DATA_SOURCE=http` y `CONVOCATORIAS_API_URL` (mas
   `CONVOCATORIAS_API_TOKEN` si aplica).
2. Asegurar que la respuesta cumpla el contrato `Convocatoria` de
   `lib/types.ts`. Ese tipo **es** el contrato de integracion.
3. Nada mas. La interfaz no cambia.

Dos decisiones importantes:

- **Revalidacion cada 300 s** (`export const revalidate = 300`). Las
  convocatorias cambian pocas veces al dia: ISR da paginas instantaneas y datos
  frescos.
- **Degradacion elegante.** Si la fuente remota falla, `fetchHttp()` devuelve
  las semillas en lugar de romper la pagina. Un banco no puede mostrar una
  pantalla de error porque una API tardo.

Para Postgres (Neon, Supabase, RDS) implementar el caso `postgres` con el
driver oficial y mapear las filas al tipo `Convocatoria`.

---

## 3. Proveedores

| Proveedor | Responsabilidad |
| --- | --- |
| `A11yProvider` | Ajustes de accesibilidad, aplicacion al `<html>`, guia de lectura y motor de voz |
| `I18nProvider` | Idioma activo, `t()` para interfaz, `tl()` para datos, `<html lang>` |
| `AuthProvider` | Sesion demo, perfil del usuario y actualizacion parcial |
| `CandidatoProvider` | Guardadas, comparador, alertas, busquedas, postulaciones, practicas, notificaciones |
| `ToastProvider` | Avisos efimeros accesibles (`role="status"`, `aria-live`) |

`A11yProvider` envuelve a los demas a proposito: los ajustes visuales deben
aplicarse antes de que se pinte cualquier animacion.

---

## 4. Persistencia e hidratacion

`lib/storage.ts` expone `usePersistentState`, que resuelve el problema clasico
de Next.js: leer `localStorage` durante el render del servidor provoca
desajustes de hidratacion.

Estrategia:

1. El estado arranca **siempre** con el valor por defecto (igual en servidor y
   cliente).
2. Tras montar, se lee `localStorage` y se sincroniza.
3. Los cambios se escriben y se difunden con un evento `bdp-storage`, de modo
   que varias pestanas y varios componentes se mantienen coherentes.

Todo esta bajo el prefijo `bdp-talento:` y protegido con `try/catch` para modo
privado o cuota agotada.

---

## 5. Motor de compatibilidad

`lib/match.ts` calcula la afinidad perfil / convocatoria sobre 100 puntos:

| Criterio | Peso |
| --- | --- |
| Habilidades coincidentes | 35 |
| Experiencia suficiente (proporcional) | 18 |
| Ciudad | 15 |
| Nivel educativo | 12 |
| Modalidad preferida | 10 |
| Area de interes declarada | 6 |
| Expectativa salarial dentro del rango | 4 |

El valor devuelto no es solo un numero: incluye `razones[]`, cada una con su
peso y si se cumple. La interfaz muestra esa lista en el detalle de la
convocatoria.

> **Decision de producto:** el puntaje es **explicable a proposito**. En una
> entidad publica, un algoritmo opaco que ordena candidaturas es inaceptable.
> La persona debe poder ver exactamente por que su afinidad es alta o baja y
> que puede mejorar. El puntaje es una ayuda de navegacion, **no** una
> evaluacion oficial ni un filtro de descarte.

`completitudPerfil()` sigue la misma filosofia: nueve bloques ponderados, cada
uno visible como cumplido o pendiente.

---

## 6. Rendimiento

- Arte visual en **SVG y CSS generativo**: cero peticiones de imagen, escala
  perfecta, peso minimo. Relevante para conexiones lentas del area rural.
- Fuentes por `next/font` con `display: swap` y subconjunto latino.
- Lenis y su bucle de animacion se cargan **despues** de la primera pintura, y
  no se cargan si el usuario pidio movimiento reducido.
- `IntersectionObserver` deja de observar tras el primer revelado.
- El halo del cursor se desactiva en dispositivos tactiles (`hover: none`).
- Convocatorias con SSG + ISR; el detalle usa `generateStaticParams`.

---

## 7. Limites conocidos

| Tema | Estado |
| --- | --- |
| Autenticacion | Demo en `localStorage`. Sustituir por SSO institucional manteniendo la interfaz de `AuthProvider` |
| Documentos | Solo se registra la ficha (nombre, tipo, tamano). El binario no se almacena ni se envia |
| Alertas por correo | Se configuran y persisten en el cliente; falta el trabajo programado en el servidor |
| Quechua y aymara | Traduccion funcional pendiente de validacion nativa |
| Seguimiento de fase de postulacion | Fuera de alcance por decision del producto |
