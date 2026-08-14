import { updateUserStatus } from "@/app/admin/actions";
import { AdminCard, AdminShell, EmptyState, FilterBar, StatusBadge } from "@/components/admin/admin-shell";
import { UserDetailModal } from "@/components/admin/user-detail-modal";
import { parseAdminFilter, getAdminUsers } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const admin = await requireAdmin();
  const query = await searchParams;
  const filter = parseAdminFilter(query);
  const users = await getAdminUsers(filter);

  return (
    <AdminShell
      admin={admin}
      active="/admin/users"
      title="Users"
      description="Kelola user yang register, status akun, saldo, dan rekening pembayaran mereka."
    >
      <AdminCard
        title="User Register"
        action={
          <FilterBar
            q={filter.q}
            status={filter.status}
            statuses={[
              { value: "active", label: "Active" },
              { value: "locked", label: "Locked" },
              { value: "suspended", label: "Suspended" }
            ]}
          />
        }
      >
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Kontak</th>
                <th>Rekening</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.username}</strong>
                    <small>{user.referralCode}</small>
                  </td>
                  <td>
                    <div>{user.email ?? "-"}</div>
                    <small>{user.phone ?? "-"}</small>
                  </td>
                  <td className="admin-note">{user.bankAccounts ?? "-"}</td>
                  <td><StatusBadge status={user.status} /></td>
                  <td>
                    <div className="admin-actions admin-actions--stack">
                      <UserDetailModal user={user} />
                      <form className="admin-actions" action={updateUserStatus}>
                        <input type="hidden" name="userId" value={user.id} />
                        <select className="admin-inline-input" name="status" defaultValue={user.status} aria-label={`Status ${user.username}`}>
                          <option value="active">Active</option>
                          <option value="locked">Locked</option>
                          <option value="suspended">Suspended</option>
                        </select>
                        <button className="admin-button admin-button--dark" type="submit">Simpan</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 ? <EmptyState>Tidak ada user yang cocok dengan filter.</EmptyState> : null}
      </AdminCard>
    </AdminShell>
  );
}
