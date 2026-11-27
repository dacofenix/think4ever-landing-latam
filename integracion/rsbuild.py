#!/usr/bin/env python3
"""Landing de Research (variantes A y B) conectada a la API de registro.
Parte de los archivos originales de Research (orig/index.html, orig/styles.css, orig/app.js) y genera:
  dist/app.js, dist/styles.css        fuentes ya integradas
  dist/a.html, dist/b.html            vista previa local (modo demostración, no llama a la API)
  dist/research.hubl.html             plantilla para HubSpot (una sola; la variante sale de la dirección de la página)
"""
import base64, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ORIG = os.path.dirname(HERE)   # los originales de Research: la carpeta de arriba
DIST = os.path.join(HERE, 'dist')
os.makedirs(DIST, exist_ok=True)
rd = lambda p: open(p, encoding='utf-8').read()

def rep(s, a, b, count=1):
    assert a in s, 'no encontrado: ' + a[:70]
    return s.replace(a, b) if count is None else s.replace(a, b, count)

def cut(s, a, b, new, keep_end=False):
    i = s.index(a); j = s.index(b, i)
    return s[:i] + new + s[j if keep_end else j + len(b):]

# --------------------------------------------------------------------- app.js
js = rd(os.path.join(ORIG, 'app.js'))
js = rep(js, "/* Think4Ever, prototipo de landing. Sin dependencias. No envía datos a ningún lado. */",
"""/* Think4ever, landing de Research (variantes A y B) conectada al registro. Sin dependencias.
   Registro: Think4Ever Landing API v3 (la misma del registro v3 de go.think4ever.com).
   Medición: los eventos de Research van al dataLayer; el envío a HubSpot y generate_lead / sign_up
   los hace tracking-v3.js, que envuelve window.fetch.
   Fuera de think4ever.com (vista previa de HubSpot, archivo local) queda en modo demostración y no llama a la API.
   Ajustes por página: window.T4E_RS = { assets: 'https://…/assets/', posters: { mascot, how: [] } } */""")

# Cuadros: si la carpeta de cuadros no está publicada, se queda con una imagen fija
js = rep(js, """  var SEQ = {
    idle:      { path: 'assets/mascota/idle/f_',      count: 78 },
    blueprint: { path: 'assets/mascota/blueprint/f_', count: 76, label: 'Living Blueprint' },
    uxui:      { path: 'assets/mascota/uxui/f_',      count: 76, label: 'UX / UI' }
  };""", """  var CFG = window.T4E_RS || {};
  // Carpeta de los cuadros en los archivos de HubSpot. Mientras no exista, la mascota y "Cómo funciona"
  // se muestran con imágenes fijas (CFG.posters) y la página funciona igual.
  var ASSETS = CFG.assets || 'https://go.think4ever.com/hubfs/t4e-landing-research/assets/';
  var POSTERS = CFG.posters || {};
  var animated = false;
  var SEQ = {
    idle:      { path: ASSETS + 'mascota/idle/f_',      count: 78 },
    blueprint: { path: ASSETS + 'mascota/blueprint/f_', count: 76, label: 'Living Blueprint' },
    uxui:      { path: ASSETS + 'mascota/uxui/f_',      count: 76, label: 'UX / UI' }
  };""")
js = js.replace("'assets/escenas/' + name", "ASSETS + 'escenas/' + name")
assert "'assets/" not in js.replace("'assets/como", "").replace("'assets/mascota", ""), "queda una ruta local"
js = rep(js, "var HOW = { path: 'assets/como/f_', count: 123 };", "var HOW = { path: ASSETS + 'como/f_', count: 123 };")
js = rep(js, "title: 'Think4Ever: your idea or your code, as a living blueprint (prototype)',", "title: 'Think4ever: your idea or your code, as a living blueprint',")
js = rep(js, "title: 'Think4Ever: tu idea o tu código, en un plano vivo (prototipo)',", "title: 'Think4ever: tu idea o tu código, en un plano vivo',")
js = rep(js, "    protoFlag: 'Research prototype. It sends no data.',\n", "")
js = cut(js, "    sheetTitle: 'This is how your blueprint starts.',", "    sheetSub:", "    sheetTitle: 'This is how your blueprint starts.',\n    sheetSub:", keep_end=False)
js = rep(js, "    inappFine: 'You can also tap the ⋯ menu at the top and choose “Open in browser”.'",
"""    inappFine: 'You can also tap the ⋯ menu at the top and choose “Open in browser”.',
    codeTitle: 'Check your email',
    codeLabel: '6-digit code',
    codeVerify: 'Verify',
    codeResend: 'Send a new code',
    codeChange: 'Use another email',
    wsProject: 'New project',
    wsNew: 'New chat',
    wsHistory: 'History',
    wsT1: 'Requirements', wsT2: 'Functional Architecture', wsT3: 'Concept', wsT4: 'Business Flows',
    wsT5: 'Roles & Permissions', wsT6: 'Business Rules', wsT7: 'UI Designs',
    wsBlocks: 'All Blocks',
    wsInput: 'Describe the project you want to create...'""")
# Mensajes nuevos (los de registro vienen del registro v3 ya publicado)
js = rep(js, "        menu: 'Toca el menú ⋯ de arriba y elige «Abrir en el navegador».',\n        copied: 'Enlace copiado.'",
"""        menu: 'Toca el menú ⋯ de arriba y elige «Abrir en el navegador».',
        copied: 'Enlace copiado.',
        later: 'Disponible al entrar a la plataforma.',
        signin: 'Iniciar sesión',
        codeText: 'Enviamos un código de 6 dígitos a {email}.',
        resent: 'Te enviamos un código nuevo.',
        redirecting: 'Listo. Te llevamos al portal…',
        demoDone: 'Vista previa: aquí se abre el portal.',
        errEmail: 'Escribe un correo válido.',
        errCode: 'Escribe los 6 dígitos del código.',
        errNetwork: 'No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.',
        errGeneric: 'Algo salió mal. Inténtalo de nuevo.'""")
js = rep(js, "        menu: 'Tap the ⋯ menu at the top and choose “Open in browser”.',\n        copied: 'Link copied.'",
"""        menu: 'Tap the ⋯ menu at the top and choose “Open in browser”.',
        copied: 'Link copied.',
        later: 'Available once you are inside the platform.',
        signin: 'Sign in',
        codeText: 'We sent a 6-digit code to {email}.',
        resent: 'We sent you a new code.',
        redirecting: 'Done. Taking you to the portal…',
        demoDone: 'Preview: the portal opens here.',
        errEmail: 'Enter a valid email.',
        errCode: 'Enter the 6-digit code.',
        errNetwork: "We couldn't connect. Check your connection and try again.",
        errGeneric: 'Something went wrong. Please try again.'""")
