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

const DESKTOP_ASSET_ROOT = "/sports_files/";
const MOBILE_ASSET_ROOT = "/sports-mobile_files/";
const DESKTOP_BANNER = "https://cdn-proxy.globalcontentcloud.com/common/default/dekstop_sport-gg.jpg";

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
  ["Fishing", "/fishing", "fishing.2e7df1a.svg"]
] satisfies Array<[string, string, string]>;

const sportsTabs = [
  ["Semua", "/sports"],
  ["Sports", "/sports/sport"],
  ["E-sports", "/sports/esport"],
  ["Virtual", "/sports/virtual"]
] satisfies Array<[string, string]>;

const sportsProviders = [
  ["Sport GG", "sportgg.jpg"],
  ["SABA Sports", "saba.jpg"],
  ["SBOBET", "sbobet.jpg"],
  ["UboBet", "ubo.jpg"],
  ["NSOFT", "nsoft.jpg"],
  ["BTI", "bti.jpg"],
  ["CMD368", "ftsport.jpg"],
  ["Saba eSports", "e-sabaesports.jpg"],
  ["TFGaming", "e-tfgaming.jpg"],
  ["CMD368", "e-ftesport.jpg"],
  ["SBOBET Virtual", "sbovsports.jpg"]
] satisfies Array<[string, string]>;

const footerText =
  "Agenolx\u00a0merupakan situs agen sportsbook terpercaya. Salah satu provider yang kami miliki adalah UBO yang merupakan provider terhandal dan terpercaya masa kini. UBO memiliki berbagai jenis taruhan di berbagai macam olahraga yang lengkap. Selain itu UBO dan Agenolx\u00a0memiliki visi yang sama yaitu memberikan pelayanan terbaik bagi pemain, oleh karena itu UBO juga berkomitmen untuk memberikan informasi pertandingan secara lengkap agar para pemain tidak perlu bingung saat menunggu taruhan. Jangan lewati pertandingan tim kesayangan anda. Mulai bertaruh pada situs kami agar menonton pertandingan tim kesayangan anda menjadi lebih seru dan menegangkan.";

export function DesktopSportsSnapshot({ user }: AuthSnapshotProps = {}) {
  return (
    <div id="__app-sports-desktop">
      <div id="__layout-sports-desktop">
        <div className="layout--default layout--d snapshot-desktop-layout sports-desktop-layout">
          <DesktopHeader user={user} />
          <DesktopMenu activeLabel="Sports+" />
          <main>
            <div className="container">
              <RunningText />
              <SportsBreadcrumbs />
              <SportsContent assetRoot={DESKTOP_ASSET_ROOT} desktop />
            </div>
          </main>
          <SportsFooterText desktop />
          <DesktopFooter />
          <DesktopQuickMenu />
          <DesktopFloatingLiveChat />
        </div>
      </div>
    </div>
  );
}

export function MobileSportsSnapshot({ user }: AuthSnapshotProps = {}) {
  return (
    <div id="__app-sports-mobile">
      <div id="__layout-sports-mobile">
        <div className="layout--default snapshot-mobile-layout sports-mobile-layout">
          <MobileSportsHeader user={user} />
          <main>
            <div className="container">
              <SportsContent assetRoot={MOBILE_ASSET_ROOT} />
            </div>
          </main>
          <SportsFooterText />
          <MobileSnapshotFooter />
          <div className="top-observer" />
          <SportsMobileStickyFooter user={user} />
          <MobileFloatingLiveChat />
          <MobileQuickFloatingMenu />
        </div>
      </div>
    </div>
  );
}

function MobileSportsHeader({ user }: AuthSnapshotProps = {}) {
  if (user) {
    return <AuthenticatedMobileHeader user={user} assetRoot={MOBILE_ASSET_ROOT} activeLabel="Sports+" links={breadcrumbItems.map(([label, href]) => [label, href])} />;
  }

  return (
    <header className="app-header surface">
      <div className="container--fluid">
        <div className="app-header__main">
          <div className="app-brand">
            <a href="/" className="app-link--active">
              <img src={`${MOBILE_ASSET_ROOT}logo.png`} alt="AGENOLX" loading="lazy" className="app-logo" />
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
                  aria-current={label === "Sports+" ? "page" : undefined}
                  className={label === "Sports+" ? "app-link--exact-active app-link--active" : ""}
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

function SportsBreadcrumbs() {
  return (
    <nav className="app-breadcrumbs app-breadcrumbs--d">
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
              aria-current={label === "Sports+" ? "page" : undefined}
              className={label === "Sports+" ? "app-link--exact-active app-link--active" : ""}
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

function SportsContent({ assetRoot, desktop = false }: { assetRoot: string; desktop?: boolean }) {
  return (
    <section className={`sports${desktop ? " sports--d" : ""}`}>
      {!desktop ? <MobileSportsMenu /> : null}
      <SportsTabNav />
      <button type="button" className="sports__banner">
        <picture>
          <source srcSet={DESKTOP_BANNER} media="(min-width: 640px)" />
          <img src={`${assetRoot}mobile_sport-gg.jpg`} alt="Sportsbook" />
        </picture>
      </button>
      <ul className="sports-grid">
        {sportsProviders.map(([label, image]) => (
          <li key={`${label}-${image}`}>
            <button type="button">
              <img src={`${assetRoot}${image}`} alt={label} /> <span>{label}</span>
            </button>
            <button type="button" className="btn btn--flex btn--brand">
              <span>Main {label}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MobileSportsMenu() {
  return (
    <nav className="app-menu app-menu--shadow-end">
      <ul>
        <li data-pos="start" className="app-menu__observer" />
        {mobileMenuItems.map(([label, href, icon]) => (
          <li className="app-menu__item" key={label}>
            <a href={href} aria-current={label === "Sports+" ? "page" : undefined} className={label === "Sports+" ? "app-link--exact-active app-link--active" : ""}>
              <img alt={label} src={`${MOBILE_ASSET_ROOT}${icon}`} className="brand-icon brand-icon--active brand-icon--md" /> <span>{label}</span>
            </a>
          </li>
        ))}
        <li data-pos="end" className="app-menu__observer" />
      </ul>
    </nav>
  );
}

function SportsTabNav() {
  return (
    <nav className="sports__nav">
      <ul>
        {sportsTabs.map(([label, href]) => (
          <li key={label}>
            <a href={href} aria-current={label === "Semua" ? "page" : undefined} className={`btn btn--flex btn--light${label === "Semua" ? " app-link--exact-active app-link--active" : ""}`}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SportsFooterText({ desktop = false }: { desktop?: boolean }) {
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

function SportsMobileStickyFooter({ user }: AuthSnapshotProps = {}) {
  if (user) {
    return <AuthenticatedMobileStickyFooter user={user} assetRoot={MOBILE_ASSET_ROOT} activePath="/sports" />;
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
