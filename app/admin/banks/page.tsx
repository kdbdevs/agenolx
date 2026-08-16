import { saveBank } from "@/app/admin/actions";
import { AdminCard, AdminShell, DateText, EmptyState, FilterBar, StatusBadge } from "@/components/admin/admin-shell";
import { getAdminBanks, parseAdminFilter } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminBanksPage({ searchParams }: PageProps) {
  const admin = await requireAdmin();
  const query = await searchParams;
  const filter = parseAdminFilter(query);
  const banks = await getAdminBanks(filter);

  return (
    <AdminShell
      admin={admin}
      active="/admin/banks"
      title="Banks"
      description="Atur channel bank dan e-money untuk register, deposit, dan withdrawal."
    >
      <div className="admin-grid" style={{ gap: "18px" }}>
        <AdminCard title="Tambah Bank / E-money">
          <form className="admin-form-grid admin-form-grid--four admin-bank-form" action={saveBank}>
            <div className="admin-field admin-bank-form__code">
              <label>Kode</label>
              <input name="code" placeholder="BCA / 54" required />
            </div>
            <div className="admin-field admin-bank-form__name">
              <label>Nama</label>
              <input name="name" placeholder="BCA" required />
            </div>
            <div className="admin-field admin-bank-form__type">
              <label>Tipe</label>
              <select name="type" defaultValue="bank">
                <option value="bank">Bank</option>
                <option value="e_money">E-money</option>
              </select>
            </div>
            <label className="admin-checkbox admin-bank-form__status">
              <input type="checkbox" name="isActive" defaultChecked />
              Aktif
            </label>
            <div className="admin-field admin-bank-form__logo">
              <label>Logo URL</label>
              <input name="logoUrl" placeholder="Opsional" />
            </div>
            <div className="admin-field admin-bank-form__account">
              <label>Nama Rekening Deposit</label>
              <input name="depositAccountName" placeholder="Opsional" />
            </div>
            <div className="admin-field admin-bank-form__account">
              <label>Nomor Rekening Deposit</label>
              <input name="depositAccountNumber" placeholder="Opsional" />
            </div>
            <button className="admin-button admin-bank-form__action" type="submit">Tambah</button>
          </form>
        </AdminCard>

        <AdminCard
          title="Daftar Bank"
          action={
            <FilterBar
              q={filter.q}
              status={filter.status}
              statuses={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" }
              ]}
            />
          }
        >
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bank</th>
                  <th>Tipe</th>
                  <th>Rekening Deposit</th>
                  <th>Status</th>
                  <th>Dibuat</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {banks.map((bank) => (
                  <tr key={bank.id}>
                    <td>
                      <strong>{bank.name}</strong>
                      <small>{bank.code}</small>
                    </td>
                    <td>{bank.type}</td>
                    <td>
                      <strong>{bank.depositAccountName ?? "-"}</strong>
                      <small>{bank.depositAccountNumber ?? ""}</small>
                    </td>
                    <td><StatusBadge status={bank.isActive ? "active" : "disabled"} /></td>
                    <td><DateText value={bank.createdAt} /></td>
                    <td>
                      <form className="admin-form-grid admin-form-grid--four admin-bank-form" action={saveBank} style={{ padding: 0 }}>
                        <input type="hidden" name="bankId" value={bank.id} />
                        <div className="admin-field admin-bank-form__code">
                          <label>Kode</label>
                          <input name="code" defaultValue={bank.code} required />
                        </div>
                        <div className="admin-field admin-bank-form__name">
                          <label>Nama</label>
                          <input name="name" defaultValue={bank.name} required />
                        </div>
                        <div className="admin-field admin-bank-form__type">
                          <label>Tipe</label>
                          <select name="type" defaultValue={bank.type}>
                            <option value="bank">Bank</option>
                            <option value="e_money">E-money</option>
                          </select>
                        </div>
                        <label className="admin-checkbox admin-bank-form__status">
                          <input type="checkbox" name="isActive" defaultChecked={bank.isActive} />
                          Aktif
                        </label>
                        <div className="admin-field admin-bank-form__logo">
                          <label>Logo URL</label>
                          <input name="logoUrl" defaultValue={bank.logoUrl ?? ""} />
                        </div>
                        <div className="admin-field admin-bank-form__account">
                          <label>Nama Rekening Deposit</label>
                          <input name="depositAccountName" defaultValue={bank.depositAccountName ?? ""} />
                        </div>
                        <div className="admin-field admin-bank-form__account">
                          <label>Nomor Rekening Deposit</label>
                          <input name="depositAccountNumber" defaultValue={bank.depositAccountNumber ?? ""} />
                        </div>
                        <button className="admin-button admin-button--dark admin-bank-form__action" type="submit">Simpan</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {banks.length === 0 ? <EmptyState>Tidak ada bank yang cocok dengan filter.</EmptyState> : null}
        </AdminCard>
      </div>
    </AdminShell>
  );
}
