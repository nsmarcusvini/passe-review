import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { display, body, mono } from "@/lib/landing-fonts";
import NavLink from "@/components/nav-link";
import AccountLink from "@/components/account-link";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const displayName =
    (user.user_metadata?.display_name as string | undefined) || user.email || "Usuário";

  return (
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} ${body.className} flex min-h-screen flex-col bg-surface`}
    >
      <header className="sticky top-0 z-10 bg-primary-dark text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link
            href="/app"
            className="flex items-center gap-2 font-display text-base font-semibold tracking-tight"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            Passe Revisão
          </Link>
          <div className="flex items-center gap-3">
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-sm border border-white/25 px-3 py-1.5 font-mono-label text-[11px] uppercase tracking-wide text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                Sair
              </button>
            </form>
            <AccountLink displayName={displayName} />
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-5 border-t border-white/10 px-4 sm:px-6">
          <NavLink href="/app">Dashboard</NavLink>
          <NavLink href="/app/dashboards">Dashboards</NavLink>
          <NavLink href="/app/revisoes">Revisões</NavLink>
          <NavLink href="/app/registrar">Registrar</NavLink>
          <NavLink href="/app/materias">Matérias</NavLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
