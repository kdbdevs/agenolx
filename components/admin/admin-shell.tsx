import Link from "next/link";
import type { ReactNode } from "react";
import type { AdminSession } from "@/lib/admin-auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/users", label: "Users", icon: "◉" },
  { href: "/admin/referrals", label: "Referral", icon: "⌁" },
  { href: "/admin/banks", label: "Banks", icon: "▤" },
  { href: "/admin/deposits", label: "Deposits", icon: "↧" },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: "↥" }
];

export function AdminShell({
  admin,
  active,
  title,
  description,
  children
}: {
  admin: AdminSession;
  active: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <img src="/logo-pemula-bet.webp" alt="PEMULABET" />
          <span>Admin</span>
        </Link>
        <nav className="admin-nav" aria-label="Admin navigation">
          <p className="admin-nav__eyebrow">Menu</p>
          {navItems.map((item) => (
            <Link className={`admin-nav__item${active === item.href ? " admin-nav__item--active" : ""}`} href={item.href} key={item.href}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-kicker">PEMULABET Control Panel</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          <div className="admin-userchip">
            <span>{admin.displayName.slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{admin.displayName}</strong>
              <small>{admin.role}</small>
            </div>
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="admin-icon-button" title="Logout">
                ↪
              </button>
            </form>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

export function MetricCard({ label, value, hint, tone = "green" }: { label: string; value: string; hint: string; tone?: "green" | "blue" | "amber" | "red" }) {
  return (
    <article className={`admin-metric admin-metric--${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <p>{hint}</p>
    </article>
  );
}

export function AdminCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="admin-card">
      <header className="admin-card__header">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}

export function FilterBar({
  q,
  status,
  statuses
}: {
  q?: string;
  status?: string;
  statuses: Array<{ value: string; label: string }>;
}) {
  return (
    <form className="admin-filter">
      <input name="q" placeholder="Cari data..." defaultValue={q ?? ""} />
      <select name="status" defaultValue={status ?? ""}>
        <option value="">Semua status</option>
        {statuses.map((item) => (
          <option value={item.value} key={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <button className="admin-button admin-button--dark" type="submit">
        Filter
      </button>
    </form>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const good = ["active", "approved", "verified"].includes(status);
  const wait = ["pending"].includes(status);
  const bad = ["rejected", "suspended", "locked", "expired", "cancelled", "disabled"].includes(status);
  return <span className={`admin-badge${good ? " admin-badge--good" : wait ? " admin-badge--wait" : bad ? " admin-badge--bad" : ""}`}>{status}</span>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="admin-empty">{children}</div>;
}

export function DateText({ value }: { value: string | Date }) {
  return <span>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))}</span>;
}
