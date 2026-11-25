#!/usr/bin/env python3
"""Rediseño de la landing (Research, 23/24-nov-2026) para publicar en HubSpot.

Parte de los archivos del prototipo (../index.html, ../styles.css, ../app.js) y genera en dist/:
  rediseno.hubl.html   plantilla de HubSpot (reemplaza la de /latam, /latam-a2 y /latam-b)
  vista-previa.html    la misma página sin HubL, para abrir en local (simula el encabezado de la página en HubSpot)

Cambios frente al prototipo:
  - Titular: el que está publicado hoy ("Tu idea o tu código, en un plano vivo"). El de la prueba de titulares
    se pone después de la reunión con Dirección del 24-nov (Sunil pidió no cambiarlo antes).
  - Enlaces reales: iniciar sesión (portal), "Trae tu código" (registro) y "Conoce Early Builders" (Developer Network).
  - Sin modo "por qué", sin aviso de prototipo y sin comentarios internos (HTML sin comentarios, JS y CSS minificados).
  - La hoja de estilos va después de {{ standard_header_includes }} y neutraliza el estilo de la caja de idea
    anterior que trae el encabezado de la página /latam en HubSpot.
Copia de preparación (25-nov-2026, documento de SEO de Dirección). NO se publica sin el visto bueno de David.
Sale en hubspot-seo-2026-11-25/dist/ y no toca hubspot/dist/. Frente a hubspot/build.py:
  - Marca escrita igual que en el sitio principal y en los datos estructurados propuestos: "Think4Ever" en el título.
  - Regla de copy de Dirección como comprobación del build: "Living Blueprint" / "plano vivo" no va solo en el
    título ni en el H1, y la página tiene un solo H1.
  - La vista previa local lleva el título y la descripción de la página en HubSpot (antes, el título viejo y la
    descripción vacía) y comprueba que conserva el noindex del encabezado de /latam.
Uso: python build.py
"""
import os, re, shutil, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
DIST = os.path.join(HERE, 'dist')
os.makedirs(DIST, exist_ok=True)
rd = lambda p: open(os.path.join(SRC, p), encoding='utf-8').read()


def rep(s, a, b):
    assert s.count(a) == 1, 'esperaba una sola vez: ' + a[:80]
    return s.replace(a, b)


def cut(s, a, b, new=''):
    """Reemplaza desde a (incluido) hasta b (incluido)."""
    i = s.index(a); j = s.index(b, i) + len(b)
    return s[:i] + new + s[j:]


H1_ES = '¿No programas? Igual puedes <em>diseñar y construir</em> tu app.'
H1_EN = 'No coding needed. <em>Design and build</em> your app.'
TITLE_EN = 'Think4Ever: design and build your app, no coding needed'
# Título y descripción en español: viven en Configuración de la página en HubSpot (no en la plantilla).
# Aquí solo alimentan la vista previa local. El título propuesto cambia "Think4ever" por "Think4Ever".
TITLE_ES = 'Think4Ever: diseña y construye tu app sin programar'
DESC_ES = ('¿No programas? Cuenta tu idea en tus palabras: Think4Ever te pregunta lo que falta, '
           'la diseña contigo y la construye. Crea tu cuenta gratis.')

# Regla de copy de Dirección (documento de SEO, 24-nov): "Living Blueprint" es el nombre de la idea, pero nunca va
# solo en un título o H1; siempre con una frase que la gente busca. Si algún día se usa, el build obliga a revisarlo.
COPY_RULE = re.compile(r'living\s+(system\s+)?(blueprint|map)|plano\s+vivo|mapa\s+vivo', re.I)
for _name, _val in (('H1_ES', H1_ES), ('H1_EN', H1_EN), ('TITLE_EN', TITLE_EN), ('TITLE_ES', TITLE_ES)):
    assert not COPY_RULE.search(re.sub(r'<[^>]+>', '', _val)), (
        'regla de copy: ' + _name + ' usa "Living Blueprint" o "plano vivo". Va con una frase que la gente busca, '
        'por ejemplo "un mapa de arquitectura siempre al día de tu código". Revisar antes de publicar.')