js = rep(js, "    restartTyping();\n  }\n  langBtn.addEventListener", "    restartTyping();\n    wireLinks();\n    if (st.email) setCodeText();\n    updatePrep();\n  }\n  langBtn.addEventListener")
js = rep(js, "    applyLang();\n    if (lastIdea) showPreview(lastIdea, true);\n", "    applyLang();\n")

# Mascota: imagen fija hasta comprobar que los cuadros existen
js = cut(js, "  loadSeq(SEQ.idle);\n  SEQ.idle.frames[0].onload", "  function nextShow()", """  // Imagen fija mientras se comprueba si la carpeta de cuadros está publicada
  var still = { frames: [new Image()] };
  if (POSTERS.mascot) {
    still.frames[0].onload = function () { if (!animated) draw(still, 0); };
    still.frames[0].src = POSTERS.mascot;
  }

  function nextShow()""", keep_end=False)
js = cut(js, "  // Estado fijo para capturas y para mostrarlo: ?vista=reposo | blueprint | uxui", "  // Tocar la mascota:", """  // Estado fijo para capturas y para mostrarlo: ?vista=reposo | blueprint | uxui
  var fixed = params.get('vista');
  function startAnim() {
    animated = true;
    lastDrawn = null;
    loadSeq(SEQ.idle);
    if (ready(SEQ.idle.frames[0])) draw(SEQ.idle, 0); else SEQ.idle.frames[0].onload = function () { draw(SEQ.idle, 0); };
    if (fixed && SEQ[fixed] && fixed !== 'idle') {
      var fseq = SEQ[fixed];
      loadSeq(fseq);
      var last = fseq.frames[fseq.frames.length - 1];
      last.onload = function () { draw(fseq, fseq.frames.length - 1); };
      setOpen(fseq);
    } else if (fixed || reduced) {
      /* queda el primer cuadro: la mascota sola */
    } else {
      if (HERO !== '2') { loadSeq(SEQ.blueprint); setTimeout(function () { loadSeq(SEQ.uxui); }, 1200); }
      setInterval(tick, 1000 / FPS);
    }
    // "Cómo funciona" pasa de las imágenes fijas a los cuadros
    if (HOW.frames) { HOW.frames = null; hLast = -1; startHow(); }
  }
  // La comprobación espera a que la página pinte, para no competir con el registro
  window.addEventListener('load', function () {
    var probe = new Image();
    probe.onload = startAnim;
    probe.src = SEQ.idle.path + pad(1) + '.webp';
  });

  // Tocar la mascota:""", keep_end=False)
js = rep(js, "    if (fixed || reduced || HERO === '2') return;\n    if (phase === 'idle') wantOpen = true; else closeNow();", "    if (!animated || fixed || reduced || HERO === '2') return;\n    if (phase === 'idle') wantOpen = true; else closeNow();")

# Rutas y controles de la caja
js = rep(js, "      chips.forEach(function (c) { c.classList.toggle('is-on', c === chip); });", "      chips.forEach(function (c) { c.classList.toggle('is-on', c === chip); });\n      st.path = chip.dataset.path; st.source = '';\n      track('intent_selected', ctx());")
js = rep(js, "      if (t === 'code') { chips.filter(function (c) { return c.dataset.path === 'code'; })[0].click(); return; }\n      showToast(T.msg[t]);",
"""      // Analizar código y conectar repositorio eligen la ruta de código (el repositorio se conecta adentro)
      if (t === 'code' || t === 'repo') {
        chips.filter(function (c) { return c.dataset.path === 'code'; })[0].click();
        if (t === 'repo') st.source = 'vcs';
        return;
      }
      showToast(T.msg.later);""")
js = cut(js, "  function submitIdea() {", "  /* ---------- Hojas ---------- */", """  function submitIdea() {
    var text = idea.value.trim();
    if (!text) {
      hint.textContent = lang === 'en' ? EN.ideaHint : hint._es;
      hint.hidden = false;
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      idea.focus();
      return;
    }
    if (st.busy) return;
    var send = form.querySelector('.send');
    st.busy = true; send.disabled = true;
    saveIntent().then(function (res) {
      st.busy = false; send.disabled = false;
      if (res !== true) { hint.textContent = res; hint.hidden = false; return; }
      $('#sheet-quote').textContent = text;
      showWs(text);
      updatePrep();
      openSheet($('#sheet'));
      track('auth_form_viewed', ctx());
      st.viewed = true;
    });
  }

  /* ---------- Hojas ---------- */""", keep_end=False)

js = rep(js, "if (HOW.frames) return;\n    loadSeq(HOW, small ? 2 : 1);     // en celular, la mitad de los cuadros",
"""if (HOW.frames) return;
    if (!animated) {
      // Sin cuadros publicados: tres imágenes fijas, una por paso
      HOW.frames = (POSTERS.how || []).map(function (src) { var im = new Image(); im.onload = updateHow; im.src = src; return im; });
      updateHow();
      return;
    }
    loadSeq(HOW, small ? 2 : 1);     // en celular, la mitad de los cuadros""")
js = rep(js, "    if (HOW.frames) drawHow(Math.round(p * (HOW.frames.length - 1)));", "    if (HOW.frames && HOW.frames.length) drawHow(Math.round(p * (HOW.frames.length - 1)));")

# Variante B: el formulario registra de verdad
js = rep(js, "    if (!ok) { email.focus(); return; }\n    showToast(T.msg.account);", "    emailHint.textContent = T.msg.errEmail;\n    if (!ok) { email.focus(); return; }\n    register(email.value.trim(), emailHint, accForm.querySelector('button[type=\"submit\"]'));")

