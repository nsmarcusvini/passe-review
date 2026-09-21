import Link from "next/link";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { signUp } from "@/lib/actions/auth";
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

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className={`${body.className} flex min-h-screen flex-col md:flex-row`}>
      {/* BRAND PANEL — o que o cadastro dispara */}
      <div className="relative overflow-hidden bg-primary-dark px-6 py-8 sm:px-10 md:flex md:w-[44%] md:flex-col md:justify-between md:px-12 md:py-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 15% 0%, rgba(0,59,112,0.9), transparent), radial-gradient(45% 40% at 100% 100%, rgba(245,196,0,0.14), transparent)",
          }}
        />
        <div className="relative">
          <Link
            href="/"
            className={`${display.className} inline-flex items-center gap-2 text-sm font-semibold text-white`}
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            Passe Revisão
          </Link>

          <Reveal delay={60} className="mt-8 md:mt-12">
            <p
              className={`${mono.className} text-xs font-medium uppercase tracking-[0.18em] text-accent`}
            >
              O que o cadastro dispara
            </p>
            <h1
              className={`${display.className} mt-4 max-w-sm text-2xl font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-3xl md:text-4xl`}
            >
              Sua primeira revisão já entra na fila.
            </h1>
            <p className="mt-4 hidden max-w-sm text-sm leading-relaxed text-white/65 sm:block md:text-base">
              Assim que a conta é criada, o relógio começa a contar: 24 horas depois, a
              primeira revisão aparece na sua fila, pronta pra resolver.
            </p>
          </Reveal>
        </div>

        <Reveal delay={160} className="relative mt-8 md:mt-0">
          <p className={`${mono.className} mb-2 text-[11px] tracking-wide text-white/40`}>
            ciclo de revisão, a partir de agora
          </p>
          <ReviewRail />
        </Reveal>
      </div>

      {/* FORM PANEL */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 sm:px-10 md:py-14">
        <Reveal delay={100} className="w-full max-w-sm">
          <div className="mb-8">
            <h2
              className={`${display.className} text-2xl font-semibold tracking-[-0.01em] text-foreground`}
            >
              Criar conta
            </h2>
            <p className="mt-1.5 text-sm text-muted">Leva menos de um minuto.</p>
          </div>

          {error && (
            <p className="mb-5 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <form action={signUp} className="space-y-4">
            <div>
              <label
                htmlFor="displayName"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Nome
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-muted">Mínimo de 6 caracteres.</p>
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-dark"
            >
              Criar conta grátis
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </Reveal>
      </div>
    </div>
  );
}
