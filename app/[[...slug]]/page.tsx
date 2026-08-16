import { AppShell } from "@/components/app-shell";
import { DesktopCasinoSnapshot, MobileCasinoSnapshot, type CasinoCategory } from "@/components/casino-snapshot";
import { DesktopHomeSnapshot } from "@/components/desktop-home-snapshot";
import { DesktopExclusiveSnapshot, MobileExclusiveSnapshot } from "@/components/exclusive-snapshot";
import { MobileHomeSnapshot } from "@/components/mobile-home-snapshot";
import { AccountPlaceholderPage, CatalogPage, DepositPage, LoginPage, PromotionsPage, RegisterPage, UserHistoryPage } from "@/components/pages";
import { DesktopPokerSnapshot, MobilePokerSnapshot } from "@/components/poker-snapshot";
import { DesktopSlotSnapshot, MobileSlotSnapshot, type SlotCategory } from "@/components/slot-snapshot";
import { DesktopSportsSnapshot, MobileSportsSnapshot } from "@/components/sports-snapshot";
import { DesktopStaticPageSnapshot, MobileStaticPageSnapshot, type StaticSnapshotKey } from "@/components/static-page-snapshot";
import { getPageBySlug, getRouteKind } from "@/lib/content";
import { getPendingDepositForUser } from "@/lib/deposits";
import { getActiveDepositTargets, getActivePaymentProviders } from "@/lib/payment-providers";
import { getCurrentUser } from "@/lib/session";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = `/${slug.join("/")}`.replace(/\/$/, "") || "/";
  const page = getPageBySlug(path);

  if (path === "/arcade") {
    redirect("/arcade/category/hot");
  }

  if (path === "/login") {
    return {
      title: "PEMULABET - login",
      description: "Masuk PEMULABET"
    };
  }

  return {
    title: page.title,
    description: path === "/" ? "Situs slot online paling gacor dan terpercaya" : "PEMULABET"
  };
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PublicRoute({ params, searchParams }: PageProps) {
  const { slug = [] } = await params;
  const query = await searchParams;
  const path = `/${slug.join("/")}`.replace(/\/$/, "") || "/";
  const routeKind = getRouteKind(path);
  const page = getPageBySlug(path);
  const user = await getCurrentUser();

  if (path === "/login") {
    if (user) redirect("/");
    return (
      <AppShell activePath={path} user={null}>
        <LoginPage />
      </AppShell>
    );
  }

  if (path === "/deposit") {
    redirect("/deposit/bank-transfer");
  }

  if (path === "/deposit/bank-transfer" || path === "/deposit/qris") {
    if (!user) redirect("/login?error=Silahkan%20masuk%20terlebih%20dahulu");
    const method = path === "/deposit/qris" ? "qris" : "bank_transfer";
    const [depositTargets, pendingDeposit] = await Promise.all([
      getActiveDepositTargets(method),
      getPendingDepositForUser(user.id)
    ]);
    return (
      <AppShell activePath={path} user={user}>
        <DepositPage
          method={method}
          targets={depositTargets}
          pendingDeposit={pendingDeposit}
          success={firstParam(query.success)}
          error={firstParam(query.error)}
        />
      </AppShell>
    );
  }

  if (path === "/user/history") {
    if (!user) redirect("/login?error=Silahkan%20masuk%20terlebih%20dahulu");
    return (
      <AppShell activePath={path} user={user}>
        <UserHistoryPage />
      </AppShell>
    );
  }

  if (path === "/user/messages" || path === "/user/messages/" || path === "/user/bonuses" || path === "/user/referral/history") {
    if (!user) redirect("/login?error=Silahkan%20masuk%20terlebih%20dahulu");
    return (
      <AppShell activePath={path} user={user}>
        <AccountPlaceholderPage title={path.includes("bonuses") ? "Bonus" : path.includes("referral") ? "Referral" : "Pesan"} />
      </AppShell>
    );
  }

  const casinoCategories = ["lobby", "top", "game-shows", "roulette", "baccarat", "sic-bo", "dragon-tiger", "blackjack", "ball-games", "idn-special"];
  const casinoCategory = path === "/casino" ? "lobby" : path.startsWith("/casino/category/") ? path.split("/").pop() : undefined;

  if (casinoCategory && casinoCategories.includes(casinoCategory)) {
    const category = casinoCategory as CasinoCategory;
    return (
      <>
        <div className="casino-mobile-render">
          <MobileCasinoSnapshot category={category} user={user} />
        </div>
        <div className="casino-desktop-render">
          <DesktopCasinoSnapshot category={category} user={user} />
        </div>
      </>
    );
  }

  if (path === "/poker") {
    return (
      <>
        <div className="poker-mobile-render">
          <MobilePokerSnapshot user={user} />
        </div>
        <div className="poker-desktop-render">
          <DesktopPokerSnapshot user={user} />
        </div>
      </>
    );
  }

  const staticPageRoutes: Record<string, StaticSnapshotKey> = {
    "/lotto": "lotto",
    "/fishing": "fishing",
    "/arcade/category/hot": "arcade-hot",
    "/arcade/provider/askmeslot_arcade": "arcade-askmeslot",
    "/arcade/provider/idnarcade": "arcade-idnarcade",
    "/arcade/provider/ky_arcade": "arcade-ky",
    "/arcade/provider/microgaming_arcade": "arcade-microgaming",
    "/arcade/provider/minigame": "arcade-minigame",
    "/arcade/category/new": "arcade-new",
    "/arcade/provider/new": "arcade-new",
    "/arcade/provider/original": "arcade-original",
    "/arcade/provider/originals": "arcade-original",
    "/arcade/provider/pragmaticplay_arcade": "arcade-pragmaticplay",
    "/arcade/provider/spadegaming_arcade": "arcade-spadegaming",
    "/promotions/all": "promotions-all",
    "/promotions/casino": "promotions-casino",
    "/promotions/fishing": "fishing",
    "/promotions/other": "promotions-other",
    "/promotions/slot": "promotions-slot",
    "/promotions/sportsbook": "promotions-sportsbook",
    "/leaderboard": "leaderboard-providers",
    "/leaderboard/providers": "leaderboard-providers",
    "/leaderboard/distributed": "leaderboard-distributed",
    "/referral": "referral",
    "/contact": "contact",
    "/register": "register"
  };
  const staticPageKey = staticPageRoutes[path];

  if (staticPageKey) {
    const paymentProviders = staticPageKey === "register" ? await getActivePaymentProviders() : undefined;

    return (
      <>
        <div className="static-page-mobile-render">
          <MobileStaticPageSnapshot pageKey={staticPageKey} user={user} paymentProviders={paymentProviders} />
        </div>
        <div className="static-page-desktop-render">
          <DesktopStaticPageSnapshot pageKey={staticPageKey} user={user} paymentProviders={paymentProviders} />
        </div>
      </>
    );
  }

  if (routeKind === "home") {
    return (
      <>
        <div className="home-mobile-render">
          <MobileHomeSnapshot user={user} />
        </div>
        <div className="home-desktop-render">
          <DesktopHomeSnapshot user={user} />
        </div>
      </>
    );
  }

  if (path === "/exclusive") {
    return (
      <>
        <div className="exclusive-mobile-render">
          <MobileExclusiveSnapshot user={user} />
        </div>
        <div className="exclusive-desktop-render">
          <DesktopExclusiveSnapshot user={user} />
        </div>
      </>
    );
  }

  if (path === "/sports") {
    return (
      <>
        <div className="sports-mobile-render">
          <MobileSportsSnapshot user={user} />
        </div>
        <div className="sports-desktop-render">
          <DesktopSportsSnapshot user={user} />
        </div>
      </>
    );
  }

  if (path === "/slot/category/hot" || path === "/slot/category/new" || path === "/slot/category/exclusive") {
    const category = path.split("/").pop() as SlotCategory;
    return (
      <>
        <div className="slot-mobile-render">
          <MobileSlotSnapshot category={category} user={user} />
        </div>
        <div className="slot-desktop-render">
          <DesktopSlotSnapshot category={category} user={user} />
        </div>
      </>
    );
  }

  return (
    <AppShell activePath={path} user={user}>
      {routeKind === "register" ? <RegisterPage /> : null}
      {routeKind === "promotions" ? <PromotionsPage category={page.category} /> : null}
      {routeKind === "catalog" ? <CatalogPage page={page} /> : null}
    </AppShell>
  );
}