PORTAL_LOGIN = 'https://portal.think4ever.com/#/login'
SIGNUP = 'https://think4ever.com/#start'
EB = 'https://go.think4ever.com/es/developer-network-co'

# ------------------------------------------------------------------ app.js
js = rd('app.js')
js = rep(js, "    h1: 'Write your idea. Get <em>the full plan</em> of your app.',", "    h1: '" + H1_EN + "',")
js = rep(js, "document.title = en ? 'think4ever: write your idea and get the full plan of your app (proposal)' : esTitle;",
         "document.title = en ? '" + TITLE_EN + "' : esTitle;")
# Sin modo "por qué"
js = rep(js, "    renderPlan(currentEx);\n    if (whyOn) setWhy(true);   // el cambio de idioma reescribe los textos y se lleva los números\n",
         "    renderPlan(currentEx);\n")
js = cut(js, "  /* ---------- Modo \"por qué\"", "$('#why-close').addEventListener('click', function () { why.hidden = true; });\n")
js = rep(js, "  if (params.has('porque')) setWhy(true);\n", "")
# Enlaces reales en lugar de los avisos del prototipo
js = rep(js, """      if (kind === 'login') { track('login_link_clicked', {}); if (LIVE) return; e.preventDefault(); showToast(MSG[lang].login); return; }
      e.preventDefault();
      showToast(MSG[lang][kind]);
      return;""", """      if (kind === 'login') { track('login_link_clicked', {}); return; }
      if (kind === 'code') { el.href = registerUrl(); track('sign_up_start', { method: 'portal', from: 'code' }); return; }
      if (kind === 'eb') { el.href = ebUrl(); track('early_builders_clicked', {}); return; }
      return;""")
js = rep(js, "  $$('[data-proto=\"login\"]').forEach(function (a) { a.href = LOGIN_URL; });",
         """  $$('[data-proto="login"]').forEach(function (a) { a.href = LOGIN_URL; });
  function ebUrl() {
    var p = new URLSearchParams(), u = utms();
    Object.keys(u).forEach(function (k) { p.set(k, u[k]); });
    var q = p.toString();
    return '""" + EB + """' + (q ? '?' + q : '');
  }
  $$('[data-proto="code"]').forEach(function (a) { a.href = registerUrl(); });
  $$('[data-proto="eb"]').forEach(function (a) { a.href = ebUrl(); });""")
js = rep(js, "    es: { login: 'Prototipo: aquí va el inicio de sesión.', code: 'Prototipo: aquí va la ruta de analizar código.',\n          eb: 'Prototipo: aquí va la página de Early Builders.',\n          whyOn: 'Toca un número para ver la decisión y su finding.', whyBtnOff: 'Ocultar el porqué', n: 'Decisión ', ",
         "    es: { ")
js = rep(js, "    en: { login: 'Prototype: sign-in goes here.', code: 'Prototype: the analyze-code path goes here.',\n          eb: 'Prototype: the Early Builders page goes here.',\n          whyOn: 'Tap a number to see the decision and its finding.', whyBtnOff: 'Hide the reasons', n: 'Decision ', ",
         "    en: { ")
