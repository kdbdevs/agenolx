import { snapshotFooterPartners, snapshotPaymentMethods } from "./mobile-home-snapshot";

import { AuthenticatedDesktopUserWidget, type AuthSnapshotProps } from "@/components/authenticated-chrome";
import { brand } from "@/lib/content";

const D = "/index_files/";

const desktopMenu = [
  ["Eksklusif", "/exclusive", "exclusive.ab7549b.svg"],
  ["Sports+", "/sports", "sports.92624ce.svg"],
  ["Slots", "/slot/category/hot", "slots.0bfdbc0.svg"],
  ["Casino", "/casino", "casino.c79b5be.svg"],
  ["Poker", "/poker", "poker.308b1f0.svg"],
  ["Lotto", "/lotto/", "lotto.dbcbcac.svg"],
  ["Arcade", "/arcade/category/hot", "arcade.98c6117.svg"],
  ["Fishing", "/fishing", "fishing.2e7df1a.svg"],
  ["Promosi", "/promotions/all", "promo.4108971.svg"],
  ["Leaderboard", "/leaderboard/providers", "leaderboard.d4577d8.svg"],
  ["Referral", "/referral", "referral.ffa5ea8.svg"],
  ["Kontak", "/contact", "chat.022cca6.svg"]
] satisfies Array<[string, string, string]>;

const desktopBreadcrumbs = [
  ["Beranda", "/"],
  ...desktopMenu.slice(0, 9).map(([label, href]) => [label, href] as [string, string])
] satisfies Array<[string, string]>;

const homeSlides = [
  "15832_6a74a1e33601a6.21692027.webp",
  "15832_6a4f9d3ccd8743.52225734.webp",
  "15832_6a6ed7e634f0e1.34682258.webp",
  "15832_6a6ed7fa556621.71158349.webp",
  "15832_6a3d2015288013.41221984.webp",
  "promotion_banner_705_.webp",
  "promotion_banner_574_.webp",
  "promotion_banner_575_.webp",
  "promotion_banner_589_.webp",
  "promotion_banner_566_.webp",
  "promotion_banner_588_.webp",
  "promotion_banner_698_.webp",
  "promotion_banner_704_.webp",
  "promotion_banner_710_.webp",
  "promotion_banner_712_.webp"
];

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
  ["Amigo Gaming", "/slot/provider/amigo", "amigo.svg", "provider--new"],
  ["Playtech", "/slot/provider/playtech_slot", "playtech_slot.svg", "provider--promo"],
  ["PlayStar", "/slot/provider/playstar", "playstar.svg", ""],
  ["TTG", "/slot/provider/ttg", "ttg.svg", ""],
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
  ["Megaways", "/slot/category/megaways", "megaways.svg", ""],
  ["Fishing", "/fishing", "fishing.svg", ""]
] satisfies Array<[string, string, string, string]>;

const hotSlots = [
  ["5 Lucky Lions", "thumbnail.webp", "habanero.svg", "game--promo"],
  ["More Monkeys", "thumbnail(1).webp", "ttg.svg", ""],
  ["Frogs N Flies", "thumbnail(2).webp", "ttg.svg", ""],
  ["Almighty Zeus Empire", "thumbnail(3).webp", "microgaming.svg", "game--promo"],
  ["Super Win", "thumbnail(4).webp", "playstar.svg", ""],
  ["The Great Safari", "thumbnail(5).webp", "fastspin.svg", "game--promo"],
  ["Laughing Buddha Level UP", "thumbnail(6).webp", "habanero.svg", "game--promo game--special"],
  ["Adventure To The West", "thumbnail(7).webp", "fastspin.svg", "game--promo"],
  ["Spaceman™", "thumbnail(8).webp", "pragmaticplay.svg", ""],
  ["Gold Volcano", "thumbnail(9).webp", "playngo.svg", ""],
  ["Charlie Chance in Hell to Pay", "thumbnail(10).webp", "playngo.svg", ""],
  ["Book of Xerxes", "thumbnail(11).webp", "apparat.svg", ""]
] satisfies Array<[string, string, string, string]>;

