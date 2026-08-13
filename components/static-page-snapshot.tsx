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
import { BANK_PROVIDERS, E_MONEY_PROVIDERS } from "@/lib/payment-providers";

export type StaticSnapshotKey =
  | "lotto"
  | "fishing"
  | "arcade-hot"
  | "arcade-askmeslot"
  | "arcade-idnarcade"
  | "arcade-ky"
  | "arcade-microgaming"
  | "arcade-minigame"
  | "arcade-new"
  | "arcade-original"
  | "arcade-pragmaticplay"
  | "arcade-spadegaming"
  | "promotions-all"
  | "promotions-casino"
  | "promotions-other"
  | "promotions-slot"
  | "promotions-sportsbook"
  | "leaderboard-providers"
  | "leaderboard-distributed"
  | "referral"
  | "contact"
  | "register";

type StaticSnapshotConfig = {
  activeLabel?: string;
  desktopSource: StaticSource;
  mobileSource?: StaticSource;
  activeHref?: string;
  mainClass: string;
  mobileAssetRoot: string;
  forceMobileFromDesktop?: boolean;
};

type StaticSource =
  | "lotto.html"
  | "lotto-mobile.html"
  | "fishing.html"
  | "arcade/category/hot.html"
  | "arcade/category/hot-mobile.html"
  | "arcade/provider/askmeslot_arcade.html"
  | "arcade/provider/askmeslot_arcade-mobile.html"
  | "arcade/provider/idnarcade.html"
  | "arcade/provider/idnarcade-mobile.html"
  | "arcade/provider/ky_arcade.html"
  | "arcade/provider/ky_arcade-mobile.html"
  | "arcade/provider/microgaming_arcade.html"
  | "arcade/provider/microgaming_arcade-mobile.html"
  | "arcade/provider/minigame.html"
  | "arcade/provider/minigame-mobile.html"
  | "arcade/provider/new.html"
  | "arcade/provider/new-mobile.html"
  | "arcade/provider/original.html"
  | "arcade/provider/original-mobile.html"
  | "arcade/provider/pragmaticplay_arcade.html"
  | "arcade/provider/pragmaticplay_arcade-mobile.html"
  | "arcade/provider/spadegaming_arcade.html"
  | "arcade/provider/spadegaming_arcade-mobile.html"
  | "promotions/all.html"
  | "promotions/all-mobile.html"
  | "promotions/casino.html"
  | "promotions/casino-mobile.html"
  | "promotions/fishing-mobile.html"
  | "promotions/other.html"
  | "promotions/other-mobile.html"
  | "promotions/slot.html"
  | "promotions/slot-mobile.html"
  | "promotions/sportsbook.html"
  | "promotions/sportsbook-mobile.html"
  | "leaderboard/providers.html"
  | "leaderboard/providers-mobile.html"
  | "leaderboard/distributed.html"
  | "leaderboard/distributed-mobile.html"
  | "referral.html"
  | "referral-mobile.html"
  | "contact.html"
  | "contact-mobile.html"
  | "register.html"
  | "register-mobile.html";