# Registro real: reemplaza el bloque de avisos de prototipo
API = r"""  /* ---------- Registro (Think4Ever Landing API v3) ---------- */

  var LIVE = /(^|\.)think4ever\.com$/.test(location.hostname);
  var API = 'https://portal.think4ever.com/api';
  var PORTAL = 'https://portal.think4ever.com/';
  var LOGIN_URL = PORTAL + '#/login';
  var TERMS_URL = PORTAL + 'legal.html';
  var PRIVACY_URL = 'https://think4ever.com/privacy-policy';
  var MODES = { intent: 'design', code: 'analyze', hardening: 'harden', prototype: 'prototype' };
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var GITHUB_URL = /https?:\/\/(www\.)?github\.com\/[^\/\s]+\/[^\/\s]+/i;
  // Igual que la plantilla publicada por Publicidad: con la portada 2 la variante A reporta research_a2
  var FLOW = 'research_' + variant + (variant === 'a' && HERO === '2' ? '2' : '');
  var REF = params.get('ref') || '', INV = params.get('inv') || '';
  var st = { path: 'intent', source: '', intent: null, chosen: false, email: '', busy: false, done: false, resendWait: false };

  function dl(o) { window.dataLayer = window.dataLayer || []; window.dataLayer.push(o); }
  /* Eventos con la nomenclatura de Research. Los parámetros que no aplican van como undefined para que GTM
     no arrastre el valor anterior. Nunca se envía el correo ni el texto de la idea. */
  var EV_KEYS = ['flow_variant', 'build_mode', 'import_source', 'in_app_browser', 'prompt_length', 'error_code', 'http_status', 'auth_mode', 'signin_method', 'method', 'lang'];
  function track(name, p) {
    var o = { event: name };
    EV_KEYS.forEach(function (k) { o[k] = undefined; });
    o.flow_variant = FLOW; o.lang = lang; o.in_app_browser = inApp;
    Object.keys(p || {}).forEach(function (k) { if (EV_KEYS.indexOf(k) >= 0 && p[k] !== undefined && p[k] !== '') o[k] = p[k]; });
    dl(o);
  }
  function ctx(extra) {
    var p = { auth_mode: 'signup' };
    if (variant === 'a') {
      var f = st.chosen && st.intent ? st.intent.fields : choiceFields();
      p.build_mode = f.build_mode;
      if (f.import_source) p.import_source = f.import_source;
      p.prompt_length = idea.value.trim().length;
    }
    Object.keys(extra || {}).forEach(function (k) { p[k] = extra[k]; });
    return p;
  }
  function utms() {
    var o = {};
    UTM_KEYS.forEach(function (k) { if (params.get(k)) o[k] = params.get(k); });
    if (!Object.keys(o).length) {
      try {
        var saved = JSON.parse(sessionStorage.getItem('t4e_utms') || 'null') || {};
        UTM_KEYS.forEach(function (k) { if (saved[k]) o[k] = saved[k]; });
      } catch (e) { /* sin sessionStorage */ }
    }
    return o;
  }
  function merge() {
    var o = {};
    [].slice.call(arguments).forEach(function (src) { Object.keys(src || {}).forEach(function (k) { o[k] = src[k]; }); });
    return o;
  }
  function partner() { var o = {}; if (REF) o.ref_key = REF; if (INV) o.invite_token = INV; return o; }

  /* Siempre con credentials: 'include' y por window.fetch, para pasar por el envoltorio de tracking-v3.js */
  function call(path, body, method) {
    if (!LIVE) {
      return new Promise(function (ok) {
        setTimeout(function () {
          if (path.indexOf('/auth/signup-intent') === 0) ok({ ok: true, status: 201, data: { intent_token: 'demo' } });
          else if (path.indexOf('/auth/register') === 0) ok({ ok: true, status: 201, data: {} });
          else ok({ ok: true, status: 200, data: {} });
        }, 400);
      });
    }
    var url = API + path + (path.indexOf('?') >= 0 ? '&' : '?') + 'lang=' + lang;
    var init = { method: method || 'POST', credentials: 'include', headers: { Accept: 'application/json' } };
    if (body) { init.headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(body); }
    return window.fetch(url, init).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) { return { ok: res.ok, status: res.status, data: data || {} }; });
    }, function () { return { ok: false, status: 0, data: {}, network: true }; });
  }

  /* La elección: ruta, idea y, en las rutas de código, de dónde viene el código */
  function choiceFields() {
    var mode = MODES[st.path] || 'design', f = { build_mode: mode }, text = idea.value.trim();
    if (text) f.project_prompt = text.slice(0, 4000);
    if (mode === 'analyze' || mode === 'harden') {
      var m = text.match(GITHUB_URL);
      if (m) { f.import_source = 'github'; f.import_url = m[0]; }
      else f.import_source = st.source || 'zip';
    }
    return f;
  }
  /* Guarda la elección. Devuelve true, o el mensaje de error si la API la rechaza. */
  function saveIntent() {
    var f = choiceFields(), sig = JSON.stringify(f);
    if (st.intent && st.intent.sig === sig) { st.chosen = true; return Promise.resolve(true); }
    return call('/auth/signup-intent', merge(f, utms())).then(function (r) {
      if (r.ok && r.data.intent_token) {
        st.intent = { token: r.data.intent_token, sig: sig, fields: f }; st.chosen = true;
        track('intent_saved', ctx({ http_status: r.status }));
        return true;
      }
      if (r.status === 400 || r.status === 429) {
        track('intent_error', ctx({ error_code: r.data.code || r.status, http_status: r.status }));
        return r.data.error || T.msg.errGeneric;
      }
      // Sin token (red o servidor): el registro manda los campos de la elección directamente
      st.intent = { token: '', sig: sig, fields: f }; st.chosen = true;
      track('intent_error', ctx({ error_code: r.network ? 'network' : 'intent_unavailable', http_status: r.status || undefined }));
      return true;
    });
  }
  function choicePayload() {
    if (!st.chosen || !st.intent) return {};
    return st.intent.token ? { intent_token: st.intent.token } : st.intent.fields;
  }
  /* Si escribió una idea y toca un botón de registro sin enviarla, la idea se guarda primero */
  function withIdea(next) {
    if (variant !== 'a' || !idea.value.trim() || (st.intent && st.intent.sig === JSON.stringify(choiceFields()))) { next(); return; }
    saveIntent().then(next);
  }

  /* Las rutas se llaman igual que en el portal: título, etiqueta y mensaje de "estamos preparando…" los entrega
     la API (/auth/signup-options) por idioma. Esta copia es la del 12-nov y se usa mientras la API responde o si falla. */
  var ROUTES = {
    es: {
      design:    { title: 'Diseñar a partir de la intención', eyebrow: 'Intención → Diseño del sistema', prep: 'Genial: estamos preparando tu plano. Regístrate y construyámoslo.' },
      analyze:   { title: 'Analizar código existente', eyebrow: 'Código → Comprensión', prep: 'Genial: nos preparamos para mapear tu código. Regístrate e importémoslo.' },
      harden:    { title: 'Preparación para producción', eyebrow: 'Código → Listo para producción', prep: 'Genial: estamos preparando tu revisión de preparación para producción. Regístrate y reforcémoslo.' },
      prototype: { title: 'Prototipo rápido', eyebrow: 'Idea → Prototipo funcional', prep: 'Genial: estamos preparando tu prototipo. Regístrate y construyámoslo.' }
    },
    en: {
      design:    { title: 'Design from intent', eyebrow: 'Intent → System design', prep: "Great — we are preparing your blueprint. Sign up and let's build it." },
      analyze:   { title: 'Analyze existing code', eyebrow: 'Code → Understanding', prep: "Great — we are preparing to map your codebase. Sign up and let's import it." },
      harden:    { title: 'Production hardening', eyebrow: 'Code → Production ready', prep: "Great — we are preparing your production-readiness review. Sign up and let's harden it." },
      prototype: { title: 'Fast prototype', eyebrow: 'Idea → Working prototype', prep: "Great — we are preparing your prototype. Sign up and let's build it." }
    }
  };
  function route(mode) { return (ROUTES[lang] || ROUTES.es)[mode]; }
  var optCache = {};
  function loadRoutes() {
    var l = lang;
    if (!LIVE || optCache[l]) return;
    optCache[l] = call('/auth/signup-options', null, 'GET').then(function (res) {
      if (!res.ok) { delete optCache[l]; return; }
      (res.data.options || []).forEach(function (o) {
        var x = ROUTES[l] && ROUTES[l][o.key];
        if (!x) return;
        if (o.title) x.title = o.title;
        if (o.eyebrow) x.eyebrow = o.eyebrow;
        if (o.preparing_message) x.prep = o.preparing_message;
        if (o.description) x.desc = o.description;
      });
      if (l === lang) updatePrep();
    });
  }
  /* Pinta los nombres de las rutas y el mensaje de la ruta elegida */
  function updatePrep() {
    var el = $('#sheet-prep'), mode = (st.intent && st.intent.fields.build_mode) || MODES[st.path] || 'design', x = route(mode);
    chips.forEach(function (c) {
      var y = route(MODES[c.dataset.path]);
      if (!y) return;
      c.textContent = y.title;
      if (y.desc) c.title = y.desc;
    });
    el.textContent = x ? x.prep : '';
    el.hidden = !el.textContent;
    $('#ws-prep').textContent = el.textContent;
    loadRoutes();
  }

  /* ---------- Paso al portal: una pantalla con la idea y la ruta, en vez de un salto en seco ---------- */

  var HO = {
    es: { email: 'Abriendo tu espacio de trabajo', google: 'Continuando con Google', sub: 'Tu espacio de trabajo abre en este paso.' },
    en: { email: 'Opening your workspace', google: 'Continuing with Google', sub: 'Your workspace opens on this step.' }
  };
  /* El espacio de trabajo como fondo del registro: la idea queda como primer mensaje del chat y el lienzo
     del concepto aparece cargando. No inventa el plano: solo muestra dónde va a quedar. */
  var wsEl = $('#ws');
  function showWs(text) {
    $('#ws-idea').textContent = text;
    wsEl.hidden = false;
    document.body.classList.add('ws-on');
  }
  function hideWs() { wsEl.hidden = true; document.body.classList.remove('ws-on'); }
  // Se quita cuando ya no hay ninguna hoja abierta ni pantalla de paso
  var wsWatch = new MutationObserver(function () {
    if (wsEl.hidden) return;
    setTimeout(function () { if (!openEl && $('#handoff').hidden) hideWs(); }, 0);
  });
  [$('#sheet'), $('#sheet-auth'), $('#sheet-inapp'), $('#handoff')].forEach(function (el) { if (el) wsWatch.observe(el, { attributes: true, attributeFilter: ['hidden'] }); });

  var handoffEl = $('#handoff');
  function handoff(kind, go) {
    var t = HO[lang] || HO.es, mode = st.chosen && st.intent ? st.intent.fields.build_mode : '', x = mode ? route(mode) : null;
    var text = variant === 'a' ? idea.value.trim() : '';
    $('#handoff-title').textContent = t[kind];
    $('#handoff-route').textContent = x ? x.eyebrow : '';
    $('#handoff-route').hidden = !x;
    $('#handoff-idea').textContent = text;
    $('#handoff-idea').hidden = !text;
    $('#handoff-sub').textContent = x ? t.sub : '';
    $('#handoff-sub').hidden = !x;
    closeSheet();
    handoffEl.hidden = false;
    setTimeout(go, kind === 'google' ? 600 : 1200);
  }
  // Si vuelve con el botón Atrás, la pantalla de paso no se queda encima
  window.addEventListener('pageshow', function (e) { if (e.persisted) handoffEl.hidden = true; });

  function googleUrl() {
    var p = new URLSearchParams();
    p.set('login', 'google');
    if (st.chosen && st.intent && st.intent.token) p.set('intent', st.intent.token);
    else if (st.chosen && st.intent) {
      // Sin token: solo la ruta y la fuente. La idea y la URL nunca van en la dirección.
      p.set('mode', st.intent.fields.build_mode);
      if (st.intent.fields.import_source) p.set('import_source', st.intent.fields.import_source);
    }
    var u = utms();
    Object.keys(u).forEach(function (k) { p.set(k, u[k]); });
    if (REF) p.set('ref', REF);
    if (INV) p.set('inv', INV);
    return PORTAL + '?' + p.toString();
  }

  /* Enlaces reales de ingreso y documentos legales (se vuelven a poner al cambiar de idioma) */
  function wireLinks() {
    $$('[data-proto="login"]').forEach(function (a) { a.href = LOGIN_URL; });
    $$('.fine').forEach(function (box) {
      [].slice.call(box.querySelectorAll('[data-proto="legal"]')).forEach(function (a, i) {
        a.href = i === 0 ? TERMS_URL : PRIVACY_URL; a.target = '_blank'; a.rel = 'noopener';
      });
    });
  }

  /* ---------- Hoja de correo y código ---------- */

  var authSheet = $('#sheet-auth'), authEmail = $('#auth-email'), authCode = $('#auth-code');
  var authMail = $('#auth-mail'), authMailMsg = $('#auth-mail-msg'), otp = $('#auth-otp'), codeMsg = $('#auth-code-msg');
  function setMsg(el, text, html) { if (html) el.innerHTML = text; else el.textContent = text; el.hidden = !text; }
  function esc(v) { return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function setCodeText() {
    $('#auth-code-sub').innerHTML = esc(T.msg.codeText).replace('{email}', '<strong>' + esc(st.email) + '</strong>');
  }
  function showAuth(view) {
    authEmail.hidden = view !== 'email';
    authCode.hidden = view !== 'code';
    if (openEl !== authSheet) openSheet(authSheet);
    if (view === 'email') {
      setMsg(authMailMsg, '');
      authMail.value = st.email || authMail.value;
      authMail.focus();
      if (!st.viewed) { st.viewed = true; track('auth_form_viewed', ctx()); }
    } else {
      setCodeText(); setMsg(codeMsg, ''); otp.value = ''; otp.disabled = false;
      otp.focus();
      track('code_screen_viewed', ctx());
    }
  }
  function busy(btn, on) { st.busy = on; if (btn) btn.disabled = on; }

  function register(mail, msgEl, btn) {
    if (st.busy) return;
    setMsg(msgEl, '');
    track('signup_submitted', ctx({ method: 'email' }));
    busy(btn, true);
    call('/auth/register', merge({ email: mail, eula_accepted: true, marketing_opt_in: false }, choicePayload(), utms(), partner())).then(function (r) {
      busy(btn, false);
      if (r.status === 201) {
        st.email = r.data.email || mail;
        showAuth('code');
      } else if (r.status === 409) {
        // El correo ya tiene cuenta: se ofrece el ingreso
        track('auth_error', ctx({ error_code: r.data.code || 'EMAIL_EXISTS', http_status: 409 }));
        setMsg(msgEl, esc(r.data.error || '') + ' <a href="' + LOGIN_URL + '">' + esc(T.msg.signin) + '</a>', true);
      } else {
        track('auth_error', ctx({ error_code: r.network ? 'network' : String(r.data.code || r.status), http_status: r.status || undefined }));
        setMsg(msgEl, r.network ? T.msg.errNetwork : (r.data.error || T.msg.errGeneric));
      }
    });
  }
  authEmail.addEventListener('submit', function (e) {
    e.preventDefault();
    var mail = authMail.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { setMsg(authMailMsg, T.msg.errEmail); authMail.focus(); return; }
    register(mail, authMailMsg, authEmail.querySelector('button[type="submit"]'));
  });
  authMail.addEventListener('input', function () { setMsg(authMailMsg, ''); });

  function verify() {
    if (st.busy || st.done) return;
    var code = otp.value;
    if (!/^\d{6}$/.test(code)) { setMsg(codeMsg, T.msg.errCode); track('code_error', ctx({ error_code: 'bad_code' })); return; }
    var btn = authCode.querySelector('button[type="submit"]');
    busy(btn, true);
    call('/auth/verify-email-code', merge({ email: st.email, otp: code }, choicePayload())).then(function (r) {
      busy(btn, false);
      if (r.status === 200) {
        track('auth_completed', ctx({ method: 'email' }));
        st.done = true; otp.disabled = true; btn.disabled = true;
        handoff('email', function () {
          if (LIVE) { window.location.href = PORTAL; return; }
          setTimeout(function () { handoffEl.hidden = true; showToast(T.msg.demoDone); }, 1600);   // vista previa
        });
        return;
      }
      if (r.status === 409) {
        // Ya estaba verificada: a ingresar
        setMsg(codeMsg, r.data.error || '');
        if (LIVE) setTimeout(function () { window.location.href = LOGIN_URL; }, 1500);
        return;
      }
      otp.value = '';
      track('code_error', ctx({ error_code: r.network ? 'network' : String(r.data.code || r.status), http_status: r.status || undefined }));
      setMsg(codeMsg, r.network ? T.msg.errNetwork : (r.data.error || T.msg.errGeneric));
      otp.focus();
    });
  }
  authCode.addEventListener('submit', function (e) { e.preventDefault(); verify(); });
  otp.addEventListener('input', function () {
    var v = otp.value.replace(/\D/g, '').slice(0, 6);
    if (otp.value !== v) otp.value = v;
    if (v.length === 6) verify();
  });
  $('#auth-resend').addEventListener('click', function () {
    if (st.resendWait || st.busy || st.done) return;
    var b = this;
    st.resendWait = true; b.disabled = true;
    setTimeout(function () { st.resendWait = false; b.disabled = false; }, 30000);   // evita varios correos seguidos
    track('code_resent', ctx());
    call('/auth/resend-verification', { email: st.email }).then(function (r) {
      if (r.ok) { otp.value = ''; setMsg(codeMsg, T.msg.resent); otp.focus(); }
      else {
        track('code_error', ctx({ error_code: r.network ? 'network' : String(r.data.code || r.status), http_status: r.status || undefined }));
        setMsg(codeMsg, r.network ? T.msg.errNetwork : (r.data.error || T.msg.errGeneric));
      }
    });
  });
  $('#auth-change').addEventListener('click', function () {
    if (st.busy || st.done) return;
    if (variant === 'b') { closeSheet(); focusEmail(); } else showAuth('email');
  });

  /* ---------- Botones de registro, ingreso y documentos legales ---------- */

  var toast = $('#toast'), toastTimer;
  function showToast(msg) {
    toast.textContent = msg; toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 3400);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-proto]');
    if (el) {
      var kind = el.dataset.proto;
      if (kind === 'login') { dl({ event: 'login_link_clicked', flow_variant: FLOW }); return; }   // enlace normal al portal
      if (kind === 'legal') return;                                                                   // enlaces normales, en otra pestaña
      e.preventDefault();
      if (st.busy) return;
      if (kind === 'google') {
        track('google_clicked', ctx({ method: 'google' }));
        if (inApp) { openSheet($('#sheet-inapp')); return; }
        if (!LIVE) { showToast(T.msg.google); return; }
        withIdea(function () { handoff('google', function () { window.location.href = googleUrl(); }); });   // la espera deja salir el evento
        return;
      }
      if (kind === 'email') {
        // En la variante B el correo no abre nada: lleva al campo del formulario
        if (variant === 'b') { closeSheet(); focusEmail(); return; }
        withIdea(function () { showAuth('email'); });
      }
      return;
    }
    if (e.target.closest(variant === 'b' ? '[data-focus-email], a[href="#registro"]' : '[data-focus-email]')) { e.preventDefault(); focusEmail(); return; }
    if (e.target.closest('[data-focus-idea]')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      idea.focus({ preventScroll: true });
    }
  });

  window.T4ERS = { version: '1.0', variant: variant, live: LIVE, state: st };
  dl({ flow_variant: FLOW });
  applyLang();
  track(variant === 'a' ? 'intent_options_viewed' : 'auth_form_viewed', ctx());
})();
"""
js = cut(js, "  /* ---------- Acciones de prototipo: nada sale de la página ---------- */", "})();", API, keep_end=False).rstrip() + "\n"
js = js.replace('Think4Ever', 'Think4ever').replace('Think4ever Landing API', 'Think4Ever Landing API')
# El 4 en negrita en los textos que se pintan como HTML (no en títulos, etiquetas aria ni placeholders)
for key in ['srSummary', 'whatEyebrow', 'whatH2', 's1p', 'a1', 'a2', 'a4']:
    m = re.search(r"^    %s: '.*$" % key, js, re.M)
    assert m, key
    js = js[:m.start()] + m.group(0).replace('Think4ever', 'Think<b>4</b>ever') + js[m.end():]