const topTables = [
  ["Baccarat 2", "thumbnail(12).webp", "IDNLIVE"],
  ["24Dspin", "thumbnail(13).webp", "IDNLIVE"],
  ["IDN 4 Stand", "thumbnail(14).webp", "IDNLIVE"],
  ["Blackjack VIP", "thumbnail(15).webp", "LuckyStreak"],
  ["Auto Mega Roulette", "thumbnail(16).webp", "Pragmatic Play"],
  ["Speed Auto Roulette", "thumbnail(17).webp", "Pragmatic Play"],
  ["Turkish Mega Roulette", "thumbnail(18).webp", "Pragmatic Play"],
  ["Indonesian BlackjackX 1", "thumbnail(19).webp", "Pragmatic Play"],
  ["Istanbul Roulette", "thumbnail(20).webp", "Microgaming Live"],
  ["Blackjack Calgary", "thumbnail(21).webp", "Microgaming Live"],
  ["FashionTV X-Beat Roulette", "thumbnail(22).webp", "Microgaming Live"],
  ["Blackjack Niagara Falls", "thumbnail(23).webp", "Microgaming Live"]
] satisfies Array<[string, string, string]>;

const casinoLobby = [
  ["Live - Lobby", "thumbnail(24).webp", "Pragmatic Play", "218", "", ""],
  ["IDN Live New Lobby", "thumbnail(25).webp", "IDNLIVE", "54", "Spesial", " casino-game--new casino-game--special"],
  ["Live Mania Lobby", "thumbnail(26).webp", "Live Mania", "", "Promosi", " casino-game--promo casino-game--new"],
  ["Live - Lobby", "thumbnail(27).webp", "Evolution", "263", "Promosi", " casino-game--promo"]
] satisfies Array<[string, string, string, string, string, string]>;

const arcadeProviders = [
  ["Hot", "/arcade/category/hot", "hot(1).svg", ""],
  ["IDNArcade", "/arcade/provider/idnarcade", "idnarcade.svg", ""],
  ["PragmaticPlay", "/arcade/provider/pragmaticplay_arcade", "pragmaticplay_arcade.svg", ""],
  ["Minigame", "/arcade/provider/minigame", "minigame.svg", ""],
  ["Askmeslot", "/arcade/provider/askmeslot_arcade", "askmeslot_arcade.svg", ""],
  ["Kong Original", "/arcade/provider/originals", "originals.svg", "idnplay.svg"],
  ["Microgaming", "/arcade/provider/microgaming_arcade", "microgaming_arcade.svg", ""],
  ["Spadegaming", "/arcade/provider/spadegaming_arcade", "spadegaming_arcade.svg", ""],
  ["KY", "/arcade/provider/ky_arcade", "ky_arcade.svg", ""],
  ["New", "/arcade/category/new", "new(1).svg", ""]
] satisfies Array<[string, string, string, string]>;

const arcadeGames = [
  ["Chicken+", "thumbnail(28).webp", "idnarcade.svg"],
  ["Dream Baccarat", "thumbnail(29).webp", "idnarcade.svg"],
  ["Limbo+", "thumbnail(30).webp", "idnarcade.svg"],
  ["Goal Win", "thumbnail(31).webp", "idnarcade.svg"],
  ["Mines", "thumbnail(32).webp", "idnarcade.svg"],
  ["Spaceman", "thumbnail(33).webp", "pragmaticplay_arcade.svg"]
] satisfies Array<[string, string, string]>;

const promos = [
  ["Spin Royal Turnamen & Cashdrop", "thumbnail_589_.webp"],
  ["Golden Crown Showdown", "thumbnail_698_.webp"],
  ["Carnival", "thumbnail_588_.webp"],
  ["MG Turnamen & Cashdrop Almighty Zeus Spin Royal", "thumbnail_710_.webp"],
  ["Level Up Game Rewards", "thumbnail_567_.webp"],
  ["PP - August Game Exclusive", "thumbnail_712_.webp"]
] satisfies Array<[string, string]>;

const exclusiveTiles = [
  ["IDNSLOT", "idnslot.webp"],
  ["IDN Live", "idnlive.webp"],
  ["IDN Poker", "idnpoker.webp"],
  ["IDN Arcade", "idnarcade.webp"],
  ["Slot Mania", "slotmania.webp"],
  ["Live Mania", "livemania.webp"]
] satisfies Array<[string, string]>;