js = rep(js, "    protoFlag: 'Research proposal. It sends no data.',\n    whyBtn: 'See the reason for each decision',\n", "")
# Revisión en frío (24-nov, 1:55 p. m.): textos que la página ya no puede sostener
FIX = [  # (clave, español en el HTML, español nuevo, inglés en app.js, inglés nuevo)
    ('a1', 'No. Empiezas gratis y sin tarjeta. think4ever no es otra IA: le da el plan a la que ya usas para programar.',
           'Para empezar, no: creas tu cuenta gratis y sin tarjeta. think4ever no es otra IA: le da el plan a herramientas como Claude Code o Cursor.',
           'No. You start free with no card. think4ever is not another AI: it gives the plan to the one you already use to code.',
           'Not to start: you create your free account with no card. think4ever is not another AI: it gives the plan to tools like Claude Code or Cursor.'),
    ('sheetSub', 'Crea tu cuenta gratis para completarlo y guardarlo.', 'Crea tu cuenta gratis y arma ahí el plan completo de tu idea.',
           'Create your free account to complete it and save it.', 'Create your free account and build the full plan of your idea there.'),
    ('gateProg', 'Tu plan va en 3 de 6 partes', 'Vista previa: 3 de 6 partes',
           'Your plan is at 3 of 6 parts', 'Preview: 3 of 6 parts'),
    ('fine', 'Gratis, sin tarjeta y sin spam. Al continuar aceptas los Términos y la Política de privacidad.', 'Gratis, sin tarjeta y sin spam.',
           'Free, no credit card and no spam. By continuing you accept the Terms and the Privacy Policy.', 'Free, no credit card and no spam.'),
    ('tr2', 'Tu correo es para entrar a tu cuenta. Nada más.', 'Solo te escribimos sobre tu cuenta y lo que tú aceptes.',
           'Your email is for signing in to your account. Nothing else.', 'We only email you about your account and what you opt into.'),
    ('alsoEbA', 'Conoce Early Builders', 'Conoce el Developer Network', 'Meet Early Builders', 'Meet the Developer Network'),
    # 24-nov, reunión con Dirección (5:40 p. m.): Sunil aprueba la versión 5 en español. Subtítulo tal cual se probó.
    ('sub', 'Pantallas, quién la usa y qué pasa en cada paso. Con ese plan, tu IA construye sin improvisar.',
            'Cuéntala en tus palabras. Think4Ever te pregunta lo que falta, la diseña contigo y la construye.',
            'Screens, who uses it and what happens at each step. With that plan, your AI builds without improvising.',
            'Describe it in your own words. Think4Ever asks what is missing, designs it with you and builds it.'),
]
for k, _es, _es2, en, en2 in FIX:
    js = rep(js, "'" + en + "'", "'" + en2 + "'")
js = rep(js, "track('early_builders_clicked', {})", "track('developer_network_clicked', {})")
assert 'whyOn' not in js and 'setWhy' not in js and 'Prototip' not in js and 'prototype' not in js.lower().replace('prototipo', ''), 'quedan restos del prototipo'
open(os.path.join(DIST, 'app.js'), 'w', encoding='utf-8').write(js)

# ------------------------------------------------------------------ styles.css
css = rd('styles.css') + """
/* El encabezado de la página /latam en HubSpot trae estilos de la caja de idea anterior (rejilla con botones).
   Esta hoja va después de standard_header_includes; estas reglas devuelven la caja a su forma. */
.idea{grid-template-columns:minmax(0,1fr);column-gap:8px}
.idea textarea{grid-column:auto;grid-row:auto;height:auto}
.idea .idea-hint{grid-column:auto;grid-row:auto;padding:0 6px 2px}
.idea .send{grid-column:auto;grid-row:auto;justify-self:auto}
"""
open(os.path.join(DIST, 'styles.css'), 'w', encoding='utf-8').write(css)


def minify(name, kind):
    out = os.path.join(DIST, name.replace('.', '.min.'))
    args = [shutil.which('npx') or 'npx', '--yes', 'esbuild', os.path.join(DIST, name), '--minify', '--legal-comments=none',
            '--outfile=' + out] + (['--target=es2017'] if kind == 'js' else [])
    subprocess.run(args, check=True, capture_output=True, cwd=HERE)
    return open(out, encoding='utf-8').read().strip()


CSS_MIN = minify('styles.css', 'css')
JS_MIN = minify('app.js', 'js')

