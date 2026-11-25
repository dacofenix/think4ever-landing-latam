/* Think4ever, landing de Research (variantes A y B) conectada al registro. Sin dependencias.
   Registro: Think4Ever Landing API v3 (la misma del registro v3 de go.think4ever.com).
   Medición: los eventos de Research van al dataLayer; el envío a HubSpot y generate_lead / sign_up
   los hace tracking-v3.js, que envuelve window.fetch.
   Fuera de think4ever.com (vista previa de HubSpot, archivo local) queda en modo demostración y no llama a la API.
   Ajustes por página: window.T4E_RS = { assets: 'https://…/assets/', posters: { mascot, how: [] } } */
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
  var CFG = window.T4E_RS || {};
  // Carpeta de los cuadros en los archivos de HubSpot. Mientras no exista, la mascota y "Cómo funciona"
  // se muestran con imágenes fijas (CFG.posters) y la página funciona igual.
  var ASSETS = CFG.assets || 'https://go.think4ever.com/hubfs/t4e-landing-research/assets/';
  var POSTERS = CFG.posters || {};
  var animated = false;
  var SEQ = {
    idle:      { path: ASSETS + 'mascota/idle/f_',      count: 78 },
    blueprint: { path: ASSETS + 'mascota/blueprint/f_', count: 76, label: 'Living Blueprint' },
    uxui:      { path: ASSETS + 'mascota/uxui/f_',      count: 76, label: 'UX / UI' }
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
  var HOW = { path: ASSETS + 'como/f_', count: 123 };

  /* ---------- Idiomas ----------
     El español está en el HTML. El inglés está aquí. Cada elemento con data-t="clave" cambia de texto;
     data-t-ph cambia el placeholder y data-t-aria el aria-label. */
  var EN = {
    title: 'Think4ever: your idea or your code, as a living blueprint',
    login: 'Sign in',
    start: 'Start free',
    mascotAria: 'See what Think4ever creates',
    h1: 'Your idea or your code, as a <em>living blueprint</em>.',
    srSummary: 'Think<b>4</b>ever designs your system, generates your UX/UI, maps your code and builds it with your AI.',
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
    whatEyebrow: 'What Think<b>4</b>ever does',
    whatH2: 'Your AI tools write code. Think<b>4</b>ever gives them the context.',
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
    s1p: 'That gives Think<b>4</b>ever the context.',
    s2h: 'Add your code and your AI tools',
    s2p: 'With that input the living blueprint is built.',
    s3h: 'Get to work',
    s3p: 'Review its recommendations and move your project forward.',
    faqEyebrow: 'Frequently asked questions',
    faqH2: 'Before you start.',
    q1: 'Do I have to pay for another AI?',
    a1: 'No. You connect the Claude, Codex or Cursor you already use and Think<b>4</b>ever gives them the context of your project.',
    q2: 'Does it work if I already have code?',
    a2: 'Yes. Bring your repository and Think<b>4</b>ever turns it into a visual, reviewable view of the system.',
    q3: 'How much does it cost?',
    a3: 'You start free. After that there is no monthly fee: you buy credits when you need them.',
    q4: 'What is context evaporation?',
    a4: 'It is the gradual loss of the information you need to understand a system. Think<b>4</b>ever keeps that information in the blueprint so neither your team nor your AI loses it.',
    closeH2: 'Start with one sentence.',
    closeP: 'Create your free account, no credit card.',
    closeBtn: 'Write my idea',
    close: 'Close',
    sheetTitle: 'This is how your blueprint starts.',
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
    inappFine: 'You can also tap the ⋯ menu at the top and choose “Open in browser”.',
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
    wsInput: 'Describe the project you want to create...'
  };

  // Textos que no viven en el HTML
  var TXT = {
    es: {
      title: 'Think4ever: tu idea o tu código, en un plano vivo',
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
        errGeneric: 'Algo salió mal. Inténtalo de nuevo.'
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
        errGeneric: 'Something went wrong. Please try again.'
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
    wireLinks();
    if (st.email) setCodeText();
    updatePrep();
  }
  langBtn.addEventListener('click', function () {
    lang = lang === 'en' ? 'es' : 'en';
    try { localStorage.setItem('t4e-lang', lang); } catch (e) { /* sin almacenamiento */ }
    applyLang();
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
      if (i === 0) img.src = ASSETS + 'escenas/' + name + '.webp';
      else img.dataset.src = ASSETS + 'escenas/' + name + '.webp';   // las demás, después de pintar
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

  // Imagen fija mientras se comprueba si la carpeta de cuadros está publicada
  var still = { frames: [new Image()] };
  if (POSTERS.mascot) {
    still.frames[0].onload = function () { if (!animated) draw(still, 0); };
    still.frames[0].src = POSTERS.mascot;
  }

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

  // Tocar la mascota: saca lo siguiente o guarda lo que tiene afuera
  function toggle() {
    if (!animated || fixed || reduced || HERO === '2') return;
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
      st.path = chip.dataset.path; st.source = '';
      track('intent_selected', ctx());
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
      // Analizar código y conectar repositorio eligen la ruta de código (el repositorio se conecta adentro)
      if (t === 'code' || t === 'repo') {
        chips.filter(function (c) { return c.dataset.path === 'code'; })[0].click();
        if (t === 'repo') st.source = 'vcs';
        return;
      }
      showToast(T.msg.later);
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
    if (HOW.frames && HOW.frames.length) drawHow(Math.round(p * (HOW.frames.length - 1)));
  }
  function startHow() {
    if (HOW.frames) return;
    if (!animated) {
      // Sin cuadros publicados: tres imágenes fijas, una por paso
      HOW.frames = (POSTERS.how || []).map(function (src) { var im = new Image(); im.onload = updateHow; im.src = src; return im; });
      updateHow();
      return;
    }
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
    emailHint.textContent = T.msg.errEmail;
    if (!ok) { email.focus(); return; }
    register(email.value.trim(), emailHint, accForm.querySelector('button[type="submit"]'));
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

  /* ---------- Registro (Think4Ever Landing API v3) ---------- */

  var LIVE = /(^|\.)think4ever\.com$/.test(location.hostname);
  var API = 'https://portal.think4ever.com/api';
  var PORTAL = 'https://portal.think4ever.com/';
  var LOGIN_URL = PORTAL + '#/login';
  var TERMS_URL = PORTAL + 'legal.html';
  var PRIVACY_URL = 'https://think4ever.com/privacy-policy';
  var MODES = { intent: 'design', code: 'analyze', hardening: 'harden', prototype: 'prototype' };
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var GITHUB_URL = /https?:\/\/(www\.)?github\.com\/[^\/\s]+\/[^\/\s]+/i;
  // Igual que la plantilla publicada por David Stephan: con la portada 2 la variante A reporta research_a2
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
