import { traitColor, type TraitGroup } from "@/lib/sims-data";

// Literal class names so Tailwind picks them up.
export const CHIP_COLORS: Record<TraitGroup["color"], string> = {
  mint: "bg-mint/15 text-mint",
  peach: "bg-peach/15 text-peach",
  lilac: "bg-lilac/15 text-lilac",
  sky: "bg-sky/15 text-sky",
  butter: "bg-butter/15 text-butter",
  rose: "bg-rose/15 text-rose",
  stone: "bg-stone/10 text-stone",
};

export function TraitChip({ trait }: { trait: string }) {
  return <span className={`pill ${CHIP_COLORS[traitColor(trait)]}`}>{trait}</span>;
}

export function Chip({ children, color = "stone" }: { children: React.ReactNode; color?: TraitGroup["color"] }) {
  return <span className={`pill ${CHIP_COLORS[color]}`}>{children}</span>;
}
