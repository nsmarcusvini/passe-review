import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import NavLink from "@/components/nav-link";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const displayName =
    (user.user_metadata?.display_name as string | undefined) || user.email || "Usuário";

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-10 border-b border-primary-dark bg-primary-dark text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/app" className="flex items-center gap-2 font-semibold">
            <span className="inline-block h-3 w-3 rounded-full bg-accent" />
            Passe Revisão
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-white/80 sm:inline">{displayName}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md border border-white/30 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 px-4 pb-2 text-sm">
          <NavLink href="/app">Dashboard</NavLink>
          <NavLink href="/app/revisoes">Revisões</NavLink>
          <NavLink href="/app/registrar">Registrar</NavLink>
          <NavLink href="/app/materias">Matérias</NavLink>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
