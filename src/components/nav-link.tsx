"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`border-b-2 py-2.5 font-mono-label text-[11px] uppercase tracking-wide transition-colors ${
        active
          ? "border-accent text-white"
          : "border-transparent text-white/50 hover:border-white/25 hover:text-white/80"
      }`}
    >
      {children}
    </Link>
  );
}