const snapshotConfigs = {
  lotto: page("Lotto", "lotto.html", "lotto-mobile.html", "lotto", "/lotto-mobile_files/"),
  fishing: page("Fishing", "fishing.html", "promotions/fishing-mobile.html", "fishing", "/fishing-mobile_files/"),
  "arcade-hot": { ...page("Arcade", "arcade/category/hot.html", "arcade/category/hot-mobile.html", "arcade", "/hot-mobile_files/"), activeHref: "/arcade/category/hot" },
  "arcade-askmeslot": page("Arcade", "arcade/provider/askmeslot_arcade.html", "arcade/provider/askmeslot_arcade-mobile.html", "arcade", "/askmeslot_arcade-mobile_files/"),
  "arcade-idnarcade": page("Arcade", "arcade/provider/idnarcade.html", "arcade/provider/idnarcade-mobile.html", "arcade", "/idnarcade-mobile_files/"),
  "arcade-ky": page("Arcade", "arcade/provider/ky_arcade.html", "arcade/provider/ky_arcade-mobile.html", "arcade", "/ky_arcade-mobile_files/"),
  "arcade-microgaming": page("Arcade", "arcade/provider/microgaming_arcade.html", "arcade/provider/microgaming_arcade-mobile.html", "arcade", "/microgaming_arcade-mobile_files/"),
  "arcade-minigame": page("Arcade", "arcade/provider/minigame.html", "arcade/provider/minigame-mobile.html", "arcade", "/minigame-mobile_files/"),
  "arcade-new": page("Arcade", "arcade/provider/new.html", "arcade/provider/new-mobile.html", "arcade", "/new-mobile_files/"),
  "arcade-original": page("Arcade", "arcade/provider/original.html", "arcade/provider/original-mobile.html", "arcade", "/original-mobile_files/"),
  "arcade-pragmaticplay": page("Arcade", "arcade/provider/pragmaticplay_arcade.html", "arcade/provider/pragmaticplay_arcade-mobile.html", "arcade", "/pragmaticplay_arcade-mobile_files/"),
  "arcade-spadegaming": page("Arcade", "arcade/provider/spadegaming_arcade.html", "arcade/provider/spadegaming_arcade-mobile.html", "arcade", "/spadegaming_arcade-mobile_files/"),
  "promotions-all": page("Promosi", "promotions/all.html", "promotions/all-mobile.html", "promotions", "/all-mobile_files/"),
  "promotions-casino": page("Promosi", "promotions/casino.html", "promotions/casino-mobile.html", "promotions", "/casino-mobile_files/"),
  "promotions-other": page("Promosi", "promotions/other.html", "promotions/other-mobile.html", "promotions", "/other-mobile_files/"),
  "promotions-slot": page("Promosi", "promotions/slot.html", "promotions/slot-mobile.html", "promotions", "/slot-mobile_files/"),
  "promotions-sportsbook": page("Promosi", "promotions/sportsbook.html", "promotions/sportsbook-mobile.html", "promotions", "/sportsbook-mobile_files/"),
  "leaderboard-providers": page("Leaderboard", "leaderboard/providers.html", "leaderboard/providers-mobile.html", "leaderboard", "/providers-mobile_files/"),
  "leaderboard-distributed": page("Leaderboard", "leaderboard/distributed.html", "leaderboard/distributed-mobile.html", "leaderboard", "/distributed-mobile_files/"),
  referral: page("Referral", "referral.html", "referral-mobile.html", "referral-info", "/referral-mobile_files/"),
  contact: page("Kontak", "contact.html", "contact-mobile.html", "contact", "/contact-mobile_files/"),
  register: page(undefined, "register.html", "register-mobile.html", "register", "/register-mobile_files/")
} satisfies Record<StaticSnapshotKey, StaticSnapshotConfig>;

const breadcrumbItems = [
  ["Eksklusif", "/exclusive", "eksklusif"],
  ["Sports+", "/sports", "sports+"],
  ["Slots", "/slot/category/hot", "slots"],
  ["Casino", "/casino", "casino"],
  ["Poker", "/poker", "poker"],
  ["Lotto", "/lotto/", "lotto"],
  ["Arcade", "/arcade/category/hot", "arcade"],
  ["Fishing", "/fishing", "fishing"],
  ["Promosi", "/promotions/all", "promosi"],
  ["Leaderboard", "/leaderboard/providers", "leaderboard"],
  ["Referral", "/referral", "referral"],
  ["Kontak", "/contact", "kontak"]
] satisfies Array<[string, string, string]>;

const projectRoot = process.cwd();

