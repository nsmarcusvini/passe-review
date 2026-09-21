import Link from "next/link";
import { display, body, mono } from "@/lib/landing-fonts";
import Reveal from "@/components/landing/reveal";
import AnswerSheet from "@/components/landing/answer-sheet";
import ReviewLedger from "@/components/landing/review-ledger";
import ApprovedStamp from "@/components/landing/approved-stamp";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className={`${mono.className} text-xs font-bold uppercase tracking-[0.16em] text-primary`}>
      {children}
    </span>
  );
}

const FEATURES = [
  {
    title: "Fila de revisões",
    body: "Atrasadas, hoje e as próximas — sempre à vista, sem você precisar lembrar de nada.",
    rotate: "-rotate-1",
  },
  {
    title: "Registro em segundos",
    body: "Total de questões, acertos, erros e uma observação. Menos de 20 segundos por sessão.",
    rotate: "rotate-1",
  },
  {
    title: "Dashboard por matéria",
    body: "Seu % de acerto por matéria e sua sequência de dias estudando, sempre visíveis.",
    rotate: "rotate-[-0.5deg]",
  },
  {
    title: "Voltar depois",
    body: "Marque questões difíceis fora do ciclo automático, sem perder o registro de nada.",
    rotate: "rotate-[1.5deg]",
  },
];

const PWA_STEPS = [
  { n: "01", label: "Abra no navegador", detail: "passe-revisao.app, no celular" },
  { n: "02", label: "Adicionar à tela inicial", detail: "menu do navegador → instalar" },
  { n: "03", label: "Estude como app", detail: "ícone próprio, sem abas, sem distração" },
];

export default function LandingPage() {
  return (
    <div className={`${body.className} flex flex-1 flex-col bg-white`}>
      {/* LETTERHEAD */}
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <span className={`${display.className} flex items-center gap-2 text-lg font-bold text-primary`}>
            <span className="inline-block h-2 w-2 rounded-full bg-accent-dark" />
            Passe Revisão
          </span>
          <nav className="flex items-center gap-5">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-muted transition-colors hover:text-foreground sm:inline"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="rounded-sm bg-accent px-4 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-dark"
            >
              Criar conta grátis
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-28">
          <div>
            <Reveal>
              <Eyebrow>Revisão por questões</Eyebrow>
            </Reveal>
            <Reveal delay={70}>
              <h1
                className={`${display.className} mt-5 max-w-xl text-[2.6rem] font-bold leading-[1.05] tracking-[-0.01em] text-foreground sm:text-5xl lg:text-6xl`}
              >
                Você estuda. Esquece. Estuda de novo.
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
                O Passe Revisão transforma cada questão que você resolve em uma revisão
                agendada — no dia exato em que sua memória começa a falhar. 24 horas, 7 dias,
                30, 45, 60. Sem planilha, sem &ldquo;depois eu organizo&rdquo;.
              </p>
            </Reveal>
            <Reveal delay={210}>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link
                  href="/cadastro"
                  className="rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-dark"
                >
                  Criar conta grátis
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                >
                  Já tenho conta →
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180} className="flex justify-center lg:justify-end">
            <AnswerSheet />
          </Reveal>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Reveal>
                <Eyebrow>O problema</Eyebrow>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <Reveal delay={60}>
                <p
                  className={`${display.className} max-w-2xl text-[1.75rem] font-semibold italic leading-[1.25] text-foreground sm:text-3xl`}
                >
                  &ldquo;Reler a matéria dá a sensação de que você sabe. Só o cartão-resposta
                  não mente.&rdquo;
                </p>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-7 max-w-xl text-base leading-relaxed text-muted">
                  Sem revisão organizada, o conteúdo que custou horas de estudo evapora em
                  poucas semanas — e o concurseiro só descobre isso durante a prova, quando já
                  é tarde. O Passe Revisão troca a releitura passiva pela resolução ativa de
                  questões: o único jeito confiável de saber se você aprendeu de verdade.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CRONOGRAMA / LEDGER */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <Reveal>
                <Eyebrow>Como funciona</Eyebrow>
              </Reveal>
              <Reveal delay={60}>
                <h2
                  className={`${display.className} mt-4 max-w-md text-3xl font-semibold leading-tight text-foreground sm:text-4xl`}
                >
                  Cada questão resolvida abre uma nova linha na sua ficha.
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
                  Você não precisa lembrar de revisar. A cada sessão registrada, o sistema já
                  calcula a próxima data — 24 horas, depois 7 dias, depois 30, 45 e 60, num
                  ciclo que se repete até a véspera da prova.
                </p>
              </Reveal>
            </div>
            <Reveal delay={100}>
              <ReviewLedger />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES — carimbos */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <Reveal>
            <Eyebrow>O que muda no seu estudo</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <h2
              className={`${display.className} mt-4 max-w-lg text-3xl font-semibold leading-tight text-foreground sm:text-4xl`}
            >
              Um jeito mais simples de nunca perder o fio da revisão.
            </h2>
          </Reveal>

          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-12">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 90} className={`w-full sm:w-[calc(50%-1rem)] ${f.rotate}`}>
                <div className="relative rounded-sm border-2 border-primary/70 p-6 before:absolute before:inset-[5px] before:rounded-sm before:border before:border-primary/30">
                  <h3
                    className={`${mono.className} text-sm font-bold uppercase tracking-[0.08em] text-primary`}
                  >
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PWA */}
      <section className="bg-primary-dark">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Reveal>
                <span className={`${mono.className} text-xs font-bold uppercase tracking-[0.16em] text-accent`}>
                  Instalação
                </span>
              </Reveal>
              <Reveal delay={60}>
                <h2
                  className={`${display.className} mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl`}
                >
                  Sem loja de aplicativo. Sem espaço ocupado.
                </h2>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-5 max-w-sm text-base leading-relaxed text-white/65">
                  O Passe Revisão é um PWA: adicione à tela inicial pelo navegador e ele abre
                  como um app de verdade, direto na sua fila de revisão do dia.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-3 sm:grid-cols-3">
                {PWA_STEPS.map((step, i) => (
                  <Reveal key={step.n} delay={i * 100}>
                    <div className="h-full rounded-sm border border-white/15 p-6">
                      <span className={`${mono.className} text-xs text-accent`}>{step.n}</span>
                      <p className="mt-3 text-sm font-semibold text-white">{step.label}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/55">{step.detail}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL — carimbo de aprovação */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div>
              <Reveal>
                <h2
                  className={`${display.className} max-w-lg text-3xl font-bold leading-tight text-foreground sm:text-5xl`}
                >
                  Sua aprovação começa na revisão de hoje.
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <div className="mt-8">
                  <Link
                    href="/cadastro"
                    className="inline-block rounded-sm bg-accent px-7 py-3.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-dark"
                  >
                    Criar conta grátis
                  </Link>
                </div>
              </Reveal>
            </div>
            <Reveal delay={160} className="flex justify-center">
              <ApprovedStamp className="h-40 w-40 rotate-[-6deg] sm:h-48 sm:w-48" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER — rodapé de documento */}
      <footer className="bg-primary-dark py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-xs text-white/50 sm:flex-row">
          <span className={`${display.className} font-semibold text-white`}>Passe Revisão</span>
          <span className={`${mono.className} text-[11px]`}>
            método de revisão ativa para concursos públicos
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-white">
              Entrar
            </Link>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
