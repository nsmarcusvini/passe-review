"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const GEAR_TEETH_ANGLES = [0, 60, 120, 180, 240, 300];

export default function AccountLink({ displayName }: { displayName: string }) {
  const pathname = usePathname();
  const active = pathname === "/app/configuracoes";

  return (
    <Link
      href="/app/configuracoes"
      aria-label={`Configurações da conta — ${displayName}`}
      aria-current={active ? "page" : undefined}
      title="Configurações"
      className={`flex h-8 w-8 items-center justify-center rounded-sm border transition-colors ${
        active
          ? "border-accent/70 bg-white/10 text-accent"
          : "border-white/25 text-white/80 hover:border-white/50 hover:text-white"
      }`}
    >
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
        <circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.4" />
        {GEAR_TEETH_ANGLES.map((deg) => (
          <rect
            key={deg}
            x="9.25"
            y="1.1"
            width="1.5"
            height="3"
            rx="0.75"
            fill="currentColor"
            transform={`rotate(${deg} 10 10)`}
          />
        ))}
      </svg>
    </Link>
  );
}
