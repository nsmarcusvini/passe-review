import { mono } from "@/lib/landing-fonts";

const ROWS = [
  { n: "01", when: "24 horas", status: "concluído" },
  { n: "02", when: "7 dias", status: "concluído" },
  { n: "03", when: "30 dias", status: "hoje" },
  { n: "04", when: "45 dias", status: "agendado" },
  { n: "05", when: "60 dias", status: "agendado" },
  { n: "06", when: "30 dias", status: "agendado" },
  { n: "07", when: "45 dias", status: "agendado" },
  { n: "08", when: "60 dias", status: "agendado" },
];

export default function ReviewLedger() {
  return (
    <div className="overflow-hidden rounded-sm border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5 sm:px-5">
        <span className={`${mono.className} text-[10px] uppercase tracking-[0.14em] text-muted`}>
          Ficha de acompanhamento
        </span>
        <span className={`${mono.className} text-[10px] text-muted`}>tópico: controle de constitucionalidade</span>
      </div>
      <div>
        {ROWS.map((row, i) => (
          <div
            key={row.n}
            className={`flex items-center justify-between px-4 py-2.5 text-sm sm:px-5 ${
              i !== ROWS.length - 1 ? "border-b border-dashed border-border" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <span className={`${mono.className} text-xs text-muted`}>{row.n}</span>
              <span className="text-foreground">{row.when}</span>
            </div>
            <span
              className={`${mono.className} text-[10px] uppercase tracking-[0.1em] ${
                row.status === "concluído"
                  ? "text-primary"
                  : row.status === "hoje"
                    ? "text-accent-dark"
                    : "text-muted"
              }`}
            >
              {row.status === "concluído" ? "✓ concluído" : row.status}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border bg-surface px-4 py-2.5 sm:px-5">
        <span className={`${mono.className} text-[10px] text-muted`}>
          a partir daqui, repete 30 · 45 · 60 indefinidamente
        </span>
      </div>
    </div>
  );
}
