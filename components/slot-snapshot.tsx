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

export type SlotCategory = "hot" | "new" | "exclusive";

type SlotGame = {
  title: string;
  className: string;
  href: string;
  image: string;
  imageAlt: string;
  providerIcon: string;
  providerAlt: string;
};

const categoryMeta = {
  hot: { label: "Hot", icon: "hot.svg", iconClass: "icon-hot" },
  new: { label: "New", icon: "new.svg", iconClass: "icon-new" },
  exclusive: { label: "Exclusive", icon: "exclusive.svg", iconClass: "icon-exclusive" }
} satisfies Record<SlotCategory, { label: string; icon: string; iconClass: string }>;

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

const slotProviders = [
  ["Hot", "/slot/category/hot", "hot.svg", ""],
  ["Exclusive", "/slot/category/exclusive", "exclusive.svg", ""],
  ["New", "/slot/category/new", "new.svg", ""],
  ["Stream n'Spin", "/sns", "idnsns.svg", "provider--live"],
  ["IDNSLOT", "/slot/provider/idnslotdirect", "idnslotdirect.svg", "provider--promo"],
  ["PragmaticPlay", "/slot/provider/pragmaticplay", "pragmaticplay.svg", "provider--promo"],
  ["Slot Mania", "/slot/provider/slotmania", "slotmania.svg", "provider--promo"],
  ["PP POP", "/slot/provider/pp-pop", "pp-pop.svg", "provider--promo"],
  ["PG Soft", "/slot/provider/pgsoft", "pgsoft.svg", ""],
  ["Microgaming", "/slot/provider/microgaming", "microgaming.svg", "provider--promo"],
  ["Nolimit City", "/slot/provider/evolution-nlc", "evolution-nlc.svg", "provider--promo"],
  ["Habanero", "/slot/provider/habanero", "habanero.svg", "provider--promo"],
  ["5G Games", "/slot/provider/5g", "5g.svg", ""],
  ["Spadegaming", "/slot/provider/spadegaming_slot", "spadegaming_slot.svg", "provider--promo"],
  ["JILI", "/slot/provider/jili", "jili.svg", "provider--new"],
  ["Playtech", "/slot/provider/playtech_slot", "playtech_slot.svg", "provider--promo"],
  ["PlayStar", "/slot/provider/playstar", "playstar.svg", ""],
  ["TTG", "/slot/provider/ttg", "ttg.svg", ""],
  ["Amigo Gaming", "/slot/provider/amigo", "amigo.svg", "provider--new"],
  ["ShadyLady", "/slot/provider/shadylady", "shadylady.svg", ""],
  ["Combo Slots", "/slot/provider/comboslots", "comboslots.svg", ""],
  ["FastSpin", "/slot/provider/fastspin", "fastspin.svg", "provider--promo"],
  ["YGR", "/slot/provider/ygr_slots", "ygr_slots.svg", ""],
  ["Penguin King", "/slot/provider/penguin_king", "penguin_king.svg", ""],
  ["PP 98% RTP", "/slot/provider/pragmaticplay98", "pragmaticplay98.svg", "provider--promo"],
  ["Level Up", "/slot/category/level-up", "level-up.svg", "provider--promo"],
  ["Spin Royal", "/slot/category/spin-royal", "spin-royal.svg", "provider--promo"],
  ["Play'n Go", "/slot/provider/playngo", "playngo.svg", ""],
  ["CQ9", "/slot/provider/cq9", "cq9.svg", ""],
  ["Yggdrasil", "/slot/provider/yggdrasil", "yggdrasil.svg", ""],
  ["BNG", "/slot/provider/bng", "bng.svg", ""],
  ["Askmeslot", "/slot/provider/askmeslot_slot", "askmeslot_slot.svg", ""],
  ["VPlus", "/slot/provider/vplus", "vplus.svg", ""],
  ["BigPot", "/slot/provider/bigpot", "bigpot.svg", ""],
  ["Reevo", "/slot/provider/reevo", "reevo.svg", ""],
  ["Bgaming", "/slot/provider/bgaming", "bgaming.svg", ""],
  ["RedTiger", "/slot/provider/evolution-redtiger", "evolution-redtiger.svg", ""],
  ["NetEnt", "/slot/provider/evolution-netent", "evolution-netent.svg", ""],
  ["SimplePlay", "/slot/provider/simpleplay", "simpleplay.svg", ""],
  ["GMW", "/slot/provider/gmw", "gmw.svg", ""],
  ["Apparat", "/slot/provider/apparat", "apparat.svg", ""],
  ["Booming", "/slot/provider/booming_games", "booming_games.svg", ""],
  ["Live22", "/slot/provider/live_22", "live_22.svg", ""],
  ["BTG", "/slot/provider/evolution-btg", "evolution-btg.svg", ""],
  ["SBOBET", "/slot/provider/sboslots", "sboslots.svg", "provider--new"],
  ["KY", "/slot/provider/ky_slots", "ky_slots.svg", ""],
  ["Buy Bonus", "/slot/category/buy-bonus", "buy-bonus.svg", ""],
  ["Table", "/slot/category/table", "table.svg", ""],
  ["Megaways", "/slot/category/megaways", "megaways.svg", ""]
] satisfies Array<[string, string, string, string]>;