assert 'showPreview' not in js and 'PLANS' not in js and 'lastIdea' not in js.replace('var lastIdea', ''), 'restos del adelanto simulado'
js = js.replace("  var lastIdea = '';\n", "")
open(os.path.join(DIST, 'app.js'), 'w', encoding='utf-8').write(js)

# ------------------------------------------------------------------ styles.css
css = rd(os.path.join(ORIG, 'styles.css')) + """
/* ---------- Integración con el registro ---------- */
.logo svg { display: block; color: var(--navy); }
.sheet-prep { margin-top: 12px; font-weight: 500; }
.sheet-prep[hidden] { display: none; }
.auth-msg { padding: 0 0 8px; }
.auth-msg a { font-weight: 700; }
.field-code { text-align: center; font-size: 24px; font-weight: 700; letter-spacing: .4em; padding: 0 0 0 .4em; }
#sheet-auth form[hidden] { display: none; }
#sheet-auth .sheet-sub { overflow-wrap: anywhere; }
.btn[disabled], .send[disabled], .btn-ghost[disabled] { opacity: .6; cursor: wait; }
@media (max-width: 379px) { .logo svg { width: 132px; height: 22px; } }
/* El espacio de trabajo como fondo del registro. Colores del tema oscuro del producto. */
.ws { position: fixed; inset: 0; z-index: 15; display: flex; background: #0A1018; color: #E6ECF4; font-family: Inter, Roboto, "DM Sans", sans-serif; animation: handoff-in .35s ease-out; }
.ws[hidden] { display: none; }
body.ws-on { overflow: hidden; }
body.ws-on .sheet-scrim { background: rgba(5, 10, 18, .5); }
body.ws-on .float-cta { display: none; }
/* La idea y el mensaje ya se leen en el chat de fondo: en la hoja no se repiten */
body.ws-on #sheet-quote, body.ws-on #sheet-prep { display: none; }
.ws-chat { width: 100%; display: flex; flex-direction: column; padding: 14px; gap: 10px; border-right: 1px solid #1B2838; }
.ws-brand svg { display: block; color: #fff; }
.ws-proj { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; border: 1px solid #2A3B50; border-radius: 10px; font-size: 13px; font-weight: 700; }
.ws-proj i { width: 8px; height: 8px; border-right: 2px solid #8FA3BA; border-bottom: 2px solid #8FA3BA; transform: rotate(45deg) translateY(-3px); }
.ws-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.ws-row span { padding: 7px; text-align: center; font-size: 12.5px; font-weight: 600; color: #CBD5E1; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 8px; }
.ws-msgs { flex: 1; display: flex; flex-direction: column; gap: 12px; padding-top: 8px; overflow: hidden; }
.ws-msgs p { margin: 0; padding: 12px 14px; border-radius: 14px; font-size: 15px; line-height: 1.45; overflow-wrap: anywhere; }
.ws-me { align-self: flex-end; max-width: 88%; background: #6FC0FF; color: #0A1018; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; }
.ws-ai { align-self: flex-start; max-width: 92%; border: 1px solid #1F2D3F; }
.ws-dots { display: inline-flex; gap: 4px; margin-left: 8px; vertical-align: middle; }
.ws-dots i { width: 6px; height: 6px; border-radius: 50%; background: #6FC0FF; animation: ws-dot 1.2s infinite ease-in-out; }
.ws-dots i:nth-child(2) { animation-delay: .15s; } .ws-dots i:nth-child(3) { animation-delay: .3s; }
.ws-composer { display: none; }
.ws-main { display: none; }
@keyframes ws-dot { 0%, 80%, 100% { opacity: .25; transform: none; } 40% { opacity: 1; transform: translateY(-3px); } }
@keyframes ws-shine { to { background-position: -200% 0; } }
@media (min-width: 720px) {
  .ws-chat { width: 32%; min-width: 300px; max-width: 480px; }
  .ws-composer { display: flex; align-items: flex-start; justify-content: space-between; min-height: 150px; padding: 14px; background: #16202E; border: 2px solid #2A3B50; border-radius: 14px; color: #7C8DA3; font-size: 15px; }
  .ws-composer b { align-self: flex-end; width: 34px; height: 34px; border-radius: 10px; background: #6FC0FF; opacity: .6; }
  .ws-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .ws-tabs { display: flex; flex-wrap: wrap; gap: 4px 22px; padding: 16px 22px 0; border-bottom: 1px solid #1B2838; }
  .ws-tabs span { padding: 8px 0 10px; font-size: 12.5px; font-weight: 600; color: #8FA3BA; border-bottom: 2px solid transparent; white-space: nowrap; }
  .ws-tabs .is-on { color: #6FC0FF; border-bottom-color: #6FC0FF; }
  .ws-body { flex: 1; display: flex; min-height: 0; }
  .ws-list { width: 280px; padding: 18px 14px; border-right: 1px solid #1B2838; display: flex; flex-direction: column; gap: 12px; }
  .ws-list strong, .ws-canvas strong { font-size: 14px; }
  .ws-list i, .ws-canvas i { border-radius: 10px; background: linear-gradient(90deg, #141E2B 25%, #1D2A3B 50%, #141E2B 75%); background-size: 200% 100%; animation: ws-shine 1.6s linear infinite; }
  .ws-list i { height: 44px; }
  .ws-canvas { flex: 1; position: relative; padding: 18px 22px; }
  .ws-canvas svg { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .7; }
  .ws-canvas i { position: absolute; width: 22%; height: 20%; border: 1px solid #2A3B50; }
}
@media (prefers-reduced-motion: reduce) { .ws, .ws-dots i, .ws-list i, .ws-canvas i { animation: none; } }
/* La cortina en tema claro (pedido de Dirección, 12-nov): mismo fondo limpio de la landing
   y azul del portal, para que no parezca de otro sitio. Pisa los colores oscuros de arriba. */
.ws { color: #0f172a;
  background:
    radial-gradient(60% 46% at 12% 4%, rgba(147, 197, 253, .55), transparent 70%),
    radial-gradient(52% 40% at 96% 14%, rgba(249, 115, 22, .10), transparent 70%),
    linear-gradient(#ffffff, #f8fafc); }
body.ws-on .sheet-scrim { background: rgba(15, 23, 42, .18); }
.ws-chat { border-right-color: #e2e8f0; }
.ws-brand svg { color: #0f172a; }
.ws-proj { border-color: #e2e8f0; background: #fff; }
.ws-proj i { border-color: #94a3b8; }
.ws-row span { color: #475569; background: #fff; border-color: #e2e8f0; }
.ws-me { background: #2563eb; color: #fff; }
.ws-ai { background: #fff; border-color: #e2e8f0; }
.ws-dots i { background: #2563eb; }
@media (min-width: 720px) {
  .ws-composer { background: #fff; border-color: #e2e8f0; color: #94a3b8; }
  .ws-composer b { background: #2563eb; }
  .ws-tabs { border-bottom-color: #e2e8f0; }
  .ws-tabs span { color: #475569; }
  .ws-tabs .is-on { color: #2563eb; border-bottom-color: #2563eb; }
  .ws-list { border-right-color: #e2e8f0; }
  .ws-list i, .ws-canvas i { background: linear-gradient(90deg, #eef2f7 25%, #e2e8f0 50%, #eef2f7 75%); background-size: 200% 100%; }
  .ws-canvas i { border-color: #e2e8f0; }
}
.sheet-login { margin-top: 8px; }
.sheet-login a { color: var(--blue); font-weight: 600; }
/* Pantalla de paso al portal */
.handoff { position: fixed; inset: 0; z-index: 90; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 14px; padding: 24px; text-align: center; color: var(--navy);
  background: radial-gradient(ellipse 70% 55% at 50% 40%, #EAF1FE 0%, #F7F9FD 70%); animation: handoff-in .25s ease-out; }
.handoff[hidden] { display: none; }
.handoff svg { color: var(--navy); margin-bottom: 10px; }
.handoff h2 { font-size: 22px; line-height: 1.25; margin: 0; }
.handoff-spin { width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--blue-soft); border-top-color: var(--blue); animation: handoff-spin .8s linear infinite; }
.handoff-route { margin: 0; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--blue); }
.handoff-idea { margin: 0; max-width: 460px; padding: 10px 14px; border-left: 3px solid #F28C28; border-radius: 8px; background: #fff; font-size: 15px; text-align: left;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
.handoff-idea[hidden], .handoff-route[hidden], .handoff-sub[hidden] { display: none; }
.handoff-sub { margin: 0; font-size: 14px; color: var(--ink-2); }
@keyframes handoff-spin { to { transform: rotate(360deg); } }
@keyframes handoff-in { from { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .handoff, .handoff-spin { animation: none; } }
"""
open(os.path.join(DIST, 'styles.css'), 'w', encoding='utf-8').write(css)

