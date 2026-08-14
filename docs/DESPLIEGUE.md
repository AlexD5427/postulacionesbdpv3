# Despliegue

## 1. Vercel (recomendado)

El proyecto es un Next.js 15 estandar: Vercel lo detecta sin configuracion.

1. **Importar** el repositorio en Vercel.
2. Ajustes detectados automaticamente:
   - Framework: Next.js
   - Build: `npm run build`
   - Output: `.next`
   - Node: **22.x** (fijado en `package.json` y `.nvmrc`)
3. **Variables de entorno** (ninguna es obligatoria para el primer despliegue):

| Variable | Necesidad | Descripcion |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recomendada | URL publica, usada por metadata y Open Graph |
| `DATA_SOURCE` | Opcional | `seed` (por defecto), `http` o `postgres` |
| `CONVOCATORIAS_API_URL` | Si `DATA_SOURCE=http` | Endpoint institucional de convocatorias |
| `CONVOCATORIAS_API_TOKEN` | Opcional | Token Bearer del endpoint |
| `DATABASE_URL` | Si `DATA_SOURCE=postgres` | Cadena de conexion |
| `SMTP_URL`, `ALERTAS_FROM` | Futuro | Envio de alertas por correo |

4. **Desplegar.** Sin variables, la aplicacion arranca en modo semilla con toda la experiencia navegable.

### Diagnostico del log de Vercel

El log que compartiste **no contiene un error de build**: compilo, tipó, genero las 22 paginas y finalizo correctamente. Las lineas `Warning` y `npm warn deprecated` son avisos, no fallos; aun asi se corrigieron para que el siguiente deploy no arrastre versiones inseguras u obsoletas.

- `engines.node >=18.18.0` era demasiado abierto: podia mover el build a un major futuro. Ahora esta fijado a `22.x`, una version disponible y soportada por Vercel.
- `next@15.3.3` tenia un aviso de seguridad RSC. Se actualizo a `15.5.7`, version parcheada segun el advisory oficial.
- React se actualizo a `19.1.2`, tambien parcheado.
- ESLint se actualizo a `9.x` y el script `lint` usa el formato flat config actual; esto elimina la cadena de dependencias obsoletas asociada a ESLint 8 (`inflight`, `rimraf`, `glob`, `@humanwhocodes/*`).
- Se dejo `.nvmrc` en `22` para que desarrollo local y Vercel usen el mismo major.

Antes de aprobar el PR, corre localmente:

```bash
npm install
npm run typecheck
npm run lint
npm run build
```

En Vercel, si el proyecto tiene una version de Node fijada manualmente en Settings, ponla tambien en **22.x** o selecciona **Default** para que respete la configuracion del repositorio.

---

## 2. Verificacion previa al merge

```bash
npm install
npm run build
npm run typecheck
npm run lint
npm run start
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