const footerText =
  "Agenolx menyediakan sangat banyak pilihan slot bagi pemain-pemain kami. Kami juga bekerja sama dengan provider-provider slot terkemuka yang dapat anda mainkan di situs kami. Dengan akun yang telah anda daftar, anda dapat bermain di seluruh permainan slot di situs kami. Bosan dengan slot tema tertentu? Jelajahi tema slot lainnya dan temukan keseruan di berbagai macam tema. Jika anda menyukai permainan slot, jangan lupa untuk menggunakan promo slot kami yang tersedia. Selamat bermain dan semoga beruntung!";

export function DesktopSlotSnapshot({ category, user }: { category: SlotCategory } & AuthSnapshotProps) {
  const assetRoot = assetRootFor(category, false);
  const games = readSlotGames(category, false);

  return (
    <div id={`__app-slot-${category}-desktop`}>
      <div id={`__layout-slot-${category}-desktop`}>
        <div className="layout--default layout--d snapshot-desktop-layout slot-desktop-layout">
          <DesktopHeader user={user} />
          <DesktopMenu activeLabel="Slots" />
          <main>
            <div className="container">
              <RunningText />
              <SlotBreadcrumbs />
              <SlotContent category={category} assetRoot={assetRoot} games={games} desktop />
            </div>
          </main>
          <DesktopSlotFooterText />
          <DesktopFooter />
          <DesktopQuickMenu />
          <DesktopFloatingLiveChat />
        </div>
      </div>
    </div>
  );
}

export function MobileSlotSnapshot({ category, user }: { category: SlotCategory } & AuthSnapshotProps) {
  const assetRoot = assetRootFor(category, true);
  const games = readSlotGames(category, true);

  return (
    <div id={`__app-slot-${category}-mobile`}>
      <div id={`__layout-slot-${category}-mobile`}>
        <div className="layout--default snapshot-mobile-layout slot-mobile-layout">
          <MobileSlotHeader user={user} assetRoot={assetRoot} />
          <main>
            <div className="container">
              <SlotContent category={category} assetRoot={assetRoot} games={games} />
            </div>
          </main>
          <MobileSlotFooterText />
          <MobileSnapshotFooter />
          <div className="top-observer" />
          <SlotMobileStickyFooter user={user} assetRoot={assetRoot} />
          <MobileFloatingLiveChat />
          <MobileQuickFloatingMenu />
        </div>
      </div>
    </div>
  );
}

