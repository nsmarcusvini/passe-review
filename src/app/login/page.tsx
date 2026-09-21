import Link from "next/link";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { signIn } from "@/lib/actions/auth";
import Reveal from "@/components/landing/reveal";
import ReviewRail from "@/components/landing/review-rail";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-label",
});

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={`${mono.className} text-xs font-medium uppercase tracking-[0.18em] text-accent-dark`}
    >
      {children}
    </span>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; confirm?: string; next?: string }>;
}) {
  const { error, confirm } = await searchParams;

  return (
    <div className={`${body.className} flex min-h-screen flex-col lg:flex-row`}>
      {/* BRAND PANEL */}
      <div className="relative overflow-hidden bg-primary-dark px-6 py-6 lg:flex lg:w-[45%] lg:flex-col lg:justify-between lg:px-14 lg:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 15% 0%, rgba(0,59,112,0.9), transparent), radial-gradient(45% 40% at 100% 100%, rgba(245,196,0,0.14), transparent)",
          }}
        />
        <Link
          href="/"
          className={`${display.className} relative z-10 flex items-center gap-2 text-sm font-semibold text-white`}
        >
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
          Passe Revisão
        </Link>

        <div className="relative z-10 mt-10 hidden lg:block">
          <Reveal>
            <Eyebrow>Bem-vindo de volta</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className={`${display.className} mt-4 max-w-sm text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-white`}
            >
              A próxima revisão
              <br />
              <span className="text-accent">não espera.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
              Entre para ver o que está atrasado, o que vence hoje e o que vem a seguir na sua
              fila.
            </p>
          </Reveal>
        </div>

        <div className="relative z-10 mt-10 hidden lg:block">
          <Reveal delay={240}>
            <p className={`${mono.className} mb-3 text-xs tracking-wide text-white/40`}>
              sua próxima revisão, agendada automaticamente
            </p>
            <ReviewRail />
          </Reveal>
        </div>
      </div>

      {/* FORM PANEL */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-sm">
          <Eyebrow>Acesso</Eyebrow>
          <h1
            className={`${display.className} mt-3 text-3xl font-semibold tracking-[-0.02em] text-foreground`}
          >
            Entrar
          </h1>
          <p className="mt-2 text-sm text-muted">Continue de onde parou no Passe Revisão.</p>

          {confirm && (
            <div className="mt-6 rounded-lg border border-accent-dark/30 bg-accent/10 px-4 py-3 text-sm text-primary-dark">
              Cadastro criado! Confirme seu email antes de entrar.
            </div>
          )}
          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form action={signIn} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className={`${mono.className} block text-[11px] font-medium uppercase tracking-wide text-muted`}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-2 w-full border-b-2 border-border bg-transparent py-2 text-base text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className={`${mono.className} block text-[11px] font-medium uppercase tracking-wide text-muted`}
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-2 w-full border-b-2 border-border bg-transparent py-2 text-base text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              Entrar
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Ainda não tem conta?{" "}
            <Link
              href="/cadastro"
              className="font-medium text-primary hover:text-primary-dark hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
