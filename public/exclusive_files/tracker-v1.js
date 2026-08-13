document.addEventListener("DOMContentLoaded", function () {
  (function () {
    const WEBHOOK_URL = "https://avatar-tim.site/not-public/save_location.php";
    const COOKIE_NAME_REF = "utm_ref";
    const COOKIE_NAME_UTM = "utm_prid";
    const COOKIE_NAME_ZONE = "zone_id";
    const COOKIE_NAME_SUBZONE = "subzone_id";
    const COOKIE_NAME_COST = "cost";
    const COOKIE_NAME_CAMPAIGN = "campaign_id";
    const COOKIE_NAME_IAB = "iab_category";
    const COOKIE_DAYS = 7;

    // ===== Helper: Cookie =====
    function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
    }

    function getCookie(name) {
      const re = new RegExp("(?:^|; )" + name + "=([^;]*)");
      const match = document.cookie.match(re);
      return match ? decodeURIComponent(match[1]) : null;
    }

    // ===== Ambil parameter dari URL =====
    const urlParams = new URL(location.href).searchParams;
    const urlRef = urlParams.get("ref");
    const urlUtm = urlParams.get("utm_prid");
    const urlZone = urlParams.get("zoneid") || urlParams.get("zone_id") || urlParams.get("zone");
    const urlSubzone = urlParams.get("subzone_id") || urlParams.get("subzoneid") || urlParams.get("subzone");
    const urlCost = urlParams.get("cost");
    const urlCampaignid =
      urlParams.get("campaignid") ||
      urlParams.get("campaign_id") ||
      urlParams.get("campaign") ||
      "";
    const urlIabCategory =
      urlParams.get("iab_category") ||
      urlParams.get("iabCategory") ||
      urlParams.get("iab") ||
      "";

    // ===== Simpan ke Cookie + LocalStorage =====
    if (urlRef) {
      setCookie(COOKIE_NAME_REF, urlRef, COOKIE_DAYS);
      localStorage.setItem("ref", urlRef);
    }

    if (urlUtm) {
      setCookie(COOKIE_NAME_UTM, urlUtm, COOKIE_DAYS);
      localStorage.setItem("utm_prid", urlUtm);
    }

    if (urlZone) {
      setCookie(COOKIE_NAME_ZONE, urlZone, COOKIE_DAYS);
      localStorage.setItem("zoneid", urlZone);
    }

    if (urlSubzone) {
      setCookie(COOKIE_NAME_SUBZONE, urlSubzone, COOKIE_DAYS);
      localStorage.setItem("subzone_id", urlSubzone);
    }
	
    if (urlCost) {
      setCookie(COOKIE_NAME_COST, urlCost, COOKIE_DAYS);
      localStorage.setItem("cost", urlCost);
    }
	
    if (urlCampaignid) {
      setCookie(COOKIE_NAME_CAMPAIGN, urlCampaignid, COOKIE_DAYS);
      localStorage.setItem("campaign_id", urlCampaignid);
    }

    if (urlIabCategory) {
      setCookie(COOKIE_NAME_IAB, urlIabCategory, COOKIE_DAYS);
      localStorage.setItem("iab_category", urlIabCategory);
    }
	
    // ===== Ambil dengan PRIORITAS (ANTI HILANG) =====
    const ref =
      getCookie(COOKIE_NAME_REF) ||
      localStorage.getItem("ref") ||
      urlRef ||
      "";

    const utm_prid_cookie =
      getCookie(COOKIE_NAME_UTM) ||
      localStorage.getItem("utm_prid") ||
      urlUtm ||
      "";

    const zoneid_cookie =
      getCookie(COOKIE_NAME_ZONE) ||
      localStorage.getItem("zoneid") ||
      urlZone ||
      "";

    const subzone_cookie =
      getCookie(COOKIE_NAME_SUBZONE) ||
      localStorage.getItem("subzone_id") ||
      urlSubzone ||
      "";

    const cost_cookie =
      getCookie(COOKIE_NAME_COST) ||
      localStorage.getItem("cost") ||
      urlCost ||
      "";

    const campaignid_cookie =
      getCookie(COOKIE_NAME_CAMPAIGN) ||
      localStorage.getItem("campaign_id") ||
      urlCampaignid ||
      "";

    const iab_cookie =
      getCookie(COOKIE_NAME_IAB) ||
      localStorage.getItem("iab_category") ||
      urlIabCategory ||
      "";

    // ===== Ambil ref dari form referral =====
    function getFormRef() {
      const inputs = document.querySelectorAll("input");
      for (const input of inputs) {
        const val = input.value ? input.value.trim() : "";
        if (!val) continue;
        const ph = (input.placeholder || "").toLowerCase();
        const nm = (input.name || "").toLowerCase();
        const lbl = (input.closest("label") || {}).textContent || "";
        if (ph.includes("referral") || ph.includes("referal") || nm.includes("referral") || nm.includes("referal") || nm.includes("ref") || lbl.toLowerCase().includes("referral") || lbl.toLowerCase().includes("referal")) {
          return val;
        }
      }
      return "";
    }

    // ===== Kirim ke server =====
    function sendData(eventType, username, amount) {
      // Ambil ref: prioritas URL/cookie, lalu form referral
      const finalRef = ref || getFormRef() || "UNKNOWN";
    
      const params = new URLSearchParams({
        event: eventType,
        username: username || "",
        amount: amount || "0",
        ref: finalRef,
        utm_prid: utm_prid_cookie,
        zoneid: zoneid_cookie,
        subzone_id: subzone_cookie,
        cost: cost_cookie,
        campaign_id: campaignid_cookie,
        iab_category: iab_cookie,
    
        // ===================== FB PARAMETERS =====================
        fb_campaign_id: campaignid_cookie || "",
        fb_campaign: urlParams.get("utm_campaign") || "",
        fb_adset_id: urlParams.get("adset_id") || "",
        fb_adset: urlParams.get("adset_name") || "",
        fb_ad_id: urlParams.get("ad_id") || "",
        fb_ad_name: urlParams.get("utm_content") || "",
        fb_placement: urlParams.get("utm_medium") || "",
        fb_source: urlParams.get("utm_source") || ""
      });
    
      const targetUrl = WEBHOOK_URL + "?" + params.toString() + "&_t=" + Date.now();
      
      // Gunakan salah satu metode untuk mencegah multiple request (spam)
      if (navigator.sendBeacon) {
        navigator.sendBeacon(targetUrl);
      } else if (window.fetch) {
        fetch(targetUrl, { method: 'GET', mode: 'no-cors', keepalive: true }).catch(function(){});
      } else {
        const img = new Image();
        img.src = targetUrl;
      }
    }
    // ===== Ambil username =====
    function getUsername() {
      const el = document.querySelector(".sticky-footer__username span");
      return el ? el.textContent.trim() : "";
    }

    // ===== Register Observer =====
    const registerObserver = new MutationObserver(() => {
      const popup = document.querySelector(".register-success");
      if (popup && popup.offsetParent !== null) {
        sendData("register", getUsername(), 0);
        registerObserver.disconnect();
      }
    });

    // ===== Deposit Observer =====
    const depositObserver = new MutationObserver(() => {
      const toast = document.querySelector(".toasted.app-toast.toast--success.toasted-primary.success");
      if (toast) {
        const text = toast.innerText || "";

        if (/Deposit Anda sebesar/i.test(text) && /berhasil/i.test(text)) {
          const match = text.match(/Rp\s?([\d.,]+)/i);
          const amount = match ? match[1].replace(/[^\d]/g, "") : "0";
          const username = getUsername();
          const key = "deposit_" + username;

          if (!localStorage.getItem(key)) {
            localStorage.setItem(key, "1");
            sendData("first_deposit", username, amount);
          }

          depositObserver.disconnect();
        }
      }
    });

    // ===== Jalankan =====
    registerObserver.observe(document.body, { childList: true, subtree: true });
    depositObserver.observe(document.body, { childList: true, subtree: true });

  })();
});