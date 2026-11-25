# Landing de LATAM de Think4Ever (Research)

Repositorio compartido del equipo de Research para editar la landing de LATAM.

## Cómo trabajar aquí

1. Clonar el repositorio y crear una rama por cambio (`git checkout -b titular-nuevo`).
2. Editar y revisar en local: `python -m http.server 3018` desde la raíz y abrir `http://localhost:3018/rediseno-2026-11-23/`.
3. Subir la rama y abrir un pull request. Otra persona del equipo lo revisa antes de unirlo a `main`.
4. Publicar: la página vive en HubSpot. `rediseno-2026-11-23/hubspot-seo-2026-11-25/build.py` (y antes `rediseno-2026-11-23/hubspot/build.py`) genera el archivo `dist/rediseno.hubl.html` que se pega en la página de HubSpot. Unir a `main` no publica nada por sí solo.

## Qué hay en cada carpeta

- `rediseno-2026-11-23/`: la versión vigente (rediseño del 23-nov y ajustes posteriores), con sus carpetas de armado para HubSpot.
- Raíz (`index.html`, `b.html`, `app.js`, `styles.css`), `integracion/` y `tools/`: el prototipo anterior del 11 y 12-nov, que se conserva como referencia. Su documentación sigue abajo.
- `assets/`: imágenes optimizadas. Los originales sin optimizar no están en el repositorio.

No se guardan llaves ni contraseñas en este repositorio.

---

# Think4Ever, prototipo de landing (MVP de Research)

Prototipo para conversar el rediseño de la landing. No es la página oficial, no está publicado y no envía datos a ningún lado.

## Cómo se corre

```bash
python -m http.server 3018 --directory "C:\Users\dacof\Downloads\t4e-landing-mvp"
```

Abrir `http://localhost:3018` (variante A, caja de idea) o `http://localhost:3018/b.html` (variante B, formulario). Atajos:

- `?lang=en` o `?lang=es`: idioma. Sin eso usa el del navegador; el botón EN/ES del encabezado lo cambia.
- `?hero=1` (por defecto): el cerebro quieto; al tocarlo saca el plano y la interfaz. `?hero=2`: el cerebro en el centro y detrás escenas que cambian solas, una por cada frase del texto rotativo.
- `?vista=reposo`, `?vista=blueprint`, `?vista=uxui`: estado fijo de la mascota.
- `?paso=1`, `?paso=2`, `?paso=3`: salta a ese paso de "Cómo funciona".
- `?inapp=1`: simula el navegador interno de Instagram o Facebook.

## Dos variantes para la prueba A/B

- **A, caja de idea** (`index.html`): caja con los controles de la plataforma (adjuntar código, conectar repositorio, dictar), las cuatro rutas y el registro en una línea.
- **B, formulario** (`b.html`): Google y un solo campo de correo.

Todo lo demás es idéntico, para que la prueba mida una sola diferencia. `b.html` es una copia de `index.html` con `<body data-v="b">`: si se edita `index.html`, hay que volver a copiarlo. También sirve `?v=b`.

## Qué falta conectar para publicarla

- Botones `data-proto="google"` y `"email"`: en el prototipo solo muestran un aviso. La versión conectada al registro está en `integracion/` (ver `integracion/LEEME.md`).
- Microsoft y Apple: no van por ahora. El equipo de desarrollo confirmó el 12-nov que hoy solo hay ingreso con Google; se agregan cuando los habiliten.
- Envío de la caja de idea (`submitIdea` en `app.js`) y del formulario (`#account-form`): hoy no envían nada.
- El adelanto del plano es simulado (`PLANS` en `app.js`).
- Medición: eventos para clic en cada proveedor, idea enviada y formulario enviado, más el pixel de Meta.

## Archivos

- `index.html`: estructura y textos en español (variante A). `b.html`: la misma página con la variante B.
- `styles.css`: paleta, diseño y animaciones. Pensado primero para 390 px.
- `app.js`: textos en inglés (objeto `EN`), texto rotativo, mascota, caja de idea, registro flotante, "Cómo funciona" y avisos de prototipo.
- `assets/mascota/`: cuadros de la mascota (`idle`, `blueprint`, `uxui`).
- `assets/como/`: cuadros que el scroll recorre en "Cómo funciona".
- `assets/escenas/`: las seis escenas de fondo de la opción `?hero=2` (90 KB en total).
- `assets/originales/`: imágenes y clips de Higgsfield sin procesar. `cerebro/` es la mascota actual; `cuadros-punto-*` son los cuadros de la mascota anterior (el punto).
- `tools/cortar_cuadros.py`: corta un clip en cuadros WebP con fondo blanco.
- `capturas/`: capturas en celular y escritorio.

## Cómo se integran los visuales

Los clips tienen fondo blanco. Se cortan en cuadros y se pintan en un `<canvas>` con `mix-blend-mode: multiply`: el blanco desaparece y la mascota queda directo sobre la página, sin marco. Si el lienzo vive dentro de un contenedor con `position: sticky` o `transform`, ese contenedor necesita el mismo color de fondo de la página.

Para cambiar un clip: cortar con `tools/cortar_cuadros.py` y actualizar `count` en `SEQ` o `HOW` al inicio de `app.js`.

## Textos en dos idiomas

Cada elemento con `data-t="clave"` trae el español en el HTML y toma el inglés de `EN[clave]` en `app.js`. `data-t-ph` cambia el placeholder y `data-t-aria` el `aria-label`. Para cambiar un texto hay que tocar los dos lados.

## Pendiente antes de usarlo en serio

- Logo: el símbolo está redibujado y el texto es aproximado. Reemplazar por el `logo.svg` oficial.
- Fuente DM Sans cargada desde Google Fonts. Para producción, servirla local.
- Probar en un celular real y dentro de Instagram y Facebook, sobre todo el botón de Google.
- En el prototipo, los botones de Google y correo no están conectados: muestran un aviso. En `integracion/` sí lo están.
- Textos legales, proveedores de registro, respuestas del FAQ y datos de producto: confirmar con Publicidad y Dirección.
