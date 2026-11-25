/* Think4Ever, prototipo de landing. Sin dependencias. No envía datos a ningún lado. */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var small = window.matchMedia('(max-width: 719px)').matches;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
  function pad(n) { return String(n).padStart(4, '0'); }

  /* ---------- Configuración ---------- */

  // La mascota: secuencias de cuadros (clips de Higgsfield cortados con tools/cortar_cuadros.py).
  // "idle" es el reposo en bucle. Las demás empiezan en la mascota sola y terminan con lo que saca de sí.
  var FPS = 15;
  var SEQ = {
    idle:      { path: 'assets/mascota/idle/f_',      count: 78 },
    blueprint: { path: 'assets/mascota/blueprint/f_', count: 76, label: 'Living Blueprint' },
    uxui:      { path: 'assets/mascota/uxui/f_',      count: 76, label: 'UX / UI' }
  };
  var SHOW = ['blueprint', 'uxui'];   // orden en que la mascota muestra las cosas
  var HOLD_MS = 2600;                 // cuánto se queda abierto lo que sacó
  // Cuántas veces se abre sola al cargar. Después queda en reposo y solo se abre al tocarla,
  // para que no le quite la atención a la caja de idea y al registro.
  var AUTO_SHOWS = SHOW.length;

  // Dos opciones de mascota para comparar (pedido de Dirección, 11-nov):
  //   ?hero=1  el cerebro quieto; al tocarlo saca el plano y la interfaz.
  //   ?hero=2  el cerebro en el centro y detrás escenas que cambian solas, una por cada frase del texto rotativo.
  // Sin ?hero, manda window.T4E_RS.hero (se fija en el encabezado de la página publicada).
  // Desde el 12-nov la portada por defecto es la 2 (escenas). La 1 queda solo con ?hero=1.
  var HERO = (params.get('hero') || (window.T4E_RS || {}).hero || '2') === '1' ? '1' : '2';
  document.body.dataset.hero = HERO;
  // Una escena por frase, en el mismo orden de las frases
  var SCENES = ['sistema', 'uxui', 'codigo', 'plano', 'construir', 'auditar'];

  // Cómo funciona: cuadros que el scroll recorre.
  var HOW = { path: 'assets/como/f_', count: 123 };

  /* ---------- Idiomas ----------
     El español está en el HTML. El inglés está aquí. Cada elemento con data-t="clave" cambia de texto;
     data-t-ph cambia el placeholder y data-t-aria el aria-label. */
  var EN = {
    title: 'Think4Ever: your idea or your code, as a living blueprint (prototype)',
    login: 'Sign in',
    start: 'Start free',
    mascotAria: 'See what Think4Ever creates',
    h1: 'Your idea or your code, as a <em>living blueprint</em>.',
    srSummary: 'Think4Ever designs your system, generates your UX/UI, maps your code and builds it with your AI.',
    ideaLabel: 'Describe your idea',
    ideaPh: 'What do you want to build? E.g. an app for field technicians to close work orders',
    chipsAria: 'Paths',
    chipIntent: 'Design from intent',
    chipCode: 'Analyze existing code',
    chipHard: 'Production hardening',
    chipProto: 'Fast prototype',
    send: 'Create my blueprint',
    ideaHint: 'Write your idea in one sentence and we turn it into a blueprint.',
    signupLabel: 'or sign up free with',
    email: 'Email',
    fine: 'No credit card. By continuing you accept the <a href="#" data-proto="legal">Terms</a> and the <a href="#" data-proto="legal">Privacy Policy</a>.',
    whatEyebrow: 'What Think4Ever does',
    whatH2: 'Your AI tools write code. Think4Ever gives them the context.',
    c1h: 'Living blueprint',
    c1p: 'Roles, flows, rules and screens of your system in one place. You can change it without losing the goal of the project.',
    c2h: 'From design to code, and back',
    c2p: 'Design how it should work first and let your AI build it. Or bring the code you already have and see it as a system.',
    c3h: 'Production ready',
    c3p: 'Review what you built with AI against 9 pillars and 39 controls, with a grade from A to E and the list of what to fix.',
    mcpH: 'You already have your AI. Connect it.',
    mcpP: 'The blueprint lives outside the coding tool. All of them use it, without paying for AI twice.',
    toolsAria: 'Compatible tools',
    howEyebrow: 'How it works',
    howH2: 'From your idea to a living blueprint in three steps.',
    s1h: 'Tell us what your project is about',
    s1p: 'That gives Think4Ever the context.',
    s2h: 'Add your code and your AI tools',
    s2p: 'With that input the living blueprint is built.',
    s3h: 'Get to work',
    s3p: 'Review its recommendations and move your project forward.',
    faqEyebrow: 'Frequently asked questions',
    faqH2: 'Before you start.',
    q1: 'Do I have to pay for another AI?',
    a1: 'No. You connect the Claude, Codex or Cursor you already use and Think4Ever gives them the context of your project.',
    q2: 'Does it work if I already have code?',
    a2: 'Yes. Bring your repository and Think4Ever turns it into a visual, reviewable view of the system.',
    q3: 'How much does it cost?',
    a3: 'You start free. After that there is no monthly fee: you buy credits when you need them.',
    q4: 'What is context evaporation?',
    a4: 'It is the gradual loss of the information you need to understand a system. Think4Ever keeps that information in the blueprint so neither your team nor your AI loses it.',
    closeH2: 'Start with one sentence.',
    closeP: 'Create your free account, no credit card.',
    closeBtn: 'Write my idea',
    protoFlag: 'Research prototype. It sends no data.',
    close: 'Close',
    sheetTitle: 'This is how your blueprint starts.',
    pvLoading: 'Building the blueprint…',
    pvRoles: 'Roles',
    pvFlows: 'Flows',
    pvScreens: 'Screens',
    pvMore: 'Rules, data and acceptance criteria are still missing.',
    sheetSub: 'Create your account to see it in full and edit it.',
    fineShort: 'Free, no credit card. By continuing you accept the Terms and the Privacy Policy.',
    inappTitle: 'One more step: open it in your browser.',
    inappSub: 'Google does not allow sign-in inside Instagram or Facebook. In your browser you are in with one tap.',
    inappOpen: 'Open in my browser',
    inappCopy: 'Copy link',
    toolCode: 'Analyze existing code',
    toolRepo: 'Connect a repository',
    toolMic: 'Dictate by voice',
    accTitle: 'Create your account',
    accOr: 'or with your email',
    accEmail: 'Email',
    accPh: 'you@email.com',
    accHint: 'Enter a valid email.',
    accBtn: 'Create free account',
    accPerk: 'Free plan with 500 credits',
    accHave: 'Already have an account?',
    closeH2b: 'Start free today.',
    inappFine: 'You can also tap the ⋯ menu at the top and choose “Open in browser”.'
  };

  // Textos que no viven en el HTML
  var TXT = {
    es: {
      title: 'Think4Ever: tu idea o tu código, en un plano vivo (prototipo)',
      phrases: ['Diseña tu sistema', 'Genera tu UX/UI', 'Mapea tu código', 'Crea tu plano vivo', 'Construye con tu IA', 'Audita tu código'],
      fill: {
        intent: 'Quiero diseñar desde cero ',
        code: 'Quiero entender y mapear mi código: ',
        hardening: 'Quiero dejar listo para producción ',
        prototype: 'Quiero un prototipo rápido de '
      },
      msg: {
        google: 'Prototipo: aquí se abre el registro con Google. No se envió ningún dato.',
        repo: 'Prototipo: aquí se conecta un repositorio.',
        mic: 'Prototipo: aquí se dicta la idea por voz.',
        account: 'Prototipo: aquí se crea la cuenta con ese correo. No se envió ningún dato.',
        email: 'Prototipo: aquí va el registro con correo. No se envió ningún dato.',
        login: 'Prototipo: aquí va el inicio de sesión.',
        legal: 'Prototipo: aquí van los documentos legales.',
        menu: 'Toca el menú ⋯ de arriba y elige «Abrir en el navegador».',
        copied: 'Enlace copiado.'
      }
    },
    en: {
      title: EN.title,
      phrases: ['Design your system', 'Generate your UX/UI', 'Map your code', 'Living blueprint', 'Build with your AI', 'Audit your code'],
      fill: {
        intent: 'I want to design ',
        code: 'I want to understand and map my code: ',
        hardening: 'I want to make production-ready ',
        prototype: 'I want a fast prototype of '
      },
      msg: {
        google: 'Prototype: Google sign-up opens here. No data was sent.',
        repo: 'Prototype: a repository gets connected here.',
        mic: 'Prototype: voice dictation goes here.',
        account: 'Prototype: the account is created with that email here. No data was sent.',
        email: 'Prototype: email sign-up goes here. No data was sent.',
        login: 'Prototype: sign-in goes here.',
        legal: 'Prototype: legal documents go here.',
        menu: 'Tap the ⋯ menu at the top and choose “Open in browser”.',
        copied: 'Link copied.'
      }
    }
  };

  // Las opciones de registro se copian en cada .providers (arriba, en la hoja y en el flotante)
  // Variante: A (caja de idea) o B (formulario). ?v=b la cambia; b.html la trae fija.
  // La principal es la del chat (A). La B sigue en su propia página (body[data-v="b"]) o con ?v=b.
  var variant = (params.get('v') || document.body.dataset.v || 'a').toLowerCase() === 'b' ? 'b' : 'a';
  document.body.dataset.v = variant;

  var tpl = $('#tpl-providers');
  $$('.providers').forEach(function (box) {
    box.appendChild(tpl.content.cloneNode(true));
    if (box.dataset.only) {
      var keep = box.dataset.only.split(',');
      [].slice.call(box.children).forEach(function (b) { if (keep.indexOf(b.dataset.proto) < 0) b.remove(); });
    }
  });

  // Se guarda el español que trae el HTML para poder volver a él
  var tEls = $$('[data-t]'), phEls = $$('[data-t-ph]'), ariaEls = $$('[data-t-aria]');
  tEls.forEach(function (el) { el._es = el.innerHTML; });
  phEls.forEach(function (el) { el._es = el.getAttribute('placeholder'); });
  ariaEls.forEach(function (el) { el._esAria = el.getAttribute('aria-label'); });

  var stored = null;
  try { stored = localStorage.getItem('t4e-lang'); } catch (e) { /* sin almacenamiento */ }
  var lang = params.get('lang') || stored || (/^es/i.test(navigator.language || '') ? 'es' : 'en');
  if (lang !== 'en') lang = 'es';
  var T = TXT[lang];
  var langBtn = $('#lang');

  function applyLang() {
    T = TXT[lang];
    var en = lang === 'en';
    document.documentElement.lang = lang;
    document.title = T.title;
    tEls.forEach(function (el) { el.innerHTML = en ? EN[el.dataset.t] : el._es; });
    phEls.forEach(function (el) { el.setAttribute('placeholder', en ? EN[el.dataset.tPh] : el._es); });
    ariaEls.forEach(function (el) {
      var label = en ? EN[el.dataset.tAria] : el._esAria;
      el.setAttribute('aria-label', label);
      if (el.hasAttribute('title')) el.setAttribute('title', label);
    });
    langBtn.textContent = en ? 'ES' : 'EN';
    restartTyping();
  }
  langBtn.addEventListener('click', function () {
    lang = lang === 'en' ? 'es' : 'en';
    try { localStorage.setItem('t4e-lang', lang); } catch (e) { /* sin almacenamiento */ }
    applyLang();
    if (lastIdea) showPreview(lastIdea, true);
  });

  /* ---------- Cuadros ---------- */

  function loadSeq(seq, step) {
    if (seq.frames) return seq.frames;
    seq.step = step || 1;
    seq.frames = [];
    for (var i = 1; i <= seq.count; i += seq.step) {
      var img = new Image();
      img.decoding = 'async';
      img.src = seq.path + pad(i) + '.webp';
      seq.frames.push(img);
    }
    return seq.frames;
  }
  function ready(img) { return img && img.complete && img.naturalWidth > 0; }
  function seqReady(seq) { return seq.frames && seq.frames.every(ready); }

  /* ---------- Texto que se escribe y se borra ---------- */

  var typed = $('#typed'), typeTimer, typeRun = 0;
  function restartTyping() {
    clearTimeout(typeTimer);
    var run = ++typeRun, list = T.phrases;
    typed.textContent = list[0];
    showScene(0);
    if (reduced) return;
    var i = 0, pos = list[0].length, deleting = true;
    function tick() {
      if (run !== typeRun) return;
      var delay;
      if (deleting) {
        pos--; delay = 32;
        if (pos === 0) { deleting = false; i = (i + 1) % list.length; delay = 320; showScene(i); }
      } else {
        pos++; delay = 62;
        if (pos === list[i].length) { deleting = true; delay = 1700; }
      }
      typed.textContent = list[i].slice(0, pos);
      typeTimer = setTimeout(tick, delay);
    }
    typeTimer = setTimeout(tick, 1700);
  }

  /* ---------- Opción 2: escenas detrás del cerebro ---------- */

  var sceneEls = [];
  if (HERO === '2') {
    var sceneBox = $('#scenes');
    SCENES.forEach(function (name, i) {
      var img = new Image();
      img.alt = '';
      img.decoding = 'async';
      if (i === 0) img.src = 'assets/escenas/' + name + '.webp';
      else img.dataset.src = 'assets/escenas/' + name + '.webp';   // las demás, después de pintar
      sceneBox.appendChild(img);
      sceneEls.push(img);
    });
    window.addEventListener('load', function () {
      sceneEls.forEach(function (img) { if (img.dataset.src) img.src = img.dataset.src; });
    });
  }
  function showScene(i) {
    sceneEls.forEach(function (img, n) { img.classList.toggle('is-on', n === i % sceneEls.length); });
  }

  /* ---------- La mascota ---------- */

  var mascot = $('#mascot');
  var mCanvas = $('#mascot-canvas');
  var mCtx = mCanvas.getContext('2d');
  var mTag = $('#mascot-tag');

  // phase: idle (reposo) | out (saca) | hold (muestra) | in (guarda)
  var phase = 'idle', cur = SEQ.idle, frame = 0, showIndex = 0, holdUntil = 0;
  var listening = false, wantOpen = false, lastDrawn = null, autoLeft = HERO === '2' ? 0 : AUTO_SHOWS;

  function draw(seq, n) {
    var img = seq.frames[n];
    if (!ready(img) || img === lastDrawn) return;
    lastDrawn = img;
    // El lienzo toma el tamaño real del cuadro: así no se estira ni pierde nitidez
    if (mCanvas.width !== img.naturalWidth) { mCanvas.width = img.naturalWidth; mCanvas.height = img.naturalHeight; }
    mCtx.drawImage(img, 0, 0);
  }
  function setOpen(seq) {
    mascot.classList.toggle('is-open', !!seq);
    if (seq) mTag.textContent = seq.label;
  }

  loadSeq(SEQ.idle);
  SEQ.idle.frames[0].onload = function () { draw(SEQ.idle, 0); };
  // Lo demás se carga después de que la página ya pintó
  window.addEventListener('load', function () {
    if (HERO === '2') return;
    loadSeq(SEQ.blueprint);
    setTimeout(function () { loadSeq(SEQ.uxui); }, 1200);
  });

  function nextShow() { return SEQ[SHOW[showIndex % SHOW.length]]; }

  function tick() {
    var now = Date.now();
    if (phase === 'idle') {
      frame = (frame + 1) % SEQ.idle.frames.length;
      draw(SEQ.idle, frame);
      // Al cerrar una vuelta de reposo se abre sola (pocas veces); después, solo si la tocan
      var loopEnd = frame === 0;
      var auto = loopEnd && !listening && autoLeft > 0;
      var seq = nextShow();
      if ((wantOpen || auto) && seqReady(seq)) {
        if (!wantOpen) autoLeft--;
        wantOpen = false; phase = 'out'; cur = seq; frame = 0; setOpen(seq);
      }
    } else if (phase === 'out') {
      frame++;
      if (frame >= cur.frames.length - 1) { frame = cur.frames.length - 1; phase = 'hold'; holdUntil = now + HOLD_MS; }
      draw(cur, frame);
    } else if (phase === 'hold') {
      if (now >= holdUntil) { phase = 'in'; setOpen(null); }
    } else if (phase === 'in') {
      frame -= 2;                      // guarda al doble de velocidad
      if (frame <= 0) { frame = 0; phase = 'idle'; showIndex++; draw(cur, 0); cur = SEQ.idle; return; }
      draw(cur, frame);
    }
  }
  function closeNow() { if (phase === 'out' || phase === 'hold') { phase = 'in'; setOpen(null); } }

  // Estado fijo para capturas y para mostrarlo: ?vista=reposo | blueprint | uxui
  var fixed = params.get('vista');
  if (fixed && SEQ[fixed] && fixed !== 'idle') {
    var fseq = SEQ[fixed];
    loadSeq(fseq);
    var last = fseq.frames[fseq.frames.length - 1];
    last.onload = function () { draw(fseq, fseq.frames.length - 1); };
    setOpen(fseq);
  } else if (fixed || reduced) {
    /* queda el primer cuadro: la mascota sola */
  } else {
    setInterval(tick, 1000 / FPS);
  }

  // Tocar la mascota: saca lo siguiente o guarda lo que tiene afuera
  function toggle() {
    if (fixed || reduced || HERO === '2') return;
    if (phase === 'idle') wantOpen = true; else closeNow();
  }
  mascot.addEventListener('click', toggle);
  mascot.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });

  /* ---------- Caja de idea ---------- */

  var form = $('#idea-form');
  var idea = $('#idea');
  var hint = $('#idea-hint');
  var lastIdea = '';

  // Mientras se escribe, la mascota guarda lo que tenga afuera y "escucha"
  idea.addEventListener('focus', function () { listening = true; autoLeft = 0; closeNow(); mascot.classList.add('is-listening'); });
  idea.addEventListener('blur', function () { listening = false; mascot.classList.remove('is-listening'); });
  var keyTimer;
  idea.addEventListener('input', function () {
    hint.hidden = true;
    mascot.classList.add('is-key');
    clearTimeout(keyTimer);
    keyTimer = setTimeout(function () { mascot.classList.remove('is-key'); }, 130);
  });

  // Las cuatro rutas: marcan la elegida y dejan el inicio de la frase escrito
  var chips = $$('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.toggle('is-on', c === chip); });
      idea.value = T.fill[chip.dataset.path];
      idea.focus();
      idea.setSelectionRange(idea.value.length, idea.value.length);
      hint.hidden = true;
    });
  });

  // Controles de la caja, los mismos de la plataforma: adjuntar código, conectar repositorio, dictar
  $$('.tool').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var t = btn.dataset.tool;
      if (t === 'code') { chips.filter(function (c) { return c.dataset.path === 'code'; })[0].click(); return; }
      showToast(T.msg[t]);
    });
  });

  // Enter envía, Shift+Enter hace salto de línea
  idea.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submitIdea(); }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); submitIdea(); });

  function submitIdea() {
    var text = idea.value.trim();
    if (!text) {
      hint.hidden = false;
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      idea.focus();
      return;
    }
    lastIdea = text;
    $('#sheet-quote').textContent = text;
    showPreview(text);
    openSheet($('#sheet'));
  }

  /* ---------- Adelanto del plano (PROTOTIPO) ----------
     No hay IA aquí: se elige una plantilla por palabras clave de la idea para mostrar cómo se
     vería el momento. En producción, este bloque lo llenaría la plataforma con el plano real. */
  var PLANS = [
    { k: /t[eé]cnic|orden|mantenim|repar|servicio|instalaci|technician|work order|maintenance|repair|field service/i,
      es: { roles: ['Técnico', 'Coordinador', 'Cliente'], flows: ['Asignar trabajo', 'Registrar repuestos', 'Cerrar orden'], screens: ['Mis trabajos', 'Detalle de orden', 'Tablero'] },
      en: { roles: ['Technician', 'Dispatcher', 'Customer'], flows: ['Assign job', 'Log parts', 'Close order'], screens: ['My jobs', 'Order detail', 'Dashboard'] } },
    { k: /tienda|venta|vend|producto|carrito|pedido|inventari|cat[aá]logo|store|shop|sell|product|cart|inventory|catalog/i,
      es: { roles: ['Comprador', 'Vendedor', 'Administrador'], flows: ['Buscar y comprar', 'Pagar pedido', 'Despachar'], screens: ['Catálogo', 'Carrito', 'Mis pedidos'] },
      en: { roles: ['Buyer', 'Seller', 'Admin'], flows: ['Browse and buy', 'Pay order', 'Ship'], screens: ['Catalog', 'Cart', 'My orders'] } },
    { k: /cita|turno|agenda|reserv|consult|m[eé]dic|cl[ií]nic|barber|sal[oó]n|appointment|booking|schedule|clinic|doctor/i,
      es: { roles: ['Cliente', 'Profesional', 'Recepción'], flows: ['Reservar turno', 'Confirmar o mover', 'Atender y cerrar'], screens: ['Agenda', 'Reservar', 'Mis turnos'] },
      en: { roles: ['Client', 'Professional', 'Front desk'], flows: ['Book a slot', 'Confirm or move', 'Attend and close'], screens: ['Calendar', 'Book', 'My bookings'] } },
    { k: /restaurant|comida|men[uú]|domicili|cocina|mesa|food|kitchen|delivery|table/i,
      es: { roles: ['Comensal', 'Mesero', 'Cocina'], flows: ['Tomar pedido', 'Preparar', 'Cobrar'], screens: ['Menú', 'Pedido', 'Cocina en vivo'] },
      en: { roles: ['Guest', 'Waiter', 'Kitchen'], flows: ['Take order', 'Prepare', 'Charge'], screens: ['Menu', 'Order', 'Live kitchen'] } },
    { k: /curso|clase|estudi|alumn|profesor|escuela|aprend|course|class|student|teacher|school|learn/i,
      es: { roles: ['Estudiante', 'Profesor', 'Coordinación'], flows: ['Inscribirse', 'Tomar clase', 'Evaluar'], screens: ['Mis cursos', 'Clase', 'Notas'] },
      en: { roles: ['Student', 'Teacher', 'Coordinator'], flows: ['Enroll', 'Take class', 'Grade'], screens: ['My courses', 'Class', 'Grades'] } },
    { k: /c[oó]digo|repo|github|legacy|refactor|producci[oó]n|auditar|mapear|code|production|audit|harden/i,
      es: { roles: ['Developer', 'Líder técnico', 'Producto'], flows: ['Importar repositorio', 'Mapear el sistema', 'Revisar hallazgos'], screens: ['Mapa del sistema', 'Dependencias', 'Reporte'] },
      en: { roles: ['Developer', 'Tech lead', 'Product'], flows: ['Import repository', 'Map the system', 'Review findings'], screens: ['System map', 'Dependencies', 'Report'] } }
  ];
  var PLAN_DEFAULT = {
    es: { roles: ['Usuario', 'Administrador', 'Soporte'], flows: ['Registro e ingreso', 'Tarea principal', 'Seguimiento'], screens: ['Inicio', 'Detalle', 'Tablero'] },
    en: { roles: ['User', 'Admin', 'Support'], flows: ['Sign-up and sign-in', 'Main task', 'Follow-up'], screens: ['Home', 'Detail', 'Dashboard'] }
  };
  var previewTimer;
  function showPreview(text, instant) {
    var plan = (PLANS.filter(function (p) { return p.k.test(text); })[0] || PLAN_DEFAULT)[lang];
    var box = $('#preview');
    ['roles', 'flows', 'screens'].forEach(function (key) {
      var ul = $('#pv-' + key);
      ul.textContent = '';
      plan[key].forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
    });
    clearTimeout(previewTimer);
    if (instant) { box.classList.remove('is-loading'); return; }
    box.classList.add('is-loading');
    previewTimer = setTimeout(function () { box.classList.remove('is-loading'); }, reduced ? 0 : 1100);
  }

  /* ---------- Hojas ---------- */

  var lastFocus = null, openEl = null;
  function openSheet(el) {
    if (openEl) openEl.hidden = true;
    lastFocus = document.activeElement;
    openEl = el; el.hidden = false;
    var b = el.querySelector('.prov, .btn');
    if (b) b.focus();
  }
  function closeSheet() {
    if (!openEl) return;
    openEl.hidden = true; openEl = null;
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeSheet(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSheet(); });

  /* ---------- Navegador interno de Instagram / Facebook ----------
     Google bloquea su inicio de sesión dentro de esos navegadores (error disallowed_useragent).
     Ahí el botón de Google ofrece abrir la página en el navegador del teléfono.
     Para verlo en un computador: ?inapp=1 */
  var ua = navigator.userAgent || '';
  var inApp = /Instagram|FBAN|FBAV|FB_IAB|; wv\)/.test(ua) || params.has('inapp');
  $('#inapp-open').addEventListener('click', function () {
    if (/Android/i.test(ua)) {
      // En Android este enlace saca la página al navegador por defecto. Falta probarlo en un teléfono real.
      location.href = 'intent://' + location.host + location.pathname +
        '#Intent;scheme=' + location.protocol.replace(':', '') + ';end';
    } else {
      showToast(T.msg.menu);
    }
  });
  $('#inapp-copy').addEventListener('click', function () {
    var url = location.origin + location.pathname;
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { showToast(T.msg.copied); }, function () { showToast(url); });
    else showToast(url);
  });

  /* ---------- Cómo funciona: el scroll mueve a la mascota y desliza los pasos ---------- */

  var how = $('#como-funciona');
  var hCanvas = $('#how-canvas');
  var hCtx = hCanvas.getContext('2d');
  var steps = [].slice.call(how.querySelectorAll('.how-step'));
  var hLast = -1, hWanted = 0, ticking = false;

  function drawHow(n) {
    var img = HOW.frames[n];
    if (!ready(img)) {
      // Aún no cargó: se dibuja en cuanto llegue, si sigue siendo el cuadro pedido
      hWanted = n;
      if (img) img.onload = function () { if (hWanted === n) drawHow(n); };
      return;
    }
    if (n === hLast) return;
    hLast = n;
    if (hCanvas.width !== img.naturalWidth) { hCanvas.width = img.naturalWidth; hCanvas.height = img.naturalHeight; }
    hCtx.drawImage(img, 0, 0);
  }
  function updateHow() {
    ticking = false;
    var r = how.getBoundingClientRect();
    var span = r.height - window.innerHeight;
    var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    how.style.setProperty('--p', p.toFixed(4));
    // Los pasos se deslizan de forma continua: d es la distancia de cada paso al punto actual
    var pos = p * (steps.length - 1);
    steps.forEach(function (el, i) {
      var d = pos - i;
      el.style.setProperty('--d', d.toFixed(3));
      el.style.setProperty('--o', Math.max(0, 1 - Math.abs(d) * 1.9).toFixed(3));
    });
    if (HOW.frames) drawHow(Math.round(p * (HOW.frames.length - 1)));
  }
  function startHow() {
    if (HOW.frames) return;
    loadSeq(HOW, small ? 2 : 1);     // en celular, la mitad de los cuadros
    updateHow();
  }
  // Los cuadros se piden cuando la sección se acerca, no al abrir la página
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) { startHow(); obs.disconnect(); }
    }, { rootMargin: '150% 0px' }).observe(how);
  } else { startHow(); }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateHow); }
  }, { passive: true });
  window.addEventListener('resize', updateHow);
  updateHow();

  // Para mostrar un paso directamente: ?paso=1, 2 o 3
  var paso = parseFloat(params.get('paso'));
  if (paso >= 1 && paso <= 3) {
    window.addEventListener('load', function () {
      startHow();
      var top = how.offsetTop + (how.offsetHeight - window.innerHeight) * ((paso - 1) / 2);
      window.scrollTo({ top: top, behavior: 'instant' });
      updateHow();
    });
  }

  /* ---------- Registro flotante ----------
     Acompaña todo el scroll: aparece cuando el registro de arriba sale de la pantalla. */

  var floatCta = $('#float-cta');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      floatCta.hidden = entries[0].isIntersecting;
    }).observe(variant === 'b' ? $('#account-form') : $('#registro'));
  } else { floatCta.hidden = false; }

  /* ---------- Variante B: formulario de un campo ---------- */

  var accForm = $('#account-form'), email = $('#email'), emailHint = $('#email-hint');
  accForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    emailHint.hidden = ok;
    if (!ok) { email.focus(); return; }
    showToast(T.msg.account);
  });
  email.addEventListener('input', function () { emailHint.hidden = true; });
  function focusEmail() {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    email.focus({ preventScroll: true });
  }

  /* ---------- La mascota sigue un poco al cursor (solo con mouse) ---------- */

  if (!reduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var hero = $('.hero'), moveQueued = false, mx = 0, my = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = mascot.getBoundingClientRect();
      mx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 320));
      my = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 320));
      if (moveQueued) return;
      moveQueued = true;
      requestAnimationFrame(function () {
        moveQueued = false;
        mascot.style.setProperty('--mx', mx.toFixed(3));
        mascot.style.setProperty('--my', my.toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', function () {
      mascot.style.setProperty('--mx', 0); mascot.style.setProperty('--my', 0);
    });
  }

  /* ---------- Acciones de prototipo: nada sale de la página ---------- */

  var toast = $('#toast'), toastTimer;
  function showToast(msg) {
    toast.textContent = msg; toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 3400);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-proto]');
    if (el) {
      e.preventDefault();
      if (el.dataset.proto === 'google' && inApp) { openSheet($('#sheet-inapp')); return; }
      // En la variante B el correo no abre nada: lleva al campo del formulario
      if (el.dataset.proto === 'email' && variant === 'b') { focusEmail(); return; }
      showToast(T.msg[el.dataset.proto]);
      return;
    }
    if (e.target.closest(variant === 'b' ? '[data-focus-email], a[href="#registro"]' : '[data-focus-email]')) { e.preventDefault(); focusEmail(); return; }
    if (e.target.closest('[data-focus-idea]')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      idea.focus({ preventScroll: true });
    }
  });

  applyLang();
})();
