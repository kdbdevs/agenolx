import Link from "next/link";
import { Fragment } from "react";
import {
  AuthenticatedDesktopUserWidget,
  AuthenticatedMobileHeader,
  AuthenticatedMobileStickyFooter
} from "@/components/authenticated-chrome";
import { DesktopFooter, DesktopFooterText } from "@/components/desktop-home-snapshot";
import { MobileFooterText, MobileSnapshotFooter } from "@/components/mobile-home-snapshot";
import { brand, floatingLinks, isActivePath, navItems } from "@/lib/content";
import type { AuthenticatedUser } from "@/lib/session";

type AppShellProps = {
  activePath: string;
  user?: AuthenticatedUser | null;
  children: React.ReactNode;
};

export function AppShell({ activePath, user, children }: AppShellProps) {
  const isDeposit = activePath === "/deposit" || activePath.startsWith("/deposit/");

  return (
    <div className="layout--default layout--d layout--bg rebuild-page">
      <Header activePath={activePath} user={user} mobileReplaced={Boolean(user)} />
      {user ? (
        <div className="rebuild-mobile-snapshot-header">
          <AuthenticatedMobileHeader
            user={user}
            assetRoot="/index-mobile_files/"
            activeLabel={getMobileHeaderActiveLabel(activePath)}
            depositActive={isDeposit}
          />
        </div>
      ) : null}
      <nav className="rebuild-nav app-menu app-menu--d app-menu--primary">
        <ul>
          {navItems.map((item) => (
            <li key={item.href} className="app-menu__item app-menu__item--font-large">
              <Link href={item.href} className={isActivePath(activePath, item.href) ? "active" : undefined}>
                <img alt={item.label} src={item.icon} className="brand-icon brand-icon--active brand-icon--md" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <div className="container rebuild-container">
          <RunningText />
          {activePath === "/" ? null : <Breadcrumbs activePath={activePath} />}
          {children}
        </div>
      </main>
      <DesktopFooterText />
      <DesktopFooter />
      <div className="rebuild-mobile-snapshot-footer">
        <MobileFooterText />
        <MobileSnapshotFooter />
      </div>
      <FloatingContactMenu />
      <BottomNav activePath={activePath} user={user} />
    </div>
  );
}

function getMobileHeaderActiveLabel(activePath: string) {
  if (activePath === "/") return "Beranda";
  const active = navItems.find((item) => isActivePath(activePath, item.href));
  return active?.label;
}

function Header({
  activePath,
  user,
  mobileReplaced = false
}: {
  activePath: string;
  user?: AuthenticatedUser | null;
  mobileReplaced?: boolean;
}) {
  return (
    <header className={`app-header surface app-header--d rebuild-header${mobileReplaced ? " rebuild-header--mobile-replaced" : ""}`}>
      <button className="app-button btn drawer__toggle drawer__toggle--d agen-menu-btn" type="button">
        <i className="icon-bars icon--lg" />
        <span>Menu</span>
      </button>
      <div className="container--fluid rebuild-header__container">
        <div className="app-header__main rebuild-header__main">
          <div className="app-brand">
            <Link href="/">
              <img src={brand.logo} alt={brand.name} className="app-logo rebuild-logo" />
            </Link>
          </div>
          <div className="app-header__widgets rebuild-header__widgets">
            <Link href="/apk" className="btn btn--brand btn--flex btn--round rebuild-apk-button">
              <i className="icon-android-alt icon--lg" />
            </Link>
            <Link
              href="https://multi-chat.info/go-tg?i=agenolx"
              target="_blank"
              className="btn btn--flex btn--sm agen-telegram-btn rebuild-telegram"
            >
              <i className="icon-telegram icon--md" />
              <span>Main di Telegram</span>
            </Link>
            {user ? (
              <AuthenticatedDesktopUserWidget user={user} activeDeposit={activePath === "/deposit" || activePath.startsWith("/deposit/")} />
            ) : (
              <div className="app-header__auth">
                <LoginInline />
                <Link href="/register" className="btn btn--brand btn--flex rebuild-button rebuild-button--brand">
                  Daftar
                </Link>
                <button type="button" data-login-modal-trigger className="btn btn--accent btn--flex rebuild-button rebuild-mobile-login">
                  Masuk
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="app-header__extra rebuild-mobile-header-extra">
        <MobileHeaderBreadcrumbs activePath={activePath} />
        <button className="app-button btn drawer__toggle rebuild-mobile-drawer-toggle" type="button">
          <span>Menu</span>
          <i className="icon-bars icon--lg" />
        </button>
      </div>
    </header>
  );
}

function MobileHeaderBreadcrumbs({ activePath }: { activePath: string }) {
  const items = [
    { label: "Beranda", href: "/" },
    ...navItems.filter((item) => !["/leaderboard/providers", "/referral", "/contact"].includes(item.href))
  ];

  return (
    <nav className="app-breadcrumbs rebuild-mobile-breadcrumbs">
      <ul>
        <li data-pos="start" className="nav-observer" />
        {items.map((item) => (
          <li className={`nav-item${item.href === "/" ? " nav-item--home" : ""}`} key={`mobile-header-${item.href}`}>
            <Link
              className={isActivePath(activePath, item.href) ? "app-link--exact-active app-link--active" : undefined}
              href={item.href}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li data-pos="end" className="nav-observer" />
      </ul>
    </nav>
  );
}

function LoginInline() {
  return (
    <div className="login-inline rebuild-login">
      <Link href="/forgot-password">Lupa Password?</Link>
      <form className="login-inline__form rebuild-login__form" action="/api/auth/login" method="post">
        <input className="input input--inverse rebuild-input" name="username" type="text" placeholder="Username" autoComplete="username" />
        <input className="input input--inverse rebuild-input" name="password" type="password" placeholder="Password" autoComplete="current-password" />
        <label className="input-confirm__label rebuild-check">
          <input name="remember" type="checkbox" />
          <span>Tetap masuk</span>
        </label>
        <button className="btn btn--accent btn--loading rebuild-button rebuild-button--accent" type="submit">
          Masuk
        </button>
      </form>
    </div>
  );
}

function RunningText() {
  return (
    <div className="running-text running-text--d running-text--light rebuild-running">
      <i className="icon-volume icon--md" aria-hidden="true" />
      <span className="rebuild-running__text">
        Agenolx! Silahkan masuk atau daftar jika anda belum memiliki akun. Jadi pemenang berikutnya dan rasakan
        keseruan bermain di Agenolx!
      </span>
    </div>
  );
}

function Breadcrumbs({ activePath }: { activePath: string }) {
  const active = navItems.find((item) => isActivePath(activePath, item.href));
  const label =
    activePath === "/"
      ? "Beranda"
      : activePath === "/deposit" || activePath.startsWith("/deposit/")
        ? "Deposit"
        : active?.label ?? "Deposit";
  const items = [
    { label: "Beranda", href: "/", dataRef: "beranda", active: activePath === "/" },
    { label, href: activePath, dataRef: label.toLowerCase(), active: activePath !== "/" },
    ...navItems
      .filter((item) => item.href !== "/" && item.label !== label)
      .filter((item) => !["Leaderboard", "Referral", "Kontak"].includes(item.label))
      .map((item) => ({ label: item.label, href: item.href, dataRef: item.label.toLowerCase(), active: false }))
  ];

  return (
    <nav className="app-breadcrumbs home--full-width app-breadcrumbs--d rebuild-breadcrumbs">
      <ul>
        <li data-pos="start" className="nav-observer" />
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${item.href}`}>
            <li className={`nav-item${index === 0 ? " nav-item--home" : ""}`}>
              <Link
                href={item.href}
                data-ref={item.dataRef}
                className={item.active ? "app-link--exact-active app-link--active" : undefined}
              >
                {item.label}
              </Link>
            </li>
            {index === 0 && activePath !== "/" ? (
              <li className="nav-item nav-item--fill">
                <i className="icon-arrow-right icon--xs" />
              </li>
            ) : null}
          </Fragment>
        ))}
        <li data-pos="end" className="nav-observer" />
      </ul>
    </nav>
  );
}

function FloatingContactMenu() {
  return (
    <>
      <button className="agen-toggle-btn" type="button">
        ☰ Menu
      </button>
      <aside className="agen-social">
        <h3>Menu Cepat</h3>
        <p>Akses Menu Cepat Agenolx</p>
        <ul>
          {floatingLinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href} target="_blank" rel="noopener noreferrer">
                <img src={item.image} alt={item.label} />
                <span className="agen-info">
                  <span>{item.label}</span>
                  <small>{item.sublabel}</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <button className="agen-close-btn" type="button">
          ✖ Close Menu
        </button>
      </aside>
    </>
  );
}

function BottomNav({ activePath, user }: { activePath: string; user?: AuthenticatedUser | null }) {
  if (user) {
    return <AuthenticatedMobileStickyFooter user={user} assetRoot="/index-mobile_files/" activePath={activePath} />;
  }

  const items = [
    navItems[1],
    navItems[2],
    navItems[3],
    navItems[8],
    navItems[11]
  ];
  return (
    <nav className="rebuild-bottom-nav">
      {items.map((item) => (
        <Link href={item.href} key={item.href} className={isActivePath(activePath, item.href) ? "active" : undefined}>
          <img src={item.icon} alt={item.label} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