function SlotContent({ category, assetRoot, games, desktop = false }: { category: SlotCategory; assetRoot: string; games: SlotGame[]; desktop?: boolean }) {
  const visibleCategory = desktop && category === "hot" ? "exclusive" : category;

  return (
    <section className={`slot${desktop ? " slot--d" : ""}`}>
      {desktop ? <DesktopProviderNav category={visibleCategory} assetRoot={assetRoot} /> : <MobileSearchHeader assetRoot={assetRoot} />}
      <div className="slot__container">
        {desktop ? <DesktopSlotHeader category={visibleCategory} /> : <MobileProviderCarousel category={category} assetRoot={assetRoot} />}
        <div className="slot-content">
          <ul className="games-grid">
            {games.map((game, index) => (
              <SlotGameCard game={game} key={`${game.title}-${index}`} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function DesktopProviderNav({ category, assetRoot }: { category: SlotCategory; assetRoot: string }) {
  const desktopProviders = slotProviders.filter(([label]) => label !== "JILI");

  return (
    <nav className="games-nav--d">
      <ul className="games-nav--d__links">
        {desktopProviders.map(([label, href, icon, badge]) => (
          <li className={`games-nav--d__item${badge === "provider--promo" ? " games-nav--d__item--promo" : ""}${badge === "provider--new" ? " games-nav--d__item--new" : ""}`} key={label}>
            <a href={href} aria-current={isActiveProvider(label, category) ? "page" : undefined} className={isActiveProvider(label, category) ? "app-link--exact-active app-link--active" : ""}>
              <img src={`${assetRoot}${icon}`} alt={label} /> <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function DesktopSlotHeader({ category }: { category: SlotCategory }) {
  const meta = categoryMeta[category];
  return (
    <header className="slot-content__header">
      <div className="slot-content__active">
        <i className={`${meta.iconClass} icon--2x`} /> <span>{meta.label}</span>
      </div>
      <SlotSearchForm />
    </header>
  );
}

function MobileSearchHeader({ assetRoot }: { assetRoot: string }) {
  return (
    <div className="search-header">
      <div className="search-header__label">
        <img alt="" src={`${assetRoot}slots.0bfdbc0.svg`} className="brand-icon brand-icon--sm" /> <span>Slots</span>
      </div>
      <div className="search-header__content">
        <SlotSearchForm />
      </div>
    </div>
  );
}

function SlotSearchForm() {
  return (
    <div className="slot-game-search">
      <form>
        <div className="input--search input__container">
          <div className="input__root">
            <input type="text" autoComplete="off" placeholder="Cari permainan" className="input" />
            <i className="input__icon input__icon--search icon-search icon--md" />
          </div>
        </div>
        <button type="submit" className="btn btn--brand">
          Cari
        </button>
      </form>
    </div>
  );
}

function MobileProviderCarousel({ category, assetRoot }: { category: SlotCategory; assetRoot: string }) {
  const groups = chunk(slotProviders, 15);
  return (
    <article className="card card--full card--light">
      <div className="card__body">
        <div className="carousel slot-carousel">
          <div className="carousel__control carousel__prev highlight carousel__control--disabled">
            <i className="icon-arrow-left icon--sm" />
          </div>
          <div className="carousel__inner">
            <div className="carousel__container transition" style={{ transform: "translateX(0px)" }}>
              {groups.map((group, index) => (
                <div className="slot-carousel__group slot-carousel__group--ud" key={index}>
                  {group.map(([label, href, icon, badge]) => (
                    <a href={href} aria-current={isActiveProvider(label, category) ? "page" : undefined} className={`slot-carousel__item${isActiveProvider(label, category) ? " app-link--exact-active app-link--active" : ""}`} key={label}>
                      <div className={`slot-carousel__img-container${badge ? ` ${badge}` : ""}`}>
                        <img src={`${assetRoot}${icon}`} alt={label} />
                      </div>
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__control carousel__next highlight">
            <i className="icon-arrow-right icon--sm" />
          </div>
        </div>
      </div>
    </article>
  );
}

function SlotGameCard({ game }: { game: SlotGame }) {
  return (
    <li title={game.title} className={game.className}>
      <a href={game.href} target="_blank">
        <div className="game-item game-item--slot">
          <img loading="lazy" src={game.image} alt={game.imageAlt} className="game-item__img" style={{ opacity: 1 }} />
          <div className="game-item__provider" style={{ opacity: 1 }}>
            <div>
              <img src={game.providerIcon} alt={game.providerAlt} />
            </div>
          </div>
        </div>
        <span className="game-item__name">{game.title}</span>
      </a>
    </li>
  );
}

function MobileSlotHeader({ user, assetRoot }: AuthSnapshotProps & { assetRoot: string }) {
  if (user) {
    return <AuthenticatedMobileHeader user={user} assetRoot={assetRoot} activeLabel="Slots" links={breadcrumbItems.map(([label, href]) => [label, href])} />;
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
                  aria-current={label === "Slots" ? "page" : undefined}
                  className={label === "Slots" ? "app-link--exact-active app-link--active" : ""}
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

function SlotBreadcrumbs() {
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
              aria-current={label === "Slots" ? "page" : undefined}
              className={label === "Slots" ? "app-link--exact-active app-link--active" : ""}
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

function DesktopSlotFooterText() {
  return <section className="footer-text footer-text--d" />;
}

function MobileSlotFooterText() {
  return (
    <section className="footer-text">
      <div className="footer-text__container">
        <article>
          <p>{footerText}</p>
        </article>
        <button type="button">Baca lebih</button>
      </div>
    </section>
  );
}

function SlotMobileStickyFooter({ user, assetRoot }: AuthSnapshotProps & { assetRoot: string }) {
  if (user) {
    return <AuthenticatedMobileStickyFooter user={user} assetRoot={assetRoot} activePath="/slot/category/hot" />;
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
                  <img alt={label} src={`${assetRoot}${icon}`} className="brand-icon brand-icon--xs" /> <span>{label}</span>
                </a>
              ) : (
                <button type="button" data-login-modal-trigger className="btn">
                  <img alt={label} src={`${assetRoot}${icon}`} className="brand-icon brand-icon--xs" /> <span>{label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

function assetRootFor(category: SlotCategory, mobile: boolean) {
  return `/${category}${mobile ? "-mobile" : ""}_files/`;
}

function sourceFileFor(category: SlotCategory, mobile: boolean) {
  return join(process.cwd(), "html", "statis", "slot", "category", `${category}${mobile ? "-mobile" : ""}.html`);
}

function readSlotGames(category: SlotCategory, mobile: boolean): SlotGame[] {
  const html = readFileSync(sourceFileFor(category, mobile), "utf8");
  const games: SlotGame[] = [];
  const pattern = /<li[^>]*title="([^"]*)"[^>]*class="([^"]*game-item__wrapper[^"]*)"[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*class="game-item__img"[\s\S]*?<div[^>]*class="game-item__provider"[\s\S]*?<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"/g;
  for (const match of html.matchAll(pattern)) {
    games.push({
      title: decodeHtml(match[1]),
      className: decodeHtml(match[2]),
      href: localizeHref(decodeHtml(match[3])),
      image: localizeAsset(decodeHtml(match[4])),
      imageAlt: decodeHtml(match[5]),
      providerIcon: localizeAsset(decodeHtml(match[6])),
      providerAlt: decodeHtml(match[7])
    });
  }
  return games;
}

function localizeHref(href: string) {
  return href.replace("https://agenolxtoro.com", "");
}

function localizeAsset(src: string) {
  if (src.startsWith("./")) return `/${src.slice(2)}`;
  return src;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, "\u00a0");
}

function isActiveProvider(label: string, category: SlotCategory) {
  return label.toLowerCase() === categoryMeta[category].label.toLowerCase();
}

function chunk<T>(items: T[], size: number) {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) result.push(items.slice(index, index + size));
  return result;
}
