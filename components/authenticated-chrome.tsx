import { brand } from "@/lib/content";
import type { AuthenticatedUser } from "@/lib/session";

type BreadcrumbLink = [label: string, href: string];

const defaultMobileLinks: BreadcrumbLink[] = [
  ["Beranda", "/"],
  ["Eksklusif", "/exclusive"],
  ["Sports+", "/sports"],
  ["Slots", "/slot/category/hot"],
  ["Casino", "/casino"],
  ["Poker", "/poker"],
  ["Lotto", "/lotto/"],
  ["Arcade", "/arcade/category/hot"],
  ["Fishing", "/fishing"],
  ["Promosi", "/promotions/all"]
];

export type AuthSnapshotProps = {
  user?: AuthenticatedUser | null;
};

export function AuthenticatedDesktopUserWidget({ user, activeDeposit = false }: { user: AuthenticatedUser; activeDeposit?: boolean }) {
  return (
    <div className="app-header__user">
      <a href="/user/messages" className="icon_chip app-header__btn-inbox btn--light">
        <i className="icon-mail icon--md" />
        <span>{user.inboxCount}</span>
      </a>
      <div className="app-header__username">
        <i className="icon-username icon--sm" />
        <span>{user.username}</span>
      </div>
      <div className="app-header__balance">
        <span>{user.balanceFormatted}</span>
      </div>
      <a href="/deposit" className={`btn btn--success btn--flex${activeDeposit ? " app-link--active" : ""}`}>
        <i className="icon-deposit icon--lg" />
        <span>Deposit</span>
      </a>
    </div>
  );
}

export function AuthenticatedMobileHeader({
  user,
  activeLabel,
  links = defaultMobileLinks,
  depositActive = false
}: {
  user: AuthenticatedUser;
  assetRoot: string;
  activeLabel?: string;
  links?: BreadcrumbLink[];
  depositActive?: boolean;
}) {
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
            <div className="app-header__user">
              <a href="/user/messages" className="icon_chip app-header__btn-inbox btn--light">
                <i className="icon-mail icon--md" />
                <span>{user.inboxCount}</span>
              </a>
              <a href="/deposit" className={`btn btn--success btn--flex${depositActive ? " app-link--active" : ""}`}>
                Deposit
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="app-header__extra">
        <nav className="app-breadcrumbs app-breadcrumbs--shadow-end">
          <ul>
            <li data-pos="start" className="nav-observer" />
            {links.map(([label, href], index) => (
              <li className={`nav-item${index === 0 ? " nav-item--home" : ""}`} key={`${label}-${href}`}>
                <a
                  href={href}
                  className={label === activeLabel || (!activeLabel && index === 0) ? "app-link--exact-active app-link--active" : undefined}
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

export function AuthenticatedMobileStickyFooter({
  user,
  activePath
}: {
  user: AuthenticatedUser;
  assetRoot: string;
  activePath: string;
}) {
  const iconRoot = "/index-mobile_files/";
  const isDeposit = activePath === "/deposit" || activePath.startsWith("/deposit/");
  const isReferral = activePath === "/user/referral/history" || activePath === "/referral";
  const isBonus = activePath === "/user/bonuses";
  const isContact = activePath === "/contact";

  const items = [
    ["Deposit", "/deposit", isDeposit ? "deposit.8ff04d8.svg" : "deposit-muted.d8db7cf.svg", isDeposit],
    ["Referral", "/user/referral/history", "referral-muted.c5d25e5.svg", isReferral],
    ["Bonus", "/user/bonuses", "gift-muted.2f539fe.svg", isBonus],
    ["Kontak", "/contact", isContact ? "chat.022cca6.svg" : "chat-muted.86ad236.svg", isContact]
  ] satisfies Array<[string, string, string, boolean]>;

  return (
    <section className="sticky-footer surface--inverse">
      <nav className="sticky-footer__nav sticky-footer__nav--user">
        <ul>
          <li className="sticky-footer__balance">
            <span>{user.balanceFormatted}</span>
            <div className="sticky-footer__username">
              <i className="icon-username icon--sm" />
              <span>{user.username}</span>
            </div>
          </li>
          {items.map(([label, href, icon, active]) => (
            <li key={label}>
              <a href={href} className={`btn${active ? " app-link--active" : ""}`}>
                <img alt={label} src={`${iconRoot}${icon}`} className="brand-icon brand-icon--xs" /> <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
