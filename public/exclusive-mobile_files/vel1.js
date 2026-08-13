  (function() {
    // Fungsi simpel mengambil parameter URL
    const urlParams = new URLSearchParams(window.location.search);
    const clickId = urlParams.get('utm_inadid');

    if (clickId) {
      // Tentukan masa berlaku (30 hari)
      const days = 30;
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "; expires=" + date.toUTCString();

      // Simpan cookie dengan tambahan SameSite=Lax agar aman di browser modern
      document.cookie = "inad_click_id=" + clickId + expires + "; path=/; SameSite=Lax";
      
      console.log("Click_id berhasil disimpan: " + clickId);
    } else {
      console.log("Parameter utm_inadid tidak ditemukan di URL.");
    }
  })();

  (function() {
    if (sessionStorage.getItem('reg_sent')) {
      console.log('[Inhousead] Already registered and tracked');
      return;
    }

    function getCookie(name) {
      console.log('[Inhousead] Getting cookie ' + name);
      var value = '; ' + document.cookie;
      var parts = value.split('; ' + name + '=');
      var res;
      if (parts.length === 2) {
        res = parts.pop().split(';').shift();
      } else {
        res = '';
      }
      console.log('[Inhousead] Cookie value is ' + res);
      return res;
    }

    function sendPostback() {
      var storedClickId = getCookie('inad_click_id');
      if (!storedClickId) {
        console.log('[Inhousead] No click_id cookie found, skipping postback');
        return;
      }
      var postbackUrl = 'https://feed.inhousead.net/postback/?click_id=' + storedClickId + '&status=registration&currency=USD';
      console.log('[Inhousead] Sending postback: ' + postbackUrl);
      var img = new Image();
      img.src = postbackUrl;
      sessionStorage.setItem('reg_sent', '1');
    }

    const registerObserver = new MutationObserver(function() {
      const popup = document.querySelector('.register-success');
      if (popup && popup.offsetParent !== null) {
        console.log('[Inhousead] Deteksi popup register!');
        sendPostback();
        registerObserver.disconnect();
      }
    });

    registerObserver.observe(document.body, { childList: true, subtree: true });
  })();
