# QA senior, iteración premium

## Alcance revisado

Rutas: `/`, `/convocatorias`, `/convocatorias/[slug]`, `/login`, `/registro`, `/panel`, `/panel/cv`, `/evaluaciones`, `/recursos`, `/bolsa`.

## Cambios de rendimiento

- `CursorGlow` actualiza el DOM directamente en `requestAnimationFrame`, no provoca un render de React por frame.
- `Counter` escribe el valor animado en un nodo ref, evitando renders por frame.
- Botones interpolan magnetismo con RAF y solo animan `transform`, `opacity`, sombra y color en microinteracciones.
- `prefers-reduced-motion` corta rotador, parallax visual, glow y fondos animados.
- El sistema premium reduce el blur de cabecera, dock y paneles para bajar coste de composición.
- Los estados táctiles no dependen de hover.

## Matriz funcional

- [ ] Crear cuenta con email nuevo, password de 8+ caracteres y términos aceptados.
- [ ] Rechazar email inválido, password corta y cuenta duplicada.
- [ ] Login con credenciales correctas e incorrectas.
- [ ] Guardar convocatoria y conservarla tras recargar.
- [ ] Postular con sesión iniciada y ver la postulación en Panel > Guardadas.
- [ ] Bloquear segunda postulación al mismo puesto.
- [ ] Confirmar aislamiento entre dos cuentas en incógnito.
- [ ] Probar `/panel` sin sesión y recuperar navegación a login.
- [ ] Probar comparador, alertas, documentos, agenda `.ics` y CV.
- [ ] Navegar con teclado, `Ctrl/Cmd + K`, `Alt + A`, `Alt + L` y `Esc`.
- [ ] Probar español, inglés, quechua y aymara.
- [ ] Activar contraste alto y movimiento reducido.

## Verificación de despliegue

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

El check de Vercel debe estar verde antes de fusionar. La autenticación continúa siendo local hasta conectar API, sesiones httpOnly, rate limiting y almacenamiento seguro.
