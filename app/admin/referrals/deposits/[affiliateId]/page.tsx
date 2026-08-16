import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminCard, AdminShell, DateText, EmptyState, MetricCard, StatusBadge } from "@/components/admin/admin-shell";
import { formatNumber, ReferralFilterForm, referralQuery, ReferralSubNav } from "@/components/admin/referral-admin";
import { getAffiliateDepositDetail, money, parseReferralAdminFilter } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

type PageProps = {
  params: Promise<{ affiliateId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminReferralDepositDetailPage({ params, searchParams }: PageProps) {
  const admin = await requireAdmin();
  const [{ affiliateId }, query] = await Promise.all([params, searchParams]);
  const affiliateIdNumber = Number(affiliateId);
  if (!Number.isInteger(affiliateIdNumber) || affiliateIdNumber <= 0) notFound();

  const filter = parseReferralAdminFilter(query);
  const detail = await getAffiliateDepositDetail(affiliateIdNumber, filter);
  if (!detail.affiliate) notFound();

  return (
    <AdminShell
      admin={admin}
      active="/admin/referrals"
      title="Referral"
      description={`Detail deposit downline untuk affiliator ${detail.affiliate.username}.`}
    >
      <ReferralSubNav active="/admin/referrals/deposits" />
      <div className="admin-actions" style={{ marginBottom: "18px" }}>
        <Link className="admin-button admin-button--light" href={`/admin/referrals/deposits?${referralQuery(filter)}`}>
          Kembali ke Deposit Downline
        </Link>
      </div>

      <section className="admin-metrics">
        <MetricCard label="Affiliator" value={detail.affiliate.username} hint={`ID ${detail.affiliate.id}`} tone="green" />
        <MetricCard label="Total Downline" value={formatNumber(detail.totals.downlines)} hint="Downline dari affiliator ini" tone="blue" />
        <MetricCard label="Deposit" value={formatNumber(detail.totals.deposits)} hint={`${filter.dateFrom} sampai ${filter.dateTo}`} tone="amber" />
        <MetricCard label="Approved" value={money(detail.totals.approvedAmount)} hint={`Pending ${money(detail.totals.pendingAmount)}`} tone="green" />
      </section>

      <div className="admin-grid" style={{ gap: "18px" }}>
        <AdminCard title="Informasi Affiliator">
          <div className="admin-detail-grid">
            <div className="admin-detail-field">
              <span>ID Affiliator</span>
              <strong>{detail.affiliate.id}</strong>
            </div>
            <div className="admin-detail-field">
              <span>Username</span>
              <strong>{detail.affiliate.username}</strong>
            </div>
            <div className="admin-detail-field">
              <span>Kode Referral</span>
              <strong>{detail.affiliate.referralCode}</strong>
            </div>
            <div className="admin-detail-field">
              <span>Daftar</span>
              <strong><DateText value={detail.affiliate.createdAt} /></strong>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Filter Detail Deposit Downline">
          <ReferralFilterForm filter={filter} mode="deposits" compact />
        </AdminCard>

        <AdminCard title={`Detail Downline & Deposit (${filter.dateFrom} sampai ${filter.dateTo})`}>
          <div className="admin-table-wrap">
            <table className="admin-table admin-referral-table">
              <thead>
                <tr>
                  <th>ID Downline</th>
                  <th>Downline</th>
                  <th>Tanggal Downline Daftar</th>
                  <th>Deposit</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                  <th>Tanggal Deposit</th>
                  <th>Tanggal Review</th>
                </tr>
              </thead>
              <tbody>
                {detail.rows.map((row, index) => (
                  <tr key={`${row.downlineId}-${row.depositId ?? `empty-${index}`}`}>
                    <td>
                      <strong>#{row.downlineId}</strong>
                    </td>
                    <td>{row.downlineUsername}</td>
                    <td><DateText value={row.downlineCreatedAt} /></td>
                    <td>
                      {row.depositId ? (
                        <>
                          <strong>#{row.depositId}</strong>
                          <small>{row.reference ?? "-"}</small>
                          <small>{row.bankName ?? row.method?.replace("_", " ") ?? "-"}</small>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{row.depositId ? money(row.amount) : "-"}</td>
                    <td>{row.status ? <StatusBadge status={row.status} /> : "-"}</td>
                    <td>{row.depositCreatedAt ? <DateText value={row.depositCreatedAt} /> : "-"}</td>
                    <td>{row.reviewedAt ? <DateText value={row.reviewedAt} /> : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {detail.rows.length === 0 ? <EmptyState>Belum ada downline atau deposit pada range ini.</EmptyState> : null}
        </AdminCard>
      </div>
    </AdminShell>
  );
}
