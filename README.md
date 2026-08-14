# BDP Talento · Plataforma centralizada de talento

Plataforma web del **Banco de Desarrollo Productivo S.A.M.** (Bolivia) para
centralizar todo el ciclo de atraccion de talento: registro de postulantes,
convocatorias vigentes hidratadas desde la base institucional, bolsa de talento,
preparacion de evaluaciones y un panel donde cada persona es duena de sus datos.

> Linea de diseno madre: **Liquid Glass** (vidrio liquido) fusionada con un
> lenguaje editorial ornamentado y referencias andinas.
> Interfaz disponible en **espanol latinoamericano, ingles, quechua y aymara**.

---

## 1. Stack

| Capa | Tecnologia |
| --- | --- |
| Framework | Next.js 15 (App Router, React 19) |
| Lenguaje | TypeScript en modo estricto |
| Animacion | framer-motion 12 + CSS moderno (`@property`, `mask-composite`, `color-mix`) |
| Scroll suave | Lenis (carga diferida, desactivable) |
| Estilos | CSS propio en tres capas con tokens y superficies (sin framework de utilidades) |
| Tipografia | Playfair Display (editorial) + Inter (interfaz), via `next/font` |
| Estado | React Context + `localStorage` con hidratacion segura |
| Despliegue | Vercel |

No hay dependencias de UI de terceros: todos los componentes (vidrio, dock,
acordeon, paleta de comandos, riel arrastrable, panel de accesibilidad) son
propios.

---

## 2. Puesta en marcha

```bash
git clone https://github.com/AlexD5427/postulacionesbdpv3.git
cd postulacionesbdpv3
npm install
cp .env.example .env.local   # opcional: funciona sin configurar nada
npm run dev                  # http://localhost:3000
```

Scripts disponibles:

```bash
npm run dev        # desarrollo
npm run build      # compilacion de produccion
npm run start      # servir la compilacion
npm run lint       # ESLint (configuracion de Next)
npm run typecheck  # tsc --noEmit
```

> `npm run typecheck` requiere que exista `next-env.d.ts`. Se genera
> automaticamente al ejecutar `npm run dev` o `npm run build` por primera vez.

---

## 3. Estructura

```
app/
  globals.css          Capa 1: tokens, reset, tipografia, accesibilidad base
  glass.css            Capa 2: Liquid Glass, fondos dinamicos, motion primitives
  components.css       Capa 3: bloques de interfaz (header, dock, tarjetas, panel)
  layout.tsx           Layout raiz: fuentes, metadata, proveedores, cromo global
  page.tsx             Portada editorial
  icon.svg             Favicon derivado del emblema
  manifest.ts          Manifiesto PWA
  convocatorias/       Listado (server) + detalle dinamico [slug]
  login/ registro/     Identidad
  panel/               Panel del candidato (+ panel/cv)
  evaluaciones/        Simulador de evaluaciones
  recursos/            Centro de aprendizaje
  bolsa/               Bolsa de talento
  not-found.tsx        404

components/
  brand/               Emblema BDP en SVG
  providers/           i18n, sesion, accesibilidad, datos de candidato, avisos
  ui/                  Primitivos: glass, motion, backgrounds, chrome
  features/            Bloques de producto (tarjetas, explorador, quiz, panel)

lib/
  types.ts             Contratos de datos
  i18n/                Configuracion de idiomas y diccionarios
  data/                Semillas + adaptador de fuente de datos
  match.ts             Motor de compatibilidad explicable
  utils.ts  storage.ts  ease.ts

docs/                  Documentacion tecnica (leer antes de contribuir)
```

---

## 4. Documentacion

| Documento | Contenido |
| --- | --- |
| [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) | Flujo de datos, proveedores, como conectar la base institucional |
| [docs/DISENO.md](docs/DISENO.md) | Sistema Liquid Glass, tokens, superficies e iteraciones graficas |
| [docs/I18N.md](docs/I18N.md) | **Regla obligatoria de 4 idiomas** y como agregar textos |
| [docs/MARCA.md](docs/MARCA.md) | Situacion del logotipo y como sustituirlo por el oficial |
| [docs/ACCESIBILIDAD.md](docs/ACCESIBILIDAD.md) | Opciones de accesibilidad, TTS y criterios WCAG |
| [docs/FUNCIONALIDADES.md](docs/FUNCIONALIDADES.md) | Catalogo de funcionalidades implementadas |
| [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md) | Publicacion en Vercel y variables de entorno |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Historial de cambios |

---

## 5. Dos reglas que no se negocian

1. **Cuatro idiomas.** Todo texto visible por el usuario debe existir en
   espanol, ingles, quechua y aymara. Sin excepciones.
   Ver [docs/I18N.md](docs/I18N.md).
2. **Liquid Glass.** Toda pantalla nueva se construye con los primitivos de
   `components/ui` y los tokens de `app/globals.css`. Sin colores ni sombras
   escritos a mano. Ver [docs/DISENO.md](docs/DISENO.md).

---

## 6. Estado actual

- Datos de convocatorias, preguntas y recursos son **semillas** del repositorio.
  El adaptador `lib/data/source.ts` permite pasar a API o base de datos sin
  tocar la interfaz.
- La sesion funciona en **modo demostracion** sobre `localStorage`, para que
  toda la experiencia sea navegable. Sustituir por el proveedor de identidad
  institucional antes de produccion.
- El seguimiento de fase de postulacion queda **fuera de alcance** por decision
  del producto.

---

&copy; Banco de Desarrollo Productivo S.A.M. · Estado Plurinacional de Bolivia
