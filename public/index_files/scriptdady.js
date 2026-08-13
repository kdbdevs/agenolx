(function() {
  // FLAG UNIK - tidak conflict dengan scriptmvl.js
  if (window.__KY_ROLLER_V3_LOADED) return;
  window.__KY_ROLLER_V3_LOADED = true;

  // === CONFIG ===
  var CONVERSION_URL = 'https://trk.roller.ad/conversion/aid/119659/ac144f0b25d98504';
  var COOKIE_DAYS = 30;
  var OBSERVER_TIMEOUT = 600000;
  var CHECK_INTERVAL = 500;
  var DEBUG = true;

  // === LOGGER ===
  function log(msg, data) {
    if (!DEBUG) return;
    var style = 'color:#00d26a;font-weight:bold;background:#1a1a1a;padding:2px 6px;border-radius:3px';
    if (data !== undefined) console.log('%c[KY]', style, msg, data);
    else console.log('%c[KY]', style, msg);
  }

  // === HELPERS ===
  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function getCookie(name) {
    var found = document.cookie.split('; ').find(function(row) {
      return row.startsWith(name + '=');
    });
    return found ? decodeURIComponent(found.split('=')[1]) : '';
  }

  function setCookie(name, value, days) {
    if (!value) return;
    var d = new Date();
    d.setTime(d.getTime() + (days * 86400000));
    document.cookie = name + '=' + encodeURIComponent(value)
      + '; expires=' + d.toUTCString() + '; path=/; SameSite=Lax';
  }

  function isValidClickId(id) {
    if (!id || typeof id !== 'string') return false;
    var invalidPatterns = ['{', '}', '%7B', '%7D', '$', '%24', '[', ']'];
    for (var i = 0; i < invalidPatterns.length; i++) {
      if (id.indexOf(invalidPatterns[i]) !== -1) return false;
    }
    var invalidValues = ['clickid', 'click_id', 'clickId', 'null', 'undefined', ''];
    if (invalidValues.indexOf(id) !== -1 || invalidValues.indexOf(id.toLowerCase()) !== -1) return false;
    if (id.length < 5 || id.length > 200) return false;
    return true;
  }

  // === MAIN INIT ===
  function init() {
    log('Kentucky Roller v3 starting...');

    var clickId = getParam('click_id') || getParam('clickid') || getCookie('clickid');

    if (!clickId) {
      log('No click_id found, idle');
      return;
    }

    if (!isValidClickId(clickId)) {
      log('Invalid click_id, idle:', clickId);
      return;
    }

    setCookie('clickid', clickId, COOKIE_DAYS);
    log('Valid ClickID:', clickId);

    var conversionFired = false;
    var observer = null;
    var intervalId = null;
    var timeoutId = null;

    function sendConversion(triggerSource) {
      if (conversionFired) return;

      var id = clickId || getCookie('clickid');
      if (!id || !isValidClickId(id)) {
        log('No valid click_id at fire time, abort');
        return;
      }

      conversionFired = true;

      var convUrl = CONVERSION_URL + '?click_id=' + encodeURIComponent(id)
                  + '&t=' + Date.now()
                  + '&src=ky';

      log('Firing KY conversion. Trigger:', triggerSource);
      log('URL:', convUrl);

      try {
        var img = document.createElement('img');
        img.style.display = 'none';
        img.width = 1;
        img.height = 1;
        img.src = convUrl + '&m=img';
        img.onload = function() { log('KY image pixel fired OK'); };
        img.onerror = function() { log('KY image pixel blocked'); };
        document.body.appendChild(img);
      } catch(e) {}

      try {
        if (navigator.sendBeacon) {
          var ok = navigator.sendBeacon(convUrl + '&m=beacon');
          log(ok ? 'KY beacon queued' : 'KY beacon rejected');
        }
      } catch(e) {}

      try {
        fetch(convUrl + '&m=fetch', {
          method: 'GET',
          mode: 'no-cors',
          keepalive: true,
          credentials: 'omit'
        }).catch(function(){});
      } catch(e) {}

      log('KY CONVERSION SENT! ClickID:', id);
    }

    function cleanup() {
      if (observer) { observer.disconnect(); observer = null; }
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
      if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
      log('Tracker cleaned up');
    }

    function checkTrigger() {
      if (conversionFired) return;


      var popup = document.querySelector('.register-success');
      if (!popup) return;

      var rect = popup.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      var style = window.getComputedStyle(popup);
      if (style.display === 'none' || style.visibility === 'hidden') return;

      var content = (popup.innerText || popup.textContent || '').toLowerCase();
      var hasSuccessText =
        content.indexOf('berhasil') !== -1 ||
        content.indexOf('selamat datang') !== -1 ||
        content.indexOf('akun') !== -1;

      if (!hasSuccessText) {
        log('.register-success found but text mismatch, skip');
        return;
      }

      log('Popup AGENOLX terdeteksi!');
      sendConversion('agenolx-popup');
      cleanup();
    }

    try {
      observer = new MutationObserver(function() { checkTrigger(); });
      observer.observe(document.body, { childList: true, subtree: true });
      log('MutationObserver active');
    } catch(e) {
      log('MutationObserver failed:', e);
    }

    intervalId = setInterval(checkTrigger, CHECK_INTERVAL);

    timeoutId = setTimeout(function() {
      cleanup();
      log('Auto-cleanup timeout');
    }, OBSERVER_TIMEOUT);

    // Function unik - tidak conflict dengan scriptmvl
    window.__fireKYConversion = function() {
      log('Manual KY trigger called');
      sendConversion('manual');
      cleanup();
    };

    checkTrigger();

    log('KY Tracker ready, listening for .register-success popup...');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