# ------------------------------------------------------------------ index.html
html = rd('index.html')
body = html[html.index('<body>') + len('<body>'):html.index('</body>')]
body = re.sub(r'<!--.*?-->\s*', '', body, flags=re.S)                  # comentarios internos fuera
body = re.sub(r' data-d="\d+"', '', body)                               # marcas del modo "por qué"
body = rep(body, 'Escribe tu idea. Recibe <em>el plan completo</em> de tu app.', H1_ES)
for k, es, es2, _en, _en2 in FIX:
    body = rep(body, 'data-t="' + k + '">' + es + '<', 'data-t="' + k + '">' + es2 + '<')
body = rep(body, '<a class="link-quiet" href="#" data-proto="login"', '<a class="link-quiet" href="' + PORTAL_LOGIN + '" data-proto="login"')
body = rep(body, '<a href="#" data-proto="code"', '<a href="' + SIGNUP + '" data-proto="code"')
body = rep(body, '<a href="#" data-proto="eb"', '<a href="' + EB + '" data-proto="eb"')
body = cut(body, '<span class="proto-flag"', '</button>\n')            # aviso de prototipo y botón del porqué
body = cut(body, '<aside class="why" id="why" hidden>', '</aside>\n')
body = rep(body, '<script src="decisiones.js"></script>\n', '')
body = rep(body, '<script src="app.js"></script>\n', '')
for bad in ('data-proto="login" data-t="login"', 'proto-flag', 'why-toggle', 'id="why"', 'decisiones', 'Propuesta', 'Prototipo'):
    if bad == 'data-proto="login" data-t="login"':
        continue
    assert bad not in body, 'queda en el HTML: ' + bad
assert '{{' not in body and '{%' not in body and '{#' not in body
assert len(re.findall(r'<h1[\s>]', body)) == 1, 'la página debe tener un solo H1 (documento de SEO, 3.4)'
assert '{{' not in CSS_MIN + JS_MIN and '{%' not in CSS_MIN + JS_MIN and '{#' not in CSS_MIN + JS_MIN, 'secuencia HubL en CSS o JS'

FONTS = """<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">"""

tpl = """<!--
  templateType: "page"
  isAvailableForNewContent: true
-->
{# content-mcp-managed #}
<!--
  templateType: page
  isAvailableForNewContent: true
  label: T4E · Landing Research A y B
-->
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ content.html_title }}</title>
<meta name="description" content="{{ content.meta_description }}">
""" + FONTS + """
{{ standard_header_includes }}
<style>
""" + CSS_MIN + """
</style>
</head>
<body>
""" + body.strip() + """
<script src="https://go.think4ever.com/hubfs/hub_generated/template_assets/1/405398805437/1794013397786/template_tracking-v3.min.js"></script>
<script>
""" + JS_MIN + """
</script>
{{ standard_footer_includes }}
</body>
</html>
"""
open(os.path.join(DIST, 'rediseno.hubl.html'), 'w', encoding='utf-8', newline='\n').write(tpl)

# Vista previa local: sin HubL y con el estilo heredado del encabezado de /latam, para probar que no rompe la caja
HEAD_LATAM = open(os.path.join(SRC, '..', 'integracion', 'encabezado-pagina-a.html'), encoding='utf-8').read()
prev = tpl.replace('{# content-mcp-managed #}\n', '').replace('<!--\n  templateType: "page"\n  isAvailableForNewContent: true\n-->\n', '', 1)
prev = prev.replace('{{ content.html_title }}', TITLE_ES)
prev = prev.replace('{{ content.meta_description }}', DESC_ES)
prev = prev.replace('{{ standard_header_includes }}', HEAD_LATAM)
assert 'noindex' in prev, 'la vista previa debe llevar el noindex del encabezado de /latam'
prev = prev.replace('{{ standard_footer_includes }}', '')
open(os.path.join(DIST, 'vista-previa.html'), 'w', encoding='utf-8', newline='\n').write(prev)

print('plantilla:', len(tpl.encode('utf-8')), 'bytes; CSS', len(CSS_MIN), 'JS', len(JS_MIN))
