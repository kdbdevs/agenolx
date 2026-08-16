import Link from "next/link";
import type { ReferralAdminFilter } from "@/lib/admin-data";

const referralNavItems = [
  { href: "/admin/referrals/links", label: "Create Link" },
  { href: "/admin/referrals/affiliators", label: "Affiliator" },
  { href: "/admin/referrals/deposits", label: "Deposit Downline" }
];

export function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function referralUrl(code: string) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://pemulabet.com").replace(/\/$/, "");
  return `${baseUrl}/register?ref=${encodeURIComponent(code)}`;
}

export function referralQuery(filter: ReferralAdminFilter, overrides: Record<string, string | number | undefined> = {}) {
  const params = new URLSearchParams({
    range: filter.range ?? "month",
    dateFrom: filter.dateFrom,
    dateTo: filter.dateTo,
    depositSort: filter.depositSort,
    depositDir: filter.depositDir
  });

  if (filter.q) params.set("q", filter.q);
  if (filter.status) params.set("status", filter.status);

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  }

  return params.toString();
}

export function ReferralSubNav({ active }: { active: string }) {
  return (
    <div className="admin-referral-tabs" aria-label="Referral sections">
      {referralNavItems.map((item) => (
        <Link
          className={`admin-referral-tabs__item${active === item.href ? " admin-referral-tabs__item--active" : ""}`}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function ReferralFilterForm({
  filter,
  mode,
  compact = false
}: {
  filter: ReferralAdminFilter;
  mode: "links" | "affiliators" | "deposits";
  compact?: boolean;
}) {
  const showDates = mode === "deposits";
  const showAffiliateSort = mode === "affiliators";
  const showDepositSort = mode === "deposits";
  const statusLabel = mode === "links" ? "Semua status link" : "Semua status user";

  return (
    <form className={`admin-filter admin-referral-filter${compact ? " admin-referral-filter--compact" : ""}`}>
      <input
        name="q"
        placeholder={mode === "links" ? "Cari affiliator / kode link..." : "Cari affiliator..."}
        defaultValue={filter.q ?? ""}
      />
      <select name="status" defaultValue={filter.status ?? ""}>
        <option value="">{statusLabel}</option>
        {mode === "links" ? (
          <>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </>
        ) : (
          <>
            <option value="active">Active</option>
            <option value="locked">Locked</option>
            <option value="suspended">Suspended</option>
          </>
        )}
      </select>

      {showDates ? (
        <>
          <select name="range" defaultValue={filter.range ?? "month"}>
            <option value="today">Hari ini</option>
            <option value="week">7 hari</option>
            <option value="month">Bulan ini</option>
            <option value="custom">Custom tanggal</option>
          </select>
          <input type="date" name="dateFrom" defaultValue={filter.dateFrom} aria-label="Tanggal mulai" />
          <input type="date" name="dateTo" defaultValue={filter.dateTo} aria-label="Tanggal akhir" />
        </>
      ) : null}

      {showAffiliateSort ? (
        <>
          <select name="affiliateSort" defaultValue={filter.affiliateSort}>
            <option value="approvedDeposits">Sort: total deposit</option>
            <option value="downlines">Sort: downline</option>
            <option value="links">Sort: jumlah link</option>
            <option value="username">Sort: username</option>
            <option value="createdAt">Sort: tanggal daftar</option>
          </select>
          <select name="affiliateDir" defaultValue={filter.affiliateDir}>
            <option value="desc">Besar ke kecil</option>
            <option value="asc">Kecil ke besar</option>
          </select>
        </>
      ) : null}

      {showDepositSort ? (
        <>
          <select name="depositSort" defaultValue={filter.depositSort}>
            <option value="approvedAmount">Sort: approved</option>
            <option value="pendingAmount">Sort: pending</option>
            <option value="depositCount">Sort: jumlah transaksi</option>
            <option value="downlines">Sort: downline</option>
            <option value="lastDeposit">Sort: terakhir deposit</option>
            <option value="affiliate">Sort: affiliator</option>
          </select>
          <select name="depositDir" defaultValue={filter.depositDir}>
            <option value="desc">Besar ke kecil</option>
            <option value="asc">Kecil ke besar</option>
          </select>
        </>
      ) : null}

      <button className="admin-button admin-button--dark" type="submit">
        Terapkan
      </button>
    </form>
  );
}
