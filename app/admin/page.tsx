import Link from "next/link";
import { AdminCard, AdminShell, DateText, EmptyState, MetricCard, StatusBadge } from "@/components/admin/admin-shell";
import { getAdminDeposits, getAdminWithdrawals, getDashboardStats, money } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const [stats, deposits, withdrawals] = await Promise.all([
    getDashboardStats(),
    getAdminDeposits({ status: "pending" }),
    getAdminWithdrawals({ status: "pending" })
  ]);

  return (
    <AdminShell
      admin={admin}
      active="/admin"
      title="Dashboard"
      description="Ringkasan operasional user, saldo, deposit, dan withdrawal."
    >
      <section className="admin-metrics">
        <MetricCard label="Total User" value={String(stats.users)} hint={`${stats.activeUsers} akun aktif`} tone="green" />
        <MetricCard label="Pending Deposit" value={String(stats.pendingDeposits)} hint={money(stats.approvedDepositAmount)} tone="amber" />
        <MetricCard label="Pending WD" value={String(stats.pendingWithdrawals)} hint={money(stats.approvedWithdrawalAmount)} tone="red" />
        <MetricCard label="Saldo Ledger" value={money(stats.walletLiability)} hint="Credit - debit semua wallet" tone="blue" />
      </section>

      <section className="admin-grid admin-grid--two">
        <AdminCard title="Deposit Menunggu" action={<Link className="admin-button admin-button--light" href="/admin/deposits?status=pending">Lihat semua</Link>}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {deposits.slice(0, 6).map((deposit) => (
                  <tr key={deposit.id}>
                    <td>
                      <strong>{deposit.username}</strong>
                      <small>{deposit.reference}</small>
                    </td>
                    <td>{money(deposit.amount)}</td>
                    <td><StatusBadge status={deposit.status} /></td>
                    <td><DateText value={deposit.createdAt} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {deposits.length === 0 ? <EmptyState>Tidak ada deposit pending.</EmptyState> : null}
        </AdminCard>

        <AdminCard title="Withdrawal Menunggu" action={<Link className="admin-button admin-button--light" href="/admin/withdrawals?status=pending">Lihat semua</Link>}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.slice(0, 6).map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td>
                      <strong>{withdrawal.username}</strong>
                      <small>{withdrawal.reference}</small>
                    </td>
                    <td>{money(withdrawal.amount)}</td>
                    <td><StatusBadge status={withdrawal.status} /></td>
                    <td><DateText value={withdrawal.createdAt} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {withdrawals.length === 0 ? <EmptyState>Tidak ada withdrawal pending.</EmptyState> : null}
        </AdminCard>
      </section>
    </AdminShell>
  );
}
