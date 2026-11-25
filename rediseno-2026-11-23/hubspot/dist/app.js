/* think4ever, propuesta de rediseño (Research, 23-nov-2026). Sin dependencias. No envía datos:
   los eventos se dejan en window.dataLayer con los nombres de la definición única del 20-nov,
   para que al montarla en HubSpot la medición ya esté. */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };

  /* ---------- Navegador interno de Instagram / Facebook ---------- */
  var ua = navigator.userAgent || '';
  var inApp = /Instagram|FBAN|FBAV|FB_IAB|; wv\)/.test(ua) || params.has('inapp');

  /* ---------- Medición ---------- */
  var FLOW = 'research_c';
  window.dataLayer = window.dataLayer || [];
  function track(event, extra) {
    var e = { event: event, flow_variant: FLOW, in_app_browser: inApp };
    for (var k in extra) e[k] = extra[k];
    window.dataLayer.push(e);
  }

  /* ---------- Idiomas ---------- */
  var EN = {
    login: 'Sign in',
    topCta: 'Sign up',
    suTitle: 'Create your free account', suSub: 'Free, no credit card. You go straight to your workspace.',
    suIdea: 'Your idea:', suGoogle: 'Continue with Google', suOr: 'or with your email', suEmailL: 'Email', suEmailPh: 'you@email.com',
    suEula: 'I accept the <a href="https://portal.think4ever.com/legal.html" target="_blank" rel="noopener">EULA, Privacy Policy and Acceptable Use Policy</a>',
    suNews: 'Send me product news and updates', suGo: 'Create my account',
    suCodeT: 'Check your email', suCodeP: 'We sent a 6-digit code to', suVerify: 'Go to my account',
    suResend: 'Send a new code', suBack: 'Use another email', suDoneT: 'Done. Opening your workspace…',
    h1: 'No coding needed. <em>Design and build</em> your app.',
    pill: 'Works with the AI you already use to code',
    sub: 'Describe it in your own words. Think4Ever asks what is missing, designs it with you and builds it.',
    lkRules: 'The rules of your app', lkData: 'The data it stores', lkDetail: 'The detail of each screen',
    ideaLabel: 'Describe your idea',
    ideaPh: 'Tell us your idea in one sentence',
    send: 'Create my free account',
    ideaHint: 'Write your idea or tap one of the examples.',
    exAria: 'Examples',
    exLabel: 'No idea? Tap one:',
    exBarber: 'Barbershop bookings',
    exGrado: 'My thesis project',
    exTienda: 'My online store',
    free: 'Free to start. No credit card.',
    freeHero: 'Free, no credit card. We only ask for your email.',
    planOf: 'Real example:',
    an1b: 'What do I get?', an1: 'The full plan of your app, before any code is written.',
    an2b: 'What if I already use an AI?', an2: 'It does not replace it. It gives it the plan so it builds well.',
    an3b: 'What does it cost?', an3: 'Starting is free, with 500 credits and no card.',
    pvScreens: 'Screens', pvRoles: 'Who uses it', pvFlows: 'What happens', pvRule: 'One rule:',
    planFoot: 'This is how your app looks before a single line of code is written.',
    getEyebrow: 'How it works',
    getH2: 'When your AI has the full plan, it builds what you asked for.',
    st1h: 'You tell us your idea', st1p: 'In one sentence, the way you would tell a friend. If something is missing, think4ever asks you with options to pick.',
    st2h: 'You see the plan of your app', st2p: 'The screens, who uses it and what happens at each step. You change it until it is the app you want.',
    st3h: 'Your AI builds it', st3p: 'You connect the AI you already use and it builds following your plan, step by step.',
    difEyebrow: 'Already using an AI?',
    difH2: 'It is not another AI to pay for. It is the plan yours is missing.',
    vsAh: 'With your AI alone',
    vsA1: 'You ask for an app and it starts writing code without asking you anything.',
    vsA2: 'Halfway through, it forgets what you had already agreed.',
    vsA3: 'You end up explaining the same thing again and again.',
    vsBh: 'With think4ever and your AI',
    vsB1: 'You see your whole app before spending time building it.',
    vsB2: 'The plan keeps everything you decided. It does not forget.',
    vsB3: 'Your AI builds following the plan, with what you already pay for.',
    prEyebrow: 'What it costs',
    prH2: 'You start free. You pay only if you want to keep going.',
    pr1b: 'No credit card.', pr1: 'You create your account and see your plan without giving payment details.',
    pr2b: '500 credits on us.', pr2: 'They come with the free plan, one time, for your first project.',
    pr3b: 'What is a credit?', pr3: 'What think4ever uses each time it works on your plan.',
    pr4b: 'And after that?', pr4: 'There is no monthly fee. You buy more credits only if you need them.',
    trEyebrow: 'Who is behind it',
    trH2: 'Your idea stays with you.', trLead: 'What you write and your plan are yours alone.',
    tr1b: 'It stays in your account.', tr1: 'Your idea and your plan are saved there, so you can continue whenever you want.',
    tr4b: 'Who is behind it.', tr4: 'think4ever is a company from Canada, with a team in Colombia.',
    tr2b: 'Zero spam.', tr2: 'We only email you about your account and what you opt into.',
    tr3b: 'Leave whenever you want.', tr3: 'No contracts and no automatic charges.',
    faqEyebrow: 'Frequently asked questions',
    faqH2: 'What people ask us before starting.',
    q1: 'I already pay for ChatGPT or Claude. Do I have to pay for something else?',
    a1: 'Not to start: you create your free account with no card. think4ever is not another AI: it gives the plan to tools like Claude Code or Cursor.',
    q2: 'Does it work on a phone?', a2: 'Yes. You write your idea and see your plan from your phone.',
    q3: 'Does it make the whole app for me?', a3: 'It gives you the full plan of your app. With that plan, the AI you already use builds it and you see each step.',
    q4: 'Do I need to know how to code?', a4: 'No. You write your idea in your own words and see the plan of your app as screens and steps, without a line of code.',
    q5: 'What if I already have a half-built app?', a5: 'It works too. You bring your code and think4ever shows you how it is put together and what is missing.',
    closeH2: 'Your app starts with one sentence.',
    alsoCode: 'Already have a half-built app?', alsoCodeA: 'Bring your code',
    alsoEb: 'Want to build with us?', alsoEbA: 'Meet the Developer Network',
    close: 'Close',
    pvLoading: 'Building your plan…',
    gateProg: 'Preview: 3 of 6 parts', sheetSub: 'Create your free account and build the full plan of your idea there.',
    gateGo: 'Create my free account',
    who: 'think4ever is a company from Canada, with a team in Colombia.',
    fine: 'Free, no credit card and no spam.',
    howBtn: 'See how it works', howTitle: 'See how it works', howClose: 'Close', howTabsAria: 'Video categories',
    howC1: 'Build from scratch', howC2: 'Continue with existing code and analyze it',
    howC3: 'Production hardening', howC4: 'Gap analysis', howSoon: 'Coming soon',
    howSoonH: 'This video is coming soon.', howSoonP: 'In the meantime, see how to build an app from scratch.',
    howSoonBtn: 'Go to Build from scratch', howMuted: 'The video starts muted. Turn the sound on with the volume button.'
  };

  var MSG = {
    es: { mine: 'Tu plan:', copied: 'Copiamos tu idea. Pégala en el siguiente paso.', suErrEmail: 'Escribe un correo válido.', suErrEula: 'Para crear la cuenta, acepta el EULA y las políticas.', suErrNet: 'No pudimos conectarnos. Revisa tu conexión e inténtalo otra vez.', suErrGeneric: 'No pudimos crear la cuenta. Inténtalo otra vez.', suErrCode: 'Escribe los 6 dígitos del código.', suErrCodeBad: 'El código no es válido o ya venció. Revísalo o pide otro.', suExists: 'Ya tienes cuenta con ese correo: te enviamos un código para entrar.', suResent: 'Te enviamos un código nuevo.', suDemo: 'Vista previa: aquí se abre el portal.', hoy: 'Hoy: ', more: 'y {n} más', real: 'Plan real, hecho por think4ever con esa frase: {s} pantallas, {f} procesos, {r} reglas y {d} tipos de datos.' },
    en: { mine: 'Your plan:', copied: 'We copied your idea. Paste it in the next step.', suErrEmail: 'Enter a valid email.', suErrEula: 'To create your account, accept the EULA and policies.', suErrNet: 'We could not connect. Check your connection and try again.', suErrGeneric: 'We could not create your account. Please try again.', suErrCode: 'Enter the 6 digits of the code.', suErrCodeBad: 'The code is not valid or has expired. Check it or ask for a new one.', suExists: 'You already have an account with that email: we sent you a code to sign in.', suResent: 'We sent you a new code.', suDemo: 'Preview: the portal opens here.', hoy: 'Today: ', more: 'and {n} more', real: 'Real plan, made by think4ever from that sentence: {s} screens, {f} processes, {r} rules and {d} kinds of data.' }
  };

  /* Planes de ejemplo REALES: los generó la plataforma el 23-nov-2026 a partir de la misma frase que trae
     cada ejemplo (proyectos BarberTurnos, Organizador de Proyecto de Grado y Tienda en Línea).
     Aquí va un extracto: 3 pantallas, los roles y 3 procesos de cada uno, una regla y los totales reales.
     El inglés es traducción de Research del plan generado en español. */
  var EXAMPLES = {
    barberia: {
      n: { screens: 24, roles: 3, flows: 10, rules: 9, data: 14 },
      es: { idea: 'Una app de turnos para una barbería', name: 'Turnos de barbería',
            screens: ['Reservar: fecha y hora', 'Mis turnos', 'Lista de espera'], roles: ['Cliente', 'Barbero', 'Administrador / dueño'],
            flows: ['Reservar turno', 'Reprogramar turno', 'Ofrecer el hueco liberado a la lista de espera'],
            rule: 'Un barbero no puede tener dos turnos que se superpongan.' },
      en: { idea: 'A booking app for a barbershop', name: 'Barbershop bookings',
            screens: ['Book: date and time', 'My bookings', 'Waiting list'], roles: ['Client', 'Barber', 'Admin / owner'],
            flows: ['Book a slot', 'Reschedule a slot', 'Offer the freed slot to the waiting list'],
            rule: 'A barber cannot have two overlapping bookings.' } },
    grado: {
      n: { screens: 18, roles: 3, flows: 10, rules: 20, data: 12 },
      es: { idea: 'Una app para organizar mi proyecto de grado', name: 'Mi proyecto de grado',
            screens: ['Cronograma', 'Tablero de tareas', 'Panel del director'], roles: ['Estudiante', 'Líder de grupo', 'Director / asesor'],
            flows: ['Planificación del cronograma', 'Subida de versión y entrega', 'Revisión del director'],
            rule: 'Cada subida crea una versión nueva. Las anteriores no se pueden editar ni borrar.' },
      en: { idea: 'An app to organize my thesis project', name: 'My thesis project',
            screens: ['Timeline', 'Task board', 'Advisor panel'], roles: ['Student', 'Group lead', 'Advisor'],
            flows: ['Timeline planning', 'Version upload and delivery', 'Advisor review'],
            rule: 'Each upload creates a new version. Earlier ones cannot be edited or deleted.' } },
    tienda: {
      n: { screens: 26, roles: 3, flows: 8, rules: 15, data: 15 },
      es: { idea: 'Una tienda en línea para mi emprendimiento', name: 'Mi tienda en línea',
            screens: ['Catálogo', 'Carrito', 'Pedidos (administrador)'], roles: ['Visitante', 'Cliente registrado', 'Administrador (dueño)'],
            flows: ['Compra en línea', 'Pedido por WhatsApp', 'Gestión de inventario'],
            rule: 'El inventario se descuenta solo cuando el pago queda confirmado.' },
      en: { idea: 'An online store for my small business', name: 'My online store',
            screens: ['Catalog', 'Cart', 'Orders (admin)'], roles: ['Visitor', 'Registered customer', 'Admin (owner)'],
            flows: ['Online purchase', 'Order by WhatsApp', 'Inventory management'],
            rule: 'Stock is deducted only when the payment is confirmed.' } }
  };
  var GENERIC = {
    es: { screens: ['Inicio', 'Lo principal de tu app', 'Tu panel'], roles: ['Quien la usa', 'Quien la administra', 'Quien da soporte'], flows: ['Entrar a la app', 'Hacer lo principal', 'Ver cómo va'] },
    en: { screens: ['Home', 'The core of your app', 'Your panel'], roles: ['Who uses it', 'Who runs it', 'Who gives support'], flows: ['Get into the app', 'Do the main thing', 'See how it goes'] }
  };

  var tEls = $$('[data-t]'), phEls = $$('[data-t-ph]'), ariaEls = $$('[data-t-aria]');
  tEls.forEach(function (el) { el._es = el.innerHTML; });
  phEls.forEach(function (el) { el._es = el.getAttribute('placeholder'); });
  ariaEls.forEach(function (el) { el._es = el.getAttribute('aria-label'); });
  var esTitle = document.title;

  var stored = null;
  try { stored = localStorage.getItem('t4e-lang'); } catch (e) { /* sin almacenamiento */ }
  var lang = params.get('lang') || stored || (/^es/i.test(navigator.language || '') ? 'es' : 'en');
  if (lang !== 'en') lang = 'es';
  var langBtn = $('#lang');

  function applyLang() {
    var en = lang === 'en';
    document.documentElement.lang = lang;
    document.title = en ? 'Think4Ever: design and build your app, no coding needed' : esTitle;
    tEls.forEach(function (el) { el.innerHTML = en ? EN[el.dataset.t] : el._es; });
    phEls.forEach(function (el) { el.setAttribute('placeholder', en ? EN[el.dataset.tPh] : el._es); });
    ariaEls.forEach(function (el) { el.setAttribute('aria-label', en ? EN[el.dataset.tAria] : el._es); });
    langBtn.textContent = en ? 'ES' : 'EN';
    renderPlan(currentEx);
  }
  langBtn.addEventListener('click', function () {
    lang = lang === 'en' ? 'es' : 'en';
    try { localStorage.setItem('t4e-lang', lang); } catch (e) { /* sin almacenamiento */ }
    applyLang();
  });

  /* ---------- El plano se arma en la misma página ---------- */
  var idea = $('#idea'), form = $('#idea-form'), hint = $('#idea-hint'), plan = $('#plan');
  var gate = $('#plan-gate'), live = $('#plan-live');
  var currentEx = 'barberia', pickedEx = null, mine = null, buildTimer;

  // Cada pieza entra con un pequeño retraso, como una respuesta que se va escribiendo
  function fill(ul, items, offset) {
    ul.textContent = '';
    items.forEach(function (t, i) {
      var li = document.createElement('li');
      li.textContent = t; li.style.setProperty('--i', offset + i * 3);
      ul.appendChild(li);
    });
  }
  function paint(p, n) {
    fill($('#pl-screens'), p.screens, 0); fill($('#pl-roles'), p.roles, 1); fill($('#pl-flows'), p.flows, 2);
    // con un plan real, cada columna dice cuánto más trae
    [['#pl-screens', 'screens'], ['#pl-flows', 'flows']].forEach(function (x) {
      var extra = n ? n[x[1]] - p[x[1]].length : 0;
      if (extra > 0) { var li = document.createElement('li'); li.className = 'more'; li.style.setProperty('--i', 9); li.textContent = MSG[lang].more.replace('{n}', extra); $(x[0]).appendChild(li); }
    });
  }
  function renderPlan(key) {
    if (mine) { renderMine(true); return; }
    var p = EXAMPLES[key][lang];
    $('#plan-name').textContent = p.name;
    paint(p, EXAMPLES[key].n);
    $('#pl-rule').textContent = p.rule;
    var n = EXAMPLES[key].n;
    $('#plan-foot').textContent = MSG[lang].real.replace('{s}', n.screens).replace('{f}', n.flows).replace('{r}', n.rules).replace('{d}', n.data);
    var r = $('#plan-rule'); r.hidden = false; r.style.animation = 'none'; void r.offsetWidth; r.style.animation = '';
    $('#plan-foot').hidden = false; gate.hidden = true; live.hidden = true;
  }
  // Con la idea de la persona: arma el inicio del plano y deja a la vista lo que falta, con la cuenta ahí mismo
  function renderMine(instant) {
    var p = mine.ex ? EXAMPLES[mine.ex][lang] : GENERIC[lang];
    $('#plan-kind').textContent = MSG[lang].mine;
    $('#plan-name').textContent = mine.text;
    $('#plan-rule').hidden = true; $('#plan-foot').hidden = true;
    clearTimeout(buildTimer);
    if (instant || reduced) { paint(p); live.hidden = true; gate.hidden = false; return; }
    ['#pl-screens', '#pl-roles', '#pl-flows'].forEach(function (s) { $(s).textContent = ''; });
    gate.hidden = true; live.hidden = false;
    buildTimer = setTimeout(function () {
      paint(p);
      buildTimer = setTimeout(function () { live.hidden = true; gate.hidden = false; }, 1100);
    }, 650);
  }
  var exBtns = $$('.ex');
  exBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      currentEx = pickedEx = btn.dataset.ex;
      if (mine) { mine = null; forget(); var k = $('#plan-kind'); k.innerHTML = lang === 'en' ? EN.planOf : k._es; }
      exBtns.forEach(function (b) { b.classList.toggle('is-on', b === btn); });
      idea.value = EXAMPLES[currentEx][lang].idea;
      hint.hidden = true;
      renderPlan(currentEx);
      track('idea_example_picked', { example: currentEx });
    });
  });
  idea.addEventListener('input', function () { hint.hidden = true; pickedEx = null; });
  idea.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submitIdea(); }
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); submitIdea(); });

  /* 24-nov, 5:00 p. m.: la caja abre el registro aquí mismo (ver "Registro en la landing" más abajo). */
  function submitIdea() { openSignup('idea_box'); }

  var toast = $('#toast'), toastTimer;
  function showToast(msg) {
    toast.textContent = msg; toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.hidden = true; }, 3200);
  }

  /* ---------- La cuenta se crea en el portal (decisión de David, 24-nov) ----------
     La landing no hace el registro: el botón de la cuenta lleva a la página de registro del portal y le pasa
     los UTM de la visita. Si la visita trae invitación (ref o inv), también van, en la misma forma en que
     el prototipo ya los mandaba al portal. La idea del visitante no viaja: se queda en este navegador. */
  var LIVE = /(^|\.)think4ever\.com$/.test(location.hostname);
  var PORTAL = 'https://portal.think4ever.com/', LOGIN_URL = PORTAL + '#/login';
  /* 24-nov: portal.think4ever.com/#/register redirige a think4ever.com/#start (registro nuevo del sitio
     principal, con "Start free" y "Continue with Google") y en el salto se pierden los UTM: se va directo ahí. */
  /* 24-nov: el registro del portal (#/register) redirige a think4ever.com/#start y en el salto pierde los UTM
     (prueba de las 4:40 p. m.). Se va directo a think4ever.com, que es donde termina igual (David, 4:45 p. m.). */
  var SIGNUP = 'https://think4ever.com/';
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var REF = params.get('ref') || '', INV = params.get('inv') || '';

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
  function registerUrl() {
    var p = new URLSearchParams(), u = utms();
    Object.keys(u).forEach(function (k) { p.set(k, u[k]); });
    if (REF) p.set('ref', REF);
    if (INV) p.set('inv', INV);
    var q = p.toString();
    return SIGNUP + (q ? '?' + q : '') + '#start';
  }
  /* ---------- Registro en la landing (24-nov, 5:00 p. m., pedido de David) ----------
     La landing crea la cuenta con la misma API del portal que usa think4ever.com (la API acepta go.think4ever.com):
     idea (signup-intent) → correo → código de 6 dígitos → portal.think4ever.com con la sesión abierta y la idea cargada.
     Google va directo al portal (?login=google) con la idea y los UTM. Nunca pasa por think4ever.com.
     Fuera de think4ever.com (vista previa local) no llama a la API: simula los pasos. */
  var API = 'https://portal.think4ever.com/api';
  var su = $('#su'), suEmail = $('#su-email'), suCode = $('#su-code'), suEula = $('#su-eula'), suNews = $('#su-news');
  var S = { email: '', mode: 'signup', intent: null, intentFor: '', busy: false, wait: 0, from: '' };
  function attrib() {
    var o = utms();
    if (REF) o.ref_key = REF;
    if (INV) o.invite_token = INV;
    return o;
  }
  function api(path, body) {
    if (!LIVE) return new Promise(function (r) { setTimeout(function () { r({ ok: true, status: 201, data: { demo: true } }); }, 500); });
    var url = API + path + (path.indexOf('?') < 0 ? '?' : '&') + 'lang=' + lang;
    return fetch(url, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, status: r.status, data: d || {} }; }); })
      .catch(function () { return { ok: false, status: 0, data: {} }; });
  }
  function ideaText() { return idea.value.trim().slice(0, 4000); }
  function ensureIntent() {
    var text = ideaText();
    if (!text) return Promise.resolve(null);
    if (S.intentFor === text) return Promise.resolve(S.intent);
    var body = { build_mode: 'design', prompt: text, project_prompt: text };
    var a = attrib(); Object.keys(a).forEach(function (k) { body[k] = a[k]; });
    return api('/auth/signup-intent', body).then(function (r) {
      S.intentFor = text;
      S.intent = r.ok && r.data && /^[a-f0-9]{48}$/i.test(r.data.intent_token || '') ? r.data.intent_token : null;
      return S.intent;
    });
  }
  function googleUrl() {
    var p = new URLSearchParams(), a = utms(), text = ideaText();
    p.set('login', 'google');
    Object.keys(a).forEach(function (k) { p.set(k, a[k]); });
    if (REF) p.set('ref', REF);
    if (INV) p.set('inv', INV);
    if (S.intent && S.intentFor === text) p.set('intent', S.intent);
    else if (text) { p.set('prompt', text.slice(0, 1500)); p.set('mode', 'design'); }
    return PORTAL + '?' + p.toString();
  }
  function suStep(n) {
    ['#su-s1', '#su-s2', '#su-s3'].forEach(function (s, i) { $(s).hidden = i !== n - 1; });
  }
  function suErr(id, msg) { var el = $(id); el.textContent = msg || ''; el.hidden = !msg; }
  function suBusy(on) {
    S.busy = on;
    $('#su-go').disabled = on; $('#su-verify').disabled = on;
  }
  function openSignup(from) {
    S.from = from;
    var text = ideaText();
    $('#su-idea').hidden = !text;
    $('#su-idea-t').textContent = text;
    suErr('#su-err1'); suErr('#su-err2');
    if (!S.email) suStep(1);
    $('#su-google').href = googleUrl();
    ensureIntent().then(function () { $('#su-google').href = googleUrl(); });
    document.documentElement.classList.add('su-on');
    if (typeof su.showModal === 'function') { if (!su.open) su.showModal(); } else su.setAttribute('open', '');
    track('sign_up_start', { method: 'landing', from: from, idea_length: text.length });
    setTimeout(function () { (S.email ? suCode : suEmail).focus({ preventScroll: true }); }, 60);
  }
  function closeSignup() {
    if (S.busy) return;
    document.documentElement.classList.remove('su-on');
    if (su.open) { if (typeof su.close === 'function') su.close(); else su.removeAttribute('open'); }
  }
  $('#su-close').addEventListener('click', closeSignup);
  su.addEventListener('close', function () { document.documentElement.classList.remove('su-on'); });
  su.addEventListener('click', function (e) { if (e.target === su) closeSignup(); });
  $('#su-google').addEventListener('click', function () {
    this.href = googleUrl();
    track('google_clicked', { method: 'google', from: S.from, in_app_browser: inApp });
  });
  function toCode(mode) {
    S.mode = mode;
    $('#su-email-t').textContent = S.email;
    suCode.value = ''; suErr('#su-err2');
    suStep(2);
    startWait();
    setTimeout(function () { suCode.focus({ preventScroll: true }); }, 60);
    track('code_sent', { mode: mode });
  }
  function startWait() {
    S.wait = 30;
    var b = $('#su-resend');
    b.disabled = true;
    var t = setInterval(function () {
      S.wait -= 1;
      if (S.wait <= 0) { clearInterval(t); b.disabled = false; }
    }, 1000);
  }
  $('#su-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (S.busy) return;
    var email = suEmail.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { suErr('#su-err1', MSG[lang].suErrEmail); suEmail.focus(); return; }
    if (!suEula.checked) { suErr('#su-err1', MSG[lang].suErrEula); return; }
    suErr('#su-err1'); suBusy(true);
    S.email = email;
    track('signup_submitted', { method: 'email', from: S.from });
    ensureIntent().then(function (tok) {
      var body = { email: email, eula_accepted: true, marketing_opt_in: !!suNews.checked };
      if (tok) body.intent_token = tok;
      var a = attrib(); Object.keys(a).forEach(function (k) { body[k] = a[k]; });
      return api('/auth/register', body).then(function (r) {
        if (r.ok) { suBusy(false); toCode('signup'); return; }
        if (r.status === 409) {
          var b2 = { email: email }; if (tok) b2.intent_token = tok;
          Object.keys(a).forEach(function (k) { b2[k] = a[k]; });
          return api('/auth/login-code', b2).then(function (r2) {
            suBusy(false);
            if (r2.ok) { toCode(r2.data && r2.data.requiresVerification ? 'signup' : 'login'); showToast(MSG[lang].suExists); return; }
            S.email = ''; suErr('#su-err1', (r2.data && r2.data.error) || MSG[lang].suErrGeneric);
          });
        }
        suBusy(false); S.email = '';
        suErr('#su-err1', r.status === 0 ? MSG[lang].suErrNet : ((r.data && r.data.error) || MSG[lang].suErrGeneric));
      });
    });
  });
  function verify() {
    if (S.busy) return;
    var code = suCode.value.replace(/\D/g, '');
    if (code.length !== 6) { suErr('#su-err2', MSG[lang].suErrCode); return; }
    suBusy(true); suErr('#su-err2');
    var body = { email: S.email, otp: code, code: code, signin_code: code };
    if (S.intent) body.intent_token = S.intent;
    var a = attrib(); Object.keys(a).forEach(function (k) { body[k] = a[k]; });
    api(S.mode === 'login' ? '/auth/login-code/verify' : '/auth/verify-email-code', body).then(function (r) {
      if (r.ok) {
        track('auth_completed', { method: 'email', mode: S.mode, from: S.from });
        suStep(3);
        S.busy = false;
        if (!LIVE) { $('#su-done').textContent = MSG[lang].suDemo; return; }
        setTimeout(function () { window.location.assign(PORTAL); }, 1200);
        return;
      }
      suBusy(false);
      suCode.value = '';
      suErr('#su-err2', r.status === 0 ? MSG[lang].suErrNet : ((r.data && r.data.error) || MSG[lang].suErrCodeBad));
      suCode.focus();
    });
  }
  $('#su-code-form').addEventListener('submit', function (e) { e.preventDefault(); verify(); });
  suCode.addEventListener('input', function () {
    var v = suCode.value.replace(/\D/g, '').slice(0, 6);
    if (suCode.value !== v) suCode.value = v;
    if (v.length === 6) verify();
  });
  $('#su-resend').addEventListener('click', function () {
    if (S.wait > 0 || S.busy) return;
    api(S.mode === 'login' ? '/auth/login-code' : '/auth/resend-verification', { email: S.email }).then(function (r) {
      if (r.ok) { showToast(MSG[lang].suResent); startWait(); track('code_resent', {}); }
      else suErr('#su-err2', (r.data && r.data.error) || MSG[lang].suErrGeneric);
    });
  });
  $('#su-back').addEventListener('click', function () {
    if (S.busy) return;
    S.email = ''; suStep(1);
    setTimeout(function () { suEmail.focus(); }, 60);
  });

  /* Todas las puertas abren el mismo registro: encabezado, barra fija, "Trae tu código" y la caja */
  [['#gate-register', 'plan'], ['#top-register', 'header'], ['#float-register', 'float_bar'], ['[data-proto="code"]', 'code']].forEach(function (x) {
    var a = $(x[0]);
    if (!a) return;
    a.href = registerUrl();
    a.addEventListener('click', function (e) { e.preventDefault(); openSignup(x[1]); });
  });

  /* Recordar dónde va: la idea y su plan. Vive 30 minutos en este navegador y nunca sale de él.
     Si no hay almacenamiento, la página sigue funcionando igual. */
  var KEEP = 't4e_rc_progress', KEEP_MS = 30 * 60 * 1000;
  function remember(part) {
    try {
      var cur = JSON.parse(localStorage.getItem(KEEP) || '{}');
      Object.keys(part).forEach(function (k) { cur[k] = part[k]; });
      cur.at = Date.now();
      localStorage.setItem(KEEP, JSON.stringify(cur));
    } catch (e) { /* sin almacenamiento */ }
  }
  function forget() { try { localStorage.removeItem(KEEP); } catch (e) { /* sin almacenamiento */ } }
  function restore() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEEP) || 'null'); } catch (e) { /* sin almacenamiento */ }
    if (!s || !s.text || Date.now() - (s.at || 0) > KEEP_MS) { forget(); return; }
    idea.value = s.text; pickedEx = EXAMPLES[s.ex] ? s.ex : null;
    mine = { text: s.text, ex: pickedEx };
    renderMine(true);
    track('progress_restored', { step: 'plan' });
  }

  $$('[data-proto="login"]').forEach(function (a) { a.href = LOGIN_URL; });
  function ebUrl() {
    var p = new URLSearchParams(), u = utms();
    Object.keys(u).forEach(function (k) { p.set(k, u[k]); });
    var q = p.toString();
    return 'https://go.think4ever.com/es/developer-network-co' + (q ? '?' + q : '');
  }
  $$('[data-proto="code"]').forEach(function (a) { a.href = registerUrl(); });
  $$('[data-proto="eb"]').forEach(function (a) { a.href = ebUrl(); });

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-proto]');
    if (el) {
      var kind = el.dataset.proto;
      if (kind === 'login') { track('login_link_clicked', {}); return; }
      if (kind === 'code') { el.href = registerUrl(); track('sign_up_start', { method: 'portal', from: 'code' }); return; }
      if (kind === 'eb') { el.href = ebUrl(); track('developer_network_clicked', {}); return; }
      return;
    }
    if (e.target.closest('[data-focus-idea]')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      idea.focus({ preventScroll: true });
    }
  });

  /* ---------- Barra fija: aparece cuando la caja sale de la pantalla ---------- */
  var floatCta = $('#float-cta');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { floatCta.hidden = entries[0].isIntersecting; }).observe(form);
  }

  /* ---------- "Mira cómo funciona": popup de videos (especificación del equipo de desarrollo, 24-nov) ----------
     Nada de YouTube se carga con la página: el iframe se crea al abrir el popup o al cambiar de categoría y se
     destruye al cerrar, para que el video pare. Arranca en silencio porque los navegadores bloquean el autoplay
     con sonido. Las categorías sin video muestran "Pronto", sin reproductor. */
  var HOW = {
    scratch: { yt: '4Yxbu3gZNYY', title: 'Design2Code' },
    code: { yt: 'XtfgRmkqsYw', title: 'Code2Design' },
    hardening: { yt: '' },
    gap: { yt: '' }
  };
  var how = $('#how'), howOpenBtn = $('#how-open'), howPanel = $('#how-panel');
  var howPlayer = $('#how-player'), howSoon = $('#how-soon'), howNote = $('#how-note');
  var howTabs = $$('.how-tab'), howCat = 'scratch', howIsOpen = false, howPressOut = false;
  var canModal = typeof how.showModal === 'function';

  function howSelect(cat, focus) {
    howCat = cat;
    howTabs.forEach(function (t) {
      var on = t.dataset.how === cat;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on) { howPanel.setAttribute('aria-labelledby', t.id); if (focus) t.focus(); }
    });
    howPlayer.textContent = '';                       // el video anterior se destruye y para
    var v = HOW[cat];
    howSoon.hidden = !!v.yt; howPlayer.hidden = !v.yt; howNote.hidden = !v.yt;
    if (!v.yt) return;
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + v.yt + '?autoplay=1&mute=1&playsinline=1&rel=0';
    f.title = v.title;
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';   // YouTube pide el origen para reproducir incrustado
    howPlayer.appendChild(f);
  }
  function howPick(cat) {
    if (cat === howCat) return;
    howSelect(cat, true);
    track('how_it_works_category', { category: cat });
  }
  function howShow() {
    if (howIsOpen) return;
    howIsOpen = true;
    document.documentElement.classList.add('how-on');
    if (canModal) how.showModal(); else how.setAttribute('open', '');
    howSelect(HOW[howCat].yt ? howCat : 'scratch', true);   // siempre abre con un video
    track('how_it_works_opened', { category: howCat });
  }
  function howHide() {
    if (!howIsOpen) return;
    howIsOpen = false;
    howPlayer.textContent = '';                       // sin iframe, el video para
    document.documentElement.classList.remove('how-on');
    if (how.open) { if (canModal) how.close(); else how.removeAttribute('open'); }
    howOpenBtn.focus({ preventScroll: true });
  }
  howOpenBtn.addEventListener('click', howShow);
  $('#how-close').addEventListener('click', howHide);
  $('#how-soon-go').addEventListener('click', function () { howPick('scratch'); });
  how.addEventListener('close', howHide);              // Esc nativo del popup
  document.addEventListener('keydown', function (e) { if (howIsOpen && e.key === 'Escape') { e.preventDefault(); howHide(); } });
  // Clic fuera: en el fondo oscuro el clic cae sobre el propio dialog, no sobre la caja
  how.addEventListener('pointerdown', function (e) { howPressOut = e.target === how; });
  how.addEventListener('click', function (e) { if (e.target === how && howPressOut) howHide(); howPressOut = false; });
  howTabs.forEach(function (t, i) {
    t.addEventListener('click', function () { howPick(t.dataset.how); });
    t.addEventListener('keydown', function (e) {
      var n = howTabs.length, j = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % n;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + n) % n;
      else if (e.key === 'Home') j = 0;
      else if (e.key === 'End') j = n - 1;
      if (j < 0) return;
      e.preventDefault();
      howPick(howTabs[j].dataset.how);
    });
  });


  applyLang();
  if (!params.has('hoja') && !params.has('nuevo')) restore();
  if (params.has('hoja')) { idea.value = EXAMPLES.barberia[lang].idea; pickedEx = 'barberia'; submitIdea(); }
})();
