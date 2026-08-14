import { AuthenticatedMobileHeader, AuthenticatedMobileStickyFooter, type AuthSnapshotProps } from "@/components/authenticated-chrome";
import { brand } from "@/lib/content";

const A = "/index-mobile_files/";

const headerLinks = [
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
] satisfies Array<[string, string]>;

const categoryItems = [
  ["Eksklusif", "/exclusive", "exclusive.ab7549b.svg"],
  ["Sports+", "/sports", "sports.92624ce.svg"],
  ["Slots", "/slot/category/hot", "slots.0bfdbc0.svg"],
  ["Casino", "/casino", "casino.c79b5be.svg"],
  ["Poker", "/poker", "poker.308b1f0.svg"],
  ["Lotto", "/lotto/", "lotto.dbcbcac.svg"],
  ["Arcade", "/arcade/category/hot", "arcade.98c6117.svg"],
  ["Fishing", "/fishing", "fishing.2e7df1a.svg"]
];

const providers = [
  ["Hot", "/slot/category/hot", "hot.svg", ""],
  ["Exclusive", "/slot/category/exclusive", "exclusive.svg", ""],
  ["New", "/slot/category/new", "new.svg", ""],
  ["Stream n'Spin", "/sns", "idnsns.svg", " provider--live"],
  ["IDNSLOT", "/slot/provider/idnslotdirect", "idnslotdirect.svg", " provider--promo"],
  ["PragmaticPlay", "/slot/provider/pragmaticplay", "pragmaticplay.svg", " provider--promo"],
  ["Slot Mania", "/slot/provider/slotmania", "slotmania.svg", " provider--promo"],
  ["PP POP", "/slot/provider/pp-pop", "pp-pop.svg", " provider--promo"],
  ["PG Soft", "/slot/provider/pgsoft", "pgsoft.svg", ""],
  ["Microgaming", "/slot/provider/microgaming", "microgaming.svg", " provider--promo"],
  ["Nolimit City", "/slot/provider/evolution-nlc", "evolution-nlc.svg", " provider--promo"],
  ["Habanero", "/slot/provider/habanero", "habanero.svg", " provider--promo"],
  ["5G Games", "/slot/provider/5g", "5g.svg", ""],
  ["Spadegaming", "/slot/provider/spadegaming_slot", "spadegaming_slot.svg", " provider--promo"],
  ["JILI", "/slot/provider/jili", "jili.svg", " provider--new"]
];

const hotGames = [
  ["Wealth Inn Level Up", "https://cdn.globalcontentcloud.com/game-images/habanero/5102/thumbnail.webp", "habanero.svg", " game--promo game--special"],
  ["Lucky Panda", "https://cdn.globalcontentcloud.com/game-images/ttg/5161/thumbnail.webp", "ttg.svg", ""],
  ["Mahjong Ways 3", "https://cdn.globalcontentcloud.com/game-images/playstar/5524/thumbnail.webp", "playstar.svg", ""],
  ["The Great Safari", "https://cdn.globalcontentcloud.com/game-images/fastspin/5817/thumbnail.webp", "fastspin.svg", " game--promo"],
  ["ATHENA-LUCKY SPREAD", "https://cdn.globalcontentcloud.com/game-images/playstar/6703/thumbnail.webp", "playstar.svg", ""],
  ["Zeus Wilds Spin Royal", "https://cdn.globalcontentcloud.com/game-images/microgaming/7222/thumbnail.webp", "microgaming.svg", " game--promo game--special"],
  ["Mahjong Princess", "https://cdn.globalcontentcloud.com/game-images/fastspin/7293/thumbnail.webp", "fastspin.svg", " game--promo"],
  ["Spaceman", "https://cdn.globalcontentcloud.com/game-images/pragmaticplay/7365/thumbnail.webp", "pragmaticplay.svg", ""],
  ["Lantern Luck Level Up", "https://cdn.globalcontentcloud.com/game-images/habanero/8206/thumbnail.webp", "habanero.svg", " game--promo game--special"],
  ["Helloween", "https://cdn.globalcontentcloud.com/game-images/playn-go/9161/thumbnail.webp", "playngo.svg", ""]
];

const casinoGames = [
  ["Live - Lobby", "thumbnail.webp", "Pragmatic Play", "218", "", ""],
  ["IDN Live New Lobby", "thumbnail(1).webp", "IDNLIVE", "54", "Spesial", " casino-game--new casino-game--special"],
  ["Live Mania Lobby", "thumbnail(2).webp", "Live Mania", "", "Promosi", " casino-game--promo casino-game--new"],
  ["Live - Lobby", "thumbnail(3).webp", "Evolution", "263", "Promosi", " casino-game--promo"],
  ["Lobby", "thumbnail(4).webp", "IDNLIVE", "54", "Spesial", " casino-game--special"],
  ["Lobby", "thumbnail(5).webp", "SexyGaming", "47", "New", " casino-game--new"]
];

