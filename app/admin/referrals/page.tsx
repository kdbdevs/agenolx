import { createReferralLink, updateReferralLinkStatus } from "@/app/admin/actions";
import { AdminCard, AdminShell, DateText, EmptyState, StatusBadge } from "@/components/admin/admin-shell";
import {
  getAffiliateDepositReportRows,
  getAffiliateRows,
  getReferralLinks,
  getReferralUserOptions,
  money,
  parseReferralAdminFilter
} from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function num(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function referralUrl(code: string) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://pemulabet.com").replace(/\/$/, "");
  return `${baseUrl}/register?ref=${encodeURIComponent(code)}`;
}

export default async function AdminReferralsPage({ searchParams }: PageProps) {
  const admin = await requireAdmin();
  const query = await searchParams;
  const filter = parseReferralAdminFilter(query);
  const [users, links, affiliates, depositReports] = await Promise.all([
    getReferralUserOptions(),
    getReferralLinks(filter),
    getAffiliateRows(filter),
    getAffiliateDepositReportRows(filter)
  ]);

  return (
    <AdminShell
      admin={admin}
      active="/admin/referrals"
      title="Referral"
      description="Buat link referral affiliator, pantau downline, dan lihat total deposit downline berdasarkan range tanggal."
    >
      <div className="admin-referral-tabs" aria-label="Referral sections">
        <a href="#create-link">Create Link</a>
        <a href="#affiliators">Affiliator</a>
        <a href="#downline-deposits">Deposit Downline</a>
      </div>

      <div className="admin-grid" style={{ gap: "18px" }}>
        <AdminCard title="Create Link Referral">
          <form id="create-link" className="admin-form-grid admin-referral-form" action={createReferralLink}>
            <div className="admin-field admin-referral-form__owner">
              <label>Affiliator</label>
              <select name="ownerUserId" required disabled={users.length === 0}>
                <option value="">Pilih affiliator</option>
                {users.map((user) => (
                  <option value={user.id} key={user.id}>
                    {user.username} ({user.referralCode})
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Kode Custom</label>
              <input name="code" placeholder="Kosongkan untuk random" />
            </div>
            <div className="admin-field admin-referral-form__label">
              <label>Label</label>
              <input name="label" placeholder="Contoh: Campaign Agustus" />
            </div>
            <label className="admin-checkbox">
              <input type="checkbox" name="isActive" defaultChecked />
              Aktif
            </label>
            <button className="admin-button admin-referral-form__action" type="submit" disabled={users.length === 0}>
              Buat Link
            </button>
          </form>
          {users.length === 0 ? <EmptyState>Belum ada user aktif untuk dijadikan affiliator.</EmptyState> : null}
        </AdminCard>

        <AdminCard title="Filter & Sorting Referral">
          <form className="admin-filter admin-referral-filter">
            <input name="q" placeholder="Cari affiliator / kode link..." defaultValue={filter.q ?? ""} />
            <select name="status" defaultValue={filter.status ?? ""}>
              <option value="">Semua status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled link</option>
              <option value="locked">Locked user</option>
              <option value="suspended">Suspended user</option>
            </select>
            <select name="range" defaultValue={filter.range ?? "month"}>
              <option value="today">Hari ini</option>
              <option value="week">7 hari</option>
              <option value="month">Bulan ini</option>
              <option value="custom">Custom tanggal</option>
            </select>
            <input type="date" name="dateFrom" defaultValue={filter.dateFrom} aria-label="Tanggal mulai" />
            <input type="date" name="dateTo" defaultValue={filter.dateTo} aria-label="Tanggal akhir" />
            <select name="affiliateSort" defaultValue={filter.affiliateSort}>
              <option value="approvedDeposits">Sort affiliator: total deposit</option>
              <option value="downlines">Sort affiliator: downline</option>
              <option value="links">Sort affiliator: jumlah link</option>
              <option value="username">Sort affiliator: username</option>
              <option value="createdAt">Sort affiliator: tanggal daftar</option>
            </select>
            <select name="affiliateDir" defaultValue={filter.affiliateDir}>
              <option value="desc">Besar ke kecil</option>
              <option value="asc">Kecil ke besar</option>
            </select>
            <select name="depositSort" defaultValue={filter.depositSort}>
              <option value="approvedAmount">Sort deposit: approved</option>
              <option value="pendingAmount">Sort deposit: pending</option>
              <option value="depositCount">Sort deposit: jumlah transaksi</option>
              <option value="downlines">Sort deposit: downline</option>
              <option value="lastDeposit">Sort deposit: terakhir deposit</option>
              <option value="affiliate">Sort deposit: affiliator</option>
            </select>
            <select name="depositDir" defaultValue={filter.depositDir}>
              <option value="desc">Besar ke kecil</option>
              <option value="asc">Kecil ke besar</option>
            </select>
            <button className="admin-button admin-button--dark" type="submit">
              Terapkan
            </button>
          </form>
        </AdminCard>

        <AdminCard title="Link Referral">
          <div className="admin-table-wrap">
            <table className="admin-table admin-referral-table">
              <thead>
                <tr>
                  <th>Link</th>
                  <th>Affiliator</th>
                  <th>Downline</th>
                  <th>Deposit Approved</th>
                  <th>Status</th>
                  <th>Dibuat</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id}>
                    <td>
                      <strong>{link.code}</strong>
                      <small>{link.label ?? "-"}</small>
                      <a className="admin-copy-link" href={referralUrl(link.code)} target="_blank" rel="noreferrer">
                        {referralUrl(link.code)}
                      </a>
                    </td>
                    <td>{link.ownerUsername}</td>
                    <td>{num(link.downlineCount)}</td>
                    <td>{money(link.approvedDepositAmount)}</td>
                    <td><StatusBadge status={link.status} /></td>
                    <td>
                      <DateText value={link.createdAt} />
                      <small>Updated: <DateText value={link.updatedAt} /></small>
                    </td>
                    <td>
                      <form className="admin-actions" action={updateReferralLinkStatus}>
                        <input type="hidden" name="referralLinkId" value={link.id} />
                        <select name="status" className="admin-inline-input" defaultValue={link.status}>
                          <option value="active">Active</option>
                          <option value="disabled">Disabled</option>
                        </select>
                        <button className="admin-button admin-button--dark" type="submit">Simpan</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {links.length === 0 ? <EmptyState>Tidak ada link referral yang cocok.</EmptyState> : null}
        </AdminCard>

        <AdminCard title="Tabel Affiliator">
          <div id="affiliators" className="admin-table-wrap">
            <table className="admin-table admin-referral-table">
              <thead>
                <tr>
                  <th>Affiliator</th>
                  <th>Kode Utama</th>
                  <th>Link Custom</th>
                  <th>Downline</th>
                  <th>Total Deposit Approved</th>
                  <th>Downline Terakhir</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((affiliate) => (
                  <tr key={affiliate.id}>
                    <td>
                      <strong>{affiliate.username}</strong>
                      <small>Daftar: <DateText value={affiliate.createdAt} /></small>
                    </td>
                    <td>
                      <strong>{affiliate.referralCode}</strong>
                      <a className="admin-copy-link" href={referralUrl(affiliate.referralCode)} target="_blank" rel="noreferrer">
                        {referralUrl(affiliate.referralCode)}
                      </a>
                    </td>
                    <td>{num(affiliate.linkCount)}</td>
                    <td>{num(affiliate.downlineCount)}</td>
                    <td>{money(affiliate.approvedDepositAmount)}</td>
                    <td>{affiliate.lastDownlineAt ? <DateText value={affiliate.lastDownlineAt} /> : "-"}</td>
                    <td><StatusBadge status={affiliate.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {affiliates.length === 0 ? <EmptyState>Tidak ada affiliator yang cocok.</EmptyState> : null}
        </AdminCard>

        <AdminCard title={`Deposit Downline (${filter.dateFrom} sampai ${filter.dateTo})`}>
          <div id="downline-deposits" className="admin-table-wrap">
            <table className="admin-table admin-referral-table">
              <thead>
                <tr>
                  <th>Affiliator</th>
                  <th>Downline</th>
                  <th>Jumlah Deposit</th>
                  <th>Total Approved</th>
                  <th>Total Pending</th>
                  <th>Deposit Terakhir</th>
                </tr>
              </thead>
              <tbody>
                {depositReports.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.username}</strong>
                      <small>{row.referralCode}</small>
                    </td>
                    <td>{num(row.downlineCount)}</td>
                    <td>{num(row.depositCount)}</td>
                    <td>{money(row.approvedDepositAmount)}</td>
                    <td>{money(row.pendingDepositAmount)}</td>
                    <td>{row.lastDepositAt ? <DateText value={row.lastDepositAt} /> : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {depositReports.length === 0 ? <EmptyState>Tidak ada deposit downline pada range ini.</EmptyState> : null}
        </AdminCard>
      </div>
    </AdminShell>
  );
}
