"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/lib/content";
import type { AuthenticatedUser } from "@/lib/session";

const categoryItems = [
  {
    label: "Cari",
    href: "/search",
    icon: "https://cdn-proxy.globalcontentcloud.com/456/dist/img/search.39ae4b1.svg"
  },
  ...navItems.filter((item) =>
    ["Eksklusif", "Sports+", "Slots", "Casino", "Poker", "Lotto", "Arcade", "Fishing", "Promosi"].includes(item.label)
  )
];

const primaryItems = [
  ["Deposit", "/deposit", "icon-deposit"],
  ["Bonus", "/user/bonuses", "icon-gift"],
  ["Leaderboard", "/leaderboard/providers", "icon-leaderboard"],
  ["Withdraw", "/withdraw/bank-transfer", "icon-withdraw"],
  ["Kontak", "/contact", "icon-chat"]
] satisfies Array<[string, string, string]>;

const accountItems = [
  ["Informasi akun", "/user", "icon-info"],
  ["Referral", "/user/referral/history", "icon-referral"],
  ["Inbox", "/user/messages", "icon-mail"],
  ["Aktivitas", "/user/activity", "icon-activity"],
  ["Riwayat Bermain", "/user/history", "icon-history"]
] satisfies Array<[string, string, string]>;

type AppDrawerProps = {
  user?: AuthenticatedUser | null;
};

export function AppDrawer({ user }: AppDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFreeSpinsOpen, setIsFreeSpinsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest(".drawer__toggle, .rebuild-menu-button");
      if (!trigger) return;

      event.preventDefault();
      setIsOpen((open) => !open);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const toggles = Array.from(document.querySelectorAll(".drawer__toggle, .rebuild-menu-button"));
    toggles.forEach((toggle) => toggle.classList.toggle("drawer__toggle--active", isOpen));

    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      toggles.forEach((toggle) => toggle.classList.remove("drawer__toggle--active"));
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`app-drawer__root rebuild-app-drawer${isOpen ? " app-drawer--open" : ""}`}>
      <button type="button" className="app-drawer__backdrop" aria-label="Tutup menu" onClick={() => setIsOpen(false)} />
      <aside className="app-drawer surface" aria-hidden={!isOpen}>
        <header className="app-drawer__header">
          <nav className="app-drawer__categories">
            <ul>
              {categoryItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={() => setIsOpen(false)}>
                    <img alt={item.label} src={item.icon} className="brand-icon brand-icon--active brand-icon--sm" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <section>
          <nav className="app-drawer__nav">
            <ul>
              {primaryItems.slice(0, 2).map(([label, href, icon]) => (
                <DrawerLink key={href} href={href} icon={icon} label={label} onNavigate={() => setIsOpen(false)} />
              ))}

              <li className="app-drawer__nav__item app-drawer__nav__item__dropdown app-drawer__freespins">
                <button type="button" onClick={() => setIsFreeSpinsOpen((open) => !open)}>
                  <div>
                    <i className="icon-free-spins icon--lg" />
                  </div>
                  <span>Free Spins</span>
                  <i className="dropdown-toggle icon-arrow-down icon--sm" />
                </button>
                <ul className={isFreeSpinsOpen ? "app-drawer__freespins--collapsed" : ""}>
                  <li>
                    <span className="no-spins">Tidak ada freespin yang tersedia.</span>
                  </li>
                </ul>
              </li>

              {primaryItems.slice(2, 4).map(([label, href, icon]) => (
                <DrawerLink key={href} href={href} icon={icon} label={label} onNavigate={() => setIsOpen(false)} />
              ))}

              <li className={`app-drawer__nav__item app-drawer__nav__item__dropdown${isAccountOpen ? " dropdown-collapsed" : ""}`}>
                <button type="button" onClick={() => setIsAccountOpen((open) => !open)}>
                  <div>
                    <i className="icon-account icon--lg" />
                  </div>
                  <span>Akun Saya</span>
                  <i className="dropdown-toggle icon-arrow-down icon--sm" />
                </button>
                <ul style={{ height: isAccountOpen ? "auto" : 0 }}>
                  {accountItems.map(([label, href, icon]) => (
                    <DrawerLink
                      key={href}
                      href={href}
                      icon={icon}
                      label={label}
                      badge={label === "Inbox" ? user?.inboxCount : undefined}
                      onNavigate={() => setIsOpen(false)}
                    />
                  ))}
                </ul>
              </li>

              {primaryItems.slice(4).map(([label, href, icon]) => (
                <DrawerLink key={href} href={href} icon={icon} label={label} onNavigate={() => setIsOpen(false)} />
              ))}
            </ul>
          </nav>

          <div className="app-drawer__extra">
            {user ? (
              <form action="/api/auth/logout" method="post">
                <button type="submit" className="app-button btn btn--dark btn--flex">
                  <i className="icon-logout icon--lg" />
                  <span>Keluar</span>
                </button>
              </form>
            ) : (
              <button type="button" className="app-button btn btn--dark btn--flex" data-login-modal-trigger onClick={() => setIsOpen(false)}>
                <i className="icon-username icon--lg" />
                <span>Masuk</span>
              </button>
            )}
            <a href="/deposit" className="btn btn--success btn--flex" onClick={() => setIsOpen(false)}>
              <i className="icon-deposit icon--lg" />
              <span>Deposit</span>
            </a>
            {!user ? (
              <a href="/register" className="btn btn--accent btn--flex" onClick={() => setIsOpen(false)}>
                <i className="icon-account icon--lg" />
                <span>Daftar</span>
              </a>
            ) : null}
            <a
              href="/"
              className="btn btn--flex"
              style={{ backgroundColor: "#0088cc", color: "#fff" }}
            >
              <i className="icon-telegram icon--md" />
              <span>Main di Telegram</span>
              <i className="icon-arrow-right icon--md" />
            </a>
          </div>
        </section>

        <div className="app-drawer__locale">
          <span>Pilih Bahasa:</span>
          <ul>
            <li>
              <a href="/" className="btn btn--sm-round app-drawer__locale--active" onClick={() => setIsOpen(false)}>
                <img src="https://cdn-proxy.globalcontentcloud.com/common/default/flags/id-ID.svg" alt="id" />
              </a>
            </li>
            <li>
              <a href="/en" className="btn btn--sm-round" onClick={() => setIsOpen(false)}>
                <img src="https://cdn-proxy.globalcontentcloud.com/common/default/flags/en-GB.svg" alt="en" />
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function DrawerLink({
  href,
  icon,
  label,
  badge,
  onNavigate
}: {
  href: string;
  icon: string;
  label: string;
  badge?: number;
  onNavigate: () => void;
}) {
  return (
    <li className="app-drawer__nav__item">
      <a href={href} onClick={onNavigate}>
        <div>
          <i className={`${icon} icon--lg`} />
        </div>
        <span>{label}</span>
        {typeof badge === "number" ? (
          <div className="badge badge--danger">
            <span className="badge__value">{badge}</span>
          </div>
        ) : null}
      </a>
    </li>
  );
}
