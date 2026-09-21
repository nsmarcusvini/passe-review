"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateAccount, updatePassword } from "@/lib/actions/profile";

const inputClass =
  "w-full rounded-sm border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";
const labelClass = "mb-1.5 block font-mono-label text-[11px] uppercase tracking-[0.14em] text-muted";

export default function AccountForm({
  displayName,
  email,
  memberSince,
}: {
  displayName: string;
  email: string;
  memberSince: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [passwordPending, startPasswordTransition] = useTransition();

  const [name, setName] = useState(displayName);
  const [emailValue, setEmailValue] = useState(email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name.trim()) {
      setError("Informe seu nome.");
      return;
    }
    startTransition(async () => {
      try {
        await updateAccount({ displayName: name.trim(), email: emailValue.trim() });
        setSuccess(
          emailValue.trim() !== email
            ? "Dados salvos. Confirme o novo email na sua caixa de entrada."
            : "Dados da conta atualizados.",
        );
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar dados.");
      }
    });
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    if (password.length < 6) {
      setPasswordError("A nova senha precisa ter ao menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("As senhas não coincidem.");
      return;
    }
    startPasswordTransition(async () => {
      try {
        await updatePassword(password);
        setPassword("");
        setConfirmPassword("");
        setPasswordSuccess(true);
      } catch (err) {
        setPasswordError(err instanceof Error ? err.message : "Erro ao trocar senha.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Nome completo</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        <p className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted">
          Membro desde {memberSince}
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-success">{success}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          {pending ? "Salvando…" : "Salvar dados"}
        </button>
      </form>

      <div className="border-t border-dashed border-border pt-5">
        <p className="mb-3 font-mono-label text-[11px] uppercase tracking-[0.14em] text-muted">
          Trocar senha
        </p>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Nova senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                placeholder="Mínimo de 6 caracteres"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirmar nova senha</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                className={inputClass}
              />
            </div>
          </div>

          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-success">Senha atualizada.</p>}

          <button
            type="submit"
            disabled={passwordPending || !password}
            className="rounded-sm border border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-50"
          >
            {passwordPending ? "Salvando…" : "Trocar senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
