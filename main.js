(function () {
  'use strict';

  var root = document.documentElement;
  var API = String(window.ASISTENTE_API || '').replace(/\/$/, '');
  var DEMOS = [
    { id: 'demo-dental', name: 'Clínica Dental Lumen', initials: 'L', color: '#0e8f86', tab: { es: 'Clínica dental', ca: 'Clínica dental' } },
    { id: 'demo-gimnasio', name: 'Gimnàs Impuls', initials: 'I', color: '#d4501e', tab: { es: 'Gimnasio', ca: 'Gimnàs' } },
    { id: 'demo-inmobiliaria', name: 'Inmobiliaria Horizonte', initials: 'H', color: '#6d4bd8', tab: { es: 'Inmobiliaria', ca: 'Immobiliària' } }
  ];
  function $(id) { return document.getElementById(id); }
  function lang() { return root.getAttribute('lang') === 'ca' ? 'ca' : 'es'; }
  function t(k) { return window.I18N[lang()][k]; }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  $('year').textContent = new Date().getFullYear();
  var snip = $('snipSrc'); if (snip && API) snip.textContent = '"' + API + '/widget.js"';

  /* =================== Idioma =================== */
  function applyLang() {
    var d = window.I18N[lang()];
    document.querySelectorAll('[data-i18n]').forEach(function (el) { var v = d[el.getAttribute('data-i18n')]; if (v != null) el.innerHTML = v; });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { var v = d[el.getAttribute('data-i18n-aria')]; if (v) el.setAttribute('aria-label', v); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { var v = d[el.getAttribute('data-i18n-ph')]; if (v) el.setAttribute('placeholder', v); });
    document.title = d['meta.title'];
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang())); });
    $('ctaMail').href = 'mailto:' + window.EMAIL + '?subject=' + encodeURIComponent('Codelab · ' + d['mail.subject']) + '&body=' + encodeURIComponent(d['mail.body']);
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang'); if (l === lang()) return;
      document.body.classList.add('lang-switching');
      setTimeout(function () {
        root.setAttribute('lang', l); save('codelab-lang', l);
        applyLang(); renderTabs(); startPreview();
        var api = window.CodelabAsistente && window.CodelabAsistente[current];
        if (api) api.setLang(l);
        document.body.classList.remove('lang-switching');
      }, 220);
    });
  });

  /* =================== Tema, menú, cabecera, animaciones =================== */
  $('themeToggle').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-anim'); root.setAttribute('data-theme', next); save('codelab-theme', next);
    setTimeout(function () { root.classList.remove('theme-anim'); }, 600);
  });
  var toggle = document.querySelector('.nav__toggle');
  toggle.addEventListener('click', function () { var o = document.body.classList.toggle('menu-open'); toggle.setAttribute('aria-expanded', String(o)); });
  document.querySelectorAll('.nav__links a').forEach(function (a) { a.addEventListener('click', function () { document.body.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); }); });
  var nav = $('nav'); var onScroll = function () { nav.classList.toggle('nav--scrolled', window.scrollY > 10); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  root.classList.add('js');
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });
  var faq = document.querySelectorAll('.faq details');
  faq.forEach(function (d) { d.addEventListener('toggle', function () { if (d.open) faq.forEach(function (o) { if (o !== d) o.open = false; }); }); });

  /* =================== Vista previa animada del hero =================== */
  var previewTimers = [];
  function startPreview() {
    previewTimers.forEach(clearTimeout); previewTimers = [];
    var body = $('previewBody');
    var script = lang() === 'ca'
      ? [['u', 'Feu blanquejament? Quant costa?'], ['b', 'Sí! El blanqueig costa des de 180 € i la primera visita és gratuïta. Vols que et reservi hora?'], ['u', 'Sí, dijous a la tarda'], ['b', 'Perfecte. Com et dius?']]
      : [['u', '¿Hacéis blanqueamiento? ¿Cuánto cuesta?'], ['b', '¡Sí! El blanqueamiento cuesta desde 180 € y la primera visita es gratis. ¿Quieres que te reserve hora?'], ['u', 'Sí, el jueves por la tarde'], ['b', 'Perfecto. ¿Cómo te llamas?']];
    function run() {
      body.innerHTML = '';
      var tm = 600;
      script.forEach(function (m) {
        if (m[0] === 'b') {
          previewTimers.push(setTimeout(function () { body.insertAdjacentHTML('beforeend', '<div class="pw__msg pw__msg--b pw__typing"><i></i><i></i><i></i></div>'); }, tm));
          tm += 1100;
        }
        previewTimers.push(setTimeout(function () {
          var ty = body.querySelector('.pw__typing'); if (ty) ty.remove();
          body.insertAdjacentHTML('beforeend', '<div class="pw__msg pw__msg--' + m[0] + '">' + esc(m[1]) + '</div>');
        }, tm));
        tm += m[0] === 'u' ? 1300 : 1700;
      });
      previewTimers.push(setTimeout(run, tm + 2600));
    }
    run();
  }

  /* =================== Demo con el asistente real =================== */
  var current = DEMOS[0].id, counts = { msgs: 0, ai: 0, leads: 0 };

  function renderTabs() {
    $('bizTabs').innerHTML = DEMOS.map(function (p) {
      return '<button role="tab" data-biz="' + p.id + '" aria-selected="' + (p.id === current) + '" style="--c:' + p.color + '">' +
        '<span class="biz-tabs__av">' + p.initials + '</span>' + esc(p.tab[lang()]) + '</button>';
    }).join('');
    $('bizTabs').querySelectorAll('[data-biz]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('data-biz') === current) return;
        current = b.getAttribute('data-biz');
        $('bizTabs').querySelectorAll('[data-biz]').forEach(function (o) { o.setAttribute('aria-selected', String(o === b)); });
        mount();
      });
    });
  }

  function resetPanel() {
    var p = DEMOS.filter(function (d) { return d.id === current; })[0];
    $('panelName').textContent = p.name;
    counts = { msgs: 0, ai: 0, leads: 0 };
    ['stMsgs', 'stAi', 'stLeads'].forEach(function (id) { $(id).textContent = '0'; });
    $('lastQuery').innerHTML = '<span class="muted">' + t('pn.waiting') + '</span>';
    $('leadList').innerHTML = '<li class="muted">' + t('pn.noLeads') + '</li>';
  }
  function bump(id, val) { var el = $(id); el.textContent = val; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }

  function mount() {
    var box = $('chatMount');
    box.innerHTML = '';
    document.querySelectorAll('script[data-demo-widget]').forEach(function (s) { s.remove(); });
    resetPanel();
    if (!API || /REEMPLAZAR/.test(API)) { box.innerHTML = '<p class="muted" style="padding:24px">Configura ASISTENTE_API en config.js</p>'; return; }
    var s = document.createElement('script');
    s.src = API + '/widget.js?v=2';
    s.setAttribute('data-negocio', current);
    s.setAttribute('data-modo', 'integrado');
    s.setAttribute('data-contenedor', '#chatMount');
    s.setAttribute('data-idioma', lang());
    s.setAttribute('data-demo-widget', '');
    document.body.appendChild(s);
  }

  window.addEventListener('codelab-asistente', function (e) {
    var d = e.detail || {};
    if (d.business !== current) return;
    if (d.type === 'message' && d.role === 'user') {
      bump('stMsgs', ++counts.msgs);
      var lq = $('lastQuery');
      lq.innerHTML = '<q>' + esc(d.text) + '</q>';
      lq.classList.remove('flash'); void lq.offsetWidth; lq.classList.add('flash');
    }
    if (d.type === 'message' && d.role === 'assistant') bump('stAi', ++counts.ai);
    if (d.type === 'lead' && d.lead) {
      bump('stLeads', ++counts.leads);
      var list = $('leadList'); var empty = list.querySelector('.muted'); if (empty) empty.remove();
      var L = d.lead;
      list.insertAdjacentHTML('afterbegin',
        '<li class="lead"><div class="lead__av">' + esc((L.name || '?').charAt(0).toUpperCase()) + '</div>' +
        '<div class="lead__info"><b>' + esc(L.name || '—') + '</b><span>' + esc(L.phone) + '</span></div>' +
        '<div class="lead__meta">' + (L.reason ? '<span class="tag">' + esc(L.reason) + '</span>' : '') + '<small>' + t('pn.new') + ' · ' + t('pn.now') + '</small></div></li>');
    }
    if (d.type === 'reset') resetPanel();
  });

  applyLang();
  renderTabs();
  mount();
  startPreview();
  setTimeout(function () { root.classList.add('loaded'); }, 60);
})();
