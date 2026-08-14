import { reviewDeposit } from "@/app/admin/actions";
import { AdminCard, AdminShell, DateText, EmptyState, FilterBar, StatusBadge } from "@/components/admin/admin-shell";
import { getAdminDeposits, money, parseAdminFilter } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminDepositsPage({ searchParams }: PageProps) {
  const admin = await requireAdmin();
  const query = await searchParams;
  const filter = parseAdminFilter(query);
  const deposits = await getAdminDeposits(filter);

  return (
    <AdminShell
      admin={admin}
      active="/admin/deposits"
      title="Deposits"
      description="Review deposit manual, approve untuk credit saldo, atau reject/expire dengan catatan."
    >
      <AdminCard
        title="Daftar Deposit"
        action={
          <FilterBar
            q={filter.q}
            status={filter.status}
            statuses={[
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
              { value: "expired", label: "Expired" }
            ]}
          />
        }
      >
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Deposit</th>
                <th>User</th>
                <th>Metode</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Waktu</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => (
                <tr key={deposit.id}>
                  <td>
                    <strong>#{deposit.id}</strong>
                    <small>{deposit.reference ?? "-"}</small>
                  </td>
                  <td>{deposit.username}</td>
                  <td>{deposit.method.replace("_", " ")}</td>
                  <td>{money(deposit.amount)}</td>
                  <td><StatusBadge status={deposit.status} /></td>
                  <td>
                    <DateText value={deposit.createdAt} />
                    <small>Updated: <DateText value={deposit.updatedAt} /></small>
                  </td>
                  <td>
                    {deposit.status === "pending" ? (
                      <form className="admin-review-form" action={reviewDeposit}>
                        <input type="hidden" name="depositId" value={deposit.id} />
                        <select name="status" defaultValue="approved" className="admin-inline-input">
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                          <option value="expired">Expire</option>
                        </select>
                        <input name="adminNotes" className="admin-inline-input" placeholder="Catatan admin" />
                        <button className="admin-button" type="submit">Proses</button>
                      </form>
                    ) : (
                      <p className="admin-note">{deposit.adminNotes ?? "-"}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {deposits.length === 0 ? <EmptyState>Tidak ada deposit yang cocok dengan filter.</EmptyState> : null}
      </AdminCard>
    </AdminShell>
  );
}
