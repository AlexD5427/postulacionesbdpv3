# Marca e iconografia

## 1. Que paso con el SVG entregado

El SVG proporcionado para el logotipo llego como **fragmento incompleto**. Su
contenido era:

- un bloque `<sodipodi:namedview>` con metadatos de la sesion de edicion de
  Inkscape (nivel de zoom, tamano de ventana, capa activa): informacion de
  herramienta, sin valor grafico;
- una regla CSS `.cls-1 { fill: #fff; }`;
- **un solo** `<path>` con `d="M105.27,47.07c0,1.42-.49,2-1.79,2..."`, que
  corresponde al contrafuerte de una letra (una `o` o similar) dentro de un
  logotipo mucho mas grande, con relleno `#004282`.

Faltaban el elemento `<svg>` raiz, el `viewBox`, y la practica totalidad de los
trazados. Con un unico contorno de letra no es posible reconstruir el logotipo
institucional: hacerlo habria sido inventar la marca del banco.

**Lo unico aprovechable y verificable fue el color oficial: `#004282`.** Ese
valor es hoy el token `--bdp-700`, eje de toda la paleta.

---

## 2. Que se construyo

Un **emblema institucional propio**, en `components/brand/BdpLogo.tsx`,
disenado para no suplantar el logotipo oficial sino para ocupar su lugar de
forma digna y coherente:

- **Tres barras ascendentes** — crecimiento y desarrollo productivo. La mayor
  en oro andino.
- **Arco superior** — el vuelo del condor y, leido de otro modo, el surco
  agricola.
- **Contenedor de esquinas suaves** con degradado azul institucional y canto
  iluminado, para que el emblema pertenezca al lenguaje Liquid Glass del resto
  de la interfaz.

Exportaciones disponibles:

| Componente | Uso |
| --- | --- |
| `BdpMark` | Emblema solo. Acepta `className`, `style`, `gradient`, `accent` |
| `BdpLogo` | Emblema + nombre + bajada, usado en cabecera y menu |
| `BdpMarkOutline` | Version en trazo, para la animacion de bienvenida |
| `BDP_AZUL` | Constante `#004282` |

El emblema aparece en: cabecera, menu a pantalla completa, animacion de
bienvenida, cierre de la portada, pie de pagina, pantallas de identidad y la
hoja de vida generada.

---

## 3. Icono del navegador

Derivado del mismo emblema, sin dependencias:

- `app/icon.svg` — favicon (64x64), detectado automaticamente por Next.js.
- `app/apple-icon.svg` — icono de pantalla de inicio en iOS (180x180), con los
  trazos engrosados para que se lea a tamano pequeno.
- `app/manifest.ts` — manifiesto PWA con `theme_color: #004282`.

---

## 4. Como sustituirlo por el logotipo oficial

1. Conseguir el SVG **completo** (con `<svg>`, `viewBox` y todos los `<path>`).
2. Reemplazar el interior de `BdpMark` por esos trazados y ajustar el
   `viewBox`. **No cambiar la firma del componente:** el resto de la aplicacion
   seguira funcionando sin tocar nada.
3. Regenerar `app/icon.svg` y `app/apple-icon.svg` con la misma marca.
4. Verificar contraste sobre las tres superficies (`dark`, `light`, `deep`) y en
   las cinco paletas de daltonismo.
5. Registrar el cambio en `docs/CHANGELOG.md`.

> Mientras esto no ocurra, cualquier uso publico del emblema actual debe
> aprobarse con el area de comunicacion del banco.
