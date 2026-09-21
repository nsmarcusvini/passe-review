import { display } from "@/lib/landing-fonts";

export default function ApprovedStamp({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 220"
      className={`text-accent-dark ${className}`}
      role="img"
      aria-label="Carimbo: aprovado, método de revisão ativa"
    >
      <defs>
        <path id="stamp-top" d="M 30,110 A 80,80 0 1 1 190,110" fill="none" />
        <path id="stamp-bottom" d="M 190,112 A 80,80 0 1 1 30,112" fill="none" />
      </defs>

      <circle cx="110" cy="110" r="98" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="110" cy="110" r="84" fill="none" stroke="currentColor" strokeWidth="1.25" />

      <text fontSize="12.5" fontWeight="700" letterSpacing="3.5" fill="currentColor">
        <textPath href="#stamp-top" startOffset="50%" textAnchor="middle">
          PASSE REVISÃO
        </textPath>
      </text>
      <text fontSize="10" fontWeight="600" letterSpacing="3" fill="currentColor">
        <textPath href="#stamp-bottom" startOffset="50%" textAnchor="middle">
          ★ MÉTODO DE REVISÃO ATIVA ★
        </textPath>
      </text>

      <text
        x="110"
        y="102"
        fontSize="30"
        fontWeight="700"
        textAnchor="middle"
        fill="currentColor"
        className={display.className}
      >
        APROVADO
      </text>
      <line x1="62" y1="118" x2="158" y2="118" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="110"
        y="136"
        fontSize="10"
        fontWeight="600"
        letterSpacing="1.5"
        textAnchor="middle"
        fill="currentColor"
      >
        NA REVISÃO DE HOJE
      </text>
    </svg>
  );
}