const promos = [
  ["Level Up Tournaments & CashDrop", "thumbnail_566_.webp"],
  ["Carnival", "thumbnail_588_.webp"],
  ["MG Turnamen & Cashdrop Almighty Zeus Spin Royal", "thumbnail_710_.webp"],
  ["PP - August Game Exclusive", "thumbnail_712_.webp"]
];

const lottoWidgets = [
  ["Totomacau Pools", "game_logo.webp", "Result: Selasa, 11.8.2026", ["6", "2", "1", "5"], "1 jam 2 mnt", "idn-lotto"],
  ["Kingkong Pools", "game_logo(1).webp", "Result: Selasa, 11.8.2026", ["9", "2", "0", "5"], "2 jam 33 mnt", "totokingkong"]
] satisfies Array<[string, string, string, string[], string, string]>;

const topTables = [
  ["Baccarat 2", "https://cdn.globalcontentcloud.com/game-images/idnlive/1207/thumbnail.webp", "IDNLIVE"],
  ["24Dspin", "https://cdn.globalcontentcloud.com/game-images/idnlive/1232/thumbnail.webp", "IDNLIVE"],
  ["IDN 4 Stand", "https://cdn.globalcontentcloud.com/game-images/idnlive/1237/thumbnail.webp", "IDNLIVE"],
  ["Blackjack VIP", "https://cdn.globalcontentcloud.com/game-images/luckystreak/1848/thumbnail.webp", "LuckyStreak"],
  ["Auto Mega Roulette", "https://cdn.globalcontentcloud.com/game-images/pragmaticplay/10991/thumbnail.webp", "Pragmatic Play"],
  ["Speed Auto Roulette", "https://cdn.globalcontentcloud.com/game-images/pragmaticplay/10993/thumbnail.webp", "Pragmatic Play"],
  ["Turkish Mega Roulette", "https://cdn.globalcontentcloud.com/game-images/pragmaticplay/11124/thumbnail.webp", "Pragmatic Play"],
  ["Indonesian BlackjackX 1", "https://cdn.globalcontentcloud.com/game-images/pragmaticplay/11184/thumbnail.webp", "Pragmatic Play"],
  ["Istanbul Roulette", "https://cdn.globalcontentcloud.com/game-images/microgaming-live/11225/thumbnail.webp", "Microgaming Live"],
  ["Blackjack Calgary", "https://cdn.globalcontentcloud.com/game-images/microgaming-live/11245/thumbnail.webp", "Microgaming Live"]
];

const arcadeItems = [
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
];

const trendingSearches = ["dragon", "mahjong", "high", "poker", "spaceman", "sugar", "wild", "bonanza", "aztec", "mega"];

const paymentMethods = [
  ["", "BCA.svg", "AGENOLX - Metode deposit - BCA"],
  ["bank-logo--h", "BRI.svg", "AGENOLX - Metode deposit - BRI"],
  ["", "BNI.svg", "AGENOLX - Metode deposit - BNI"]
] satisfies Array<[string, string, string]>;