# ------------------------------------------------------------------ index.html
html = rd(os.path.join(ORIG, 'index.html'))
SYMBOL = rd(os.path.join(HERE, 'logo-symbol.svg')).strip()
html = rep(html, '  <meta name="robots" content="noindex, nofollow">\n', '')
html = rep(html, '  <link rel="preload" as="image" href="assets/mascota/idle/f_0001.webp">\n', '')
html = cut(html, '    <!-- Símbolo redibujado', '</span>\n  </a>', '    <svg viewBox="0 0 204 34" width="156" height="26" role="img" aria-label="think4ever"><use href="#t4e-logo"/></svg>\n  </a>')
html = rep(html, '<form class="idea" id="idea-form" novalidate>', '<form class="idea" id="idea-form" data-hs-do-not-collect="true" novalidate>')
html = rep(html, '<form class="account" id="account-form" novalidate>', '<form class="account" id="account-form" data-hs-do-not-collect="true" novalidate>')
html = rep(html, '\n  <span class="proto-flag" data-t="protoFlag">Prototipo de Research. No envía datos.</span>', '')
html = cut(html, '    <!-- Adelanto del plano antes de pedir la cuenta.', '    <p class="sheet-sub" data-t="sheetSub">',
           '    <!-- Mensaje de la API para la ruta elegida ("estamos preparando tu plano"). El adelanto simulado del prototipo no se publica. -->\n    <p class="sheet-prep" id="sheet-prep" hidden></p>\n\n    <p class="sheet-sub" data-t="sheetSub">', keep_end=False)
