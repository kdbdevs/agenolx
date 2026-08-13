(function () {
    var s = 'clckd.postback.pxl',
        u = 'pxl',
        g = 259;

    function t(e) {
        var r = window.location.search.substring(1).split("&");
        for (var n = 0; n < r.length; n++) {
            var a = r[n].split("=");
            if (decodeURIComponent(a[0]) === e) {
                return decodeURIComponent(a[1] || "");
            }
        }
        return null;
    }

    var l = t(u);
    if (l) {
        localStorage.setItem(s, JSON.stringify({ url: l }));
    }

    function c(e) {
        try {
            var r = document.createElement("img");
            r.src = e;
            r.style.display = "none";
            (document.body || document.documentElement).appendChild(r);
            r.onload = r.onerror = function () {
                r.parentNode && r.parentNode.removeChild(r);
            };
        } catch (e) {
            console.warn("Pixel error:", e);
        }
    }

    function m(e, r) {
        return e + (e.indexOf("?") > -1 ? "&" : "?") + r;
    }

    function p(e, r) {
        try {
            var a = localStorage.getItem(s);
            a = JSON.parse(a || "{}");

            if (!a.url || a[e]) return;

            a[e] = true;

            var o = m(decodeURIComponent(a.url), "adg=" + e + "&adrt=" + r);
            localStorage.setItem(s, JSON.stringify(a));
            c(o);
        } catch (e) {
            console.warn("trackClckdPostback error:", e);
        }
    }

    var d = XMLHttpRequest.prototype.open,
        v = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (e, r) {
        this._pxl_url = r;
        return d.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function () {
        var r = this,
            a = r.onreadystatechange;

        r.onreadystatechange = function () {
            try {
                if (
                    r.readyState === 4 &&
                    r._pxl_url &&
                    r._pxl_url.indexOf("/api/auth/register") > -1
                ) {
                    try {
                        var n = JSON.parse(r.responseText);
                        if (
                            r.status >= 200 &&
                            r.status < 300 &&
                            n &&
                            n.user &&
                            n.user.username
                        ) {
                            p(g, 1);
                        }
                    } catch (e) {
                        console.warn("JSON parse error:", e);
                    }
                }
            } catch (e) {}

            a && a.apply(this, arguments);
        };

        return v.apply(this, arguments);
    };
})();