const footerPartners = [
  ["/poker", "icon-idnpoker", "IDNPOKER"],
  ["/arcade/provider/idnarcade", "icon-idnarcade", "IDNArcade"],
  ["/sports", "icon-ubo", "UboBet"],
  ["/sports", "icon-saba", "SABA Sports"],
  ["/sports", "icon-sbobet", "SBOBET"],
  ["/sports", "icon-cmd", "CMD368"],
  ["/sports", "icon-bti", "BTi"],
  ["/sports", "icon-tfgaming", "TFGaming"],
  ["/sns", "icon-idnsns", "Stream n'Spin"],
  ["/slot/category/spin-royal", "icon-spin-royal", "Spin Royal"],
  ["/slot/category/level-up", "icon-level-up", "Level Up"],
  ["/slot/provider/idnslotdirect", "icon-idnslotdirect", "IDNSLOT"],
  ["/slot/provider/pragmaticplay", "icon-pragmaticplay", "PragmaticPlay"],
  ["/slot/provider/slotmania", "icon-slotmania", "Slot Mania"],
  ["/slot/provider/pp-pop", "icon-pp-pop", "PP POP"],
  ["/slot/provider/pgsoft", "icon-pgsoft", "PG Soft"],
  ["/slot/provider/microgaming", "icon-microgaming", "Microgaming"],
  ["/slot/provider/evolution-nlc", "icon-evolution-nlc", "Nolimit City"],
  ["/slot/provider/habanero", "icon-habanero", "Habanero"],
  ["/slot/provider/5g", "icon-5g", "5G Games"],
  ["/slot/provider/spadegaming_slot", "icon-spadegaming_slot", "Spadegaming"],
  ["/slot/provider/jili", "icon-jili", "JILI"],
  ["/slot/provider/playtech_slot", "icon-playtech_slot", "Playtech"],
  ["/slot/provider/playstar", "icon-playstar", "PlayStar"],
  ["/slot/provider/ttg", "icon-ttg", "TTG"],
  ["/slot/provider/amigo", "icon-amigo", "Amigo Gaming"],
  ["/slot/provider/comboslots", "icon-comboslots", "Combo Slots"],
  ["/slot/provider/fastspin", "icon-fastspin", "FastSpin"],
  ["/slot/provider/ygr_slots", "icon-ygr_slots", "YGR"],
  ["/slot/provider/penguin_king", "icon-penguin_king", "Penguin King"],
  ["/slot/provider/pragmaticplay98", "icon-pragmaticplay98", "PP 98% RTP"],
  ["/slot/provider/playngo", "icon-playngo", "Play'n Go"],
  ["/slot/provider/cq9", "icon-cq9", "CQ9"],
  ["/slot/provider/yggdrasil", "icon-yggdrasil", "Yggdrasil"],
  ["/slot/provider/shadylady", "icon-shadylady", "ShadyLady"],
  ["/slot/provider/bng", "icon-bng", "BNG"],
  ["/slot/provider/askmeslot_slot", "icon-askmeslot_slot", "Askmeslot"],
  ["/slot/provider/vplus", "icon-vplus", "VPlus"],
  ["/slot/provider/bigpot", "icon-bigpot", "BigPot"],
  ["/slot/provider/reevo", "icon-reevo", "Reevo"],
  ["/slot/provider/bgaming", "icon-bgaming", "Bgaming"],
  ["/slot/provider/evolution-redtiger", "icon-evolution-redtiger", "RedTiger"],
  ["/slot/provider/evolution-netent", "icon-evolution-netent", "NetEnt"],
  ["/slot/provider/simpleplay", "icon-simpleplay", "SimplePlay"],
  ["/slot/provider/gmw", "icon-gmw", "GMW"],
  ["/slot/provider/apparat", "icon-apparat", "Apparat"],
  ["/slot/provider/booming_games", "icon-booming_games", "Booming"],
  ["/slot/provider/live_22", "icon-live_22", "Live22"],
  ["/slot/provider/evolution-btg", "icon-evolution-btg", "BTG"],
  ["/slot/provider/sboslots", "icon-sboslots", "SBOBET"],
  ["/slot/provider/ky_slots", "icon-ky_slots", "KY"],
  ["/arcade/provider/minigame", "icon-minigame", "Minigame"],
  ["/casino/provider/evolution", "icon-evolution", "Evolution"],
  ["/casino/provider/idnlive", "icon-idnlive", "IDNLIVE"],
  ["/casino/provider/mg_live_grand", "icon-mg_live_grand", "Microgaming Live"],
  ["/casino/provider/sagaming", "icon-sagaming", "SA Gaming"],
  ["/casino/provider/og", "icon-og", "Oriental Game"],
  ["/casino/provider/ion", "icon-ion", "ION"],
  ["/casino/provider/vivo-gaming", "icon-vivo-gaming", "VivoGaming"],
  ["/casino/provider/ezugi-gaming", "icon-ezugi-gaming", "Ezugi"],
  ["/casino/provider/luckystreak", "icon-luckystreak", "LuckyStreak"],
  ["/casino/provider/sexygaming", "icon-sexygaming", "SexyGaming"]
] satisfies Array<[string, string, string]>;

const footerLinkGroups = [
  [
    "links",
    "Quick Links",
    [
      ["/", "Beranda"],
      ["/exclusive", "Eksklusif"],
      ["/sports", "Sports+"],
      ["/slot/category/hot", "Slots"],
      ["/casino", "Casino"],
      ["/poker", "Poker"],
      ["/lotto/", "Lotto"],
      ["/arcade/category/hot", "Arcade"],
      ["/fishing", "Fishing"]
    ]
  ],
  [
    "brand",
    "AGENOLX",
    [
      ["/about-us", "Tentang Kami"],
      ["/contact", "Contact"],
      ["/deposit", "Deposit"],
      ["/withdraw", "Withdraw"],
      ["/referral", "Referral"],
      ["/leaderboard/providers", "Leaderboard"],
      ["/apk", "Download APP"]
    ]
  ],
  [
    "legal",
    "Legal",
    [
      ["/legal/responsible-gaming", "Responsible Gaming"],
      ["/legal/terms-and-conditions", "Syarat & Ketentuan"],
      ["/legal/privacy-policy", "Kebijakan Privasi"],
      ["/complaint", "Pengaduan Konsumen"]
    ]
  ]
] satisfies Array<[string, string, Array<[string, string]>]>;

