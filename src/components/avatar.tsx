import { GEN_ACCENT, type GenerationNumber } from "@/lib/types";

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

/** Round avatar: the character's photo, or their initials on a generation-coloured background. */
export function Avatar({
  name,
  photoUrl,
  generation,
  className = "size-10 text-sm",
}: {
  name: string;
  photoUrl: string | null;
  generation: GenerationNumber;
  className?: string;
}) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photoUrl} alt={name} className={`shrink-0 rounded-full object-cover ${className}`} />;
  }
  return (
    <span
      aria-label={name}
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-ink ${GEN_ACCENT[generation].bg} ${className}`}
    >
      {initials(name)}
    </span>
  );
}