AUTH = """<!-- El espacio de trabajo, como fondo del registro (variante A, después de enviar la idea) -->
<div class="ws" id="ws" aria-hidden="true" hidden>
  <div class="ws-chat">
    <div class="ws-brand"><svg viewBox="0 0 204 34" width="150" height="25"><use href="#t4e-logo"/></svg></div>
    <div class="ws-proj"><span data-t="wsProject">Nuevo proyecto</span><i></i></div>
    <div class="ws-row"><span data-t="wsNew">Nuevo chat</span><span data-t="wsHistory">Historial</span></div>
    <div class="ws-msgs">
      <p class="ws-me" id="ws-idea"></p>
      <p class="ws-ai"><span id="ws-prep"></span><span class="ws-dots"><i></i><i></i><i></i></span></p>
    </div>
    <div class="ws-composer"><span data-t="wsInput">Describe el proyecto que quieres crear...</span><b></b></div>
  </div>
  <div class="ws-main">
    <div class="ws-tabs">
      <span data-t="wsT1">Requisitos</span><span data-t="wsT2">Arquitectura funcional</span><span class="is-on" data-t="wsT3">Concepto</span><span data-t="wsT4">Flujos de negocio</span><span data-t="wsT5">Roles y permisos</span><span data-t="wsT6">Reglas de negocio</span><span data-t="wsT7">Diseños de UI</span>
    </div>
    <div class="ws-body">
      <div class="ws-list"><strong data-t="wsBlocks">Todos los bloques</strong><i></i><i></i><i></i><i></i></div>
      <div class="ws-canvas">
        <strong data-t="wsT3">Concepto</strong>
        <svg viewBox="0 0 600 420" preserveAspectRatio="none"><path d="M150 96 L300 190 M450 96 L300 190 M300 190 L190 320 M300 190 L420 320" fill="none" stroke="#2F6B4A" stroke-width="1.5"/></svg>
        <i style="left:14%;top:12%"></i><i style="left:64%;top:12%"></i><i style="left:39%;top:36%"></i><i style="left:20%;top:66%"></i><i style="left:58%;top:66%"></i>
      </div>
    </div>
  </div>
</div>

<!-- Pantalla de paso al portal -->
<div class="handoff" id="handoff" role="status" aria-live="polite" hidden>
  <svg viewBox="0 0 204 34" width="156" height="26" aria-hidden="true"><use href="#t4e-logo"/></svg>
  <span class="handoff-spin" aria-hidden="true"></span>
  <h2 id="handoff-title"></h2>
  <p class="handoff-route" id="handoff-route" hidden></p>
  <p class="handoff-idea" id="handoff-idea" hidden></p>
  <p class="handoff-sub" id="handoff-sub" hidden></p>
</div>

<!-- Hoja de registro con correo y código de verificación -->
<div class="sheet" id="sheet-auth" hidden>
  <div class="sheet-scrim" data-close></div>
  <div class="sheet-panel" role="dialog" aria-modal="true" aria-labelledby="auth-title">
    <button class="sheet-x" type="button" data-close aria-label="Cerrar" data-t-aria="close">×</button>
    <form id="auth-email" data-hs-do-not-collect="true" novalidate>
      <h2 id="auth-title" data-t="accTitle">Crea tu cuenta</h2>
      <p class="sheet-sub"></p>
      <label class="field-label" for="auth-mail" data-t="accEmail">Correo electrónico</label>
      <input class="field" id="auth-mail" name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false" placeholder="tu@correo.com" data-t-ph="accPh">
      <p class="idea-hint auth-msg" id="auth-mail-msg" role="alert" hidden></p>
      <button class="btn btn-wide" type="submit" data-t="accBtn">Crear cuenta gratis</button>
      <p class="fine" data-t="fine">Sin tarjeta. Al continuar aceptas los <a href="#" data-proto="legal">Términos</a> y la <a href="#" data-proto="legal">Política de privacidad</a>.</p>
    </form>
    <form id="auth-code" data-hs-do-not-collect="true" novalidate hidden>
      <h2 data-t="codeTitle">Revisa tu correo</h2>
      <p class="sheet-sub" id="auth-code-sub"></p>
      <label class="sr-only" for="auth-otp" data-t="codeLabel">Código de 6 dígitos</label>
      <input class="field field-code" id="auth-otp" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" maxlength="6">
      <p class="idea-hint auth-msg" id="auth-code-msg" role="status" hidden></p>
      <button class="btn btn-wide" type="submit" data-t="codeVerify">Verificar</button>
      <button class="btn-ghost" type="button" id="auth-resend" data-t="codeResend">Enviar un código nuevo</button>
      <button class="btn-ghost" type="button" id="auth-change" data-t="codeChange">Usar otro correo</button>
    </form>
  </div>
</div>

<!-- Registro flotante"""
html = rep(html, '<!-- Registro flotante', AUTH)
html = html.replace('Think4Ever', 'Think4ever')
# El 4 en negrita en el texto visible (no en atributos, en el <title> ni en comentarios)
head, body = html.split('<body', 1)
parts = re.split(r'(<!--.*?-->|<[^>]+>)', body, flags=re.S)
body = ''.join(p if p.startswith('<') else p.replace('Think4ever', 'Think<b>4</b>ever') for p in parts)
html = head + '<body' + body
# Sin comentarios ni sangría: la plantilla viaja más liviana
html = re.sub(r'<!--.*?-->', '', html, flags=re.S)
html = '\n'.join(l.strip() for l in html.split('\n') if l.strip()) + '\n'

