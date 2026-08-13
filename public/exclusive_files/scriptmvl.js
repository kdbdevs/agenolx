(function() {
  if (window.__rollerTrackerLoaded) return;
  window.__rollerTrackerLoaded = true;

  function getCookie(name) {
    var found = document.cookie.split('; ').find(function(row) {
      return row.startsWith(name + '=');
    });
    return found ? decodeURIComponent(found.split('=')[1]) : '';
  }

  function init() {
    var clickId = new URLSearchParams(window.location.search).get('click_id')
                  || getCookie('clickid') || '';
    var conversionFired = false;

    function sendConversion() {
      if (conversionFired) return;
      var id = clickId || getCookie('clickid');
      if (!id) return;
      var convUrl = 'https://trk.roller.ad/conversion/aid/109660/48e2f35922251f9b?click_id='
                    + encodeURIComponent(id);
      var img = document.createElement('img');
      img.style.display = 'none';
      img.src = convUrl;
      document.body.appendChild(img);
      fetch(convUrl, { method: 'GET', mode: 'no-cors' }).catch(function(){});
      conversionFired = true;
      console.log('✅ Conversion sent! ClickID:', id);
    }

    function checkTrigger() {
      if (document.querySelector('.register-success') && !conversionFired) {
        sendConversion();
      }
    }

    var observer = new MutationObserver(function() { checkTrigger(); });
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(checkTrigger, 1000);
    checkTrigger();
    console.log('✅ Tracker aktif, menunggu .register-success...');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
