/*!
 * Codelab · Asistente IA — widget
 * Uso:
 *   <script src="https://TU-SERVIDOR/widget.js" data-negocio="id-del-negocio" defer></script>
 * Opciones:
 *   data-modo="integrado" data-contenedor="#mi-div"   → dentro de la página en lugar de flotante
 *   data-idioma="es|ca|en"                              → fuerza el idioma (por defecto, el de la página)
 */
(function () {
  'use strict';
  var script = document.currentScript || document.querySelector('script[data-negocio]');
  if (!script) return;
  var API = new URL(script.src, location.href).origin;
  var BIZ = script.getAttribute('data-negocio');
  var MODE = script.getAttribute('data-modo') === 'integrado' ? 'inline' : 'float';
  var CONTAINER = script.getAttribute('data-contenedor');
  if (!BIZ) return;

  var T = {
    es: { ph: 'Escribe tu mensaje…', send: 'Enviar', open: 'Abrir chat', close: 'Cerrar chat', reset: 'Nueva conversación', online: 'En línea', powered: 'Asistente con IA de', err: 'No se ha podido enviar. Inténtalo de nuevo.', busy: 'Hay muchas consultas ahora mismo. Espera unos segundos.' },
    ca: { ph: 'Escriu el teu missatge…', send: 'Envia', open: 'Obre el xat', close: 'Tanca el xat', reset: 'Conversa nova', online: 'En línia', powered: 'Assistent amb IA de', err: 'No s\'ha pogut enviar. Torna-ho a provar.', busy: 'Ara mateix hi ha moltes consultes. Espera uns segons.' },
    en: { ph: 'Type your message…', send: 'Send', open: 'Open chat', close: 'Close chat', reset: 'New conversation', online: 'Online', powered: 'AI assistant by', err: 'Message not sent. Please try again.', busy: 'Lots of requests right now. Please wait a few seconds.' }
  };
  function pickLang() {
    var f = script.getAttribute('data-idioma');
    if (f && T[f]) return f;
    var l = (document.documentElement.lang || navigator.language || 'es').toLowerCase();
    return l.indexOf('ca') === 0 ? 'ca' : l.indexOf('en') === 0 ? 'en' : 'es';
  }
  var lang = pickLang();

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  var KS = 'cla-s-' + BIZ, KH = 'cla-h-' + BIZ;
  function newId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
  }
  var session = store.get(KS) || newId(); store.set(KS, session);
  var history = []; try { history = JSON.parse(store.get(KH) || '[]'); } catch (e) {}

  function emit(type, detail) {
    try { window.dispatchEvent(new CustomEvent('codelab-asistente', { detail: Object.assign({ type: type, business: BIZ }, detail || {}) })); } catch (e) {}
  }

  var host = document.createElement('div');
  host.setAttribute('data-codelab-asistente', BIZ);
  var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

  var CSS = [
    ':host{all:initial}',
    '*{box-sizing:border-box;margin:0;padding:0;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}',
    '.w{--c:#1546d6;color:#16213b;font-size:15px;line-height:1.5}',
    '.fab{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:60px;height:60px;border-radius:50%;border:0;cursor:pointer;background:var(--c);color:#fff;display:grid;place-items:center;box-shadow:0 12px 30px -8px rgba(0,0,0,.35);transition:transform .35s cubic-bezier(.22,1,.36,1)}',
    '.fab:hover{transform:scale(1.06)}',
    '.fab svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:2;stroke-linejoin:round;stroke-linecap:round;transition:transform .35s,opacity .25s;position:absolute}',
    '.fab .x{opacity:0;transform:rotate(-90deg)}.open .fab .b{opacity:0;transform:rotate(90deg)}.open .fab .x{opacity:1;transform:none}',
    '.fab .dot{position:absolute;top:4px;right:4px;width:14px;height:14px;border-radius:50%;background:#ef4444;border:2px solid #fff;display:none}',
    '.has-unread .fab .dot{display:block}',
    '.box{display:flex;flex-direction:column;background:#fff;overflow:hidden}',
    '.float .box{position:fixed;right:20px;bottom:92px;z-index:2147483000;width:380px;height:min(600px,calc(100vh - 120px));border-radius:20px;box-shadow:0 30px 70px -20px rgba(0,0,0,.35),0 0 0 1px rgba(0,0,0,.06);opacity:0;transform:translateY(16px) scale(.98);pointer-events:none;transition:opacity .35s cubic-bezier(.22,1,.36,1),transform .35s cubic-bezier(.22,1,.36,1)}',
    '.float.open .box{opacity:1;transform:none;pointer-events:auto}',
    '.inline .box{height:100%;min-height:440px;border-radius:inherit}',
    '@media (max-width:480px){.float .box{right:0;bottom:0;width:100%;height:100%;border-radius:0}.float.open .fab{display:none}}',
    '.head{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--c);color:#fff}',
    '.av{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.22);display:grid;place-items:center;font-weight:700;flex:none}',
    '.who{flex:1;min-width:0}.who b{display:block;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.who small{font-size:12px;opacity:.9;display:flex;align-items:center;gap:6px}.who small i{width:7px;height:7px;border-radius:50%;background:#7dffb2}',
    '.hb{width:34px;height:34px;border-radius:10px;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.12);cursor:pointer;display:grid;place-items:center;flex:none}',
    '.hb:hover{background:rgba(255,255,255,.24)}.hb svg{width:16px;height:16px;stroke:#fff;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}',
    '.inline .hb.cl{display:none}',
    '.body{flex:1;overflow-y:auto;padding:18px 14px;display:flex;flex-direction:column;gap:10px;background:#f5f7fb;scroll-behavior:smooth}',
    '.m{max-width:84%;padding:10px 14px;border-radius:16px;white-space:pre-wrap;overflow-wrap:anywhere;animation:pop .4s cubic-bezier(.22,1,.36,1) both}',
    '.m.u{align-self:flex-end;background:var(--c);color:#fff;border-bottom-right-radius:4px}',
    '.m.a{align-self:flex-start;background:#fff;color:#16213b;border:1px solid #e3e8f1;border-bottom-left-radius:4px}',
    '.m.e{align-self:center;background:#fff4e5;color:#8a4b00;font-size:13px}',
    '.m a{color:inherit}',
    '.typing{display:inline-flex;gap:4px;padding:13px 15px}.typing i{width:6px;height:6px;border-radius:50%;background:#98a2b8;animation:dot 1.2s infinite}.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}',
    '@keyframes dot{0%,60%,100%{transform:none;opacity:.4}30%{transform:translateY(-4px);opacity:1}}',
    '@keyframes pop{from{opacity:0;transform:translateY(8px)}}',
    '.chips{display:flex;gap:6px;overflow-x:auto;padding:10px 12px 2px;border-top:1px solid #e9edf4;background:#fff;scrollbar-width:none}.chips::-webkit-scrollbar{display:none}',
    '.chips button{flex:none;border:1px solid #dfe5ef;background:#fff;color:#16213b;border-radius:999px;padding:6px 12px;font-size:13px;cursor:pointer}',
    '.chips button:hover{border-color:var(--c);color:var(--c)}',
    '.form{display:flex;gap:8px;padding:10px 12px;background:#fff}',
    '.form input{flex:1;min-width:0;border:1px solid #dfe5ef;border-radius:12px;padding:11px 13px;font-size:15px;color:#16213b;outline:none;background:#fff}',
    '.form input:focus{border-color:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 18%,transparent)}',
    '.form button{width:44px;border:0;border-radius:12px;background:var(--c);cursor:pointer;display:grid;place-items:center}',
    '.form button:disabled{opacity:.5;cursor:default}.form button svg{width:18px;height:18px;fill:#fff}',
    '.pw{font-size:11px;color:#8a93a8;text-align:center;padding:0 0 9px;background:#fff}.pw a{color:inherit;font-weight:600;text-decoration:none}',
    '@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}'
  ].join('');

  var I = {
    chat: '<svg class="b" viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5.1A8 8 0 1 1 21 12z"/></svg>',
    x: '<svg class="x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    reset: '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M4 12l16-8-6 16-2.5-6.5L4 12z"/></svg>'
  };

  var t = T[lang];
  root.innerHTML = '<style>' + CSS + '</style>' +
    '<div class="w ' + MODE + '">' +
      (MODE === 'float' ? '<button class="fab" aria-label="' + t.open + '">' + I.chat + I.x + '<span class="dot"></span></button>' : '') +
      '<div class="box" role="dialog" aria-label="Chat">' +
        '<div class="head"><span class="av"></span><div class="who"><b></b><small><i></i>' + t.online + '</small></div>' +
          '<button class="hb rs" aria-label="' + t.reset + '" title="' + t.reset + '">' + I.reset + '</button>' +
          '<button class="hb cl" aria-label="' + t.close + '">' + I.down + '</button></div>' +
        '<div class="body" aria-live="polite"></div>' +
        '<div class="chips"></div>' +
        '<form class="form"><input type="text" maxlength="600" autocomplete="off" placeholder="' + t.ph + '" aria-label="' + t.ph + '"><button type="submit" aria-label="' + t.send + '">' + I.send + '</button></form>' +
        '<div class="pw">' + t.powered + ' <a href="https://codelab.pauizel.com" target="_blank" rel="noopener">Codelab</a></div>' +
      '</div>' +
    '</div>';

  var $ = function (s) { return root.querySelector(s); };
  var W = $('.w'), body = $('.body'), input = $('.form input'), sendBtn = $('.form button'), chips = $('.chips');
  var cfg = null, busy = false;

  function scroll() { body.scrollTop = body.scrollHeight; }
  function bubble(role, text) {
    var d = document.createElement('div');
    d.className = 'm ' + (role === 'user' ? 'u' : role === 'error' ? 'e' : 'a');
    d.textContent = text;
    body.appendChild(d); scroll();
    return d;
  }
  function typing(on) {
    var ex = body.querySelector('.typing');
    if (on && !ex) { var d = document.createElement('div'); d.className = 'm a typing'; d.innerHTML = '<i></i><i></i><i></i>'; body.appendChild(d); scroll(); }
    if (!on && ex) ex.remove();
  }
  function save() { store.set(KH, JSON.stringify(history.slice(-40))); }
  function renderChips() {
    var list = (cfg && cfg.chips && (cfg.chips[lang] && cfg.chips[lang].length ? cfg.chips[lang] : cfg.chips.es)) || [];
    if (history.some(function (m) { return m.role === 'user'; })) list = [];
    chips.innerHTML = '';
    chips.style.display = list.length ? '' : 'none';
    list.forEach(function (c) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = c;
      b.onclick = function () { send(c); };
      chips.appendChild(b);
    });
  }
  function paint() {
    body.innerHTML = '';
    var greet = cfg && cfg.greeting ? (cfg.greeting[lang] || cfg.greeting.es) : '';
    if (greet) bubble('assistant', greet);
    history.forEach(function (m) { bubble(m.role, m.content); });
    renderChips();
  }

  function send(text) {
    text = String(text || '').trim();
    if (!text || busy) return;
    busy = true; sendBtn.disabled = true;
    input.value = '';
    history.push({ role: 'user', content: text }); save();
    bubble('user', text); renderChips();
    emit('message', { role: 'user', text: text });
    var typingTimer = setTimeout(function () { typing(true); }, 250);
    var stopTyping = function () { clearTimeout(typingTimer); typing(false); };
    fetch(API + '/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business: BIZ, session: session, message: text, lang: lang, page: location.href.slice(0, 300) })
    }).then(function (r) { return r.json().then(function (j) { return { status: r.status, j: j }; }); })
      .then(function (r) {
        stopTyping();
        if (r.status === 429) { bubble('error', t.busy); history.pop(); save(); return; }
        if (!r.j || !r.j.reply) throw new Error('bad');
        history.push({ role: 'assistant', content: r.j.reply }); save();
        bubble('assistant', r.j.reply);
        emit('message', { role: 'assistant', text: r.j.reply });
        if (r.j.lead) emit('lead', { lead: r.j.lead, question: (history.filter(function (m) { return m.role === 'user'; })[0] || {}).content });
        if (MODE === 'float' && !W.classList.contains('open')) W.classList.add('has-unread');
      })
      .catch(function () { stopTyping(); bubble('error', t.err); history.pop(); save(); input.value = text; })
      .then(function () { busy = false; sendBtn.disabled = false; if (MODE === 'inline' || W.classList.contains('open')) input.focus({ preventScroll: true }); });
  }

  function reset() {
    if (busy) return;
    session = newId(); store.set(KS, session);
    history = []; store.del(KH);
    paint();
    emit('reset');
  }
  function open() { if (MODE !== 'float') return; W.classList.add('open'); W.classList.remove('has-unread'); setTimeout(function () { input.focus(); scroll(); }, 200); emit('open'); }
  function close() { if (MODE !== 'float') return; W.classList.remove('open'); }

  $('.form').addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });
  $('.rs').addEventListener('click', reset);
  $('.cl').addEventListener('click', close);
  var fab = $('.fab'); if (fab) fab.addEventListener('click', function () { W.classList.contains('open') ? close() : open(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  function mount() {
    var target = MODE === 'inline' && CONTAINER ? document.querySelector(CONTAINER) : null;
    (target || document.body).appendChild(host);
    if (target) { host.style.display = 'block'; host.style.height = '100%'; host.style.borderRadius = 'inherit'; }
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  fetch(API + '/api/business/' + encodeURIComponent(BIZ)).then(function (r) { return r.ok ? r.json() : null; }).then(function (c) {
    if (!c) { host.remove(); return; }
    cfg = c;
    W.style.setProperty('--c', c.color || '#1546d6');
    $('.av').textContent = (c.name || '?').trim().charAt(0).toUpperCase();
    $('.who b').textContent = c.name;
    paint();
    emit('ready', { name: c.name });
  }).catch(function () { host.remove(); });

  window.CodelabAsistente = window.CodelabAsistente || {};
  window.CodelabAsistente[BIZ] = { open: open, close: close, reset: reset, send: send, setLang: function (l) { if (T[l]) { lang = l; t = T[l]; input.placeholder = t.ph; paint(); } } };
})();
