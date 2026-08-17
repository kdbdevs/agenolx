"use client";

import { useEffect } from "react";

export function PasswordVisibilityController() {
  useEffect(() => {
    const syncButtons = () => {
      const buttons = document.querySelectorAll<HTMLButtonElement>(".input__password .input__icon--pv");
      for (const button of buttons) {
        const input = findPasswordInput(button);
        if (!input) continue;
        button.setAttribute("aria-label", input.type === "text" ? "Sembunyikan password" : "Tampilkan password");
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest<HTMLButtonElement>(".input__password .input__icon--pv");
      if (!button) return;

      const input = findPasswordInput(button);
      if (!input) return;

      event.preventDefault();
      const isVisible = input.type === "text";
      input.type = isVisible ? "password" : "text";
      input.dataset.passwordVisible = isVisible ? "false" : "true";
      button.setAttribute("aria-label", isVisible ? "Tampilkan password" : "Sembunyikan password");

      const icon = button.querySelector<HTMLElement>("[class*='icon-eye']");
      icon?.classList.toggle("icon-eye-slash", isVisible);
      icon?.classList.toggle("icon-eye", !isVisible);
    };

    syncButtons();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

function findPasswordInput(button: HTMLButtonElement) {
  const root = button.closest(".input__root") ?? button.closest(".input__password");
  return root?.querySelector<HTMLInputElement>('input[name*="password"], input[type="password"], input[data-password-visible]');
}
