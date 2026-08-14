import { readFileSync } from "fs";
import { join } from "path";
import {
  DesktopFloatingLiveChat,
  DesktopFooter,
  DesktopHeader,
  DesktopMenu,
  DesktopQuickMenu,
  RunningText
} from "./desktop-home-snapshot";
import {
  MobileFloatingLiveChat,
  MobileQuickFloatingMenu,
  MobileSnapshotFooter
} from "./mobile-home-snapshot";
import { AuthenticatedMobileHeader, AuthenticatedMobileStickyFooter, type AuthSnapshotProps } from "@/components/authenticated-chrome";
import { brand } from "@/lib/content";

const MOBILE_ASSET_ROOT = "/poker-mobile_files/";
const POKER_DESKTOP_SOURCE = join(process.cwd(), "html", "statis", "poker.html");
const POKER_MOBILE_SOURCE = join(process.cwd(), "html", "statis", "poker-mobile.html");

const breadcrumbItems = [
  ["Eksklusif", "/exclusive", "eksklusif"],
  ["Sports+", "/sports", "sports+"],
  ["Slots", "/slot/category/hot", "slots"],
  ["Casino", "/casino", "casino"],
  ["Poker", "/poker", "poker"],
  ["Lotto", "/lotto/", "lotto"],
  ["Arcade", "/arcade/category/hot", "arcade"],
  ["Fishing", "/fishing", "fishing"],
  ["Promosi", "/promotions/all", "promosi"]
] satisfies Array<[string, string, string]>;

const footerText =
  "Agenolx menyediakan platform pemain melawan pemain di permainan multiplayer kami. Kami bekerja sama dengan penyedia platform multiplayer terbaik yaitu IDNPOKER. IDNPOKER menyediakan permainan poker yang sangat digemari para pemain kartu. Selain poker, terdapat juga berbagai macam permainan kartu lainnya berbasis multiplayer seperti domino, ceme, capsa dan lain-lain. Bagi anda yang menyukai tantangan, anda wajib bermain di IDNPOKER pada situs kami karena tidak hanya keberuntungan yang dibutuhkan, namun juga dibutuhkan keahlian dalam permainan multiplayer.";

export function DesktopPokerSnapshot({ user }: AuthSnapshotProps = {}) {
  const pokerMainHtml = readPokerMainHtml(false);

  return (
    <div id="__app-poker-desktop">
      <div id="__layout-poker-desktop">
        <div className="layout--default layout--d snapshot-desktop-layout poker-desktop-layout">
          <DesktopHeader user={user} />
          <DesktopMenu activeLabel="Poker" />
          <main>
            <div className="container">
              <RunningText />
              <PokerBreadcrumbs />
              <PokerMain html={pokerMainHtml} />
            </div>
          </main>
          <PokerFooterText desktop />
          <DesktopFooter />
          <DesktopQuickMenu />
          <DesktopFloatingLiveChat />
        </div>
      </div>
    </div>
  );
}

export function MobilePokerSnapshot({ user }: AuthSnapshotProps = {}) {
  const pokerMainHtml = readPokerMainHtml(true);

  return (
    <div id="__app-poker-mobile">
      <div id="__layout-poker-mobile">
        <div className="layout--default snapshot-mobile-layout poker-mobile-layout">
          <MobilePokerHeader user={user} />
          <main>
            <div className="container">
              <PokerMain html={pokerMainHtml} />
            </div>
          </main>
          <PokerFooterText />
          <MobileSnapshotFooter />
          <div className="top-observer" />
          <PokerMobileStickyFooter user={user} />
          <MobileFloatingLiveChat />
          <MobileQuickFloatingMenu />
        </div>
      </div>
    </div>
  );
}

