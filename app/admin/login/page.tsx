import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const admin = await getAdminSession();
  if (admin) redirect("/admin");
  const query = await searchParams;
  const error = first(query.error);

  return (
    <main className="admin-login">
      <section className="admin-login__media">
        <img src="/logo-pemula-bet.webp" alt="PEMULABET" />
        <div>
          <h1>Kelola operasional PEMULABET dengan tenang dan rapi.</h1>
          <p>Monitor user register, bank, deposit, dan withdrawal dari satu dashboard admin berbasis TailAdmin.</p>
        </div>
        <p>Admin app berjalan terpisah dan siap dipasang ke subdomain lewat port 3001.</p>
      </section>
      <section className="admin-login__panel">
        <form className="admin-login__form" action="/api/admin/login" method="post">
          <h2>Masuk Admin</h2>
          <p>Gunakan akun admin yang dibuat lewat script `npm run admin:create`.</p>
          {error ? <div className="admin-alert">{error}</div> : null}
          <div className="admin-grid" style={{ gap: "16px" }}>
            <div className="admin-field">
              <label>Username</label>
              <input name="username" autoComplete="username" required />
            </div>
            <div className="admin-field">
              <label>Password</label>
              <input name="password" type="password" autoComplete="current-password" required />
            </div>
            <button className="admin-button" type="submit">
              Masuk
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