export function DesktopHomeSnapshot({ user }: AuthSnapshotProps = {}) {
  return (
    <div id="__app-desktop">
      <div id="__layout-desktop">
        <div className="layout--default layout--d snapshot-desktop-layout">
          <DesktopHeader user={user} />
          <DesktopMenu />
          <main>
            <div className="container">
              <RunningText />
              <section className="home home--d">
                <HomeCarousel />
                <IdnCarousel />
                <Teaser user={user} />
                <BreadcrumbRail />
                <SlotProviderRail />
                <GameSection title="Hot Slots" href="/slot/category/hot" icon="hot-muted.0c60698.svg" games={hotSlots} />
                <TopTablesSection />
                <SnsBanner />
                <CasinoSection />
                <ArcadeProviderRail />
                <ArcadeShowcase />
                <ImageCard title="Sports+" href="/sports" icon="sports-muted.aba62f9.svg" image="sport.png" cta="Main Sports+" />
                <ExclusiveSection />
                <PromoSection />
                <ImageCard title="Lotto" href="/lotto" icon="lotto-muted.42a4023.svg" image="lotto.png" cta="Main Lotto" />
                <ImageCard title="Poker" href="/poker" icon="poker-muted.a0c9bb9.svg" image="poker.png" cta="Main Poker" />
                <ImageCard title="Fishing" href="/fishing" icon="fishing-muted.3bbc777.svg" image="fishing.png" cta="Main Fishing" />
              </section>
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

export function DesktopHeader({ user, activeDeposit = false }: AuthSnapshotProps & { activeDeposit?: boolean } = {}) {
  return (
    <header className="app-header surface app-header--d">
      <button className="app-button btn drawer__toggle drawer__toggle--d agen-menu-btn" type="button">
        <i className="icon-bars icon--lg" /> <span>Menu</span>
      </button>
      <div className="container--fluid">
        <div className="app-header__main">
          <div className="app-brand">
            <a href="/" aria-current="page" className="app-link--exact-active app-link--active">
              <img src={brand.logo} alt={brand.name} loading="lazy" className="app-logo" />
            </a>
          </div>
          <div className="app-header__widgets">
            <a href="https://multi-chat.info/go-tg?i=agenolx" target="_blank" className="btn btn--flex btn--sm agen-telegram-btn desktop-home__telegram">
              <i className="icon-telegram icon--md" /> <span>Main di Telegram</span>
            </a>
            {user ? (
              <AuthenticatedDesktopUserWidget user={user} activeDeposit={activeDeposit} />
            ) : (
              <div className="app-header__auth">
                <div className="login-inline">
                  <a href="/forgot-password">Lupa Password?</a>
                  <form className="login-inline__form" action="/api/auth/login" method="post">
                    <div className="input__container">
                      <div className="input__root">
                        <input name="username" type="text" autoComplete="username" placeholder="Username" className="input input--inverse" />
                        <i className="input__icon icon-username icon--xs" />
                      </div>
                    </div>
                    <div className="input__container input__password">
                      <div className="input__root">
                        <input name="password" type="password" autoComplete="current-password" placeholder="Password" className="input input--inverse" />
                        <button type="button" className="input__icon input__icon--pv btn--flex">
                          <i className="icon-eye-slash icon--md" />
                        </button>
                        <i className="input__icon icon-key icon--xs" />
                      </div>
                    </div>
                    <div className="input-confirm">
                      <label htmlFor="kli-inline-desktop" className="input-confirm__label">
                        <i className="icon-square icon--md" /> <span>Tetap masuk</span>
                      </label>
                      <input id="kli-inline-desktop" name="remember" type="checkbox" />
                    </div>
                    <button type="submit" className="btn btn--accent btn--loading">
                      <span>Masuk</span>
                    </button>
                  </form>
                </div>
                <a href="/register" className="btn btn--brand btn--flex">
                  Daftar
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function DesktopMenu({ activeLabel }: { activeLabel?: string } = {}) {
  return (
    <nav className="app-menu app-menu--d app-menu--primary">
      <ul>
        <li data-pos="start" className="app-menu__observer" />
        {desktopMenu.map(([label, href, icon]) => (
          <li className="app-menu__item app-menu__item--font-large" key={label}>
            <a href={href} className={label === activeLabel ? "app-link--exact-active app-link--active" : undefined}>
              <img alt={label} src={`${D}${icon}`} className="brand-icon brand-icon--active brand-icon--md" /> <span>{label}</span>
            </a>
          </li>
        ))}
        <li data-pos="end" className="app-menu__observer" />
      </ul>
    </nav>
  );
}

export function RunningText() {
  return (
    <div className="running-text running-text--d running-text--light">
      <i className="icon-volume icon--md" />
      <div className="snapshot-marquee">
        <span className="snapshot-marquee__inner">Selamat datang di Pemulabet! Silahkan masuk atau daftar jika anda belum memiliki akun. Jadi pemenang berikutnya dan rasakan keseruan bermain di Pemulabet!</span>
      </div>
    </div>
  );
}

function HomeCarousel() {
  return (
    <div className="home-carousel">
      <div dir="ltr" className="slick-slider slick-initialized">
        <div className="slick-list">
          <div className="slick-track">
            <div tabIndex={-1} data-index="0" aria-hidden="false" className="slick-slide slick-active slick-current">
              <div>
                <a href="/promotions/all/g705" style={{ width: "100%", display: "inline-block" }}>
                  <img src={`${D}promotion_banner_705_.webp`} alt="PEMULABET" loading="lazy" className="slide" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <ul className="slick-dots">
          {homeSlides.map((slide, index) => (
            <li className={slide === "promotion_banner_705_.webp" ? "slick-active" : undefined} key={slide}>
              <button>{index + 1}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function IdnCarousel() {
  return (
    <div className="idn-carousel home--columns-1">
      <div dir="ltr" className="slick-slider slick-initialized">
        <div className="slick-list">
          <div className="slick-track">
            <div tabIndex={-1} data-index="1" aria-hidden="false" className="slick-slide slick-active slick-current">
              <div>
                <a className="idn-carousel__slide" href="/casino">
                  <img src={`${D}idn-live.jpg`} alt="IDN Live" loading="lazy" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <ul className="slick-dots">
          <li>
            <button>1</button>
          </li>
          <li className="slick-active">
            <button>2</button>
          </li>
          <li>
            <button>3</button>
          </li>
        </ul>
      </div>
      <div className="idn-carousel__special">
        <span>Spesial</span>
      </div>
    </div>
  );
}

function Teaser({ user }: AuthSnapshotProps = {}) {
  if (user) {
    return (
      <div className="home__teaser">
        <a href="/promotions/all" className="btn btn--flex btn--accent-secondary">
          <i className="icon-promo icon--md" /> <span>Promosi</span>
        </a>
        <a href="/user/history" className="btn btn--flex btn--brand">
          <i className="icon-history icon--md" /> <span>Histori</span>
        </a>
        <a href="/deposit" className="app-button btn btn--success btn--flex">
          <i className="icon-deposit icon--md" /> <span>Deposit</span>
        </a>
      </div>
    );
  }

  return (
    <div className="home__teaser">
      <a href="/promotions/all" className="btn btn--flex btn--accent-secondary">
        <i className="icon-promo icon--md" /> <span>Promosi</span>
      </a>
      <a href="/register" className="btn btn--flex btn--brand">
        <i className="icon-register icon--md" /> <span>Daftar</span>
      </a>
      <button className="app-button btn btn--accent btn--flex" type="button" data-login-modal-trigger>
        <i className="icon-login icon--md" /> <span>Masuk</span>
      </button>
    </div>
  );
}

function BreadcrumbRail() {
  return (
    <nav className="app-breadcrumbs home--full-width app-breadcrumbs--d">
      <ul>
        <li data-pos="start" className="nav-observer" />
        {desktopBreadcrumbs.map(([label, href], index) => (
          <li className={`nav-item${index === 0 ? " nav-item--home" : ""}`} key={label}>
            <a href={href} className={index === 0 ? "app-link--exact-active app-link--active" : undefined}>
              {label}
            </a>
          </li>
        ))}
        <li data-pos="end" className="nav-observer" />
      </ul>
    </nav>
  );
}

function SlotProviderRail() {
  const providerGroups = Array.from({ length: Math.ceil(slotProviders.length / 8) }, (_, index) =>
    slotProviders.slice(index * 8, index * 8 + 8)
  );

  return (
    <article className="card card--slot-carousel card--d card--inline card--light home--full-width">
      <div className="card__title">
        <a href="/slot/category/hot">
          <img alt="Slots" src={`${D}slots-muted.a305ba0.svg`} className="brand-icon brand-icon--md" /> <span>Slots</span>
        </a>
      </div>
      <div className="card__body">
        <div className="carousel slot-carousel carousel--d slot-carousel--d">
          <div className="carousel__control carousel__prev carousel__control--disabled">
            <i className="icon-arrow-left icon--sm" />
          </div>
          <div className="carousel__inner">
            <div className="carousel__container transition">
              {providerGroups.map((group, groupIndex) => (
                <div className="slot-carousel__group slot-carousel__group--ud" key={groupIndex}>
                  {group.map(([label, href, icon, badge]) => (
                    <a href={href} className="slot-carousel__item" key={label}>
                      <div className={`slot-carousel__img-container${badge ? ` ${badge}` : ""}`}>
                        <img src={`${D}${icon}`} alt={label} />
                      </div>
                      <span>{label}</span>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="carousel__control carousel__next">
            <i className="icon-arrow-right icon--sm" />
          </div>
        </div>
      </div>
      <a href="/slot/category/hot" className="btn--flex btn--sm card__see-all">
        Lihat semua
      </a>
    </article>
  );
}

function SectionHeader({ title, href, icon }: { title: string; href: string; icon: string }) {
  return (
    <header className="card__header">
      <div className="card__title">
        <a href={href}>
          <img alt={title} src={`${D}${icon}`} className="brand-icon brand-icon--md" /> <span>{title}</span>
        </a>
      </div>
      <a href={href} className="btn--sm btn--flex card__see-all">
        Lihat semua
      </a>
    </header>
  );
}

function GameSection({ title, href, icon, games }: { title: string; href: string; icon: string; games: typeof hotSlots }) {
  return (
    <article className="card home--full-width card--d card--full-alt card--light">
      <SectionHeader title={title} href={href} icon={icon} />
      <div className="card__body">
        <section className="slot-showcase">
          <div />
          <ul className="slot-showcase__grid">
            {games.map(([title, image, provider, flags]) => (
              <li title={title} className={`game-item__wrapper ${flags} game-item--normal-view`} key={title}>
                <a href={href} target="_blank">
                  <div className="game-item game-item--slot">
                    <img loading="lazy" src={`${D}${image}`} alt={title} className="game-item__img" style={{ opacity: 1 }} />
                    <div className="game-item__provider" style={{ opacity: 1 }}>
                      <div>
                        <img src={`${D}${provider}`} alt="" />
                      </div>
                    </div>
                  </div>
                  <span className="game-item__name">{title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

function CasinoGame({ item, showName = false }: { item: [string, string, string, string?, string?, string?]; showName?: boolean }) {
  const [title, image, provider, count = "", flag = "", classes = ""] = item;
  return (
    <li data-flag={flag} className={`casino-game${classes} casino-game--d casino-game--dark casino-game--normal-view`}>
      <a href="/casino">
        <div className="casino-game__container">
          {showName ? <span className="casino-game__name">{title}</span> : null}
          {count ? (
            <div className="casino-game__count">
              <span>{count}</span>
            </div>
          ) : null}
          <img src={`${D}${image}`} alt={title} style={{ opacity: 1 }} />
          <div className="casino-game__placeholder">
            <img src={`${D}game-placeholder.png`} alt={title} />
          </div>
        </div>
        <span className="casino-game__provider">{provider}</span>
      </a>
    </li>
  );
}

function TopTablesSection() {
  return (
    <article className="card home--full-width card--d card--full-alt card--light">
      <SectionHeader title="Top Tables" href="/casino/category/top" icon="casino-muted.9646e2b.svg" />
      <div className="card__body">
        <section className="top-tables-showcase">
          <div />
          <ul className="top-tables-showcase__grid">
            {topTables.map((table) => (
              <CasinoGame item={[table[0], table[1], table[2]]} showName key={table[0]} />
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}

function SnsBanner() {
  return (
    <div className="sns-card home--full-width sns-card--d">
      <div />
      <button type="button">
        <picture>
          <source srcSet="https://cdn-proxy.globalcontentcloud.com/common/default/sns/banner-d.webp" media="(min-width: 640px)" />
          <img src={`${D}banner-slim.webp`} alt="Stream n'Spin" />
        </picture>
        <div className="sns-card__ribbon">
          <div className="pulse">
            <span className="pulse__wave" />
            <span className="pulse__wave" />
            <span className="pulse__wave" />
          </div>
          <span>LIVE</span>
        </div>
      </button>
    </div>
  );
}

function CasinoSection() {
  return (
    <article className="card home--columns-2 card--d card--full card--light">
      <SectionHeader title="Casino" href="/casino" icon="casino-muted.9646e2b.svg" />
      <div className="card__body">
        <div className="casino-home">
          <ul>
            {casinoLobby.map((item) => (
              <CasinoGame item={item} key={`${item[0]}-${item[1]}`} />
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function ArcadeProviderRail() {
  return (
    <article className="card card--arcade-carousel card--d card--inline card--light home--full-width">
      <div className="card__title">
        <a href="/arcade/category/hot">
          <img alt="Arcade" src={`${D}arcade-muted.120303a.svg`} className="brand-icon brand-icon--md" /> <span>Arcade</span>
        </a>
      </div>
      <div className="card__body">
        <div className="carousel arcade-carousel carousel--d arcade-carousel--d arcade-carousel--light">
          <div className="carousel__control carousel__prev carousel__control--disabled">
            <i className="icon-arrow-left icon--sm" />
          </div>
          <div className="carousel__inner">
            <div className="carousel__container transition">
              <ul>
                {arcadeProviders.map(([label, href, icon, byIcon]) => (
                  <li className="arcade-carousel__item" key={label}>
                    <a href={href}>
                      <div className="arcade-carousel__img-container">
                        <img src={`${D}${icon}`} alt={label} />
                        {byIcon ? (
                          <div className="arcade-carousel__by-idn">
                            <img src={`${D}${byIcon}`} alt="" />
                          </div>
                        ) : null}
                      </div>
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="carousel__control carousel__next">
            <i className="icon-arrow-right icon--sm" />
          </div>
        </div>
      </div>
      <a href="/arcade/category/hot" className="btn--flex btn--sm card__see-all">
        Lihat semua
      </a>
    </article>
  );
}

function ArcadeShowcase() {
  return (
    <section className="arcade-showcase home--full-width">
      <ul className="arcade-showcase__grid">
        {arcadeGames.map(([title, image, provider]) => (
          <li title={title} className="game-item__wrapper game-item--normal-view" key={title}>
            <a href="/arcade/category/hot">
              <div className="game-item game-item--arcade">
                <img loading="lazy" src={`${D}${image}`} alt={title} className="game-item__img" style={{ opacity: 1 }} />
                <div className="game-item__provider" style={{ opacity: 1 }}>
                  <div>
                    <img src={`${D}${provider}`} alt="" />
                  </div>
                </div>
              </div>
              <span className="game-item__name">{title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ImageCard({ title, href, icon, image, cta }: { title: string; href: string; icon: string; image: string; cta: string }) {
  return (
    <article className="card home--columns-1 card--d card--full card--light">
      <SectionHeader title={title} href={href} icon={icon} />
      <div className="card__body">
        <a href={href} className="snapshot-desktop-image-card">
          <img src={`${D}${image}`} alt={title} className="card__image" />
        </a>
      </div>
      <div className="card__cta">
        <a href={href} className="btn btn--flex btn--brand">
          {cta}
        </a>
      </div>
    </article>
  );
}

function ExclusiveSection() {
  return (
    <article className="card home--columns-half card--d card--full card--light">
      <SectionHeader title="Eksklusif" href="/exclusive" icon="exclusive-muted.ccee61c.svg" />
      <div className="card__body">
        <div className="exclusive-card exclusive-card--d">
          <ul>
            {exclusiveTiles.map(([label, image]) => (
              <li key={label}>
                <a href="/exclusive">
                  <img src={`${D}${image}`} alt={label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function PromoSection() {
  return (
    <article className="card home--columns-half card--d card--full card--light">
      <SectionHeader title="Promosi" href="/promotions/all" icon="promo-muted.ee149da.svg" />
      <div className="card__body">
        <div className="promo-card promo-card--d">
          <ul>
            {promos.map(([title, image]) => (
              <li key={title}>
                <a href="/promotions/all">
                  <img src={`${D}${image}`} alt={title} loading="lazy" />
                  <span className="promo-card__title">{title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function DesktopFooterText() {
  return (
    <section className="footer-text footer-text--d">
      <div className="footer-text__container">
        <article>
          <h1>
            <strong>Pemulabet Situs Slot Online Paling Gacor Dan Terpercaya</strong>
          </h1>
          <p>
            Pemulabet adalah situs slot online terpercaya yang menyediakan permainan slot online berbagai macam provider slot yang memiliki tingkat kemenangan tinggi dan bukan hanya itu Pemulabet juga menyediakan berbagai macam permainan seperti Judi Online Bola, Bandar Togel Online dan masih banyak lainnya.
          </p>
          <p>
            Bersama situs terpercaya ini para pemain akan bermain dengan seru dan nyaman. Daftar sekarang dan nikmati berbagai permainan slot gacor, casino, poker, lotto, arcade, fishing, dan promosi terbaik.
          </p>
        </article>
        <button type="button">Baca lebih</button>
      </div>
    </section>
  );
}

export function DesktopFooter() {
  return (
    <footer data-fetch-key="0" className="app-footer app-footer--d">
      <div className="app-footer__container">
        <section className="app-footer__links">
          <FooterGroup type="links" title="Quick Links" items={desktopBreadcrumbs.slice(0, 9)} />
          <FooterGroup
            type="brand"
            title="PEMULABET"
            items={[
              ["Tentang Kami", "/about-us"],
              ["Contact", "/contact"],
              ["PEMULABET LiveChat", "https://secure.livechatinc.com/licence/direct.lc.chat/15432000/v2/open_chat.cgi?groups=0"],
              ["Deposit", "/deposit"],
              ["Withdraw", "/withdraw"],
              ["Referral", "/referral"],
              ["Leaderboard", "/leaderboard/providers"]
            ]}
          />
          <FooterGroup
            type="legal"
            title="Legal"
            items={[
              ["Responsible Gaming", "/legal/responsible-gaming"],
              ["Syarat & Ketentuan", "/legal/terms-and-conditions"],
              ["Kebijakan Privasi", "/legal/privacy-policy"],
              ["Pengaduan Konsumen", "/complaint"]
            ]}
          />
          <div className="app-footer__link-group app-footer__link-group--social">
            <h5>Stay Connected</h5>
            <ul>
              <li>
                <a href="https://www.facebook.com/groups/agenolxofficial1" target="_blank" rel="noopener" className="btn--flex">
                  <i className="icon-facebook icon--2x" />
                </a>
              </li>
            </ul>
          </div>
        </section>
        <section className="app-footer__text" style={{ maxHeight: "10rem" }}>
          <article>
            <p>
              Pemulabet adalah situs slot online terpercaya yang menyediakan permainan slot online berbagai macam provider slot yang memiliki tingkat kemenangan tinggi. Pemain dapat menikmati slot, casino, poker, lotto, arcade, fishing, promosi, dan layanan pelanggan dengan tampilan yang mengikuti snapshot sumber.
            </p>
          </article>
          <button type="button">Baca lebih</button>
        </section>
        <section className="app-footer__payment">
          <h5>Metode deposit</h5>
          <ul>
            {snapshotPaymentMethods.map(([className, image, alt]) => (
              <li className={className} key={image}>
                <img loading="lazy" src={`${D}${image}`} alt={alt} />
              </li>
            ))}
          </ul>
        </section>
        <section className="app-footer__partners">
          <h5>Partner</h5>
          <ul>
            {snapshotFooterPartners.map(([href, icon, label], index) => (
              <li key={`${label}-${index}`}>
                <a href={href}>
                  <i className={`${icon} icon--2-5x`} /> <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <p className="app-footer__copyright">© 2026 PEMULABET - All rights reserved.</p>
      </div>
    </footer>
  );
}

function FooterGroup({ type, title, items }: { type: string; title: string; items: Array<[string, string]> }) {
  return (
    <nav data-type={type} className="app-footer__link-group">
      <h5>{title}</h5>
      <ul>
        {items.map(([label, href]) => (
          <li key={`${title}-${label}`}>
            <a href={href}>{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DesktopQuickMenu() {
  return null;
}

export function DesktopFloatingLiveChat() {
  return null;
}