const sourceHtml: Record<StaticSource, string> = {
  "lotto.html": readFileSync(join(projectRoot, "html", "statis", "lotto.html"), "utf8"),
  "lotto-mobile.html": readFileSync(join(projectRoot, "html", "statis", "lotto-mobile.html"), "utf8"),
  "fishing.html": readFileSync(join(projectRoot, "html", "statis", "fishing.html"), "utf8"),
  "arcade/category/hot.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "category", "hot.html"), "utf8"),
  "arcade/category/hot-mobile.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "category", "hot-mobile.html"), "utf8"),
  "arcade/provider/askmeslot_arcade.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "askmeslot_arcade.html"), "utf8"),
  "arcade/provider/askmeslot_arcade-mobile.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "askmeslot_arcade-mobile.html"), "utf8"),
  "arcade/provider/idnarcade.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "idnarcade.html"), "utf8"),
  "arcade/provider/idnarcade-mobile.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "idnarcade-mobile.html"), "utf8"),
  "arcade/provider/ky_arcade.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "ky_arcade.html"), "utf8"),
  "arcade/provider/ky_arcade-mobile.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "ky_arcade-mobile.html"), "utf8"),
  "arcade/provider/microgaming_arcade.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "microgaming_arcade.html"), "utf8"),
  "arcade/provider/microgaming_arcade-mobile.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "microgaming_arcade-mobile.html"), "utf8"),
  "arcade/provider/minigame.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "minigame.html"), "utf8"),
  "arcade/provider/minigame-mobile.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "minigame-mobile.html"), "utf8"),
  "arcade/provider/new.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "new.html"), "utf8"),
  "arcade/provider/new-mobile.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "new-mobile.html"), "utf8"),
  "arcade/provider/original.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "original.html"), "utf8"),
  "arcade/provider/original-mobile.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "original-mobile.html"), "utf8"),
  "arcade/provider/pragmaticplay_arcade.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "pragmaticplay_arcade.html"), "utf8"),
  "arcade/provider/pragmaticplay_arcade-mobile.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "pragmaticplay_arcade-mobile.html"), "utf8"),
  "arcade/provider/spadegaming_arcade.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "spadegaming_arcade.html"), "utf8"),
  "arcade/provider/spadegaming_arcade-mobile.html": readFileSync(join(projectRoot, "html", "statis", "arcade", "provider", "spadegaming_arcade-mobile.html"), "utf8"),
  "promotions/all.html": readFileSync(join(projectRoot, "html", "statis", "promotions", "all.html"), "utf8"),
  "promotions/all-mobile.html": readFileSync(join(projectRoot, "html", "statis", "promotions", "all-mobile.html"), "utf8"),
  "promotions/casino.html": readFileSync(join(projectRoot, "html", "statis", "promotions", "casino.html"), "utf8"),
  "promotions/casino-mobile.html": readFileSync(join(projectRoot, "html", "statis", "promotions", "casino-mobile.html"), "utf8"),
  "promotions/fishing-mobile.html": readFileSync(join(projectRoot, "html", "statis", "promotions", "fishing-mobile.html"), "utf8"),
  "promotions/other.html": readFileSync(join(projectRoot, "html", "statis", "promotions", "other.html"), "utf8"),
  "promotions/other-mobile.html": readFileSync(join(projectRoot, "html", "statis", "promotions", "other-mobile.html"), "utf8"),
  "promotions/slot.html": readFileSync(join(projectRoot, "html", "statis", "promotions", "slot.html"), "utf8"),
  "promotions/slot-mobile.html": readFileSync(join(projectRoot, "html", "statis", "promotions", "slot-mobile.html"), "utf8"),
  "promotions/sportsbook.html": readFileSync(join(projectRoot, "html", "statis", "promotions", "sportsbook.html"), "utf8"),
  "promotions/sportsbook-mobile.html": readFileSync(join(projectRoot, "html", "statis", "promotions", "sportsbook-mobile.html"), "utf8"),
  "leaderboard/providers.html": readFileSync(join(projectRoot, "html", "statis", "leaderboard", "providers.html"), "utf8"),
  "leaderboard/providers-mobile.html": readFileSync(join(projectRoot, "html", "statis", "leaderboard", "providers-mobile.html"), "utf8"),
  "leaderboard/distributed.html": readFileSync(join(projectRoot, "html", "statis", "leaderboard", "distributed.html"), "utf8"),
  "leaderboard/distributed-mobile.html": readFileSync(join(projectRoot, "html", "statis", "leaderboard", "distributed-mobile.html"), "utf8"),
  "referral.html": readFileSync(join(projectRoot, "html", "statis", "referral.html"), "utf8"),
  "referral-mobile.html": readFileSync(join(projectRoot, "html", "statis", "referral-mobile.html"), "utf8"),
  "contact.html": readFileSync(join(projectRoot, "html", "statis", "contact.html"), "utf8"),
  "contact-mobile.html": readFileSync(join(projectRoot, "html", "statis", "contact-mobile.html"), "utf8"),
  "register.html": readFileSync(join(projectRoot, "html", "statis", "register.html"), "utf8"),
  "register-mobile.html": readFileSync(join(projectRoot, "html", "statis", "register-mobile.html"), "utf8")
};

