# Catalogo de funcionalidades

Mas alla del rediseno, la plataforma incorpora funciones que buscan resolver
problemas reales de quien postula. Cada una responde a una friccion concreta.

---

## 1. Motor de compatibilidad explicable

`lib/match.ts` · visible en tarjetas y en el detalle de cada convocatoria.

Calcula la afinidad perfil / puesto sobre 100 puntos y **muestra el desglose
completo**: cuantas habilidades coinciden, si la ciudad calza, si la
experiencia alcanza. La persona ve exactamente que le falta.

*Friccion que resuelve:* postular a ciegas y no saber por que nunca avanzas.

---

## 2. Alertas de convocatorias con previsualizacion

Criterios por area, ciudad y modalidad, con frecuencia inmediata, diaria o
semanal. Antes de guardar, muestra **cuantas convocatorias vigentes calzarian
hoy** con esos criterios.

*Friccion que resuelve:* enterarte de una convocatoria el dia que cierra.

---

## 3. Busquedas guardadas

Guarda la consulta completa (texto y filtros) y la reaplica en un clic.

*Friccion que resuelve:* reconstruir los mismos seis filtros cada semana.

---

## 4. Comparador de convocatorias

Hasta tres puestos lado a lado: requisitos, salario, modalidad, nivel,
competencias, cierre y tu compatibilidad en cada uno.

*Friccion que resuelve:* decidir entre dos ofertas con quince pestanas
abiertas.

---

## 5. Centro de documentos con lista de verificacion

Respaldos organizados y una lista de lo que conviene tener digitalizado, con
marca de lo obligatorio y de lo que ya esta cargado.

*Friccion que resuelve:* quedar fuera por un documento faltante.

> Nota tecnica: esta version registra solo la ficha del archivo. El binario no
> se almacena ni se envia a ningun servidor.

---

## 6. Generador de hoja de vida

Convierte el perfil en un CV institucional imprimible o exportable a PDF con el
dialogo nativo del navegador. Permite decidir si se incluyen contacto y
expectativa salarial. Estilos de impresion propios.

*Friccion que resuelve:* mantener el CV en Word y que quede desactualizado.

---

## 7. Simulador de evaluaciones

Banco de preguntas propio en cinco categorias (razonamiento, financiero,
normativa, ofimatica y competencias) con temporizador, comprobacion inmediata,
**explicacion de cada respuesta** e historial de intentos con mejor puntaje.

*Friccion que resuelve:* llegar al examen sin conocer el formato.

---

## 8. Agenda de fechas clave

Linea de tiempo con los cierres de tus convocatorias, con codigo de color por
urgencia y exportacion a `.ics` (una fecha o todas) para cualquier calendario.

*Friccion que resuelve:* olvidar la fecha limite.

---

## 9. Paleta de comandos

`Ctrl/Cmd + K`. Busca convocatorias, navega, cambia de idioma y ejecuta
acciones de accesibilidad sin tocar el mouse. Navegable con flechas.

*Friccion que resuelve:* perder tiempo navegando por menus.

---

## 10. Panel de accesibilidad completo

Lectura por voz multilingue, cinco paletas de color, escalado de texto, guia de
lectura, cursor grande, control de movimiento. Detalle en
[ACCESIBILIDAD.md](ACCESIBILIDAD.md).

*Friccion que resuelve:* que la interfaz decida por ti como debes leer.

---

## Funciones complementarias

| Funcion | Descripcion |
| --- | --- |
| **Completitud de perfil** | Nueve bloques ponderados, cada uno visible como cumplido o pendiente |
| **Recomendaciones** | Convocatorias ordenadas por tu compatibilidad real |
| **Bolsa de talento** | Visibilidad activable: tu perfil sigue vivo aunque no haya convocatoria abierta |
| **Centro de aprendizaje** | Guias, plantillas y articulos filtrables por tema |
| **Notificaciones internas** | Historial de avisos con contador de no leidas en cabecera y dock |
| **Convocatorias guardadas** | Marcador rapido desde cualquier tarjeta |
| **Compartir puesto** | API nativa de compartir con respaldo a portapapeles |
| **Cuatro idiomas** | Cambio inmediato con deteccion inicial del navegador |
| **Dock de accesos directos** | Barra posterior al login con ampliacion tipo lupa y contadores |
| **Perfil unico** | Datos, experiencia, formacion, habilidades e idiomas en un solo lugar |

---

## Fuera de alcance (decision explicita)

**Seguimiento de fase de postulacion.** Excluido a peticion del producto. La
arquitectura lo admite sin refactor: el tipo `Convocatoria` y
`CandidatoProvider` ya registran las postulaciones, de modo que agregar estados
de avance seria aditivo.
