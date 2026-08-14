# Sistema de diseno · Liquid Glass + editorial andino

## 1. La tesis

La referencia visual solicitada es un sitio inmobiliario de lujo: escala
tipografica enorme, ritmo pausado, mucho aire, rieles arrastrables, revelados
por mascara y una elegancia plana y ornamentada.

La plataforma, en cambio, es la cara de una **banca publica de desarrollo
productivo**. Copiar el lujo literal habria sido un error de tono.

La fusion se resolvio asi:

| De la referencia editorial | De la identidad BDP | Resultado |
| --- | --- | --- |
| Tipografia display enorme y aireada | Azul institucional `#004282` | Titulares serif de gran escala sobre superficies profundas |
| Ritmo lento, secciones que respiran | Seriedad institucional | `--section-y` amplio y alternancia de superficies |
| Riel arrastrable de tipologias | Convocatorias como producto central | Vitrina de convocatorias arrastrable |
| Revelados por mascara y parallax | Transparencia de proceso | Revelados suaves, nunca decorativos sin razon |
| Ornamento mediterraneo | Textil andino / wiphala | Trama de chevrones en linea fina, oro andino |
| Fotografia de producto | No hay banco de imagenes propio | Arte generativo en SVG (andes, agro, ciudad, cadena, vidrio) |

Y sobre todo eso, la **linea madre**: Liquid Glass. Vidrio con espesor,
refraccion, especular que sigue el cursor y bordes de luz.

---

## 2. Arquitectura CSS en tres capas

El orden de importacion en `app/layout.tsx` es significativo:

1. **`app/globals.css`** — tokens (color, radios, curvas, escala tipografica),
   reset, tipografia editorial, superficies y accesibilidad base.
2. **`app/glass.css`** — el sistema Liquid Glass, fondos dinamicos y primitivos
   de animacion.
3. **`app/components.css`** — bloques concretos: preloader, cabecera, dock,
   tarjetas, panel, acordeon, pie.

### Superficies

En lugar de un tema claro/oscuro global, cada seccion declara su superficie:

```html
<section class="section" data-surface="dark">   <!-- tinta -->
<section class="section" data-surface="light">  <!-- papel -->
<section class="section" data-surface="deep">   <!-- azul institucional -->
```

Cada superficie redefine `--bg`, `--fg`, `--glass`, `--accent`, etc. Los
componentes no saben en que fondo estan: leen tokens. Asi el mismo `GlassCard`
funciona sobre tinta, papel o azul sin una sola linea condicional.

---

## 3. Anatomia del vidrio

Un panel `.glass` combina cinco senales opticas:

1. **Difusion:** `backdrop-filter: blur() saturate()`.
2. **Canto iluminado:** `::before` con degradado superior en `soft-light`.
3. **Especular vivo:** `::after` con un radial anclado a `--mx`/`--my`, que se
   actualizan desde JS con la posicion del cursor.
4. **Espesor:** `.bevel`, sombras internas que simulan el canto del material.
5. **Refraccion:** `.refract` con una capa desplazada por el filtro SVG
   `#bdp-liquid` (`feTurbulence` + `feDisplacementMap` animados).

Opcionales:

- `.liquid-edge` — borde de luz conico animado con `@property --angle` y
  `mask-composite: exclude`. Un anillo de luz que gira por el perimetro.
- `.sheen` — barrido especular diagonal al pasar el cursor.

Sin `backdrop-filter` (navegadores antiguos) hay respaldo con `@supports not`
que rellena con `color-mix` sobre el fondo: se pierde el desenfoque, nunca la
legibilidad.

---

## 4. Las diez iteraciones graficas aplicadas

Cada una es una pasada de mejora sobre el diseno base, no un adorno aislado:

1. **Vidrio con espesor real.** Bisel interno + canto iluminado, para que el
   panel se lea como material y no como un rectangulo translucido.
2. **Especular que sigue el cursor.** El brillo nace donde esta el puntero:
   el vidrio deja de ser estatico.
3. **Borde de luz liquido.** Anillo conico animado por el perimetro, activo en
   los elementos jerarquicamente importantes.
4. **Refraccion con turbulencia SVG.** Una capa detras del vidrio que se
   deforma lentamente: da sensacion de liquido, no de cristal.
5. **Aurora por seccion.** Manchas de luz a la deriva que cambian de mezcla
   segun la superficie (`screen` en oscuro, `multiply` en claro).
6. **Grano filmico animado.** Textura fina global que rompe el bandeado de los
   degradados y aporta cuerpo fotografico.
7. **Ornamento andino en linea fina.** Chevrones tipo wiphala enmascarados con
   degradado: identidad territorial sin caer en el cliche.
8. **Causticas de luz de agua.** Patron radial repetido y desenfocado sobre el
   arte, como reflejo de piscina; hereda el lujo de la referencia.
9. **Botones magneticos con relleno liquido.** Se inclinan hacia el cursor, la
   etiqueta se desliza en vertical y el color sube desde abajo.
10. **Revelados coreografiados.** Entradas por mascara, desenfoque y division
    por lineas y caracteres, con retardos escalonados por posicion.

Iteraciones adicionales que quedaron en el sistema: dock con ampliacion tipo
lupa, anillos conicos de compatibilidad, contadores animados, marquesina
tipografica, parallax con resorte y escala ligada al scroll.

---

## 5. Movimiento

- **Curvas** centralizadas en `lib/ease.ts` (`EASE_OUT` es la principal) y
  duplicadas como tokens CSS (`--e-out`, `--e-in-out`, `--e-back`, `--e-soft`).
- **Scroll suave** con Lenis, cargado de forma diferida y con respaldo al
  scroll nativo si la libreria falla.
- **Revelados** con `IntersectionObserver` propio (`useInView`), no con
  animaciones al montar: nada se anima fuera de pantalla.
- **Regla de oro:** toda animacion se apaga con `prefers-reduced-motion` o con
  el interruptor del panel de accesibilidad. Los fondos animados se pueden
  pausar por separado sin perder el diseno.

---

## 6. Tipografia

| Uso | Familia | Notas |
| --- | --- | --- |
| Titulares y cifras destacadas | Playfair Display | Serif editorial, `letter-spacing` negativo en escalas grandes |
| Interfaz, formularios, cuerpo | Inter | Legibilidad en pantallas pequenas y conexiones lentas |
| Codigos, cejillas numeradas | Monoespaciada del sistema | Sin peso de descarga |

Toda la escala es fluida con `clamp()`, y se multiplica por `--text-scale`, que
controla el panel de accesibilidad. Aumentar el texto al 150% no rompe ningun
bloque porque no hay alturas fijas.

---

## 7. Al construir una pantalla nueva

1. Envolver en `<section class="section" data-surface="...">`.
2. Fondo con `<Aurora />`, `<MeshGrid />`, `<AndeanPattern />` o `<Caustics />`.
3. Contenido en `.container` (o `.container--narrow` para lectura).
4. Encabezado con `<SectionHeader />`.
5. Bloques con `<GlassCard />`; acciones con `<GlassButton />` / `<GlassLink />`.
6. Entradas con `<Reveal />`, `<SplitLines />`, `<Counter />`, `<Parallax />`.
7. Cero colores literales: siempre `var(--token)`.
8. Textos siempre por `t()` o `tl()`, en los cuatro idiomas.
