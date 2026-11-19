(function () {
  'use strict';

  var root = document.documentElement;
  function $(id) { return document.getElementById(id); }
  function lang() { return root.getAttribute('lang') === 'ca' ? 'ca' : 'es'; }
  function t(k) { return window.I18N[lang()][k]; }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('year').textContent = new Date().getFullYear();

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
        applyLang(); renderTabs(); startDemo(current); startPreview();
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

  /* =================== Demo interactiva =================== */
  var current = 'dental', bot = null, stats = null, busy = false, started = false;

  function renderTabs() {
    $('bizTabs').innerHTML = Object.keys(window.BOT_PROFILES).map(function (id) {
      var p = window.BOT_PROFILES[id];
      return '<button role="tab" data-biz="' + id + '" aria-selected="' + (id === current) + '" style="--c:' + p.color + '">' +
        '<span class="biz-tabs__av">' + p.initials + '</span>' + esc(p.tab[lang()]) + '</button>';
    }).join('');
    $('bizTabs').querySelectorAll('[data-biz]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (busy) return;
        current = b.getAttribute('data-biz');
        $('bizTabs').querySelectorAll('[data-biz]').forEach(function (o) { o.setAttribute('aria-selected', String(o === b)); });
        startDemo(current);
      });
    });
  }

  function setStats() {
    $('stConv').textContent = stats[0];
    $('stLeads').textContent = stats[1];
    $('stAuto').textContent = stats[2] + '%';
  }
  function bump(id) {
    var el = $(id); el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }

  function addMsg(who, text) {
    var body = $('chatBody');
    var el = document.createElement('div');
    el.className = 'msg msg--' + who;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTo({ top: body.scrollHeight, behavior: reduced ? 'auto' : 'smooth' });
    return el;
  }
  function typing(on) {
    var body = $('chatBody'), ex = body.querySelector('.msg--typing');
    if (on && !ex) { body.insertAdjacentHTML('beforeend', '<div class="msg msg--b msg--typing"><i></i><i></i><i></i></div>'); body.scrollTop = body.scrollHeight; }
    if (!on && ex) ex.remove();
  }
  function renderChips() {
    $('chatChips').innerHTML = bot.chips().map(function (c) { return '<button type="button">' + esc(c) + '</button>'; }).join('');
    $('chatChips').querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { send(b.textContent); }); });
  }

  function startDemo(id) {
    var p = window.BOT_PROFILES[id];
    bot = window.createBot(id, lang());
    stats = p.stats.slice();
    started = false; busy = false;
    $('chat').style.setProperty('--biz', p.color);
    $('chatAv').textContent = p.initials;
    $('chatName').textContent = p.name;
    $('panelName').textContent = p.name;
    $('chatBody').innerHTML = '';
    $('lastQuery').innerHTML = '<span class="muted">' + t('pn.waiting') + '</span>';
    $('leadList').innerHTML = '<li class="muted">' + t('pn.noLeads') + '</li>';
    setStats();
    renderChips();
    typing(true);
    setTimeout(function () { typing(false); addMsg('b', bot.greet()); }, reduced ? 0 : 700);
  }

  function send(text) {
    text = String(text || '').trim();
    if (!text || busy) return;
    busy = true;
    addMsg('u', text);
    $('chatInput').value = '';
    if (!started) { started = true; stats[0]++; setStats(); bump('stConv'); }

    var res = bot.reply(text);
    var delay = reduced ? 0 : Math.min(1600, 500 + res.text.length * 9);
    setTimeout(function () { typing(true); }, reduced ? 0 : 250);
    setTimeout(function () {
      typing(false);
      addMsg('b', res.text);
      busy = false;

      if (res.intent && !res.lead && res.intent.id !== 'saludo' && res.intent.id !== 'gracias') {
        var lq = $('lastQuery');
        lq.innerHTML = '<span class="tag' + (res.unresolved ? ' tag--warn' : '') + '">' + esc(res.intent.label[lang()]) + '</span>' +
          '<q>' + esc(text) + '</q>' + (res.unresolved ? '<small>' + t('pn.unresolved') + '</small>' : '');
        lq.classList.remove('flash'); void lq.offsetWidth; lq.classList.add('flash');
      }
      if (res.lead) {
        stats[1]++; setStats(); bump('stLeads');
        var list = $('leadList'); var empty = list.querySelector('.muted'); if (empty) empty.remove();
        list.insertAdjacentHTML('afterbegin',
          '<li class="lead"><div class="lead__av">' + esc(res.lead.name.charAt(0)) + '</div>' +
          '<div class="lead__info"><b>' + esc(res.lead.name) + '</b><span>' + esc(res.lead.phone) + '</span></div>' +
          '<div class="lead__meta"><span class="tag">' + esc(res.lead.reason) + '</span><small>' + t('pn.new') + ' · ' + t('pn.now') + '</small></div></li>');
      }
      $('chatInput').focus({ preventScroll: true });
    }, delay);
  }

  $('chatForm').addEventListener('submit', function (e) { e.preventDefault(); send($('chatInput').value); });
  $('chatReset').addEventListener('click', function () { if (!busy) startDemo(current); });

  applyLang();
  renderTabs();
  startDemo(current);
  startPreview();
  setTimeout(function () { root.classList.add('loaded'); }, 60);
})();
