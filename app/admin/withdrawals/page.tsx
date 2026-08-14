import { createWithdrawal, reviewWithdrawal } from "@/app/admin/actions";
import { AdminCard, AdminShell, DateText, EmptyState, FilterBar, StatusBadge } from "@/components/admin/admin-shell";
import { getAdminWithdrawals, getWithdrawalUserOptions, money, parseAdminFilter } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminWithdrawalsPage({ searchParams }: PageProps) {
  const admin = await requireAdmin();
  const query = await searchParams;
  const filter = parseAdminFilter(query);
  const [withdrawals, users] = await Promise.all([getAdminWithdrawals(filter), getWithdrawalUserOptions()]);

  return (
    <AdminShell
      admin={admin}
      active="/admin/withdrawals"
      title="Withdrawals"
      description="Buat dan review withdrawal. Approval otomatis mencatat debit di wallet ledger."
    >
      <div className="admin-grid" style={{ gap: "18px" }}>
        <AdminCard title="Buat Withdrawal Manual">
          <form className="admin-form-grid admin-form-grid--three" action={createWithdrawal}>
            <div className="admin-field">
              <label>User</label>
              <select name="userId" required defaultValue="">
                <option value="" disabled>Pilih user</option>
                {users.map((user) => (
                  <option value={user.id} key={`${user.id}-${user.bankAccountId ?? "none"}`}>
                    {user.username}{user.bankLabel ? ` - ${user.bankLabel}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Rekening ID</label>
              <select name="userBankAccountId" defaultValue="">
                <option value="">Tanpa rekening</option>
                {users.filter((user) => user.bankAccountId).map((user) => (
                  <option value={user.bankAccountId ?? ""} key={`bank-${user.bankAccountId}`}>
                    {user.username} - {user.bankLabel}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Amount</label>
              <input name="amount" type="number" min={50000} placeholder="50000" required />
            </div>
            <button className="admin-button" type="submit">Buat</button>
            <div className="admin-field" style={{ gridColumn: "1 / -1" }}>
              <label>Catatan</label>
              <textarea name="adminNotes" placeholder="Opsional" />
            </div>
          </form>
        </AdminCard>

        <AdminCard
          title="Daftar Withdrawal"
          action={
            <FilterBar
              q={filter.q}
              status={filter.status}
              statuses={[
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
                { value: "cancelled", label: "Cancelled" }
              ]}
            />
          }
        >
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Withdrawal</th>
                  <th>User</th>
                  <th>Rekening</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Waktu</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td>
                      <strong>#{withdrawal.id}</strong>
                      <small>{withdrawal.reference ?? "-"}</small>
                    </td>
                    <td>{withdrawal.username}</td>
                    <td>
                      <strong>{withdrawal.bankName ?? "-"}</strong>
                      <small>{withdrawal.accountName ?? "-"} / {withdrawal.accountNumber ?? "-"}</small>
                    </td>
                    <td>{money(withdrawal.amount)}</td>
                    <td><StatusBadge status={withdrawal.status} /></td>
                    <td>
                      <DateText value={withdrawal.createdAt} />
                      <small>Updated: <DateText value={withdrawal.updatedAt} /></small>
                    </td>
                    <td>
                      {withdrawal.status === "pending" ? (
                        <form className="admin-review-form" action={reviewWithdrawal}>
                          <input type="hidden" name="withdrawalId" value={withdrawal.id} />
                          <select name="status" defaultValue="approved" className="admin-inline-input">
                            <option value="approved">Approve</option>
                            <option value="rejected">Reject</option>
                            <option value="cancelled">Cancel</option>
                          </select>
                          <input name="adminNotes" className="admin-inline-input" placeholder="Catatan admin" />
                          <button className="admin-button" type="submit">Proses</button>
                        </form>
                      ) : (
                        <p className="admin-note">{withdrawal.adminNotes ?? "-"}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {withdrawals.length === 0 ? <EmptyState>Tidak ada withdrawal yang cocok dengan filter.</EmptyState> : null}
        </AdminCard>
      </div>
    </AdminShell>
  );
}
