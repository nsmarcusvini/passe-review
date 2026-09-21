"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm("Tem certeza? Essa ação não pode ser desfeita.")) return;
        startTransition(async () => {
          await action();
          router.refresh();
        });
      }}
      className="font-mono-label text-[11px] uppercase tracking-wide text-muted transition-colors hover:text-danger disabled:opacity-50"
    >
      Excluir
    </button>
  );
}
