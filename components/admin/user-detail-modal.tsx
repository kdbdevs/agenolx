"use client";

import { useId, useState } from "react";
import type { AdminUserRow } from "@/lib/admin-data";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="admin-detail-field">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

export function UserDetailModal({ user }: { user: AdminUserRow }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const bankAccounts = user.bankAccounts?.split("\n").filter(Boolean) ?? [];

  return (
    <>
      <button className="admin-button admin-button--light" type="button" onClick={() => setOpen(true)}>
        View Detail
      </button>
      {open ? (
        <div className="admin-modal" role="presentation" onMouseDown={() => setOpen(false)}>
          <section
            className="admin-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="admin-modal__header">
              <div>
                <p className="admin-kicker">User Detail</p>
                <h2 id={titleId}>{user.username}</h2>
                <span className={`admin-badge${user.status === "active" ? " admin-badge--good" : " admin-badge--bad"}`}>
                  {user.status}
                </span>
              </div>
              <button className="admin-icon-button" type="button" onClick={() => setOpen(false)} aria-label="Tutup detail user">
                x
              </button>
            </header>

            <div className="admin-modal__body">
              <section className="admin-detail-grid">
                <Field label="User ID" value={user.id} />
                <Field label="Username" value={user.username} />
                <Field label="Referral Code" value={user.referralCode} />
                <Field label="Locale" value={user.locale} />
                <Field label="Email" value={user.email} />
                <Field label="Phone" value={user.phone} />
                <Field label="Saldo" value={formatMoney(user.balance)} />
                <Field label="Register" value={formatDate(user.createdAt)} />
                <Field label="Last Update" value={formatDate(user.updatedAt)} />
                <Field label="Verified Bank" value={user.verifiedBankAccounts} />
                <Field label="Pending Bank" value={user.pendingBankAccounts} />
              </section>

              <section className="admin-detail-section">
                <h3>Rekening Pembayaran</h3>
                {bankAccounts.length ? (
                  <ul>
                    {bankAccounts.map((account) => (
                      <li key={account}>{account}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Belum ada rekening tersimpan.</p>
                )}
              </section>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
