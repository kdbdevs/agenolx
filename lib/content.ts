export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export type ProviderItem = {
  label: string;
  href: string;
  icon: string;
};

export type GameItem = {
  title: string;
  image: string;
  provider?: string;
  providerLogo?: string;
};

export type PromotionItem = {
  title: string;
  image: string;
  teaser: string;
  category: "all" | "casino" | "slot" | "sports" | "other";
};

export type PageData = {
  title: string;
  heading: string;
  kind: "home" | "register" | "catalog" | "promotions";
  category?: string;
  icon?: string;
  hero?: string;
  providers?: ProviderItem[];
  games?: GameItem[];
};

export const brand = {
  name: "PEMULABET",
  logo: "/logo-pemula-bet.webp",
  favicon: "/fav-pemula-bet.webp",
  homeHero: "https://cdn.globalcontentcloud.com/promotions/promotion_banner_588_.webp"
};

export const homeSlides = [
  "https://cdn.globalcontentcloud.com/promotions/promotion_banner_588_.webp",
  "https://cdn.globalcontentcloud.com/content/15832_6a74a1e33601a6.21692027.webp",
  "https://cdn.globalcontentcloud.com/content/15832_6a4f9d3ccd8743.52225734.webp",
  "https://cdn.globalcontentcloud.com/content/15832_6a6ed7e634f0e1.34682258.webp",
  "https://cdn.globalcontentcloud.com/content/15832_6a6ed7fa556621.71158349.webp",
  "https://cdn.globalcontentcloud.com/content/15832_6a3d2015288013.41221984.webp"
];

export const navItems: NavItem[] = [
  {
    label: "Eksklusif",
    href: "/exclusive",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/exclusive.ab7549b.svg"
  },
  {
    label: "Sports+",
    href: "/sports",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/sports.92624ce.svg"
  },
  {
    label: "Slots",
    href: "/slot/category/hot",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/slots.0bfdbc0.svg"
  },
  {
    label: "Casino",
    href: "/casino/category/lobby",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/casino.c79b5be.svg"
  },
  {
    label: "Poker",
    href: "/poker",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/poker.308b1f0.svg"
  },
  {
    label: "Lotto",
    href: "/lotto",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/lotto.dbcbcac.svg"
  },
  {
    label: "Arcade",
    href: "/arcade/category/hot",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/arcade.98c6117.svg"
  },
  {
    label: "Fishing",
    href: "/fishing",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/fishing.2e7df1a.svg"
  },
  {
    label: "Promosi",
    href: "/promotions/all",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/promo.4108971.svg"
  },
  {
    label: "Leaderboard",
    href: "/leaderboard/providers",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/leaderboard.d4577d8.svg"
  },
  {
    label: "Referral",
    href: "/referral",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/referral.ffa5ea8.svg"
  },
  {
    label: "Kontak",
    href: "/contact",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/chat.022cca6.svg"
  }
];

