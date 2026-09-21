type Props = {
  examTarget: string | null;
  daysRemaining: number | null;
};

export default function ExamCountdownStamp({ examTarget, daysRemaining }: Props) {
  const hasDate = daysRemaining !== null;
  const done = hasDate && daysRemaining <= 0;

  const bottomText = done
    ? "★ PROVA REALIZADA ★"
    : examTarget
      ? `★ ${examTarget.slice(0, 28).toUpperCase()} ★`
      : "★ DEFINA A DATA DA PROVA ★";

  return (
    <div
      className="shrink-0 select-none"
      style={{ transform: "rotate(-4deg)" }}
      aria-hidden={!hasDate}
    >
      <svg
        viewBox="0 0 220 220"
        className="h-[132px] w-[132px] text-primary sm:h-[152px] sm:w-[152px]"
        role="img"
        aria-label={
          hasDate
            ? done
              ? "Prova já realizada"
              : `Faltam ${daysRemaining} dias para a prova`
            : "Data da prova ainda não definida"
        }
      >
        <defs>
          <path id="cd-stamp-top" d="M 30,110 A 80,80 0 1 1 190,110" fill="none" />
          <path id="cd-stamp-bottom" d="M 190,112 A 80,80 0 1 1 30,112" fill="none" />
        </defs>

        <circle cx="110" cy="110" r="98" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle
          cx="110"
          cy="110"
          r="84"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 4"
          opacity="0.6"
        />

        <text fontSize="11.5" fontWeight="700" letterSpacing="3" fill="currentColor">
          <textPath href="#cd-stamp-top" startOffset="50%" textAnchor="middle">
            CONTAGEM REGRESSIVA
          </textPath>
        </text>
        <text fontSize="9" fontWeight="600" letterSpacing="1.5" fill="currentColor">
          <textPath href="#cd-stamp-bottom" startOffset="50%" textAnchor="middle">
            {bottomText}
          </textPath>
        </text>

        {done ? (
          <text
            x="110"
            y="122"
            fontSize="20"
            fontWeight="700"
            textAnchor="middle"
            fill="currentColor"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CONCLUÍDA
          </text>
        ) : (
          <>
            <text
              x="110"
              y="128"
              fontSize="52"
              fontWeight="700"
              textAnchor="middle"
              fill="currentColor"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {hasDate ? daysRemaining : "?"}
            </text>
            <text
              x="110"
              y="150"
              fontSize="10"
              fontWeight="600"
              letterSpacing="2"
              textAnchor="middle"
              fill="currentColor"
            >
              {hasDate ? `DIA${daysRemaining === 1 ? "" : "S"} PARA A PROVA` : "DIAS PARA A PROVA"}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