export function DesktopStaticPageSnapshot({ pageKey, user }: { pageKey: StaticSnapshotKey } & AuthSnapshotProps) {
  const config = snapshotConfigs[pageKey];
  const mainHtml = readSourceSection(config.desktopSource, config.mainClass, false, config.activeHref);
  const footerHtml = readFooterText(config.desktopSource, false, config.activeHref);

  return (
    <div id={`__app-${pageKey}-desktop`}>
      <div id={`__layout-${pageKey}-desktop`}>
        <div className="layout--default layout--d snapshot-desktop-layout static-page-desktop-layout">
          <DesktopHeader user={user} />
          <DesktopMenu activeLabel={config.activeLabel} />
          <main>
            <div className="container">
              <RunningText />
              <StaticBreadcrumbs activeLabel={config.activeLabel} />
              <RawHtml html={mainHtml} />
            </div>
          </main>
          <RawHtml html={footerHtml} />
          <DesktopFooter />
          <DesktopQuickMenu />
          <DesktopFloatingLiveChat />
        </div>
      </div>
    </div>
  );
}

export function MobileStaticPageSnapshot({ pageKey, user }: { pageKey: StaticSnapshotKey } & AuthSnapshotProps) {
  const config = snapshotConfigs[pageKey];
  const source = config.mobileSource ?? config.desktopSource;
  const mainHtml = readSourceSection(source, config.mainClass, Boolean(config.forceMobileFromDesktop), config.activeHref);
  const footerHtml = readFooterText(source, Boolean(config.forceMobileFromDesktop), config.activeHref);

  return (
    <div id={`__app-${pageKey}-mobile`}>
      <div id={`__layout-${pageKey}-mobile`}>
        <div className="layout--default snapshot-mobile-layout static-page-mobile-layout">
          <MobileStaticHeader activeLabel={config.activeLabel} assetRoot={config.mobileAssetRoot} user={user} />
          <main>
            <div className="container">
              <RawHtml html={mainHtml} />
            </div>
          </main>
          <RawHtml html={footerHtml} />
          <MobileSnapshotFooter />
          <div className="top-observer" />
          <StaticMobileStickyFooter user={user} activePath={config.activeHref ?? ""} assetRoot={config.mobileAssetRoot} />
          <MobileFloatingLiveChat />
          <MobileQuickFloatingMenu />
        </div>
      </div>
    </div>
  );
}

