import { AdminCard, AdminShell, DateText, EmptyState, StatusBadge } from "@/components/admin/admin-shell";
import { formatNumber, ReferralFilterForm, referralUrl, ReferralSubNav } from "@/components/admin/referral-admin";
import { getAffiliateRows, money, parseReferralAdminFilter } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminReferralAffiliatorsPage({ searchParams }: PageProps) {
  const admin = await requireAdmin();
  const query = await searchParams;
  const filter = parseReferralAdminFilter(query);
  const affiliates = await getAffiliateRows(filter);

  return (
    <AdminShell
      admin={admin}
      active="/admin/referrals"
      title="Referral"
      description="Tabel lengkap affiliator, kode utama, jumlah link, downline, dan total deposit."
    >
      <ReferralSubNav active="/admin/referrals/affiliators" />
      <div className="admin-grid" style={{ gap: "18px" }}>
        <AdminCard title="Filter & Sorting Affiliator">
          <ReferralFilterForm filter={filter} mode="affiliators" />
        </AdminCard>

        <AdminCard title="Tabel Affiliator">
          <div className="admin-table-wrap">
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
                    <td>{formatNumber(affiliate.linkCount)}</td>
                    <td>{formatNumber(affiliate.downlineCount)}</td>
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
      </div>
    </AdminShell>
  );
}
