/**
 * Categorical palette (fixed order, validated for CVD-safe adjacency).
 * Assign in sequence, never cycled — beyond 8 series, fold the rest into "Outras".
 * See node_modules-free reference: skill dataviz/references/palette.md.
 */
export const CATEGORICAL_COLORS = [
  "#2a78d6", // blue
  "#eb6834", // orange
  "#1baf7a", // aqua
  "#eda100", // yellow
  "#e87ba4", // magenta
  "#008300", // green
  "#4a3aa7", // violet
  "#e34948", // red
] as const;

export const OTHER_COLOR = "#898781";

/** Status pair for correct/incorrect — reuses the app's own success/danger tokens. */
export const STATUS_COLORS = {
  correct: "#1f7a4d",
  incorrect: "#b3261e",
} as const;

export function describeArcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number,
): string {
  const point = (angle: number, r: number) => ({
    x: cx + r * Math.sin(angle),
    y: cy - r * Math.cos(angle),
  });

  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
  const outerStart = point(startAngle, rOuter);
  const outerEnd = point(endAngle, rOuter);
  const innerStart = point(endAngle, rInner);
  const innerEnd = point(startAngle, rInner);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}
