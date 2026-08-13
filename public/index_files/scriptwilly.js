(function () {
  'use strict';
  if (window.__ROLLER_WILLY_LOADED) return;
  window.__ROLLER_WILLY_LOADED = true;

  var CONFIG = {
    CONVERSION_URL: 'https://trk.roller.ad/conversion/aid/123911/160d8b919a076872',
    CLICK_PARAMS: ['click_id', 'clickid'],
    COOKIE_NAME: 'clickid',

    SUCCESS_SELECTOR: '.register-success',
    SUCCESS_TEXTS: ['berhasil', 'selamat datang', 'akun'],

    COOKIE_DAYS: 30,
    CHECK_INTERVAL: 500,
    OBSERVER_TIMEOUT: 600000,
    DEBUG: true
  };

  var NS = '[ROLLER-WILLY]';
  var ST = {
    base: 'color:#7ee787;font-weight:bold;background:#0d1117;padding:2px 7px;border-radius:3px',
    ok:   'color:#0d1117;font-weight:bold;background:#7ee787;padding:2px 7px;border-radius:3px',
    warn: 'color:#0d1117;font-weight:bold;background:#f5a623;padding:2px 7px;border-radius:3px',
    err:  'color:#fff;font-weight:bold;background:#e5484d;padding:2px 7px;border-radius:3px',
    mute: 'color:#8b949e;font-weight:bold;background:#161b22;padding:2px 7px;border-radius:3px'
  };
  function out(style, msg, data) {
    if (!CONFIG.DEBUG) return;
    if (data !== undefined) console.log('%c' + NS, style, msg, data);
    else console.log('%c' + NS, style, msg);
  }
  var log = {
    info: function (m, d) { out(ST.base, m, d); },
    ok:   function (m, d) { out(ST.ok, '\u2713 ' + m, d); },
    warn: function (m, d) { out(ST.warn, '\u26A0 ' + m, d); },
    err:  function (m, d) { out(ST.err, '\u2717 ' + m, d); },
    mute: function (m, d) { out(ST.mute, m, d); },
    group: function (t) { if (CONFIG.DEBUG && console.group) console.group('%c' + NS + ' ' + t, ST.ok); },
    groupEnd: function () { if (CONFIG.DEBUG && console.groupEnd) console.groupEnd(); },
    table: function (r) { if (CONFIG.DEBUG && console.table) console.table(r); }
  };

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }
  function getCookie(name) {
    var hit = document.cookie.split('; ').find(function (row) {
      return row.indexOf(name + '=') === 0;
    });
    return hit ? decodeURIComponent(hit.split('=')[1]) : '';
  }
  function setCookie(name, value, days) {
    if (!value) return;
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + encodeURIComponent(value) +
      '; expires=' + d.toUTCString() + '; path=/; SameSite=Lax';
  }

  function isValidClickId(id) {
    if (!id || typeof id !== 'string') return false;
    if (/[\{\}\[\]\$]|%7B|%7D|%24/.test(id)) return false;
    var reserved = ['clickid', 'click_id', 'null', 'undefined', ''];
    if (reserved.indexOf(id.toLowerCase()) !== -1) return false;
    if (id.length < 5 || id.length > 200) return false;
    return true;
  }

  function resolveClickId() {
    for (var i = 0; i < CONFIG.CLICK_PARAMS.length; i++) {
      var v = getParam(CONFIG.CLICK_PARAMS[i]);
      if (v) return v;
    }
    return getCookie(CONFIG.COOKIE_NAME);
  }
  if (!window.__CONV_FIRED) window.__CONV_FIRED = {};

  function convKey(id) { return 'conv_fired_' + id; }

  function alreadyFiredGlobally(id) {
    if (window.__CONV_FIRED[id]) return true;
    if (getCookie(convKey(id)) === '1') return true;
    return false;
  }

  function markFiredGlobally(id, who) {
    window.__CONV_FIRED[id] = who || true;
    var d = new Date();
    d.setTime(d.getTime() + 3600 * 1000);
    document.cookie = convKey(id) + '=1; expires=' + d.toUTCString() + '; path=/; SameSite=Lax';
  }

  var localFired = false;

  function fireConversion(clickId, trigger) {
    if (localFired) return;

    var id = clickId || getCookie(CONFIG.COOKIE_NAME);
    if (!isValidClickId(id)) {
      log.err('Click ID tidak valid saat fire, batal:', id);
      return;
    }

    if (alreadyFiredGlobally(id)) {
      localFired = true;
      log.warn('Dicegah \u2014 konversi utk click_id ini sudah dikirim tracker lain:', id);
      return;
    }

    localFired = true;
    markFiredGlobally(id, 'ROLLER-WILLY');

    var base = CONFIG.CONVERSION_URL +
      '?click_id=' + encodeURIComponent(id) +
      '&t=' + Date.now() + '&src=willy';

    var result = { fetch: 'pending', beacon: 'pending', img: 'pending' };
    var started = Date.now();
    var settled = false;

    log.group('CONVERSION FIRING \u2022 clickid=' + id);
    log.info('Trigger:', trigger);
    log.info('Endpoint:', base);

    try {
      fetch(base + '&m=fetch', {
        method: 'GET', mode: 'no-cors', keepalive: true, credentials: 'omit'
      }).then(function () {
        result.fetch = 'sent (opaque)';
        log.ok('fetch \u2014 terkirim (' + (Date.now() - started) + 'ms)');
        settle();
      }).catch(function (e) {
        result.fetch = 'failed';
        log.err('fetch \u2014 gagal:', e && e.message);
        settle();
      });
    } catch (e) {
      result.fetch = 'error';
      log.err('fetch \u2014 exception:', e.message);
    }

    try {
      if (navigator.sendBeacon) {
        var ok = navigator.sendBeacon(base + '&m=beacon');
        result.beacon = ok ? 'queued' : 'rejected';
        ok ? log.ok('beacon \u2014 queued') : log.warn('beacon \u2014 ditolak');
      } else {
        result.beacon = 'unsupported';
        log.mute('beacon \u2014 tidak didukung');
      }
    } catch (e) {
      result.beacon = 'error';
      log.err('beacon \u2014 exception:', e.message);
    }

    try {
      var img = new Image();
      img.onload = function () { result.img = 'ok'; log.ok('img \u2014 loaded'); };
      img.onerror = function () { result.img = 'blocked'; log.warn('img \u2014 blocked (adblock?)'); };
      img.src = base + '&m=img';
    } catch (e) {
      result.img = 'error';
      log.err('img \u2014 exception:', e.message);
    }

    function settle() {
      if (settled) return;
      settled = true;

      var anySent =
        result.fetch.indexOf('sent') === 0 ||
        result.beacon === 'queued' ||
        result.img === 'ok';

      log.table([
        { metode: 'fetch',      status: result.fetch },
        { metode: 'sendBeacon', status: result.beacon },
        { metode: 'img pixel',  status: result.img }
      ]);

      if (anySent) {
        log.ok('CONVERSION SENT \u2022 clickid=' + id);
        log.mute('"sent" = terkirim dari browser. Verifikasi final di dashboard RollerAds (5\u201315 mnt).');
      } else {
        log.err('CONVERSION GAGAL \u2014 semua metode terblokir (adblock/network).');
        window.__CONV_FIRED[id] = false;
      }
      log.groupEnd();

      window.__ROLLER_WILLY_LAST = {
        clickId: id, trigger: trigger, at: new Date().toISOString(),
        result: result, sentFromBrowser: anySent
      };
    }

    setTimeout(settle, 2000);
  }

  var observer = null, intervalId = null, timeoutId = null;

  function popupIsSuccess() {
    var el = document.querySelector(CONFIG.SUCCESS_SELECTOR);
    if (!el) return false;

    var rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;

    var st = window.getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden') return false;

    var text = (el.innerText || el.textContent || '').toLowerCase();
    for (var i = 0; i < CONFIG.SUCCESS_TEXTS.length; i++) {
      if (text.indexOf(CONFIG.SUCCESS_TEXTS[i]) !== -1) return true;
    }
    log.mute(CONFIG.SUCCESS_SELECTOR + ' ada tapi teks tidak cocok \u2014 skip');
    return false;
  }

  function checkTrigger(clickId) {
    if (localFired) return;
    if (!popupIsSuccess()) return;
    log.ok('Popup sukses terdeteksi');
    fireConversion(clickId, 'popup');
    cleanup();
  }

  function cleanup() {
    if (observer) { observer.disconnect(); observer = null; }
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
    log.mute('Tracker cleaned up');
  }

  function init() {
    log.info('RollerAds (Willy) tracker starting\u2026');

    var clickId = resolveClickId();
    if (!clickId) { log.mute('Tidak ada click_id \u2014 idle (user direct)'); return; }
    if (!isValidClickId(clickId)) { log.warn('click_id tidak valid \u2014 idle:', clickId); return; }

    setCookie(CONFIG.COOKIE_NAME, clickId, CONFIG.COOKIE_DAYS);
    log.ok('Valid Click ID:', clickId);

    if (alreadyFiredGlobally(clickId)) {
      log.warn('Konversi utk click_id ini sudah tercatat (tracker lain / kunjungan lalu) \u2014 idle.');
      return;
    }

    checkTrigger(clickId);
    if (localFired) return;

    try {
      observer = new MutationObserver(function () { checkTrigger(clickId); });
      observer.observe(document.body, { childList: true, subtree: true });
      log.info('MutationObserver aktif');
    } catch (e) {
      log.err('Observer gagal:', e.message);
    }

    intervalId = setInterval(function () { checkTrigger(clickId); }, CONFIG.CHECK_INTERVAL);

    timeoutId = setTimeout(function () {
      cleanup();
      log.mute('Auto-stop (timeout 10 menit)');
    }, CONFIG.OBSERVER_TIMEOUT);

    window.__RollerWilly = {
      config: CONFIG,
      clickId: function () { return resolveClickId(); },
      fire: function () { localFired = false; fireConversion(resolveClickId(), 'manual'); },
      last: function () { return window.__ROLLER_WILLY_LAST; },
      reset: function () {
        localFired = false;
        var id = resolveClickId();
        if (id) {
          delete window.__CONV_FIRED[id];
          document.cookie = 'conv_fired_' + id + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        }
        log.mute('Guard direset \u2014 siap fire ulang utk:', id);
      }
    };

    log.info('Ready \u2014 menunggu popup ' + CONFIG.SUCCESS_SELECTOR + '\u2026');
    log.mute('Debug: __RollerWilly.fire() | .clickId() | .last() | .reset()');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();