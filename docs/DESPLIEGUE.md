# Despliegue

## 1. Vercel (recomendado)

El proyecto es un Next.js 15 estandar: Vercel lo detecta sin configuracion.

1. **Importar** el repositorio en Vercel.
2. Ajustes detectados automaticamente:
   - Framework: Next.js
   - Build: `npm run build`
   - Output: `.next`
   - Node: 18.18 o superior (definido en `package.json`)
3. **Variables de entorno** (ninguna es obligatoria para el primer despliegue):

| Variable | Necesidad | Descripcion |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recomendada | URL publica, usada por metadata y Open Graph |
| `DATA_SOURCE` | Opcional | `seed` (por defecto), `http` o `postgres` |
| `CONVOCATORIAS_API_URL` | Si `DATA_SOURCE=http` | Endpoint institucional de convocatorias |
| `CONVOCATORIAS_API_TOKEN` | Opcional | Token Bearer del endpoint |
| `DATABASE_URL` | Si `DATA_SOURCE=postgres` | Cadena de conexion |
| `SMTP_URL`, `ALERTAS_FROM` | Futuro | Envio de alertas por correo |

4. **Desplegar.** Sin variables, la aplicacion arranca en modo semilla con toda
   la experiencia navegable.

---

## 2. Verificacion previa al merge

```bash
npm ci
npm run build      # debe compilar sin errores
npm run typecheck  # TypeScript estricto
npm run lint       # ESLint
npm run start      # revisar en local la compilacion de produccion
```

Lista de comprobacion manual:

- [ ] Animacion de bienvenida se muestra una vez y da paso a la portada.
- [ ] Portada completa en los cuatro idiomas, sin desbordes de texto.
- [ ] Riel de convocatorias: arrastre, rueda y flechas del teclado.
- [ ] Filtros, orden, busqueda guardada y comparador.
- [ ] Registro, acceso, edicion de perfil y persistencia al recargar.
- [ ] Dock visible tras el acceso, con contadores correctos.
- [ ] Simulador: temporizador, explicaciones e historial.
- [ ] Hoja de vida: vista previa e impresion o PDF.
- [ ] Panel de accesibilidad: alto contraste, cinco paletas, escalado, TTS.
- [ ] `Ctrl+K`, `Alt+A`, `Alt+L` y `Esc`.
- [ ] Movil real: cabecera, menu a pantalla completa y dock.
- [ ] `prefers-reduced-motion` activo: la pagina sigue usable y sin animacion.

---

## 3. Notas de compatibilidad

- **Cabeceras de seguridad** basicas en `next.config.mjs`
  (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`).
- **`backdrop-filter`** tiene respaldo con `@supports not`: en navegadores sin
  soporte se pierde el desenfoque, nunca la legibilidad.
- **`color-mix()` y `@property`** se usan solo para refinamientos visuales; su
  ausencia degrada el efecto, no la funcionalidad.
- **Sin imagenes externas:** todo el arte es SVG y CSS, por lo que no hay
  dominios que autorizar en `next.config`. Si mas adelante se suben fotografias
  reales, colocarlas en `public/media` y usar `next/image`.
- **ESLint no bloquea el despliegue** (`eslint.ignoreDuringBuilds`), pero el
  chequeo de tipos **si**: un error de TypeScript detiene el build a proposito.

---

## 4. Alojamiento alternativo

Cualquier plataforma con Node 18+ sirve:

```bash
npm ci && npm run build && npm run start   # puerto 3000 por defecto
```

Para exportacion estatica habria que renunciar a ISR y a las rutas
revalidadas; no es el modo recomendado.