function PokerMain({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function MobilePokerHeader({ user }: AuthSnapshotProps = {}) {
  if (user) {
    return <AuthenticatedMobileHeader user={user} assetRoot={MOBILE_ASSET_ROOT} activeLabel="Poker" links={breadcrumbItems.map(([label, href]) => [label, href])} />;
  }

  return (
    <header className="app-header surface">
      <div className="container--fluid">
        <div className="app-header__main">
          <div className="app-brand">
            <a href="/" className="app-link--active">
              <img src={brand.logo} alt={brand.name} loading="lazy" className="app-logo" />
            </a>
          </div>
          <div className="app-header__widgets">
            <a href="/apk" className="btn btn--brand btn--flex btn--round">
              <i className="icon-android-alt icon--lg" />
            </a>
            <div className="app-header__auth">
              <a href="/register" className="btn btn--brand btn--flex">
                Daftar
              </a>
              <button className="btn btn--accent" type="button" data-login-modal-trigger>
                Masuk
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="app-header__extra">
        <nav className="app-breadcrumbs app-breadcrumbs--shadow-end">
          <ul>
            <li data-pos="start" className="nav-observer" />
            <li className="nav-item nav-item--home">
              <a href="/" {...({ name: "Beranda" } as { name: string })} className="app-link--active">
                Beranda
              </a>
            </li>
            <li className="nav-item nav-item--fill">
              <i className="icon-arrow-right icon--xs" />
            </li>
            {breadcrumbItems.map(([label, href, ref]) => (
              <li className="nav-item" key={label}>
                <a
                  href={href}
                  aria-current={label === "Poker" ? "page" : undefined}
                  className={label === "Poker" ? "app-link--exact-active app-link--active" : ""}
                  {...({ name: label } as { name: string })}
                  data-ref={ref}
                >
                  {label}
                </a>
              </li>
            ))}
            <li data-pos="end" className="nav-observer" />
          </ul>
        </nav>
        <button className="app-button btn drawer__toggle" type="button">
          <span>Menu</span> <i className="icon-bars icon--lg" />
        </button>
      </div>
    </header>
  );
}

function PokerBreadcrumbs() {
  return (
    <nav className="app-breadcrumbs app-breadcrumbs--d app-breadcrumbs--shadow-end">
      <ul>
        <li data-pos="start" className="nav-observer" />
        <li className="nav-item nav-item--home">
          <a href="/" className="app-link--active" {...({ name: "Beranda" } as { name: string })}>
            Beranda
          </a>
        </li>
        <li className="nav-item nav-item--fill">
          <i className="icon-arrow-right icon--xs" />
        </li>
        {breadcrumbItems.map(([label, href, ref]) => (
          <li className="nav-item" key={label}>
            <a
              href={href}
              aria-current={label === "Poker" ? "page" : undefined}
              className={label === "Poker" ? "app-link--exact-active app-link--active" : ""}
              {...({ name: label } as { name: string })}
              data-ref={ref}
            >
              {label}
            </a>
          </li>
        ))}
        <li data-pos="end" className="nav-observer" />
      </ul>
    </nav>
  );
}

function PokerFooterText({ desktop = false }: { desktop?: boolean }) {
  return (
    <section className={`footer-text${desktop ? " footer-text--d" : ""}`}>
      <div className="footer-text__container">
        <article>
          <p>{footerText}</p>
        </article>
        <button type="button">Baca lebih</button>
      </div>
    </section>
  );
}

function PokerMobileStickyFooter({ user }: AuthSnapshotProps = {}) {
  if (user) {
    return <AuthenticatedMobileStickyFooter user={user} assetRoot={MOBILE_ASSET_ROOT} activePath="/poker" />;
  }

  const items = [
    ["Beranda", "/", "home-muted.df1f27a.svg", "link"],
    ["Daftar", "/register", "edit-muted.452594a.svg", "link"],
    ["Masuk", "/", "login-muted.3774dfc.svg", "button"],
    ["Promosi", "/promotions/all", "promo-muted.ee149da.svg", "link"],
    ["Kontak", "/contact", "chat-muted.86ad236.svg", "link"]
  ] satisfies Array<[string, string, string, "link" | "button"]>;

  return (
    <section className="sticky-footer surface--inverse">
      <nav className="sticky-footer__nav">
        <ul>
          {items.map(([label, href, icon, kind]) => (
            <li key={label}>
              {kind === "link" ? (
                <a href={href} className="btn">
                  <img alt={label} src={`${MOBILE_ASSET_ROOT}${icon}`} className="brand-icon brand-icon--xs" /> <span>{label}</span>
                </a>
              ) : (
                <button type="button" data-login-modal-trigger className="btn">
                  <img alt={label} src={`${MOBILE_ASSET_ROOT}${icon}`} className="brand-icon brand-icon--xs" /> <span>{label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

function readPokerMainHtml(mobile: boolean) {
  const html = readFileSync(mobile ? POKER_MOBILE_SOURCE : POKER_DESKTOP_SOURCE, "utf8");
  const match = html.match(/<section\b[^>]*class="[^"]*\bpoker\b[^"]*"[\s\S]*?<\/section>/);
  if (!match) throw new Error(`Poker main section not found for ${mobile ? "mobile" : "desktop"}`);
  return sanitizePokerMainHtml(match[0]);
}

function sanitizePokerMainHtml(html: string) {
  return html
    .replace(/https:\/\/agenolx\.com/g, "")
    .replace(/https:\/\/agenolxtoro\.com/g, "")
    .replace(/(href|src)="\.\/([^"]+)"/g, '$1="/$2"')
    .replace(/\s(?:onclick|onerror|onload|onmouseover|onmouseout)="[^"]*"/g, "")
    .replace(/\sfdprocessedid="[^"]*"/g, "");
}
