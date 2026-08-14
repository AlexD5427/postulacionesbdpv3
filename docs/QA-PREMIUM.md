# QA premium, segunda pasada

## Rendimiento

- La posición del cursor, el halo, el magnetismo y el tilt se actualizan fuera del árbol React con `requestAnimationFrame`.
- No se aplica `will-change` de forma global. Los elementos solo usan transformaciones compositor-friendly.
- Los blobs, el grain, el sheen, el borde líquido y el rotador respetan `prefers-reduced-motion`.
- Cabecera, dock y paneles usan una capa de blur menor, con superficies azul institucionales explícitas.

## Microinteracciones

- Botón: default, hover, focus, active, disabled, loading, error y éxito mediante clases y estados existentes.
- Halo azul contextual en el punto de interacción.
- Targets táctiles de al menos 44px.
- El hover se desactiva como dependencia funcional en touch.
- El foco mantiene contraste visible para teclado.

## QA de flujo

Revisar en preview: portada, listado y detalle de convocatorias, registro, login, postulación única, panel aislado por cuenta, comparador, alertas, CV, evaluaciones, idiomas, TTS y reduced motion.

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

No hacer merge hasta que el check de Vercel esté verde y se prueben dos cuentas en sesiones separadas.