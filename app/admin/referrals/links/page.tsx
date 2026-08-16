import { createReferralLink, updateReferralLinkStatus } from "@/app/admin/actions";
import { AdminCard, AdminShell, DateText, EmptyState, StatusBadge } from "@/components/admin/admin-shell";
import { formatNumber, ReferralFilterForm, referralUrl, ReferralSubNav } from "@/components/admin/referral-admin";
import { getReferralLinks, getReferralUserOptions, money, parseReferralAdminFilter } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/admin-auth";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminReferralLinksPage({ searchParams }: PageProps) {
  const admin = await requireAdmin();
  const query = await searchParams;
  const filter = parseReferralAdminFilter(query);
  const [users, links] = await Promise.all([getReferralUserOptions(), getReferralLinks(filter)]);

  return (
    <AdminShell
      admin={admin}
      active="/admin/referrals"
      title="Referral"
      description="Buat dan kelola link referral random atau custom untuk affiliator."
    >
      <ReferralSubNav active="/admin/referrals/links" />
      <div className="admin-grid" style={{ gap: "18px" }}>
        <AdminCard title="Create Link Referral">
          <form className="admin-form-grid admin-referral-form" action={createReferralLink}>
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

        <AdminCard title="Filter Link Referral">
          <ReferralFilterForm filter={filter} mode="links" />
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
                    <td>{formatNumber(link.downlineCount)}</td>
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
      </div>
    </AdminShell>
  );
}
