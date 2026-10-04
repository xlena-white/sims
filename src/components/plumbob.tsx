/** The Sims plumbob, as a small faceted diamond. */
export function Plumbob({ className = "", color = "var(--color-mint)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 40" aria-hidden className={className}>
      <path d="M12 0 L22 18 L12 40 L2 18 Z" fill={color} />
      <path d="M12 0 L22 18 L12 22 Z" fill="#fff" opacity="0.35" />
      <path d="M12 0 L12 22 L2 18 Z" fill="#fff" opacity="0.12" />
      <path d="M2 18 L12 22 L12 40 Z" fill="#000" opacity="0.18" />
    </svg>
  );
}
