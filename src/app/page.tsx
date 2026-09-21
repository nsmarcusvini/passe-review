import Link from "next/link";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
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

const FEATURES = [
  {
    n: "01",
    title: "Fila de revisões",
    body: "Atrasadas, hoje e as próximas — tudo ordenado por urgência, sem você precisar lembrar de nada.",
    big: true,
  },
  {
    n: "02",
    title: "Registro em segundos",
    body: "Total de questões, acertos, erros e uma observação. Menos de 20 segundos por sessão.",
  },
  {
    n: "03",
    title: "Dashboard por matéria",
    body: "% de acerto por matéria e sua sequência de dias estudando, sempre à vista.",
  },
  {
    n: "04",
    title: "Voltar depois",
    body: "Marque questões difíceis fora do ciclo automático, sem perder o registro de nada.",
  },
];

export default function LandingPage() {
  return (
    <div className={`${body.className} flex flex-1 flex-col bg-white`}>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-primary-dark/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <span className={`${display.className} flex items-center gap-2 text-sm font-semibold text-white`}>
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            Passe Revisão
          </span>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-white/75 transition-colors hover:text-white sm:inline"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-light"
            >
              Criar conta grátis
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-primary-dark">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 15% 0%, rgba(0,59,112,0.9), transparent), radial-gradient(45% 40% at 100% 100%, rgba(245,196,0,0.14), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
          <Reveal>
            <Eyebrow>Método de recuperação ativa</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className={`${display.className} mt-5 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl`}
            >
              Estudar não é o problema.
              <br />
              <span className="text-accent">Esquecer é.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              O Passe Revisão organiza suas revisões pelo método de resolução de questões: você
              estuda, resolve, e o sistema agenda sozinho a próxima rodada — no dia exato em que
              seu cérebro está prestes a esquecer.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/cadastro"
                className="rounded-md bg-accent px-6 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-light"
              >
                Criar conta grátis
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                Já tenho conta →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={320} className="mt-20">
            <p className={`${mono.className} mb-3 text-xs tracking-wide text-white/40`}>
              sua próxima revisão, agendada automaticamente
            </p>
            <ReviewRail />
          </Reveal>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <div className="grid gap-10 sm:grid-cols-12">
          <div className="sm:col-span-4">
            <Reveal>
              <Eyebrow>O problema</Eyebrow>
            </Reveal>
          </div>
          <div className="sm:col-span-8">
            <Reveal delay={60}>
              <h2
                className={`${display.className} max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-4xl`}
              >
                Reler a matéria dá a sensação de que você sabe. Resolver questões prova se você
                sabe de verdade.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
                Sem revisão organizada, o conteúdo que custou horas de estudo evapora em poucas
                semanas — e o concurseiro só descobre isso na hora da prova. O Passe Revisão
                transforma cada questão resolvida em um novo ponto no seu cronograma de revisão,
                calculado automaticamente pra chegar exatamente quando você começa a esquecer.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="bg-surface py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <Eyebrow>O que você ganha</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2
              className={`${display.className} mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-4xl`}
            >
              Tudo que você precisa pra nunca mais perder o fio da revisão.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-6">
            {FEATURES.map((f, i) => (
              <Reveal
                key={f.n}
                delay={i * 90}
                className={f.big ? "sm:col-span-3 sm:row-span-2" : "sm:col-span-3"}
              >
                <div
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-7 shadow-sm ${
                    f.big ? "min-h-[220px]" : "min-h-[160px]"
                  }`}
                >
                  <span className={`${mono.className} text-xs text-muted`}>{f.n}</span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                  {f.big && (
                    <div className="mt-auto flex items-center gap-2 pt-8">
                      {["24H", "7D", "30D", "45D", "60D"].map((label, di) => (
                        <span key={label} className="flex items-center gap-2">
                          <span
                            className={`h-2 w-2 rounded-full ${
                              di === 0 ? "bg-accent" : "bg-border"
                            }`}
                          />
                          {di < 4 && <span className="h-px w-5 bg-border" />}
                        </span>
                      ))}
                      <span className={`${mono.className} ml-2 text-[11px] text-muted`}>
                        próxima em 24h
                      </span>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PWA */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <div className="grid gap-10 sm:grid-cols-12 sm:items-center">
          <div className="sm:col-span-5">
            <Reveal>
              <Eyebrow>Instale como app</Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2
                className={`${display.className} mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-4xl`}
              >
                Sem loja de aplicativo. Sem espaço ocupado.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                O Passe Revisão é um PWA: adicione à tela inicial pelo navegador e ele abre como
                um app de verdade, direto na sua fila de revisão do dia.
              </p>
            </Reveal>
          </div>

          <div className="sm:col-span-7">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { n: "01", label: "Abra no navegador", detail: "passe-revisao.app no celular" },
                { n: "02", label: "Adicionar à tela inicial", detail: "menu do navegador → instalar" },
                { n: "03", label: "Estude como app", detail: "ícone próprio, sem abas, sem distração" },
              ].map((step, i) => (
                <Reveal key={step.n} delay={i * 100}>
                  <div className="h-full rounded-2xl border border-border bg-primary-dark p-6">
                    <span className={`${mono.className} text-xs text-accent`}>{step.n}</span>
                    <p className="mt-3 text-sm font-semibold text-white">{step.label}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/60">{step.detail}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-primary-dark py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <Reveal>
            <h2
              className={`${display.className} mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-5xl`}
            >
              Sua próxima revisão já podia estar agendada.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-9">
              <Link
                href="/cadastro"
                className="inline-block rounded-md bg-accent px-7 py-3.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-light"
              >
                Criar conta grátis
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-border bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-xs text-muted sm:flex-row">
          <span className={`${display.className} font-semibold text-foreground`}>Passe Revisão</span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-primary">
              Entrar
            </Link>
            <span>© {new Date().getFullYear()} Passe Revisão</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