function RawHtml({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function MobileStaticHeader({ activeLabel, assetRoot, user }: { activeLabel?: string; assetRoot: string } & AuthSnapshotProps) {
  if (user) {
    return <AuthenticatedMobileHeader user={user} assetRoot={assetRoot} activeLabel={activeLabel} links={breadcrumbItems.map(([label, href]) => [label, href])} />;
  }

  return (
    <header className="app-header surface">
      <div className="container--fluid">
        <div className="app-header__main">
          <div className="app-brand">
            <a href="/" className="app-link--active">
              <img src={`${assetRoot}logo.png`} alt="AGENOLX" loading="lazy" className="app-logo" />
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
              <button type="button" data-login-modal-trigger className="btn btn--accent">
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
                  aria-current={label === activeLabel ? "page" : undefined}
                  className={label === activeLabel ? "app-link--exact-active app-link--active" : ""}
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

function StaticBreadcrumbs({ activeLabel }: { activeLabel?: string }) {
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
              aria-current={label === activeLabel ? "page" : undefined}
              className={label === activeLabel ? "app-link--exact-active app-link--active" : ""}
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

function StaticMobileStickyFooter({ user, activePath, assetRoot }: AuthSnapshotProps & { activePath: string; assetRoot: string }) {
  if (user) {
    return <AuthenticatedMobileStickyFooter user={user} assetRoot={assetRoot} activePath={activePath} />;
  }

  const items = [
    ["Beranda", "/", "home-muted.df1f27a.svg", "link"],
    ["Daftar", "/register", "edit-muted.452594a.svg", "link"],
    ["Masuk", "/login", "login-muted.3774dfc.svg", "button"],
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
                  <img alt={label} src={`/index-mobile_files/${icon}`} className="brand-icon brand-icon--xs" /> <span>{label}</span>
                </a>
              ) : (
                <button type="button" data-login-modal-trigger className="btn">
                  <img alt={label} src={`/index-mobile_files/${icon}`} className="brand-icon brand-icon--xs" /> <span>{label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

function page(
  activeLabel: string | undefined,
  desktopSource: StaticSource,
  mobileSource: StaticSource | undefined,
  mainClass: string,
  mobileAssetRoot: string
): StaticSnapshotConfig {
  return { activeLabel, desktopSource, mobileSource, mainClass, mobileAssetRoot };
}

function readSourceSection(source: StaticSource, classToken: string, forceMobile = false, activeHref?: string) {
  const html = sourceHtml[source];
  const match = findSectionByClass(html, classToken);
  if (!match) throw new Error(`Main section ${classToken} not found in ${source}`);
  return sanitizeStaticHtml(match, forceMobile, activeHref);
}

function readFooterText(source: StaticSource, forceMobile = false, activeHref?: string) {
  const html = sourceHtml[source];
  const match = findSectionByClass(html, "footer-text");
  if (!match) return "";
  return sanitizeStaticHtml(match, forceMobile, activeHref);
}

function findSectionByClass(html: string, classToken: string) {
  const pattern = /<section\b[^>]*class="([^"]*)"[\s\S]*?<\/section>/g;
  for (const match of html.matchAll(pattern)) {
    const classes = match[1].split(/\s+/);
    if (classes.includes(classToken)) return match[0];
  }
  return undefined;
}

function sanitizeStaticHtml(html: string, forceMobile: boolean, activeHref?: string) {
  let output = html
    .replace(/https:\/\/agenolx\.com/g, "")
    .replace(/https:\/\/agenolxtoro\.com/g, "")
    .replace(/(href|src)="\.\/([^"]+)"/g, '$1="/$2"')
    .replace(/\s(?:onclick|onerror|onload|onmouseover|onmouseout)="[^"]*"/g, "")
    .replace(/\sfdprocessedid="[^"]*"/g, "");

  if (forceMobile) {
    output = output.replace(/\s+[a-z0-9_-]+--d\b/g, "");
  }

  if (activeHref) {
    output = activateStaticHref(output, activeHref);
  }

  if (output.includes("register-form-1")) {
    output = wireRegisterSnapshotForm(output);
  }

  return output;
}

function wireRegisterSnapshotForm(html: string) {
  const formMatch = html.match(/<form\b[^>]*class="[^"]*\bregister-form-1\b[^"]*"[\s\S]*?<\/form>/);
  if (!formMatch) return html;

  let inputIndex = 0;
  let wiredForm = formMatch[0]
    .replace(/<form\b([^>]*)>/, (_tag, attributes: string) => {
      let nextAttributes = attributes
        .replace(/\saction="[^"]*"/g, "")
        .replace(/\smethod="[^"]*"/g, "");
      nextAttributes += ' action="/api/auth/register" method="post"';
      return `<form${nextAttributes}>`;
    })
    .replace(/<input\b([^>]*)>/g, (tag, attributes: string) => {
      if (/\sname=/.test(attributes)) return tag;
      const name = `registerField${inputIndex}`;
      inputIndex += 1;
      return `<input name="${name}"${attributes}>`;
    })
    .replace(/<select\b([^>]*)>/g, (tag, attributes: string) => {
      if (/\sname=/.test(attributes)) return tag;
      return `<select name="paymentMethod" required onchange="this.form.dataset.paymentMethod=this.value;var bank=this.value==='bank';var money=this.value==='e-money';var b=this.form.querySelector('[data-payment-provider=bank]');var m=this.form.querySelector('[data-payment-provider=e-money]');var bs=this.form.querySelector('[name=bankCode]');var ms=this.form.querySelector('[name=eMoneyCode]');if(b)b.hidden=!bank;if(m)m.hidden=!money;if(bs)bs.disabled=!bank;if(ms)ms.disabled=!money"${attributes}>`;
    });

  wiredForm = renameRegisterInput(wiredForm, /(<div\b[^>]*class="[^"]*\binput-username\b[^"]*"[\s\S]*?<input\b)([^>]*)(>)/, "username");
  wiredForm = renameRegisterInput(wiredForm, /(<label>Password<\/label>[\s\S]*?<input\b)([^>]*)(>)/, "password");
  wiredForm = renameRegisterInput(wiredForm, /(<label>Masukkan kembali Password<\/label>[\s\S]*?<input\b)([^>]*)(>)/, "passwordConfirm");
  wiredForm = renameRegisterInput(wiredForm, /(<label>Kode Referral<\/label>[\s\S]*?<input\b)([^>]*)(>)/, "referralCode");
  wiredForm = renameRegisterInput(wiredForm, /(<div\b[^>]*class="[^"]*\binput-fullname\b[^"]*"[\s\S]*?<input\b)([^>]*)(>)/, "fullName");
  wiredForm = renameRegisterInput(wiredForm, /(<label>E-mail<\/label>[\s\S]*?<input\b)([^>]*)(>)/, "email");
  wiredForm = renameRegisterInput(wiredForm, /(<div\b[^>]*class="[^"]*\binput-phone\b[^"]*"[\s\S]*?<input\b)([^>]*)(>)/, "phone");
  wiredForm = injectRegisterPaymentDetails(wiredForm);
  wiredForm = removeRegisterCaptcha(wiredForm);
  wiredForm += registerPaymentControllerScript();

  return html.replace(formMatch[0], wiredForm);
}

function renameRegisterInput(html: string, pattern: RegExp, name: string) {
  return html.replace(pattern, (_match, prefix: string, attributes: string, suffix: string) => {
    const nextAttributes = attributes.replace(/\sname="[^"]*"/, "");
    return `${prefix} name="${name}"${nextAttributes}${suffix}`;
  });
}

function removeRegisterCaptcha(html: string) {
  return html.replace(
    /\s*<div\b(?=[^>]*(?:class="[^"]*\bcaptcha\b|data-fetch-key="data-v-431db275:0"))[^>]*[\s\S]*?(?:<!---->\s*)*(?=<button\b)/,
    ""
  )
    .replace(/\s*<button\b(?=[^>]*type="button")(?=[^>]*data-v-431db275)[\s\S]*?<\/button>\s*/g, "")
    .replace(/\s*<div\b(?=[^>]*class="[^"]*\bcaptcha__image\b)[\s\S]*?<\/div>\s*/g, "");
}

function injectRegisterPaymentDetails(html: string) {
  const marker = /(<select\b[^>]*name="paymentMethod"[\s\S]*?<\/select>[\s\S]*?<\/div>\s*<!---->\s*<\/div>)(?:\s*<!---->){2,4}/;
  return html.replace(marker, `$1${registerPaymentDetailsHtml()}`);
}

function registerPaymentDetailsHtml() {
  return `
    <div class="select__container input__container register-payment-provider" data-payment-provider="bank" hidden>
      <label>Bank</label>
      <div class="input__root">
        <select name="bankCode" required class="input input__select" disabled>
          <option disabled="disabled" value="">Pilih Bank</option>
          ${BANK_PROVIDERS.map((provider) => `<option value="${provider.code}">${provider.name}</option>`).join("")}
        </select>
        <i class="input__icon icon-bank icon--xs"></i>
        <i class="select__arrow icon-arrow-down icon--xs"></i>
      </div>
    </div>
    <div class="select__container input__container register-payment-provider" data-payment-provider="e-money" hidden>
      <label>E-money</label>
      <div class="input__root">
        <select name="eMoneyCode" required class="input input__select" disabled>
          <option disabled="disabled" value="">Pilih Akun</option>
          ${E_MONEY_PROVIDERS.map((provider) => `<option value="${provider.code}">${provider.name}</option>`).join("")}
        </select>
        <i class="input__icon icon-bank icon--xs"></i>
        <i class="select__arrow icon-arrow-down icon--xs"></i>
      </div>
    </div>
    <div class="input__container">
      <label>Nama Rekening</label>
      <div class="input__root">
        <input type="text" name="accountName" autocomplete="off" required class="input">
        <i class="input__icon icon-bank icon--xs"></i>
      </div>
    </div>
    <div class="alert alert--info">
      <i class="icon-info icon--lg"></i>
      <p>Nama rekening harus sama/sesuai dengan yang terdaftar pada rekening tersebut.</p>
    </div>
    <div class="input__container">
      <label>Nomor Rekening</label>
      <div class="input__root">
        <input type="text" name="accountNumber" autocomplete="off" required class="input">
        <i class="input__icon icon-bank icon--xs"></i>
      </div>
    </div>`;
}

function registerPaymentControllerScript() {
  return `<script>
    (() => {
      const form = document.currentScript?.previousElementSibling?.matches?.("form")
        ? document.currentScript.previousElementSibling
        : document.currentScript?.parentElement?.querySelector?.("form.register-form-1");
      if (!form) return;
      const method = form.querySelector('select[name="paymentMethod"]');
      const bank = form.querySelector('[data-payment-provider="bank"]');
      const eMoney = form.querySelector('[data-payment-provider="e-money"]');
      const bankSelect = form.querySelector('select[name="bankCode"]');
      const eMoneySelect = form.querySelector('select[name="eMoneyCode"]');
      const syncPaymentMethod = () => {
        const isBank = method?.value === "bank";
        const isEMoney = method?.value === "e-money";
        if (bank) bank.hidden = !isBank;
        if (eMoney) eMoney.hidden = !isEMoney;
        if (bankSelect) bankSelect.disabled = !isBank;
        if (eMoneySelect) eMoneySelect.disabled = !isEMoney;
      };
      method?.addEventListener("change", syncPaymentMethod);
      syncPaymentMethod();
    })();
  </script>`;
}

function activateStaticHref(html: string, activeHref: string) {
  return html.replace(/<a\b([^>]*)>/g, (tag, attributes: string) => {
    const hrefMatch = attributes.match(/\shref="([^"]*)"/);
    if (!hrefMatch) return tag;

    const isActive = hrefMatch[1] === activeHref;
    let nextAttributes = attributes
      .replace(/\saria-current="page"/g, "")
      .replace(/\sclass="([^"]*)"/g, (_classAttribute, classValue: string) => {
        const classes = classValue
          .split(/\s+/)
          .filter((className) => className && className !== "app-link--exact-active" && className !== "app-link--active");
        if (isActive) classes.push("app-link--exact-active", "app-link--active");
        return classes.length ? ` class="${classes.join(" ")}"` : "";
      });

    if (isActive && !/\sclass=/.test(nextAttributes)) {
      nextAttributes += ' class="app-link--exact-active app-link--active"';
    }

    if (isActive) {
      nextAttributes += ' aria-current="page"';
    }

    return `<a${nextAttributes}>`;
  });
}
