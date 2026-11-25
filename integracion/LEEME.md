# Landing de Research conectada a la API: versión del 12 de noviembre

Parte del paquete de David Stephan (`t4e-landing-research-api-a-b.zip`, la versión publicada en HubSpot el 11 de noviembre) y le suma los cambios de Research del 12 de noviembre. El registro, la medición y la plantilla única para A y B quedan como él los dejó.

## Qué cambia frente a lo publicado

1. **Solo Google y correo.** Se quitó el botón de Microsoft (y el enlace a Microsoft Store). El equipo de desarrollo confirmó el 12 de noviembre que hoy solo hay ingreso con Google; Microsoft y Apple llegan después. En la variante B queda Google y el campo de correo.
2. **Opción 2 de la mascota** (pedido de Dirección del 11 de noviembre): el cerebro en el centro y detrás seis escenas que cambian solas, una por cada frase del texto que rota. La opción 1 (el cerebro quieto, que saca el plano y la interfaz al tocarlo) sigue siendo la que se ve por defecto.
   - Para verla: agregar `?hero=2` a la dirección.
   - Para dejarla fija en una página: en el HTML del encabezado, `<script>window.T4E_RS={hero:'2'}</script>`.
   - En la opción 2 no se cargan los cuadros del plano ni de la interfaz: pesa menos que la 1.
3. **"Plan gratis con 500 créditos"** también en la variante A, debajo de los botones de registro. Es el dato de la página de precios (Think Free: 500 créditos, una sola vez).
4. **Las rutas se llaman igual que en el portal.** Los cuatro botones de ruta y el mensaje de "estamos preparando" toman título y texto de la API (`/auth/signup-options`), en español e inglés. Si la API no responde, queda una copia del 12 de noviembre. En español cambian tres nombres: "Diseñar a partir de la intención", "Analizar código existente" y "Preparación para producción".
5. **Pantalla de paso al portal.** Al verificar el código o continuar con Google ya no hay un salto en seco: se ve "Abriendo tu espacio de trabajo" con la ruta elegida y la idea que escribió la persona, y de ahí pasa al portal.
6. **El espacio de trabajo como fondo del registro** (variante A). Al tocar "Crear mi plano", la página pasa a verse como el espacio de trabajo del producto, con sus colores: la idea queda como primer mensaje del chat, el mensaje de "estamos preparando" como respuesta, y a la derecha las pestañas y el lienzo del concepto cargando. Encima va la tarjeta de registro. No inventa el plano: solo muestra dónde va a quedar. En celular se ve solo la columna del chat. Los nombres de las pestañas en español son traducción de Research; en inglés son los del producto.
7. **La caja de idea queda sin los botones de adjuntar, conectar herramientas y dictar** (12 de noviembre, 5:30 p. m.). En la landing no hacían nada y el equipo de desarrollo los señaló como confusos. Queda el texto y el botón "Crear mi plano", en escritorio y en celular. Las cuatro rutas de abajo no cambian.
8. **Mismo lenguaje visual del portal** (12 de noviembre, 6 p. m.). La landing usa ahora la fuente del producto (Inter) y los valores del tema claro del portal: fondo `#f8fafc`, texto `#0f172a`, azul principal `#2563eb`, bordes `#e2e8f0`, naranja `#f97316`, esquinas de 12 y 16 px, sombras neutras y el mismo anillo de foco. El botón "Crear mi plano" pasa a ser azul, como el botón principal del portal. Se quedó en tema claro porque la mascota y las escenas tienen fondo blanco. No cambian textos, estructura, registro ni medición. La versión anterior queda en `respaldo-antes-de-unificar-2026-11-12/` dentro de la carpeta de Research.
9. **Todo en una sola pantalla** (12 de noviembre, noche, pedido de Dirección). Desde el logo hasta los botones de Google y correo cabe sin desplazar, en celular y en escritorio, en las dos variantes. La animación ya no depende del ancho: su alto sale del alto de la pantalla (21 % en celular, 30 % en escritorio), así que es lo que se encoge. El título, el texto que rota, la caja y las rutas se compactaron unos pocos píxeles. Medido en 360x540, 360x600, 390x664, 1366x650 y 1920x950.
10. **La principal es la del chat con las escenas.** La portada 2 (escenas) pasa a ser la de por defecto; la 1 queda con `?hero=1`. La variante B sigue en su página (`research-b` o `latam-b` en la dirección) o con `?v=b`.
11. **Jerarquía de la primera pantalla.** Una sola acción principal ("Crear mi plano"). En celular se quita el botón "Empieza gratis" del encabezado y queda "Iniciar sesión"; las cuatro rutas pasan a pastillas discretas; Google y correo siguen a la vista, más bajos y con la etiqueta "o crea tu cuenta gratis con".
12. La plantilla deja sin efecto el estilo viejo de la caja que traen las páginas de HubSpot en su encabezado (rejilla de tres botones y 120 px de alto).

## Qué hay que hacer en HubSpot

1. Subir las seis imágenes de `assets-nuevos/escenas/` a los archivos de HubSpot, en `t4e-landing-research/assets/escenas/` (90 KB en total). Sin ellas, la opción 2 muestra el cerebro solo; la opción 1 no cambia.
2. Reemplazar la plantilla (templateId 407933673434) por `hubspot/research.hubl.html`.
3. Los encabezados de las páginas A y B no cambian.

Si ya está publicada la versión del mediodía, solo hace falta el paso 2: las escenas ya están arriba.

## Qué trae

- `hubspot/research.hubl.html`: la plantilla nueva. `hubspot/encabezado-pagina-a.html` y `encabezado-pagina-b.html`: los mismos de la versión publicada.
- `vista-previa/research-a.html` y `research-b.html`: se abren con doble clic. Fuera de go.think4ever.com quedan en modo demostración: no crean cuentas ni llaman a la API. Las escenas de la opción 2 se ven cuando estén subidas a HubSpot.
- `fuente/`: `app.js` y `styles.css` integrados, sus versiones minificadas y `rsbuild.py`, el mismo script con cuatro ajustes (lee los originales de la carpeta de arriba, las escenas salen de la carpeta de cuadros, la opción 2 no carga el plano ni la interfaz, ya no hay Microsoft, textos de ruta desde la API y pantalla de paso).
- `assets-nuevos/escenas/`: las seis escenas.

## Comprobado

En el navegador de escritorio, en modo demostración: caja de idea (guarda la elección y abre la hoja con Google y Correo), registro con correo hasta la pantalla del código, variante B, opción 2 con las seis escenas, nombres de ruta en los dos idiomas, pantalla de paso, fondo de espacio de trabajo, y sin errores en consola.

## Pendiente

- Un registro real de principio a fin en las dos variantes, con un correo nuevo, ya publicada la plantilla.
- Verla en un teléfono real y dentro del navegador de Instagram y Facebook.
- Visto bueno de Nury a la línea legal.
- Que el portal abra en tema claro cuando la persona llega desde la landing. Hoy abre oscuro y no hay un parámetro para pedirlo; es un cambio del equipo de desarrollo.