export const snapshotPaymentMethods = paymentMethods;
export const snapshotFooterPartners = footerPartners;

export function MobileHomeSnapshot({ user }: AuthSnapshotProps = {}) {
  return (
    <div id="__app">
      <div id="__layout">
        <div className="layout--default snapshot-mobile-layout">
          <SnapshotHeader user={user} />
          <main>
            <div className="container">
              <section className="home snapshot-mobile-home">
                <HeroCarousel />
                <HomeTeaser user={user} />
                <div className="running-text running-text--primary">
                  <i className="icon-volume icon--md" />
                  <div className="snapshot-marquee">
                    <span className="snapshot-marquee__inner">
                      Selamat datang di Pemulabet! Silahkan masuk atau daftar jika anda belum memiliki akun. Jadi
                      pemenang berikutnya dan rasakan keseruan bermain di Pemulabet!
                    </span>
                  </div>
                </div>
                <CategoryMenu />
                <ProviderRail />
                <SplitCard />
                <HotSlots />
                <CasinoCard />
                <PromoCard />
                <LottoHomepageCard />
                <TopTablesCard />
                <ExclusiveCard />
                <ArcadeCard />
                <LottoFishingSplit />
                <SearchModule />
                <MobileFooterText />
              </section>
            </div>
          </main>
          <MobileSnapshotFooter />
          <div className="top-observer" />
          <MobileStickyFooter user={user} activePath="/" />
          <MobileFloatingLiveChat />
          <MobileQuickFloatingMenu />
        </div>
      </div>
    </div>
  );
}

function HomeTeaser({ user }: AuthSnapshotProps = {}) {
  if (user) {
    return (
      <div className="home__teaser">
        <a href="/promotions/all" className="btn btn--flex btn--accent-secondary">
          <i className="icon-promo icon--lg" /> <span>Promosi</span>
        </a>
        <a href="/user/history" className="btn btn--flex btn--brand">
          <i className="icon-history icon--lg" /> <span>Histori</span>
        </a>
        <a href="/deposit" className="app-button btn btn--flex btn--success">
          <i className="icon-deposit icon--lg" /> <span>Deposit</span>
        </a>
      </div>
    );
  }

  return (
    <div className="home__teaser">
      <a href="/promotions/all" className="btn btn--flex btn--accent-secondary">
        <i className="icon-promo icon--lg" /> <span>Promosi</span>
      </a>
      <a href="/register" className="btn btn--flex btn--brand">
        <i className="icon-register icon--lg" /> <span>Daftar</span>
      </a>
      <button type="button" data-login-modal-trigger className="app-button btn btn--flex btn--accent">
        <i className="icon-login icon--lg" /> <span>Masuk</span>
      </button>
    </div>
  );
}

function SnapshotHeader({ user }: AuthSnapshotProps = {}) {
  if (user) {
    return <AuthenticatedMobileHeader user={user} assetRoot={A} activeLabel="Beranda" links={headerLinks} />;
  }

  return (
    <header className="app-header surface">
      <div className="container--fluid">
        <div className="app-header__main">
          <div className="app-brand">
            <a href="/" aria-current="page" className="app-link--exact-active app-link--active">
              <img src={brand.logo} alt={brand.name} className="app-logo" />
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
            {headerLinks.map(([label, href], index) => (
              <li className={`nav-item${index === 0 ? " nav-item--home" : ""}`} key={label}>
                <a
                  href={href}
                  data-name={label}
                  className={index === 0 ? "app-link--exact-active app-link--active app-link--exact-active" : ""}
                >
                  {label}
                </a>
              </li>
            ))}
            <li data-pos="end" className="nav-observer" />
          </ul>
        </nav>
        <button className="app-button btn drawer__toggle">
          <span>Menu</span> <i className="icon-bars icon--lg" />
        </button>
      </div>
    </header>
  );
}

