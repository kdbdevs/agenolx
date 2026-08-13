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

export type CasinoCategory =
  | "lobby"
  | "top"
  | "game-shows"
  | "roulette"
  | "baccarat"
  | "sic-bo"
  | "dragon-tiger"
  | "blackjack"
  | "ball-games"
  | "idn-special";

const MOBILE_COMMON_ROOT = "/lobby-mobile_files/";

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

const mobileMenuItems = [
  ["Eksklusif", "/exclusive", "exclusive.ab7549b.svg"],
  ["Sports+", "/sports", "sports.92624ce.svg"],
  ["Slots", "/slot/category/hot", "slots.0bfdbc0.svg"],
  ["Casino", "/casino", "casino.c79b5be.svg"],
  ["Poker", "/poker", "poker.308b1f0.svg"],
  ["Lotto", "/lotto/", "lotto.dbcbcac.svg"],
  ["Arcade", "/arcade/category/hot", "arcade.98c6117.svg"],
  ["Fishing", "/fishing", "fishing.2e7df1a.svg"],
  ["Promosi", "/promotions/all", "promo.4108971.svg"]
] satisfies Array<[string, string, string]>;

const footerText =
  "Agenolx merupakan bandar casino online terpercaya dan terbaik di Indonesia. Kami memiliki berbagai macam casino online yang telah kami pilih untuk memanjakan pemain kami. Casino online kami dapat diakses 24 jam sehingga anda dapat bermain kapanpun dan dimanapun. Sudah banyak pemain kami yang memiliki kemenangan besar di casino online kami dan mungkin ada yang berikutnya. Coba sekarang dan temukan casino online favorit anda.";

export function DesktopCasinoSnapshot({ category, user }: { category: CasinoCategory } & AuthSnapshotProps) {
  const casinoMainHtml = readCasinoMainHtml(category, false);

  return (
    <div id={`__app-casino-${category}-desktop`}>
      <div id={`__layout-casino-${category}-desktop`}>
        <div className="layout--default layout--d snapshot-desktop-layout casino-desktop-layout">
          <DesktopHeader user={user} />
          <DesktopMenu activeLabel="Casino" />
          <main>
            <div className="container">
              <RunningText />
              <CasinoBreadcrumbs />
              <CasinoMain html={casinoMainHtml} />
            </div>
          </main>
          <CasinoFooterText desktop />
          <DesktopFooter />
          <DesktopQuickMenu />
          <DesktopFloatingLiveChat />
        </div>
      </div>
    </div>
  );
}

export function MobileCasinoSnapshot({ category, user }: { category: CasinoCategory } & AuthSnapshotProps) {
  const hasMobileSnapshot = category === "lobby" || category === "top";
  const casinoMainHtml = readCasinoMainHtml(category, true);

  return (
    <div id={`__app-casino-${category}-mobile`}>
      <div id={`__layout-casino-${category}-mobile`}>
        <div className="layout--default snapshot-mobile-layout casino-mobile-layout">
          <MobileCasinoHeader user={user} />
          <main>
            <div className="container">
              {hasMobileSnapshot ? null : <MobileCasinoMenu />}
              <CasinoMain html={casinoMainHtml} />
            </div>
          </main>
          <CasinoFooterText />
          <MobileSnapshotFooter />
          <div className="top-observer" />
          <CasinoMobileStickyFooter user={user} />
          <MobileFloatingLiveChat />
          <MobileQuickFloatingMenu />
        </div>
      </div>
    </div>
  );
}

function CasinoMain({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function MobileCasinoHeader({ user }: AuthSnapshotProps = {}) {
  if (user) {
    return <AuthenticatedMobileHeader user={user} assetRoot={MOBILE_COMMON_ROOT} activeLabel="Casino" links={breadcrumbItems.map(([label, href]) => [label, href])} />;
  }

  return (
    <header className="app-header surface">
      <div className="container--fluid">
        <div className="app-header__main">
          <div className="app-brand">
            <a href="/" className="app-link--active">
              <img src={`${MOBILE_COMMON_ROOT}logo.png`} alt="AGENOLX" loading="lazy" className="app-logo" />
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
                  aria-current={label === "Casino" ? "page" : undefined}
                  className={label === "Casino" ? "app-link--exact-active app-link--active" : ""}
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

function MobileCasinoMenu() {
  return (
    <nav className="app-menu app-menu--shadow-end app-menu--shadow-start">
      <ul>
        <li data-pos="start" className="app-menu__observer" />
        {mobileMenuItems.map(([label, href, icon]) => (
          <li className="app-menu__item" key={label}>
            <a href={href} aria-current={label === "Casino" ? "page" : undefined} className={label === "Casino" ? "app-link--active" : ""}>
              <img alt={label} src={`${MOBILE_COMMON_ROOT}${icon}`} className="brand-icon brand-icon--active brand-icon--md" /> <span>{label}</span>
            </a>
          </li>
        ))}
        <li data-pos="end" className="app-menu__observer" />
      </ul>
    </nav>
  );
}

function CasinoBreadcrumbs() {
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
              aria-current={label === "Casino" ? "page" : undefined}
              className={label === "Casino" ? "app-link--exact-active app-link--active" : ""}
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

function CasinoFooterText({ desktop = false }: { desktop?: boolean }) {
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

function CasinoMobileStickyFooter({ user }: AuthSnapshotProps = {}) {
  if (user) {
    return <AuthenticatedMobileStickyFooter user={user} assetRoot={MOBILE_COMMON_ROOT} activePath="/casino/category/lobby" />;
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
                  <img alt={label} src={`${MOBILE_COMMON_ROOT}${icon}`} className="brand-icon brand-icon--xs" /> <span>{label}</span>
                </a>
              ) : (
                <button type="button" data-login-modal-trigger className="btn">
                  <img alt={label} src={`${MOBILE_COMMON_ROOT}${icon}`} className="brand-icon brand-icon--xs" /> <span>{label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

function sourceFileFor(category: CasinoCategory, mobile: boolean) {
  const hasMobileSnapshot = category === "lobby" || category === "top";
  return join(process.cwd(), "html", "statis", "casino", "category", `${category}${mobile && hasMobileSnapshot ? "-mobile" : ""}.html`);
}

function readCasinoMainHtml(category: CasinoCategory, mobile: boolean) {
  const html = readFileSync(sourceFileFor(category, mobile), "utf8");
  const match = html.match(/<section\b[^>]*class="[^"]*\bcasino\b[^"]*"[\s\S]*?<\/section>/);
  if (!match) throw new Error(`Casino main section not found for ${category}`);
  return sanitizeCasinoMainHtml(match[0], mobile && category !== "lobby" && category !== "top");
}

function sanitizeCasinoMainHtml(html: string, forceMobileClasses: boolean) {
  let output = html
    .replace(/https:\/\/agenolxtoro\.com/g, "")
    .replace(/(href|src)="\.\/([^"]+)"/g, '$1="/$2"')
    .replace(/\s(?:onclick|onerror|onload|onmouseover|onmouseout)="[^"]*"/g, "")
    .replace(/\sfdprocessedid="[^"]*"/g, "");

  if (forceMobileClasses) {
    output = output
      .replace(/\s+casino--d/g, "")
      .replace(/\s+page-nav--d/g, "")
      .replace(/\s+casino-game--d/g, "")
      .replace(/\s+style="display: none;"/g, ' style="display:none;"');
  }

  return output;
}
