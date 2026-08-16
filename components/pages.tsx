import Link from "next/link";
import {
  arcadeGames,
  exclusiveTiles,
  featuredGames,
  getPromotions,
  homeCategoryBanners,
  homeSideBanners,
  homeSlides,
  navItems,
  PageData,
  slotGames,
  slotProviders
} from "@/lib/content";
import { DepositAmountPicker } from "@/components/deposit-amount-picker";
import type { PendingDeposit } from "@/lib/deposits";
import type { DepositPaymentTarget } from "@/lib/payment-providers";

export function HomePage() {
  const homeNav = [
    { label: "Beranda", href: "/" },
    ...navItems.filter((item) => !["/leaderboard/providers", "/referral", "/contact"].includes(item.href))
  ];

  return (
    <section className="home home--d rebuild-home">
      <div className="home-carousel rebuild-home-carousel">
        <Link href="/">
          <img src={homeSlides[0]} alt="AGENOLX" />
        </Link>
        <div className="rebuild-home-dots" aria-hidden="true">
          {homeSlides.map((slide, index) => (
            <span className={index === 0 ? "active" : undefined} key={slide} />
          ))}
        </div>
      </div>

      <aside className="idn-carousel home--columns-1 rebuild-home-side">
        {homeSideBanners.map((banner) => (
          <Link className="rebuild-home-side__banner" href={banner.href} key={banner.title}>
            <img src={banner.image} alt={banner.title} />
            <div className="rebuild-side-dots" aria-hidden="true">
              <span />
              <span className="active" />
              <span />
            </div>
            <strong>{banner.badge}</strong>
          </Link>
        ))}
      </aside>

      <div className="home__teaser rebuild-home-teaser">
        <Link href="/promotions/all" className="btn btn--flex btn--accent-secondary rebuild-button">
          <i className="icon-promo icon--md" />
          Promosi
        </Link>
        <Link href="/register" className="btn btn--flex btn--brand rebuild-button rebuild-button--brand">
          <i className="icon-register icon--md" />
          Daftar
        </Link>
        <button type="button" data-login-modal-trigger className="btn btn--flex btn--accent rebuild-button">
          <i className="icon-login icon--md" />
          Masuk
        </button>
      </div>

      <MobileRunningText />
      <MobileCategoryMenu />

      <nav className="app-breadcrumbs home--full-width app-breadcrumbs--d rebuild-breadcrumbs rebuild-home-nav">
        <ul>
          <li data-pos="start" className="nav-observer" />
          {homeNav.map((item) => (
            <li className={`nav-item${item.href === "/" ? " nav-item--home" : ""}`} key={item.href}>
              <Link
                className={item.href === "/" ? "app-link--exact-active app-link--active" : undefined}
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li data-pos="end" className="nav-observer" />
        </ul>
      </nav>

      <ProviderRail />

      <HomeGameSection
        className="home--full-width"
        title="Hot Slots"
        href="/slot/category/hot"
        icon="https://cdn-proxy.globalcontentcloud.com/common/dark/slot/hot.svg"
        games={slotGames}
      />

      <HomeGameSection
        className="home--columns-2"
        title="Casino"
        href="/casino/category/lobby"
        icon={navItems[3].icon}
        games={featuredGames}
      />
      <HomeBannerSection
        className="home--columns-1"
        title="Sports+"
        href="/sports"
        icon={navItems[1].icon}
        image={homeCategoryBanners.sports}
      />
      <HomeGameSection
        className="home--full-width"
        title="Arcade"
        href="/arcade/category/hot"
        icon={navItems[6].icon}
        games={arcadeGames}
      />
      <ExclusiveSection />
      <PromotionPreview />
      <HomeBannerSection
        className="home--columns-1"
        title="Lotto"
        href="/lotto"
        icon={navItems[5].icon}
        image={homeCategoryBanners.lotto}
      />
      <HomeBannerSection
        className="home--columns-1"
        title="Poker"
        href="/poker"
        icon={navItems[4].icon}
        image={homeCategoryBanners.poker}
      />
      <HomeBannerSection
        className="home--columns-1"
        title="Fishing"
        href="/fishing"
        icon={navItems[7].icon}
        image={homeCategoryBanners.fishing}
      />
    </section>
  );
}

export function RegisterPage() {
  return (
    <section className="register register--d rebuild-register">
      <header className="page-header">
        <h3>Daftar</h3>
      </header>
      <form action="/api/auth/register" method="post">
        <div className="register-form-1__fields rebuild-register__fields">
          <fieldset className="rebuild-fieldset">
            <h3>Informasi Akun</h3>
            <Field label="Username" name="username" />
            <Field label="Password" name="password" type="password" />
            <Field label="Masukkan kembali Password" name="passwordConfirm" type="password" />
            <p className="rebuild-help">
              Password wajib memiliki minimal 8 karakter, dan wajib memiliki minimal 1 huruf dan 1 angka. Karakter
              spesial yang diperbolehkan adalah ! @ # $ % ^ * _ | , .
            </p>
            <Field label="Kode Referral" name="referralCode" />
          </fieldset>
          <fieldset className="rebuild-fieldset">
            <h3>Informasi Pribadi</h3>
            <Field label="Nama Lengkap" name="fullName" />
            <Field label="E-mail" name="email" type="email" />
            <Field label="Nomor Telepon" name="phone" type="tel" prefix="+62" />
            <h3>Informasi Pembayaran</h3>
            <div className="rebuild-field">
              <label>Metode Pembayaran</label>
              <select name="paymentMethod" defaultValue="">
                <option value="" disabled>
                  Pilih Metode Pembayaran
                </option>
                <option>Bank</option>
                <option>E-money</option>
              </select>
            </div>
          </fieldset>
        </div>
        <button className="btn btn--brand btn--block rebuild-button rebuild-button--brand" type="submit">
          Daftar
        </button>
      </form>
    </section>
  );
}

export function LoginPage() {
  return (
    <section className="register register--d rebuild-register">
      <header className="page-header">
        <h3>Masuk</h3>
      </header>
      <form action="/api/auth/login" method="post">
        <div className="register-form-1__fields rebuild-register__fields" style={{ gridTemplateColumns: "1fr" }}>
          <fieldset className="rebuild-fieldset">
            <h3>Informasi Akun</h3>
            <Field label="Username" name="username" />
            <Field label="Password" name="password" type="password" />
            <label className="input-confirm__label rebuild-check" style={{ marginBottom: "1rem" }}>
              <input name="remember" type="checkbox" />
              <span>Tetap masuk</span>
            </label>
          </fieldset>
        </div>
        <button className="btn btn--accent btn--block rebuild-button rebuild-button--accent" type="submit">
          Masuk
        </button>
      </form>
    </section>
  );
}

export function DepositPage({
  method,
  targets,
  pendingDeposit,
  success,
  error
}: {
  method: "bank_transfer" | "qris";
  targets: DepositPaymentTarget[];
  pendingDeposit?: PendingDeposit | null;
  success?: string;
  error?: string;
}) {
  const isQris = method === "qris";
  const amountOptions = [50000, 100000, 200000, 500000];
  const readyTargets = isQris
    ? targets
    : targets.filter((target) => target.depositAccountName && target.depositAccountNumber);
  const hasPendingDeposit = Boolean(pendingDeposit);
  const formDisabled = readyTargets.length === 0 || hasPendingDeposit;

  return (
    <section className="deposit deposit--d">
      <header className="page-header">
        <i className="icon-deposit icon--2x" />
        <h3>Deposit</h3>
      </header>
      <nav className="side-nav side-nav--d">
        <ul>
          <li className={`side-nav__item${!isQris ? " side-nav__item--active" : ""}`}>
            <Link href="/deposit/bank-transfer">
              <i className="icon-bank-transfer icon--lg" />
              <span>Bank Transfer</span>
            </Link>
          </li>
          <li className={`side-nav__item${isQris ? " side-nav__item--active" : ""}`}>
            <Link href="/deposit/qris">
              <i className="icon-qris icon--lg" />
              <span>QRIS</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="deposit-content">
        <form className="wallet-form wallet-form--d" action="/api/deposits" method="post">
          <input type="hidden" name="method" value={method} />
          {success ? (
            <div className="alert alert--success">
              <i className="icon-check-circle icon--lg" />
              <p>{success}</p>
            </div>
          ) : null}
          {error ? (
            <div className="alert alert--danger">
              <i className="icon-times-circle icon--lg" />
              <p>{error}</p>
            </div>
          ) : null}
          {pendingDeposit ? (
            <div className="alert alert--warning wallet-pending-deposit">
              <i className="icon-info icon--lg" />
              <div>
                <strong>Deposit masih dalam proses</strong>
                <p>
                  Deposit {pendingDeposit.reference ?? `#${pendingDeposit.id}`} sebesar {pendingDeposit.amountFormatted}
                  {pendingDeposit.bankName ? ` melalui ${pendingDeposit.bankName}` : ""} sedang menunggu proses admin.
                </p>
                <p>Anda belum bisa membuat deposit baru sampai deposit ini disetujui, ditolak, atau kedaluwarsa.</p>
              </div>
            </div>
          ) : null}
          <div className="bank-select bank-select--d">
            <span className="bank-select__label">Pilih Bank</span>
            <div className="bank-select__body">
              {readyTargets.map((bank, index) => (
                <div className="bank-select__item" key={bank.code}>
                  <label role="button" htmlFor={`deposit-target-${bank.code}`}>
                    {bank.logoUrl ? <img src={bank.logoUrl} alt={bank.name} /> : <span>{bank.name}</span>}
                  </label>
                  <input
                    id={`deposit-target-${bank.code}`}
                    className="bank-select__input"
                    type="radio"
                    name="bankId"
                    value={bank.id}
                    defaultChecked={index === 0}
                    disabled={formDisabled}
                  />
                  <i className="bank-select__icon icon-circle icon--xs" />
                </div>
              ))}
            </div>
          </div>
          {readyTargets.length > 0 && !isQris ? (
            <div className="wallet-detail wallet-detail__deposit-to">
              <span>Tujuan Deposit</span>
              {readyTargets.map((target) => (
                <div key={`deposit-detail-${target.code}`}>
                  <strong>{target.name}</strong>
                  <p>{target.depositAccountName}</p>
                  <p>{target.depositAccountNumber}</p>
                </div>
              ))}
            </div>
          ) : null}
          <div className={`alert alert--${readyTargets.length ? "info" : "danger"}`}>
            <i className="icon-info icon--lg" />
            <p>
              {readyTargets.length
                ? "Silahkan memilih salah satu Bank terlebih dahulu."
                : "Rekening tujuan deposit belum tersedia."}
            </p>
          </div>
          <DepositAmountPicker amounts={amountOptions} disabled={formDisabled} />
          {!isQris ? (
            <div className="input__container input__textarea">
              <label>Catatan</label>
              <div className="input__root">
                <textarea name="note" className="input" rows={1} placeholder="Catatan" disabled={formDisabled} />
                <i className="input__icon icon-pen icon--xs" />
              </div>
            </div>
          ) : null}
          <button type="submit" className="btn btn--block btn--success" disabled={formDisabled}>
            <span>{hasPendingDeposit ? "Deposit Sedang Diproses" : "Kirim"}</span>
          </button>
        </form>
      </div>
    </section>
  );
}

export function UserHistoryPage() {
  return (
    <section className="history history--d">
      <header className="page-header">
        <h3>Riwayat Bermain</h3>
      </header>
      <div className="history-content">
        <p>Belum ada riwayat permainan.</p>
      </div>
    </section>
  );
}

export function AccountPlaceholderPage({ title }: { title: string }) {
  return (
    <section className="static-page static-page--d">
      <header className="page-header">
        <h3>{title}</h3>
      </header>
      <div className="static-page__content">
        <p>Data akun akan tampil di sini setelah modul ini dilengkapi.</p>
      </div>
    </section>
  );
}

export function CatalogPage({ page }: { page: PageData }) {
  return (
    <>
      <MobileCategoryMenu />
      {page.hero ? (
        <section className="rebuild-hero">
          <img src={page.hero} alt={page.heading} />
        </section>
      ) : null}
      <CatalogSection title={page.heading} icon={page.icon} providers={page.providers} games={page.games ?? []} />
    </>
  );
}

function MobileRunningText() {
  return (
    <div className="running-text running-text--primary rebuild-home-mobile-running">
      <i className="icon-volume icon--md" aria-hidden="true" />
      <div className="snapshot-marquee">
        <span className="snapshot-marquee__inner">
          Selamat datang di Pemulabet! Silahkan masuk atau daftar jika anda belum memiliki akun. Jadi pemenang
          berikutnya dan rasakan keseruan bermain di Pemulabet!
        </span>
      </div>
    </div>
  );
}

function MobileCategoryMenu() {
  return (
    <nav className="app-menu rebuild-mobile-category-menu">
      <ul>
        <li data-pos="start" className="app-menu__observer" />
        {navItems.slice(0, 8).map((item) => (
          <li className="app-menu__item" key={`mobile-category-${item.href}`}>
            <Link href={item.href}>
              <img alt={item.label} src={item.icon} className="brand-icon brand-icon--active brand-icon--md" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
        <li data-pos="end" className="app-menu__observer" />
      </ul>
    </nav>
  );
}

export function PromotionsPage({ category }: { category?: string }) {
  const tabs = [
    { label: "Semua", href: "/promotions/all" },
    { label: "Casino", href: "/promotions/casino" },
    { label: "Slots", href: "/promotions/slot" },
    { label: "Sports", href: "/promotions/sportsbook" },
    { label: "Lainnya", href: "/promotions/other" }
  ];
  const promos = getPromotions(category);
  return (
    <section className="promotions-list promotions-list--d rebuild-card">
      <header className="rebuild-card__header">
        <div className="rebuild-card__title">
          <img src={navItems[8].icon} alt="Promosi" />
          <h3>Promosi</h3>
        </div>
      </header>
      <nav className="rebuild-actions" style={{ padding: "0.5rem" }}>
        {tabs.map((tab) => (
          <Link className="rebuild-button" href={tab.href} key={tab.href}>
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="rebuild-promo-grid">
        {promos.map((promotion) => (
          <article className="promotion promotions__item rebuild-promo" key={promotion.title}>
            <img src={promotion.image} alt={promotion.title} />
            <div className="promotion__teaser rebuild-promo__teaser">
              <div>
                <h3>{promotion.title}</h3>
                <p>{promotion.teaser}</p>
              </div>
              <Link className="btn btn--sm btn--flex btn--accent detail rebuild-button rebuild-button--accent" href="#">
                Detail
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CatalogSection({
  title,
  icon,
  providers,
  games
}: {
  title: string;
  icon?: string;
  providers?: { label: string; href: string; icon: string }[];
  games: { title: string; image: string; provider?: string; providerLogo?: string }[];
}) {
  return (
    <section className="card card--light rebuild-card">
      <header className="rebuild-card__header">
        <div className="rebuild-card__title">
          {icon ? <img src={icon} alt={title} /> : null}
          <h3>{title}</h3>
        </div>
        <Link href="/slot/category/hot" className="btn--sm btn--flex card__see-all rebuild-button">
          Lihat semua
        </Link>
      </header>
      {providers?.length ? (
        <div className="rebuild-provider-grid">
          {providers.map((provider) => (
            <Link className="slot-carousel__item rebuild-provider" href={provider.href} key={provider.href}>
              <img src={provider.icon} alt={provider.label} />
              <span>{provider.label}</span>
            </Link>
          ))}
        </div>
      ) : null}
      {games.length ? (
        <div className="rebuild-grid">
          {games.map((game) => (
            <article className="rebuild-game" key={`${game.title}-${game.image}`}>
              <img src={game.image} alt={game.title} />
              <div className="rebuild-game__label">
                <span>{game.title}</span>
                {game.providerLogo ? <img src={game.providerLogo} alt={game.provider ?? ""} /> : null}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ProviderRail() {
  return (
    <article className="card card--slot-carousel card--full card--light home--full-width rebuild-provider-rail">
      <header className="card__header rebuild-provider-rail__header">
        <div className="card__title">
          <Link href="/slot/category/hot">
            <img
              alt="Slots"
              className="brand-icon brand-icon--sm"
              src="https://cdn-proxy.globalcontentcloud.com/456/dist/img/slots-muted.a305ba0.svg"
            />
            <span>Slots</span>
          </Link>
        </div>
        <Link href="/slot/category/hot" className="btn--sm btn--flex card__see-all rebuild-provider-rail__all">
          Lihat Semua
        </Link>
      </header>
      <div className="card__body">
        <div className="carousel slot-carousel">
          <div className="carousel__control carousel__prev highlight carousel__control--disabled">
            <i className="icon-arrow-left icon--sm" />
          </div>
          <div className="carousel__inner">
            <div className="carousel__container transition">
              <div className="slot-carousel__group slot-carousel__group--ud rebuild-provider-strip">
                {slotProviders.slice(0, 15).map((provider) => (
                  <Link className="slot-carousel__item" href={provider.href} key={provider.href}>
                    <div className={`slot-carousel__img-container${providerBadgeClass(provider.label)}`}>
                      <img src={provider.icon} alt={provider.label} />
                    </div>
                    <span>{provider.label}</span>
                  </Link>
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

function providerBadgeClass(label: string) {
  if (["Stream n'Spin"].includes(label)) {
    return " provider--live";
  }
  if (["Amigo Gaming", "SBOBET"].includes(label)) {
    return " provider--new";
  }
  if (
    [
      "IDNSLOT",
      "PragmaticPlay",
      "Slot Mania",
      "PP POP",
      "Microgaming",
      "Nolimit City",
      "Habanero",
      "Spadegaming",
      "Playtech",
      "FastSpin",
      "PP 98% RTP",
      "Level Up",
      "Spin Royal"
    ].includes(label)
  ) {
    return " provider--promo";
  }
  return "";
}

function HomeGameSection({
  title,
  href,
  icon,
  games,
  className
}: {
  title: string;
  href: string;
  icon: string;
  games: { title: string; image: string; provider?: string; providerLogo?: string }[];
  className: string;
}) {
  return (
    <section className={`card card--d card--full card--light rebuild-home-card ${className}`}>
      <HomeSectionHeader title={title} href={href} icon={icon} />
      <div className="rebuild-home-games">
        {games.map((game) => (
          <Link className="game-item__wrapper rebuild-home-game" href={href} key={`${title}-${game.title}`}>
            <img src={game.image} alt={game.title} />
            <span>{game.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HomeBannerSection({
  title,
  href,
  icon,
  image,
  className
}: {
  title: string;
  href: string;
  icon: string;
  image: string;
  className: string;
}) {
  return (
    <section className={`card card--d card--full card--light rebuild-home-card ${className}`}>
      <HomeSectionHeader title={title} href={href} icon={icon} />
      <Link className="rebuild-home-banner-card" href={href}>
        <img src={image} alt={title} />
      </Link>
    </section>
  );
}

function ExclusiveSection() {
  return (
    <section className="card card--d card--full card--light rebuild-home-card home--columns-half">
      <HomeSectionHeader title="Eksklusif" href="/exclusive" icon={navItems[0].icon} />
      <div className="exclusive-card exclusive-card--d rebuild-exclusive-grid">
        {exclusiveTiles.map((tile) => (
          <Link href={tile.href} key={tile.title}>
            <img src={tile.image} alt={tile.title} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function PromotionPreview() {
  const promos = getPromotions("all").slice(0, 3);

  return (
    <section className="card card--d card--full card--light rebuild-home-card home--columns-half">
      <HomeSectionHeader title="Promosi" href="/promotions/all" icon={navItems[8].icon} />
      <div className="promo-card promo-card--d rebuild-home-promos">
        {promos.map((promotion) => (
          <Link href="/promotions/all" key={promotion.title}>
            <img src={promotion.image} alt={promotion.title} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function HomeSectionHeader({ title, href, icon }: { title: string; href: string; icon: string }) {
  return (
    <header className="card__header rebuild-card__header">
      <div className="card__title rebuild-card__title">
        <Link href={href}>
          <img alt={title} src={icon} />
          <span>{title}</span>
        </Link>
      </div>
      <Link href={href} className="btn--sm btn--flex card__see-all rebuild-home-see-all">
        Lihat Semua
      </Link>
    </header>
  );
}

function Field({ label, name, type = "text", prefix }: { label: string; name: string; type?: string; prefix?: string }) {
  return (
    <div className="input__container rebuild-field">
      <label>{label}</label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {prefix ? (
          <span className="rebuild-button" style={{ width: 70, flexShrink: 0 }}>
            {prefix}
          </span>
        ) : null}
        <input name={name} type={type} autoComplete="off" />
      </div>
    </div>
  );
}
