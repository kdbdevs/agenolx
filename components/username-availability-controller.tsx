"use client";

import { useEffect } from "react";

type UsernameResponse = {
  valid: boolean;
  available: boolean;
  message: string;
};

export function UsernameAvailabilityController() {
  useEffect(() => {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="username"][data-username-check="true"]'));
    const cleanups: Array<() => void> = [];

    for (const input of inputs) {
      if (input.dataset.usernameCheckBound === "true") continue;
      input.dataset.usernameCheckBound = "true";

      const note = getOrCreateNote(input);
      let timeoutId = window.setTimeout(() => undefined, 0);
      window.clearTimeout(timeoutId);
      let controller: AbortController | null = null;

      const setState = (state: "idle" | "checking" | "valid" | "invalid", message = "") => {
        input.classList.toggle("input--valid", state === "valid");
        input.classList.toggle("input--invalid", state === "invalid");
        input.setAttribute("aria-invalid", state === "invalid" ? "true" : "false");
        input.dataset.usernameAvailable = state === "valid" ? "true" : state === "invalid" ? "false" : "";
        input.dataset.usernameChecking = state === "checking" ? "true" : "false";
        if (note) {
          note.textContent = message;
          note.classList.toggle("username-availability-note--ok", state === "valid");
        }
      };

      const checkUsername = async () => {
        const username = input.value.trim();
        if (!username) {
          setState("idle");
          return;
        }

        controller?.abort();
        controller = new AbortController();
        setState("checking", "Mengecek username...");

        try {
          const response = await fetch(`/api/auth/username?username=${encodeURIComponent(username)}`, {
            signal: controller.signal,
            headers: { accept: "application/json" }
          });
          const result = (await response.json()) as UsernameResponse;
          setState(result.valid && result.available ? "valid" : "invalid", result.message);
        } catch (error) {
          if ((error as DOMException).name === "AbortError") return;
          setState("invalid", "Username belum bisa dicek. Coba ketik ulang atau gunakan username lain.");
        }
      };

      const onInput = () => {
        window.clearTimeout(timeoutId);
        setState("idle");
        timeoutId = window.setTimeout(checkUsername, 350);
      };

      const form = input.form;
      const onSubmit = (event: SubmitEvent) => {
        if (input.dataset.usernameAvailable === "false" || input.dataset.usernameChecking === "true") {
          event.preventDefault();
          setState("invalid", input.dataset.usernameChecking === "true" ? "Tunggu pengecekan username selesai." : note?.textContent ?? "");
          input.focus();
        }
      };

      input.addEventListener("input", onInput);
      form?.addEventListener("submit", onSubmit);
      if (input.value.trim()) onInput();

      cleanups.push(() => {
        window.clearTimeout(timeoutId);
        controller?.abort();
        input.removeEventListener("input", onInput);
        form?.removeEventListener("submit", onSubmit);
        delete input.dataset.usernameCheckBound;
      });
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, []);

  return null;
}

function getOrCreateNote(input: HTMLInputElement) {
  const container = input.closest(".input__container, .rebuild-field");
  const existing = container?.querySelector<HTMLElement>('[data-username-availability-note="true"]');
  if (existing) return existing;

  const note = document.createElement("p");
  note.className = "input__error username-availability-note";
  note.dataset.usernameAvailabilityNote = "true";
  container?.append(note);
  return note;
}
