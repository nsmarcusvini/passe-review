const BASE_INTERVALS_DAYS = [1, 7, 30, 45, 60];
const CYCLE_TAIL_DAYS = [30, 45, 60];

/** Dias até a próxima revisão para um dado passo (0-indexado). Após o passo 4 (60 dias), o ciclo [30, 45, 60] se repete indefinidamente. */
export function intervalDaysForStep(step: number): number {
  if (step < BASE_INTERVALS_DAYS.length) {
    return BASE_INTERVALS_DAYS[step];
  }
  const cyclePos = (step - BASE_INTERVALS_DAYS.length) % CYCLE_TAIL_DAYS.length;
  return CYCLE_TAIL_DAYS[cyclePos];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function toDateOnlyString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Data (YYYY-MM-DD) da próxima revisão, a partir da data da sessão que acabou de ser registrada. */
export function nextDueDate(sessionDate: string, nextStep: number): string {
  const [year, month, day] = sessionDate.split("-").map(Number);
  const base = new Date(Date.UTC(year, month - 1, day));
  return toDateOnlyString(addDays(base, intervalDaysForStep(nextStep)));
}

export function stepLabel(step: number): string {
  const days = intervalDaysForStep(step);
  return days === 1 ? "24h" : `${days}d`;
}
