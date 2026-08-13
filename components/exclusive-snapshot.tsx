import {
  DesktopFloatingLiveChat,
  DesktopFooter,
  DesktopFooterText,
  DesktopHeader,
  DesktopMenu,
  DesktopQuickMenu,
  RunningText
} from "./desktop-home-snapshot";
import {
  MobileFloatingLiveChat,
  MobileFooterText,
  MobileQuickFloatingMenu,
  MobileSnapshotFooter,
  MobileStickyFooter
} from "./mobile-home-snapshot";
import { AuthenticatedMobileHeader, type AuthSnapshotProps } from "@/components/authenticated-chrome";

const DESKTOP_ASSET_ROOT = "/exclusive_files/";
const MOBILE_ASSET_ROOT = "/exclusive-mobile_files/";

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

const exclusiveTiles = [
  ["IDNPOKER", "/poker", "idnpoker.webp", "link"],
  ["IDNSLOT", "/slot/provider/idnslotdirect", "idnslot.webp", "link"],
  ["Slot Mania", "/slot/provider/slotmania", "slotmania.webp", "link"],
  ["IDNLIVE", "", "idnlive.webp", "button"],
  ["Live Mania", "", "livemania.webp", "button"],
  ["IDN Arcade", "/arcade/provider/idnarcade", "idnarcade.webp", "link"],
  ["Stream n'Spin", "", "sns.webp", "button"],
  ["Sport GG", "", "sportgg.webp", "button"],
  ["PP 98% RTP", "/slot/provider/pragmaticplay98", "pp98.webp", "link"],
  ["Spin Royal", "/slot/category/spin-royal", "spinroyal.webp", "link"],
  ["LeVel UP", "/slot/category/level-up", "levelup.webp", "link"],
  ["Kong Original", "/arcade/provider/originals", "kong.webp", "link"]
] satisfies Array<[string, string, string, "link" | "button"]>;

export function DesktopExclusiveSnapshot({ user }: AuthSnapshotProps = {}) {
  return (
    <div id="__app-exclusive-desktop">
      <div id="__layout-exclusive-desktop">
        <div className="layout--default layout--d snapshot-desktop-layout exclusive-desktop-layout">
          <DesktopHeader user={user} />
          <DesktopMenu activeLabel="Eksklusif" />
          <main>
            <div className="container">
              <RunningText />
              <DesktopExclusiveBreadcrumbs />
              <ExclusiveContent assetRoot={DESKTOP_ASSET_ROOT} desktop />
            </div>
          </main>
          <DesktopFooterText />
          <DesktopFooter />
          <DesktopQuickMenu />
          <DesktopFloatingLiveChat />
        </div>
      </div>
    </div>
  );
}

export function MobileExclusiveSnapshot({ user }: AuthSnapshotProps = {}) {
  return (
    <div id="__app-exclusive-mobile">
      <div id="__layout-exclusive-mobile">
        <div className="layout--default snapshot-mobile-layout exclusive-mobile-layout">
          <MobileExclusiveHeader user={user} />
          <main>
            <div className="container">
              <ExclusiveContent assetRoot={MOBILE_ASSET_ROOT} />
            </div>
          </main>
          <MobileFooterText />
          <MobileSnapshotFooter />
          <div className="top-observer" />
          <MobileStickyFooter user={user} activePath="/exclusive" />
          <MobileFloatingLiveChat />
          <MobileQuickFloatingMenu />
        </div>
      </div>
    </div>
  );
}

function MobileExclusiveHeader({ user }: AuthSnapshotProps = {}) {
  if (user) {
    return <AuthenticatedMobileHeader user={user} assetRoot={MOBILE_ASSET_ROOT} activeLabel="Eksklusif" links={breadcrumbItems.map(([label, href]) => [label, href])} />;
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
                  aria-current={label === "Eksklusif" ? "page" : undefined}
                  className={label === "Eksklusif" ? "app-link--exact-active app-link--active" : ""}
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

function DesktopExclusiveBreadcrumbs() {
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
              aria-current={label === "Eksklusif" ? "page" : undefined}
              className={label === "Eksklusif" ? "app-link--exact-active app-link--active" : ""}
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

function ExclusiveContent({ assetRoot, desktop = false }: { assetRoot: string; desktop?: boolean }) {
  return (
    <section className={`exclusive${desktop ? " exclusive--d" : ""}`}>
      <header className="page-header">
        <i className="icon-exclusive icon--lg" /> <h3>Eksklusif</h3>
      </header>
      <ul>
        {exclusiveTiles.map(([alt, href, image, kind], index) => (
          <li key={alt}>
            {kind === "link" ? (
              <a href={href}>
                <img src={`${assetRoot}${image}`} alt={alt} loading={index > 2 ? "lazy" : undefined} />
                <ExclusiveBadge desktop={desktop} />
              </a>
            ) : (
              <button type="button">
                <img src={`${assetRoot}${image}`} alt={alt} loading="lazy" />
                <ExclusiveBadge desktop={desktop} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExclusiveBadge({ desktop }: { desktop: boolean }) {
  return (
    <div className="surface">
      <i className={`icon-exclusive ${desktop ? "icon--lg" : "icon--md"}`} />
    </div>
  );
}
