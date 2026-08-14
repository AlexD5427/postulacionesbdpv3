# Accesibilidad

La plataforma es la puerta de entrada al empleo en una entidad publica. Si una
persona no puede usarla, el proceso deja de ser equitativo. La accesibilidad no
es una capa opcional aqui.

Objetivo: **WCAG 2.2 nivel AA**.

---

## 1. Panel de accesibilidad

Boton flotante permanente (esquina inferior derecha) o `Alt + A`.
Todas las preferencias persisten en el navegador.

### Vision y color

- **Alto contraste** — refuerza texto y bordes, desactiva desenfoques y oculta
  los fondos decorativos.
- **Cinco paletas**: original, deuteranopia, protanopia, tritanopia y
  monocromatica.

> **Decision tecnica:** las paletas **no** usan `filter` CSS. Un filtro sobre
> el `<body>` rompe `position: fixed` y `backdrop-filter`, es decir, romperia
> la cabecera, el dock y todo el vidrio. En su lugar se **remapean los tokens
> de acento** a combinaciones distinguibles para cada deficiencia. El diseno se
> conserva intacto; solo cambia el color.

### Texto y lectura

- Tamano de texto del 90% al 150% (`--text-scale`).
- Espaciado entre lineas y entre letras ajustables.
- Fuente de alta legibilidad (Atkinson Hyperlegible con respaldo).
- Subrayado permanente de enlaces.
- **Guia de lectura**: banda horizontal que sigue el cursor y atenua el resto.
- Cursor grande de alto contraste.

### Movimiento

- Reducir movimiento (apaga transiciones y animaciones).
- Pausar fondos animados por separado, conservando las transiciones utiles.

### Lectura por voz (TTS)

Sobre `SpeechSynthesis`, sin servicios externos:

- Leer la pagina completa o solo la seleccion.
- Velocidad de 0.6x a 1.8x.
- El texto se trocea por frases porque los motores cortan enunciados largos.
- Selecciona voz nativa del idioma activo cuando existe.
- **Quechua y aymara:** casi ningun motor trae voz nativa. Se usa pronunciacion
  espanola (foneticamente cercana) y **el panel lo advierte explicitamente**.
  Preferimos una limitacion declarada a un silencio inexplicado.

---

## 2. Accesibilidad estructural

- **Enlace de salto** al contenido como primer elemento enfocable.
- Un solo `<h1>` por pagina y jerarquia de encabezados coherente.
- HTML semantico: `header`, `nav`, `main`, `section`, `article`, `footer`,
  `table` con `<caption>` y `<th scope>`.
- **Foco visible** en todo elemento interactivo (contorno oro, 2 px, con
  desplazamiento).
- Estados anunciados con `aria-pressed`, `aria-expanded`, `aria-current`,
  `aria-checked`, `aria-invalid`, `aria-modal`.
- Regiones vivas (`role="status"`, `aria-live="polite"`) para avisos, conteo de
  resultados y rotador del hero.
- Todo elemento decorativo lleva `aria-hidden="true"`.
- Iconos siempre acompanados de texto o `aria-label`.

---

## 3. Teclado

| Atajo | Accion |
| --- | --- |
| `Tab` / `Shift+Tab` | Recorrer la interfaz |
| `Ctrl/Cmd + K` | Paleta de comandos (buscar y navegar) |
| `Alt + A` | Panel de accesibilidad |
| `Alt + L` | Leer o detener la lectura de la pagina |
| `Esc` | Cerrar dialogos, menus y paleta |
| `Flecha izq/der` | Mover el riel de convocatorias cuando tiene el foco |
| `Flecha arriba/abajo` + `Enter` | Recorrer y ejecutar en la paleta |

Ningun gesto de arrastre es la unica via: el riel se recorre tambien con
teclado y con rueda.

---

## 4. Color y contraste

- Texto principal sobre superficie oscura y clara por encima de 4.5:1.
- El color nunca es el unico portador de informacion: los estados llevan icono,
  texto o forma (por ejemplo las opciones del simulador combinan color, marca y
  posicion).
- Los estados del formulario se anuncian con texto, no solo con borde rojo.

---

## 5. Movimiento y vestibular

- `prefers-reduced-motion` se respeta a nivel de CSS **y** de JavaScript: con la
  preferencia activa no se carga el scroll suave ni se muestra la animacion de
  bienvenida.
- Ninguna animacion parpadea mas de tres veces por segundo.
- Nada se mueve de forma automatica y permanente en el eje de lectura salvo la
  marquesina, que se pausa al pasar el cursor y con el interruptor de fondos.

---

## 6. Formularios

- Toda entrada tiene `<label>` asociado.
- Ayudas y errores vinculados y descritos con texto.
- `autocomplete` correcto en identidad y contacto.
- `inputMode` adecuado en campos numericos.
- Los errores explican como corregir, no solo que algo esta mal.

---

## 7. Pendientes

- [ ] Auditoria con lectores reales (NVDA, VoiceOver, TalkBack).
- [ ] Pruebas con usuarios con baja vision en agencias.
- [ ] Validacion de contraste en las cinco paletas con herramienta automatica.
- [ ] Declaracion publica de accesibilidad enlazada desde el pie.
