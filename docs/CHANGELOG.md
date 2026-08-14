# Historial de cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

---

## [3.0.0] · Reconstruccion completa

Primera version funcional de la plataforma. El repositorio estaba vacio (solo
`LICENSE`), por lo que **no hay migracion ni codigo anterior que preservar**:
toda la base se escribio desde cero.

### Agregado · Fundaciones

- Proyecto Next.js 15 con App Router, React 19 y TypeScript estricto.
- Sistema de diseno CSS en tres capas con tokens y superficies
  (`dark`, `light`, `deep`).
- Sistema **Liquid Glass**: vidrio con espesor, especular vivo, borde de luz
  conico animado, barrido especular y refraccion con filtros SVG.
- Primitivos de animacion: revelados, division de texto, contadores,
  marquesina, parallax, escala ligada al scroll, rotador.
- Fondos dinamicos: aurora, grano filmico, malla, trama andina, causticas.
- Scroll suave con Lenis, diferido y desactivable.

### Agregado · Producto

- Portada editorial con hero animado, tres pilares, concepto, vitrina
  arrastrable de convocatorias, beneficios, proceso, metricas, testimonios,
  preguntas frecuentes y cierre.
- Explorador de convocatorias con busqueda, cinco grupos de filtros, cuatro
  ordenamientos y busquedas guardadas.
- Detalle de convocatoria con compatibilidad explicable, requisitos,
  beneficios, similares, compartir y exportacion de la fecha de cierre.
- Acceso y registro con validacion y medidor de robustez de contrasena.
- Panel del candidato con siete pestanas: resumen, perfil, guardadas, alertas,
  documentos, agenda y comparador.
- Editor de perfil completo (datos, preferencias, habilidades, experiencia,
  formacion) con completitud ponderada y explicada.
- Generador de hoja de vida imprimible y exportable a PDF.
- Simulador de evaluaciones con temporizador, explicaciones e historial.
- Centro de aprendizaje filtrable por tema.
- Bolsa de talento con visibilidad activable.
- Notificaciones internas y avisos efimeros accesibles.
- Paleta de comandos (`Ctrl/Cmd + K`).
- Dock de accesos directos posterior al acceso, con ampliacion tipo lupa,
  contadores y tooltips accesibles.
- Animacion de bienvenida "Trabaja en BDP S.A.M.", una vez por sesion.

### Agregado · Idiomas

- Cuatro idiomas: espanol latinoamericano, ingles, quechua y aymara.
- Selector dedicado en cabecera, menu y paleta de comandos.
- Deteccion inicial del idioma del navegador y persistencia de la eleccion.
- Respaldo automatico al espanol: la interfaz nunca muestra una clave cruda.
- **Regla obligatoria** documentada en `docs/I18N.md`.

### Agregado · Accesibilidad

- Panel completo: alto contraste, cinco paletas (incluidas deuteranopia,
  protanopia, tritanopia y monocromatica), escalado de texto, espaciado de
  lineas y letras, fuente de alta legibilidad, subrayado de enlaces, guia de
  lectura, cursor grande y control de movimiento.
- Lector de voz sobre `SpeechSynthesis`, con seleccion de voz por idioma y
  aviso explicito cuando no existe voz nativa para quechua o aymara.
- Enlace de salto al contenido, foco visible, semantica ARIA y atajos de
  teclado (`Ctrl+K`, `Alt+A`, `Alt+L`, `Esc`).

### Agregado · Marca

- Emblema institucional propio en SVG (tres barras ascendentes bajo un arco),
  construido sobre el color oficial `#004282`.
- Favicon, icono de iOS y manifiesto PWA derivados del emblema.

### Agregado · Datos

- Ocho convocatorias semilla, doce preguntas de practica y nueve recursos.
- Adaptador de fuente de datos (`seed` / `http` / `postgres`) con degradacion
  elegante si la fuente remota falla.
- Motor de compatibilidad explicable, ponderado y documentado.

### Notas

- El **seguimiento de fase de postulacion** queda fuera de alcance por decision
  del producto.
- El SVG del logotipo entregado era un fragmento incompleto; ver
  `docs/MARCA.md` para el detalle y el procedimiento de sustitucion.
- Las traducciones de quechua y aymara requieren validacion por hablantes
  nativos antes de produccion.

---

## Como registrar cambios futuros

Cada PR agrega su bloque bajo `## [No publicado]` con las secciones que
correspondan: `Agregado`, `Cambiado`, `Corregido`, `Eliminado`.

Recordatorio obligatorio: todo texto nuevo visible por el usuario debe llegar en
**los cuatro idiomas** y respetar la linea Liquid Glass.