function HeroCarousel() {
  const slides = [
    "15832_6a74a1e33601a6.21692027.webp",
    "15832_6a4f9d3ccd8743.52225734.webp",
    "17411_6a7ae18e99aee0.23002626.webp",
    "15832_6a6ed7fa556621.71158349.webp",
    "15832_6a3d2015288013.41221984.webp",
    "promotion_banner_705_.webp",
    "promotion_banner_575_.webp"
  ];

  return (
    <div className="home-carousel">
      <div dir="ltr" className="slick-slider slick-initialized">
        <div className="slick-list">
          <div className="slick-track snapshot-hero-track">
            <div tabIndex={-1} data-index="0" aria-hidden="false" className="slick-slide slick-active slick-current">
              <div>
                <a href="/" aria-current="page" className="app-link--exact-active app-link--active" tabIndex={-1}>
                  <img
                    src="https://cdn.globalcontentcloud.com/promotions/promotion_banner_575_.webp"
                    alt="AGENOLX"
                    className="slide"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <ul className="slick-dots">
          {slides.map((slide, index) => (
            <li className={index === slides.length - 1 ? "slick-active" : ""} key={slide}>
              <button>{index + 1}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CategoryMenu() {
  return (
    <nav className="app-menu app-menu--shadow-end">
      <ul>
        <li data-pos="start" className="app-menu__observer" />
        {categoryItems.map(([label, href, icon]) => (
          <li className="app-menu__item" key={label}>
            <a href={href}>
              <img alt={label} src={`${A}${icon}`} className="brand-icon brand-icon--active brand-icon--md" />{" "}
              <span>{label}</span>
            </a>
          </li>
        ))}
        <li data-pos="end" className="app-menu__observer" />
      </ul>
    </nav>
  );
}

function ProviderRail() {
  return (
    <article className="card card--slot-carousel card--full card--light">
      <header className="card__header">
        <div className="card__title">
          <a href="/slot/category/hot">
            <img alt="Slots" src={`${A}slots-muted.a305ba0.svg`} className="brand-icon brand-icon--sm" />{" "}
            <span>Slots</span>
          </a>
        </div>
        <a href="/slot/category/hot" className="btn--sm btn--flex card__see-all">
          Lihat semua
        </a>
      </header>
      <div className="card__body">
        <div className="carousel slot-carousel">
          <div className="carousel__control carousel__prev highlight carousel__control--disabled">
            <i className="icon-arrow-left icon--sm" />
          </div>
          <div className="carousel__inner">
            <div className="carousel__container transition">
              <div className="slot-carousel__group slot-carousel__group--ud">
                {providers.map(([label, href, icon, badge]) => (
                  <a href={href} className="slot-carousel__item" key={label}>
                    <div className={`slot-carousel__img-container${badge}`}>
                      <img src={`${A}${icon}`} alt={label} />
                    </div>
                    <span>{label}</span>
                  </a>
                ))}
              </div>
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

function SplitCard() {
  return (
    <article className="card card--split card--primary">
      {[
        ["Sports+", "/sports", "sports-muted.aba62f9.svg", "sport.png", "Main Sports+"],
        ["Poker", "/poker", "poker-muted.a0c9bb9.svg", "poker.png", "Main Poker"]
      ].map(([title, href, icon, image, cta]) => (
        <div className="card__item" key={title}>
          <div className="card__title">
            <a href={href}>
              <img alt={title} src={`${A}${icon}`} className="brand-icon brand-icon--sm" /> <span>{title}</span>
            </a>
          </div>
          <a href={href}>
            <img src={`${A}${image}`} alt={title} className="card__image" />
          </a>
          <a href={href} className="btn btn--flex btn--brand card__cta">
            {cta}
          </a>
        </div>
      ))}
    </article>
  );
}

function HotSlots() {
  return (
    <article className="card card--full card--light">
      <CardHeader title="Hot Slots" href="/slot/category/hot" icon="hot-muted.0c60698.svg" />
      <div className="card__body">
        <div className="hot-slots-card">
          <div className="scroll-container scroll-container--primary scroll-container--shadow-end">
            <div className="scroll-container__observer" />
            <ul>
              <div data-pos="start" className="scroll-container__shadow-observer" />
              <div className="inner hot-slots-card__container">
                {hotGames.map(([title, image, providerIcon, flags]) => (
                  <li className={`game-item__wrapper${flags} game-item--normal-view`} title={title} key={title}>
                    <a href="/slot/category/hot" target="_blank">
                      <div className="game-item game-item--slot">
                        <img src={image} alt={title} className="game-item__img" style={{ opacity: 1 }} />
                        <div className="game-item__provider" style={{ opacity: 1 }}>
                          <div>
                            <img src={`${A}${providerIcon}`} alt="" />
                          </div>
                        </div>
                      </div>
                      <span className="game-item__name">{title}</span>
                    </a>
                  </li>
                ))}
                <div data-pos="end" className="scroll-container__shadow-observer end" />
              </div>
            </ul>
            <div data-pos="top" className="scroll-container__top-observer" />
          </div>
        </div>
      </div>
    </article>
  );
}

function CasinoCard() {
  return (
    <article className="card card--full card--primary">
      <CardHeader title="Casino" href="/casino" icon="casino-muted.9646e2b.svg" />
      <div className="card__body">
        <div className="casino-carousel">
          <ul>
            <li className="casino-carousel__fill" />
            {casinoGames.map(([title, image, provider, count, flag, modifierClass]) => (
              <li
                data-flag={flag}
                className={`casino-game casino-carousel__item${modifierClass} casino-game--light casino-game--normal-view`}
                key={`${provider}-${image}`}
              >
                <a href="/casino">
                  <div className="casino-game__container">
                    {count ? (
                      <div className="casino-game__count">
                        <span>{count}</span>
                      </div>
                    ) : null}
                    <img src={`${A}${image}`} alt={title} style={{ opacity: 1 }} />
                    <div className="casino-game__placeholder">
                      <img src={`${A}game-placeholder.png`} alt={title} />
                    </div>
                  </div>
                  <span className="casino-game__provider">{provider}</span>
                </a>
              </li>
            ))}
            <li className="casino-carousel__fill" />
          </ul>
        </div>
      </div>
    </article>
  );
}

function PromoCard() {
  return (
    <article className="card card--full card--light">
      <CardHeader title="Promosi" href="/promotions/all" icon="promo-muted.ee149da.svg" />
      <div className="card__body">
        <div className="promo-card">
          <div dir="ltr" className="slick-slider slick-initialized">
            <div className="slick-list">
              <div className="slick-track snapshot-promo-track">
                {promos.map(([title, image]) => (
                  <div tabIndex={-1} aria-hidden="false" className="slick-slide slick-active" key={title}>
                    <div>
                      <div tabIndex={-1} className="promo-card__slide">
                        <a href="/promotions/all">
                          <img src={`${A}${image}`} alt={title} />
                          <span className="promo-card__title">{title}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function LottoHomepageCard() {
  return (
    <article className="card card--full card--primary">
      <CardHeader title="Lotto" href="/lotto/" icon="lotto-muted.42a4023.svg" />
      <div className="card__body">
        <ul data-fetch-key="data-v-1fee39ab:0" className="lotto-homepage">
          {lottoWidgets.map(([name, logo, resultLabel, numbers, countdown, slug]) => (
            <li className="lotto-widget" key={name}>
              <div className="lotto-widget__container">
                <button className="lotto-widget__img">
                  <img src={`${A}${logo}`} alt={name as string} />
                </button>
                <div className="lotto-widget__spacer" />
                <div className="lotto-widget__title">
                  <span>Live Results</span>
                  <h2>{name}</h2>
                </div>
                <div className="lotto-widget__result">
                  <span>{resultLabel}</span>
                  <ul>
                    {(numbers as string[]).map((number, index) => (
                      <li key={`${name}-${index}`}>
                        <div>
                          <span>{number}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lotto-widget__links">
                  <a href={`/lotto/results/${slug}`}>
                    <i className="icon-history-alt icon--lg" />
                    <span>Results {(name as string).toUpperCase()}</span>
                    <i className="icon-arrow-right icon--xs" />
                  </a>
                  <button>
                    <i className="icon-play-circle icon--lg" />
                    <span>Main Sekarang</span>
                    <i className="icon-arrow-right icon--xs" />
                  </button>
                </div>
                <div className="lotto-widget__countdown lotto-widget__countdown--special">{countdown}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function TopTablesCard() {
  return (
    <article className="card card--full card--light">
      <CardHeader title="Top Tables" href="/casino/category/top" icon="casino-muted.9646e2b.svg" />
      <div className="card__body">
        <div className="top-tables-card">
          <div className="scroll-container scroll-container--primary scroll-container--shadow-end">
            <div className="scroll-container__observer" />
            <ul>
              <div data-pos="start" className="scroll-container__shadow-observer" />
              <div className="inner top-tables-card__container">
                {topTables.map(([title, image, provider]) => (
                  <li data-flag="" className="casino-game casino-game--light casino-game--normal-view" key={title}>
                    <a href="/casino/category/top">
                      <div className="casino-game__container">
                        <span className="casino-game__name">{title}</span>
                        <img src={image} alt={title} style={{ opacity: 1 }} />
                        <div className="casino-game__placeholder">
                          <img src={`${A}game-placeholder.png`} alt={title} />
                        </div>
                      </div>
                      <span className="casino-game__provider">{provider}</span>
                    </a>
                  </li>
                ))}
                <div data-pos="end" className="scroll-container__shadow-observer end" />
              </div>
            </ul>
            <div data-pos="top" className="scroll-container__top-observer" />
          </div>
        </div>
      </div>
      <div className="card__banner">
        <div className="sns-card">
          <div />
          <button>
            <picture>
              <source srcSet="https://cdn-proxy.globalcontentcloud.com/common/default/sns/banner-d.webp" media="(min-width: 640px)" />
              <img src={`${A}banner-slim.webp`} alt="Stream n'Spin" />
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
      </div>
    </article>
  );
}

function ExclusiveCard() {
  return (
    <article className="card card--full card--primary">
      <CardHeader title="Eksklusif" href="/exclusive" icon="exclusive-muted.ccee61c.svg" />
      <div className="card__body">
        <div className="exclusive-card">
          <ul>
            <li>
              <button>
                <img src={`${A}sns.webp`} alt="Stream n'Spin" loading="lazy" />
              </button>
            </li>
            <li>
              <a href="/slot/provider/idnslotdirect">
                <img src={`${A}idnslot.webp`} alt="IDNSLOT" />
              </a>
            </li>
            <li>
              <a href="/arcade/provider/idnarcade">
                <img src={`${A}idnarcade.webp`} alt="IDN Arcade" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}

function ArcadeCard() {
  return (
    <article className="card card--arcade-carousel card--full card--light">
      <CardHeader title="Arcade" href="/arcade/category/hot" icon="arcade-muted.120303a.svg" />
      <div className="card__body">
        <div className="carousel arcade-carousel arcade-carousel--dark">
          <div className="carousel__control carousel__prev highlight carousel__control--disabled">
            <i className="icon-arrow-left icon--sm" />
          </div>
          <div className="carousel__inner">
            <div className="carousel__container transition" style={{ transform: "translateX(0px)" }}>
              <ul>
                {arcadeItems.map(([label, href, icon, byIdn]) => (
                  <li key={label}>
                    <a href={href} className="arcade-carousel__item">
                      <div className="arcade-carousel__img-container">
                        <img src={`${A}${icon}`} alt={label} />
                        {byIdn ? (
                          <div className="arcade-carousel__by-idn surface">
                            <img src={`${A}${byIdn}`} alt={label} />
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
          <div className="carousel__control carousel__next highlight">
            <i className="icon-arrow-right icon--sm" />
          </div>
        </div>
      </div>
      <div className="card__cta">
        <a href="/arcade/category/hot" className="btn btn--flex btn--brand">
          Main Arcade
        </a>
      </div>
    </article>
  );
}

function LottoFishingSplit() {
  return (
    <article className="card card--split card--primary">
      {[
        ["Lotto", "/lotto/", "lotto-muted.42a4023.svg", "lotto.png", "Main Lotto"],
        ["Fishing", "/fishing", "fishing-muted.3bbc777.svg", "fishing.png", "Main Fishing"]
      ].map(([title, href, icon, image, cta]) => (
        <div className="card__item" key={title}>
          <div className="card__title">
            <a href={href}>
              <img alt={title} src={`${A}${icon}`} className="brand-icon brand-icon--sm" /> <span>{title}</span>
            </a>
          </div>
          <a href={href}>
            <img src={`${A}${image}`} alt={title} loading="lazy" className="card__image" />
          </a>
          <div className="card__cta">
            <a href={href} className="btn btn--flex btn--brand">
              {cta}
            </a>
          </div>
        </div>
      ))}
    </article>
  );
}

function SearchModule() {
  return (
    <section data-fetch-key="data-v-47bb2b1b:0" className="search-module">
      <header>
        <div className="search-module__title">
          <img alt="" src={`${A}search-muted.434c2f5.svg`} className="brand-icon brand-icon--sm" />
          <span>Cari</span>
        </div>
        <div className="select-dropdown input__container">
          <div className="input__root">
            <button type="button" className="input">
              Slots
            </button>
            <ul className="select-dropdown__options">
              {[
                ["Slots", "slots.0bfdbc0.svg", "selected"],
                ["Casino", "casino.c79b5be.svg", ""],
                ["Arcade", "arcade.98c6117.svg", ""]
              ].map(([label, icon, selected]) => (
                <li key={label}>
                  <button type="button" className={selected}>
                    <img alt="" src={`${A}${icon}`} className="brand-icon input__icon brand-icon--xs" />
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
            <img alt="" src={`${A}slots.0bfdbc0.svg`} className="brand-icon input__icon brand-icon--mini" />
            <i className="select__arrow icon-arrow-down icon--xs" />
          </div>
        </div>
        <div className="input--search input__container">
          <div className="input__root">
            <input type="text" autoComplete="off" value="" placeholder="Cari permainan" className="input" readOnly />
            <i className="input__icon input__icon--search icon-search icon--md" />
          </div>
        </div>
        <button>
          <i className="icon-filter icon--md" />
        </button>
      </header>
      <div className="search-module__guest">
        <h4>
          Ketik sesuatu.
          <br />
          Kolom pencariannya butuh perhatian.
        </h4>
      </div>
      <div className="flex-scroll-container search-module__recent">
        <header>
          <i className="icon-trend icon--md" />
          <h3>Trending Searches</h3>
        </header>
        <div className="shadow-container shadow-end shadow--dark">
          <ul>
            <li data-pos="start" className="shadow-observer" />
            {trendingSearches.map((term) => (
              <li key={term}>
                <button className="btn btn--light btn--flex">
                  <span>{term}</span>
                  <i className="icon-search icon--md" />
                </button>
              </li>
            ))}
            <li data-pos="end" className="shadow-observer" />
          </ul>
        </div>
      </div>
      <div className="search-module__content" />
      <div className="search-module__providers">
        <div className="backdrop" style={{ display: "none" }} />
        <nav>
          <ul />
        </nav>
      </div>
    </section>
  );
}

function CardHeader({ title, href, icon }: { title: string; href: string; icon: string }) {
  return (
    <header className="card__header">
      <div className="card__title">
        <a href={href}>
          <img alt={title} src={`${A}${icon}`} className="brand-icon brand-icon--sm" /> <span>{title}</span>
        </a>
      </div>
      <a href={href} className="btn--sm btn--flex card__see-all">
        Lihat semua
      </a>
    </header>
  );
}

export function MobileFooterText() {
  return (
    <section className="footer-text">
      <div className="footer-text__container">
        <article>
          <p>
            Agenolx adalah situs slot online paling gacor yang memiliki berbagai provider slot yang bisa memberikan
            jackpot melimpah.
          </p>
        </article>
        <button>Baca lebih</button>
      </div>
    </section>
  );
}

export function MobileSnapshotFooter() {
  return (
    <footer data-fetch-key="0" className="app-footer">
      <div className="app-footer__container">
        <section className="app-footer__links">
          {footerLinkGroups.map(([type, title, items]) => (
            <nav data-type={type} className="app-footer__link-group" key={title}>
              <h5>{title}</h5>
              <ul>
                {items.map(([href, item]) => (
                  <li key={item}>
                    <a href={href}>{item}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
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
        <section className="app-footer__payment">
          <h5>Metode deposit</h5>
          <ul>
            {paymentMethods.map(([className, image, alt]) => (
              <li className={className} key={image}>
                <img loading="lazy" src={`${A}${image}`} alt={alt} />
              </li>
            ))}
          </ul>
        </section>
        <section className="app-footer__partners">
          <h5>Partner</h5>
          <ul>
            {footerPartners.map(([href, icon, label], index) => (
              <li key={`${label}-${index}`}>
                <a href={href}>
                  <i className={`${icon} icon--2-5x`} /> <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <p className="app-footer__copyright">© 2026 AGENOLX - All rights reserved.</p>
      </div>
    </footer>
  );
}

export function MobileStickyFooter({ user, activePath = "/" }: AuthSnapshotProps & { activePath?: string } = {}) {
  if (user) {
    return <AuthenticatedMobileStickyFooter user={user} assetRoot={A} activePath={activePath} />;
  }

  const items = [
    ["Beranda", "/", "home.17b8a8b.svg", "app-link--active"],
    ["Daftar", "/register", "edit-muted.452594a.svg", ""],
    ["Masuk", "/login", "login-muted.3774dfc.svg", ""],
    ["Promosi", "/promotions/all", "promo-muted.ee149da.svg", ""],
    ["Kontak", "/contact", "chat-muted.86ad236.svg", ""]
  ];
  return (
    <section className="sticky-footer surface--inverse">
      <nav className="sticky-footer__nav">
        <ul>
          {items.map(([label, href, icon, active]) => (
            <li key={label}>
              {label === "Masuk" ? (
                <button type="button" data-login-modal-trigger className={`btn ${active}`}>
                  <img alt={label} src={`${A}${icon}`} className="brand-icon brand-icon--xs" /> <span>{label}</span>
                </button>
              ) : (
                <a href={href} className={`btn ${active}`}>
                  <img alt={label} src={`${A}${icon}`} className="brand-icon brand-icon--xs" /> <span>{label}</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

export function MobileFloatingLiveChat() {
  return null;
}

export function MobileQuickFloatingMenu() {
  return null;
}
