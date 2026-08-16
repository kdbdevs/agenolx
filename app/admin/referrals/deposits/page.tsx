import Link from "next/link";
import { AdminCard, AdminShell, DateText, EmptyState } from "@/components/admin/admin-shell";
import { formatNumber, ReferralFilterForm, referralQuery, ReferralSubNav } from "@/components/admin/referral-admin";
import { getAffiliateDepositReportRows, money, parseReferralAdminFilter } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminReferralDepositsPage({ searchParams }: PageProps) {
  const admin = await requireAdmin();
  const query = await searchParams;
  const filter = parseReferralAdminFilter(query);
  const depositReports = await getAffiliateDepositReportRows(filter);

  return (
    <AdminShell
      admin={admin}
      active="/admin/referrals"
      title="Referral"
      description="Total deposit downline per affiliator berdasarkan range tanggal."
    >
      <ReferralSubNav active="/admin/referrals/deposits" />
      <div className="admin-grid" style={{ gap: "18px" }}>
        <AdminCard title="Filter & Sorting Deposit Downline">
          <ReferralFilterForm filter={filter} mode="deposits" />
        </AdminCard>

        <AdminCard title={`Deposit Downline (${filter.dateFrom} sampai ${filter.dateTo})`}>
          <div className="admin-table-wrap">
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
                      <Link
                        className="admin-row-link"
                        href={`/admin/referrals/deposits/${row.id}?${referralQuery(filter)}`}
                      >
                        <strong>{row.username}</strong>
                        <small>{row.referralCode}</small>
                      </Link>
                    </td>
                    <td>
                      <Link
                        className="admin-row-link"
                        href={`/admin/referrals/deposits/${row.id}?${referralQuery(filter)}`}
                      >
                        {formatNumber(row.downlineCount)}
                      </Link>
                    </td>
                    <td>{formatNumber(row.depositCount)}</td>
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
