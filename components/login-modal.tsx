"use client";

import { useEffect, useId, useState } from "react";

export function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const titleId = useId();

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const trigger = target.closest("[data-login-modal-trigger]");
      if (!trigger) return;

      event.preventDefault();
      setIsOpen(true);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal login-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="modal__backdrop"
        aria-label="Tutup modal masuk"
        onClick={() => setIsOpen(false)}
      />
      <div className="modal__root">
        <div className="modal__surface surface modal__surface--inverse">
          <header className="modal__header">
            <h3 id={titleId}>Masuk</h3>
          </header>
          <section className="modal__body">
            <div className="login__container">
              <form className="login__form" action="/api/auth/login" method="post">
                <div className="input__container">
                  <div className="input__root">
                    <input
                      type="text"
                      name="username"
                      autoComplete="username"
                      placeholder="Username"
                      className="input input--inverse"
                    />
                    <i className="input__icon icon-username icon--xs" />
                  </div>
                </div>
                <div className="input__container input__password">
                  <div className="input__root">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      placeholder="Password"
                      className="input input--inverse"
                    />
                    <button
                      type="button"
                      className="input__icon input__icon--pv btn--flex"
                      aria-label={isPasswordVisible ? "Sembunyikan password" : "Tampilkan password"}
                      onClick={() => setIsPasswordVisible((visible) => !visible)}
                    >
                      <i className={`${isPasswordVisible ? "icon-eye" : "icon-eye-slash"} icon--md`} />
                    </button>
                    <i className="input__icon icon-key icon--xs" />
                  </div>
                </div>
                <div className="input-confirm input-confirm--inverse">
                  <label htmlFor="kli-modal" className="input-confirm__label">
                    <i className="icon-square icon--md" />
                    <span>Tetap masuk</span>
                  </label>
                  <input id="kli-modal" name="remember" type="checkbox" />
                </div>
                <button type="submit" className="btn btn--accent btn--block">
                  <span>Masuk</span>
                </button>
              </form>
              <div className="login__extra">
                <a href="/forgot-password">Lupa Password?</a>
                <a href="/register">Buat Akun</a>
              </div>
            </div>
          </section>
        </div>
        <button
          type="button"
          className="btn--flex btn--round--sm modal__close modal__close--inverse"
          aria-label="Tutup modal masuk"
          onClick={() => setIsOpen(false)}
        >
          <i className="icon-times-circle icon--lg" />
        </button>
      </div>
    </div>
  );
}