def b64(name):
    return 'data:image/webp;base64,' + base64.b64encode(open(os.path.join(HERE, name), 'rb').read()).decode()
POSTERS = '{mascot:"%s",how:["%s"]}' % (b64('mascota_idle_f_0001.webp'), b64('como_f_0123.webp'))
TRACK = 'https://go.think4ever.com/hubfs/hub_generated/template_assets/1/405398805437/1794013397786/template_tracking-v3.min.js'

def minify(path, kind):
    out = path.replace('.' + kind, '.min.' + kind)
    args = [shutil.which('npx') or 'npx', '--yes', 'esbuild', path, '--minify', '--outfile=' + out] + (['--target=es2017'] if kind == 'js' else [])
    subprocess.run(args, check=True, capture_output=True, cwd=HERE)
    return rd(out)
CSS_MIN = minify(os.path.join(DIST, 'styles.css'), 'css')
JS_MIN = minify(os.path.join(DIST, 'app.js'), 'js')

def page(variant, hubl, assets=None):
    h = html
    h = rep(h, '<title>Think4ever (prototipo)</title>',
            ('<title>{{ content.html_title }}</title>\n<meta name="description" content="{{ content.meta_description }}">' if hubl
             else '<title>Think4ever</title>'))
    h = rep(h, '<link rel="stylesheet" href="styles.css">\n', '<style>\n' + CSS_MIN + '</style>\n' + ('{{ standard_header_includes }}\n' if hubl else ''))
    if hubl:
        h = rep(h, '<body data-v="a">', "{% if 'research-b' in content.slug|lower or 'latam-b' in content.slug|lower %}<body data-v=\"b\">{% else %}<body data-v=\"a\">{% endif %}\n" + SYMBOL)
    else:
        h = rep(h, '<body data-v="a">', '<body data-v="%s">\n%s' % (variant, SYMBOL))
    cfg = 'window.T4E_RS={%sposters:%s};' % (('assets:"%s",' % assets) if assets else '', POSTERS)
    if hubl:
        # Igual que la plantilla publicada por Publicidad: carteles desde los archivos de HubSpot (sin base64)
        # y Object.assign, para que lo que fije el encabezado de cada pagina (window.T4E_RS) no se pierda.
        A = 'https://go.think4ever.com/hubfs/t4e-landing-research/assets/'
        cfg = ('window.T4E_RS=Object.assign({posters:{mascot:"' + A + 'mascota/idle/f_0001.webp",how:["' + A + 'como/f_0001.webp","'
               + A + 'como/f_0062.webp","' + A + 'como/f_0123.webp"]}},window.T4E_RS||{});')
    tail = '<script>' + cfg + '</script>\n' + ('<script src="%s"></script>\n' % TRACK if hubl else '') + '<script>\n' + JS_MIN + '</script>\n' + ('{{ standard_footer_includes }}\n' if hubl else '')
    h = rep(h, '<script src="app.js"></script>\n', tail)
    return h

tpl = '<!--\n  templateType: page\n  isAvailableForNewContent: true\n  label: T4E · Landing Research A y B\n-->\n' + page('a', True)
check = tpl.replace('{{ content.html_title }}', '').replace('{{ content.meta_description }}', '').replace('{{ standard_header_includes }}', '').replace('{{ standard_footer_includes }}', '')
check = check.replace("{% if 'research-b' in content.slug|lower or 'latam-b' in content.slug|lower %}", '').replace('{% else %}', '').replace('{% endif %}', '')
for bad in ('{{', '{%', '{#'):
    assert bad not in check, 'HubL: aparece ' + bad + ' en ' + repr(check[max(0, check.index(bad) - 40):check.index(bad) + 40])
open(os.path.join(DIST, 'research.hubl.html'), 'w', encoding='utf-8').write(tpl)
for v in 'ab':
    open(os.path.join(DIST, v + '.html'), 'w', encoding='utf-8').write(page(v, False, assets=(sys.argv[1] if len(sys.argv) > 1 else None)))
print('plantilla', len(tpl.encode()), 'bytes · css', len(CSS_MIN), '· js', len(JS_MIN))