export const slotProviders: ProviderItem[] = [
  ["Hot", "/slot/category/hot", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/hot.svg"],
  ["Exclusive", "/slot/category/exclusive", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/exclusive.svg"],
  ["New", "/slot/category/new", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/new.svg"],
  ["Stream n'Spin", "/sns", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/idnsns.svg"],
  ["IDNSLOT", "/slot/provider/idnslotdirect", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/idnslotdirect.svg"],
  ["PragmaticPlay", "/slot/provider/pragmaticplay", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/pragmaticplay.svg"],
  ["Slot Mania", "/slot/provider/slotmania", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/slotmania.svg"],
  ["PP POP", "/slot/provider/pp-pop", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/pp-pop.svg"],
  ["PG Soft", "/slot/provider/pgsoft", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/pgsoft.svg"],
  ["Microgaming", "/slot/provider/microgaming", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/microgaming.svg"],
  ["Nolimit City", "/slot/provider/evolution-nlc", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/evolution-nlc.svg"],
  ["Habanero", "/slot/provider/habanero", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/habanero.svg"],
  ["5G Games", "/slot/provider/5g", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/5g.svg"],
  ["Spadegaming", "/slot/provider/spadegaming_slot", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/spadegaming_slot.svg"],
  ["Amigo Gaming", "/slot/provider/amigo", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/amigo.svg"],
  ["Playtech", "/slot/provider/playtech_slot", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/playtech_slot.svg"],
  ["PlayStar", "/slot/provider/playstar", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/playstar.svg"],
  ["TTG", "/slot/provider/ttg", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/ttg.svg"],
  ["ShadyLady", "/slot/provider/shadylady", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/shadylady.svg"],
  ["Combo Slots", "/slot/provider/comboslots", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/comboslots.svg"],
  ["FastSpin", "/slot/provider/fastspin", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/fastspin.svg"],
  ["YGR", "/slot/provider/ygr_slots", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/ygr_slots.svg"],
  ["Penguin King", "/slot/provider/penguin_king", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/penguin_king.svg"],
  ["PP 98% RTP", "/slot/provider/pragmaticplay98", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/pragmaticplay98.svg"],
  ["Level Up", "/slot/category/level-up", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/level-up.svg"],
  ["Spin Royal", "/slot/category/spin-royal", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/spin-royal.svg"],
  ["Play'n Go", "/slot/provider/playngo", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/playngo.svg"],
  ["CQ9", "/slot/provider/cq9", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/cq9.svg"],
  ["Yggdrasil", "/slot/provider/yggdrasil", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/yggdrasil.svg"],
  ["BNG", "/slot/provider/bng", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/bng.svg"],
  ["Askmeslot", "/slot/provider/askmeslot_slot", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/askmeslot_slot.svg"],
  ["VPlus", "/slot/provider/vplus", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/vplus.svg"],
  ["BigPot", "/slot/provider/bigpot", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/bigpot.svg"],
  ["Reevo", "/slot/provider/reevo", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/reevo.svg"],
  ["Bgaming", "/slot/provider/bgaming", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/bgaming.svg"],
  ["RedTiger", "/slot/provider/evolution-redtiger", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/evolution-redtiger.svg"],
  ["NetEnt", "/slot/provider/evolution-netent", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/evolution-netent.svg"],
  ["SimplePlay", "/slot/provider/simpleplay", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/simpleplay.svg"],
  ["GMW", "/slot/provider/gmw", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/gmw.svg"],
  ["Apparat", "/slot/provider/apparat", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/apparat.svg"],
  ["Booming", "/slot/provider/booming_games", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/booming_games.svg"],
  ["Live22", "/slot/provider/live_22", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/live_22.svg"],
  ["BTG", "/slot/provider/evolution-btg", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/evolution-btg.svg"],
  ["SBOBET", "/slot/provider/sboslots", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/sboslots.svg"],
  ["KY", "/slot/provider/ky_slots", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/ky_slots.svg"],
  ["Buy Bonus", "/slot/category/buy-bonus", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/buy-bonus.svg"],
  ["Table", "/slot/category/table", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/table.svg"],
  ["Megaways", "/slot/category/megaways", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/megaways.svg"],
  ["Fishing", "/fishing", "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/fishing.svg"]
].map(([label, href, icon]) => ({ label, href, icon }));

export const homeSideBanners = [
  {
    title: "IDN Poker",
    href: "/poker",
    image: "https://cdn-proxy.globalcontentcloud.com/common/default/idn/idn-poker.jpg",
    badge: "Spesial"
  }
];

export const homeCategoryBanners = {
  sports: "https://cdn-proxy.globalcontentcloud.com/common/default/sport.png",
  lotto: "https://cdn-proxy.globalcontentcloud.com/common/default/lotto.png",
  poker: "https://cdn-proxy.globalcontentcloud.com/common/default/poker.png",
  fishing: "https://cdn-proxy.globalcontentcloud.com/common/default/fishing.png"
};

export const exclusiveTiles = [
  ["IDNPOKER", "/poker", "https://cdn-proxy.globalcontentcloud.com/common/default/exclusive/idnpoker.webp"],
  ["IDNSLOT", "/slot/provider/idnslotdirect", "https://cdn-proxy.globalcontentcloud.com/common/default/exclusive/idnslot.webp"],
  ["Slot Mania", "/slot/provider/slotmania", "https://cdn-proxy.globalcontentcloud.com/common/default/exclusive/slotmania.webp"],
  ["IDNLIVE", "/casino/category/lobby", "https://cdn-proxy.globalcontentcloud.com/common/default/exclusive/idnlive.webp"],
  ["Live Mania", "/casino/category/lobby", "https://cdn-proxy.globalcontentcloud.com/common/default/exclusive/livemania.webp"],
  ["IDN Arcade", "/arcade/provider/idnarcade", "https://cdn-proxy.globalcontentcloud.com/common/default/exclusive/idnarcade.webp"]
].map(([title, href, image]) => ({ title, href, image }));

export const slotGames: GameItem[] = [
  ["Lucky Tiger Gold", "https://cdn.globalcontentcloud.com/game-images/pp-pop/15181/thumbnail.webp", "PP POP"],
  ["More Monkeys", "https://cdn.globalcontentcloud.com/game-images/ttg/5203/thumbnail.webp", "TTG"],
  ["Frogs N Flies", "https://cdn.globalcontentcloud.com/game-images/ttg/5211/thumbnail.webp", "TTG"],
  ["Almighty Zeus Spin Royal", "https://cdn.globalcontentcloud.com/game-images/microgaming/16925/thumbnail.webp", "Microgaming"],
  ["Super Win", "https://cdn.globalcontentcloud.com/game-images/playstar/5505/thumbnail.webp", "PlayStar"],
  ["The Great Safari", "https://cdn.globalcontentcloud.com/game-images/fastspin/5817/thumbnail.webp", "FastSpin"],
  ["Dream Blackjack", "https://cdn.globalcontentcloud.com/game-images/idnarcade/16534/thumbnail.webp", "IDNArcade"],
  ["ImmortalRoad", "https://cdn.globalcontentcloud.com/game-images/minigame/15737/thumbnail.webp", "Mini Game"],
  ["Spaceman", "https://cdn.globalcontentcloud.com/game-images/pragmaticplay/7369/thumbnail.webp", "PragmaticPlay"],
  ["Big Bass Crash", "https://cdn.globalcontentcloud.com/game-images/pragmaticplay/6707/thumbnail.webp", "PragmaticPlay"],
  ["Shadow Rush", "https://cdn.globalcontentcloud.com/game-images/kong-original/15713/thumbnail.webp", "Kong Original"],
  ["FireBlast", "https://cdn.globalcontentcloud.com/game-images/minigame/15738/thumbnail.webp", "Mini Game"]
].map(([title, image, provider]) => ({ title, image, provider }));

export const arcadeGames: GameItem[] = [
  ["Chicken+", "https://cdn.globalcontentcloud.com/game-images/pragmaticplay/15515/thumbnail.webp", "PragmaticPlay"],
  ["Dream Baccarat", "https://cdn.globalcontentcloud.com/game-images/idnarcade/16211/thumbnail.webp", "IDNArcade"],
  ["Limbo+", "https://cdn.globalcontentcloud.com/game-images/pragmaticplay/14915/thumbnail.webp", "PragmaticPlay"],
  ["Goal Win", "https://cdn.globalcontentcloud.com/game-images/kong-original/16522/thumbnail.webp", "Kong Original"],
  ["Mines+", "https://cdn.globalcontentcloud.com/game-images/pragmaticplay/14421/thumbnail.webp", "PragmaticPlay"],
  ["Plinko", "https://cdn.globalcontentcloud.com/game-images/originals/5916/thumbnail.webp", "Originals"]
].map(([title, image, provider]) => ({ title, image, provider }));

export const featuredGames: GameItem[] = [
  {
    title: "Live - Lobby",
    image: "https://cdn.globalcontentcloud.com/game-images/pragmaticplay/947/thumbnail.webp",
    provider: "PragmaticPlay",
    providerLogo: "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/pragmaticplay.svg"
  },
  {
    title: "IDN Live New Lobby",
    image: "https://cdn.globalcontentcloud.com/game-images/idnlive/14252/thumbnail.webp",
    provider: "IDN Live"
  },
  {
    title: "Live Mania Lobby",
    image: "https://cdn.globalcontentcloud.com/game-images/pragmaticplay/14772/thumbnail.webp",
    provider: "PragmaticPlay"
  },
  {
    title: "Lobby",
    image: "https://cdn.globalcontentcloud.com/game-images/idnlive/1238/thumbnail.webp",
    provider: "IDN Live"
  }
];

export const pokerGames: GameItem[] = [
  ["Joker Cash", "https://cdn.globalcontentcloud.com/game-images/idn-poker/14224/second_thumb.webp"],
  ["Joker Spin", "https://cdn.globalcontentcloud.com/game-images/idn-poker/9597/second_thumb.webp"],
  ["Capsa Susun", "https://cdn.globalcontentcloud.com/game-images/idn-poker/1297/second_thumb.webp"],
  ["Ceme", "https://cdn.globalcontentcloud.com/game-images/idn-poker/1291/second_thumb.webp"],
  ["Texas Poker", "https://cdn.globalcontentcloud.com/game-images/idn-poker/1288/second_thumb.webp"],
  ["Gaple", "https://cdn.globalcontentcloud.com/game-images/idn-poker/12128/second_thumb.webp"]
].map(([title, image]) => ({ title, image, provider: "IDNPOKER" }));

export const fishingGames: GameItem[] = [
  ["Fishing Legend", "https://cdn.globalcontentcloud.com/game-images/spadegaming/10332/thumbnail.webp", "Spadegaming"],
  ["Onestick Fishing", "https://cdn.globalcontentcloud.com/game-images/cq9/12130/thumbnail.webp", "CQ9"],
  ["Fishing God", "https://cdn.globalcontentcloud.com/game-images/spadegaming/5804/thumbnail.webp", "Spadegaming"],
  ["Fishing War", "https://cdn.globalcontentcloud.com/game-images/spadegaming/5805/thumbnail.webp", "Spadegaming"],
  ["OneShotFishing", "https://cdn.globalcontentcloud.com/game-images/cq9/10204/thumbnail.webp", "CQ9"],
  ["Hero Fishing", "https://cdn.globalcontentcloud.com/game-images/cq9/10205/thumbnail.webp", "CQ9"],
  ["Boom Fishing", "https://cdn.globalcontentcloud.com/game-images/ygr-fishing/15277/thumbnail.webp", "YGR"],
  ["Pirates Fishing", "https://cdn.globalcontentcloud.com/game-images/ygr-fishing/15286/thumbnail.webp", "YGR"]
].map(([title, image, provider]) => ({ title, image, provider }));

export const sportsGames: GameItem[] = [
  ["Sportsbook", "https://cdn-proxy.globalcontentcloud.com/common/default/mobile_sport-gg.jpg", "Sport GG"],
  ["SABA Sports", "https://cdn-proxy.globalcontentcloud.com/common/default/sports/saba.jpg", "SABA Sports"],
  ["SBOBET", "https://cdn-proxy.globalcontentcloud.com/common/default/sports/sbobet.jpg", "SBOBET"],
  ["UboBet", "https://cdn-proxy.globalcontentcloud.com/common/default/sports/ubo.jpg", "UboBet"],
  ["BTI", "https://cdn-proxy.globalcontentcloud.com/common/default/sports/bti.jpg", "BTI"],
  ["TFGaming", "https://cdn-proxy.globalcontentcloud.com/common/default/sports/e-tfgaming.jpg", "TFGaming"]
].map(([title, image, provider]) => ({ title, image, provider }));

export const lottoGames: GameItem[] = [
  ["Totomacau Pools", "https://cdn.globalcontentcloud.com/game-images/totomacau-pools/9500/game_logo.webp"],
  ["Kingkong Pools", "https://cdn.globalcontentcloud.com/game-images/kingkong-pools/6947/game_logo.webp"],
  ["Hongkong Lotto", "https://cdn.globalcontentcloud.com/game-images/hongkong/5379/game_logo.webp"],
  ["Singapore Pools", "https://cdn.globalcontentcloud.com/game-images/singapore/5378/game_logo.webp"],
  ["Sydney Lotto", "https://cdn.globalcontentcloud.com/game-images/sydney/5380/game_logo.webp"],
  ["4D JAKARTA", "https://cdn.globalcontentcloud.com/game-images/4d-jakarta/9470/game_logo.webp"]
].map(([title, image]) => ({ title, image, provider: "Lotto" }));

export const promotions: PromotionItem[] = [
  {
    title: "EVENT PANJAT TURNOVER PEMULABET",
    image: "https://cdn.globalcontentcloud.com/promotions/promotion_39_production_456.webp",
    category: "casino",
    teaser: "Dapatkan Hadiah Grand Prize NINJA R 250 CC dengan aktif bermain Slot dan Live Casino di PEMULABET."
  },
  {
    title: "BONUS DEPOSIT NEW MEMBER 100%",
    image: "https://cdn.globalcontentcloud.com/promotions/promotion_40_production_456.webp",
    category: "all",
    teaser: "Klaim Bonus New Member 100rb + 100rb untuk rekening bank aktif/valid di PEMULABET."
  },
  {
    title: "BONUS X-TRA FREECHIP RP 5.000 DOWNLOAD APK",
    image: "https://cdn.globalcontentcloud.com/promotions/promotion_43_production_456.webp",
    category: "other",
    teaser: "Download aplikasi PEMULABET untuk mendapatkan FREECHIPS Rp 5.000 sekarang juga."
  },
  {
    title: "BONUS FREESPIN KHUSUS SLOT GAMES HINGGA 200X",
    image: "https://cdn.globalcontentcloud.com/promotions/promotion_27_production_456.jpg",
    category: "slot",
    teaser: "Nikmati event Bonus Freespin untuk permainan Slot Online."
  },
  {
    title: "BONUS ROLLINGAN LIVE CASINO 0.5% SETIAP MINGGU",
    image: "https://cdn.globalcontentcloud.com/promotions/promotion_30_production_456.jpg",
    category: "casino",
    teaser: "Bonus rollingan mingguan otomatis dari turnover Live Casino di PEMULABET."
  },
  {
    title: "EXTRA BONUS PARLAY HINGGA 15.000.000,-",
    image: "https://cdn.globalcontentcloud.com/promotions/promotion_29_production_456.jpg",
    category: "sports",
    teaser: "Pasang taruhan bola dan dapatkan extra bonus kemenangan parlay."
  }
];

export const quickLinks = [
  { label: "Beranda", href: "/" },
  { label: "Eksklusif", href: "/exclusive" },
  { label: "Sports+", href: "/sports" },
  { label: "Slots", href: "/slot/category/hot" },
  { label: "Casino", href: "/casino/category/lobby" },
  { label: "Poker", href: "/poker" },
  { label: "Lotto", href: "/lotto" },
  { label: "Fishing", href: "/fishing" }
];

const pageMap: Record<string, PageData> = {
  "/": {
    title: "PEMULABET - SITUS SLOT ONLINE PALING GACOR DAN TERPERCAYA",
    heading: "Beranda",
    kind: "home",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/slots-muted.a305ba0.svg",
    providers: slotProviders,
    games: slotGames
  },
  "/register": {
    title: "PEMULABET - register",
    heading: "Daftar",
    kind: "register"
  },
  "/exclusive": {
    title: "PEMULABET - Eksklusif",
    heading: "Eksklusif",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/exclusive.ab7549b.svg",
    games: featuredGames
  },
  "/sports": {
    title: "PEMULABET - Sportsbook",
    heading: "Sports",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/sports.92624ce.svg",
    games: sportsGames
  },
  "/slot/category/hot": {
    title: "PEMULABET - Hot",
    heading: "Hot Slots",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/hot.svg",
    providers: slotProviders,
    games: slotGames
  },
  "/slot/category/new": {
    title: "PEMULABET - New",
    heading: "New",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/new.svg",
    providers: slotProviders,
    games: slotGames
  },
  "/slot/category/exclusive": {
    title: "PEMULABET - Exclusive",
    heading: "Exclusive",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/common/dark/slot/exclusive.svg",
    providers: slotProviders,
    games: slotGames
  },
  "/casino/category/lobby": {
    title: "PEMULABET - Live Casino",
    heading: "Casino",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/casino.c79b5be.svg",
    games: featuredGames
  },
  "/casino/category/top": {
    title: "PEMULABET - Live Casino",
    heading: "Casino",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/casino.c79b5be.svg",
    games: featuredGames
  },
  "/poker": {
    title: "PEMULABET - Poker",
    heading: "Poker",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/poker.308b1f0.svg",
    hero: "https://cdn-proxy.globalcontentcloud.com/common/default/poker-banner.webp",
    games: pokerGames
  },
  "/lotto": {
    title: "PEMULABET - lotto",
    heading: "Lotto",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/lotto.dbcbcac.svg",
    games: lottoGames
  },
  "/arcade/category/hot": {
    title: "PEMULABET - Arcade",
    heading: "Arcade",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/arcade.98c6117.svg",
    games: arcadeGames
  },
  "/fishing": {
    title: "PEMULABET - fishing",
    heading: "Fishing",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/fishing.2e7df1a.svg",
    games: fishingGames
  },
  "/promotions/all": {
    title: "PEMULABET - Promosi",
    heading: "Promosi",
    kind: "promotions",
    category: "all"
  },
  "/promotions/casino": {
    title: "PEMULABET - Promosi",
    heading: "Promosi",
    kind: "promotions",
    category: "casino"
  },
  "/promosi": {
    title: "PEMULABET - Promosi",
    heading: "Promosi",
    kind: "promotions",
    category: "all"
  },
  "/leaderboard/providers": {
    title: "PEMULABET - Leaderboard",
    heading: "Leaderboard",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/leaderboard.d4577d8.svg",
    games: featuredGames
  },
  "/contact": {
    title: "PEMULABET - contact",
    heading: "Kontak",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/chat.022cca6.svg",
    games: featuredGames
  },
  "/referral": {
    title: "PEMULABET - Referral",
    heading: "Referral",
    kind: "catalog",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/referral.ffa5ea8.svg",
    games: featuredGames
  }
};

export function getPageBySlug(path: string): PageData {
  if (path === "/slot" || path === "/slots") {
    return pageMap["/slot/category/hot"];
  }
  if (path === "/casino") {
    return pageMap["/casino/category/lobby"];
  }
  if (path === "/arcade") {
    return pageMap["/arcade/category/hot"];
  }
  if (path === "/promotions") {
    return pageMap["/promotions/all"];
  }
  if (path === "/leaderboard") {
    return pageMap["/leaderboard/providers"];
  }
  return pageMap[path] ?? pageMap["/"];
}

export function getRouteKind(path: string): PageData["kind"] {
  return getPageBySlug(path).kind;
}

export function getPromotions(category?: string): PromotionItem[] {
  if (!category || category === "all") {
    return promotions;
  }
  return promotions.filter((promotion) => promotion.category === category);
}

export function isActivePath(activePath: string, href: string): boolean {
  if (href === "/") {
    return activePath === "/";
  }
  return activePath === href || activePath.startsWith(`${href}/`);
}
