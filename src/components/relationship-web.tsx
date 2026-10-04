import Link from "next/link";
import type { WebKind, WebLink } from "@/lib/family";
import { GEN_ACCENT, type Character } from "@/lib/types";
import { initials } from "./avatar";

const KIND_COLOR: Record<WebKind, string> = {
  family: "var(--color-mint)",
  romantic: "var(--color-rose)",
  friend: "var(--color-sky)",
  rival: "var(--color-danger)",
};

const KIND_LABEL: Record<WebKind, string> = {
  family: "Family",
  romantic: "Love",
  friend: "Friends",
  rival: "Rivals",
};

const SIZE = 560;
const CENTER = SIZE / 2;

/** A radial web: the character in the middle, everyone they're connected to around them. */
export function RelationshipWeb({ character, links }: { character: Character; links: WebLink[] }) {
  if (links.length === 0) {
    return <p className="italic text-chalk-faint">No connections yet. Add parents, partners or relationships in the admin panel.</p>;
  }

  const radius = links.length <= 4 ? 170 : 195;
  const nodes = links.map((link, i) => {
    const angle = (i / links.length) * Math.PI * 2 - Math.PI / 2;
    return { ...link, x: CENTER + Math.cos(angle) * radius, y: CENTER + Math.sin(angle) * radius };
  });
  const kinds = [...new Set(links.map((l) => l.kind))];

  return (
    <div>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-xl" role="img" aria-label={`${character.name}'s connections`}>
        <defs>
          <clipPath id="web-center">
            <circle cx={CENTER} cy={CENTER} r={46} />
          </clipPath>
          {nodes.map((n) => (
            <clipPath key={n.person.id} id={`web-${n.person.id}`}>
              <circle cx={n.x} cy={n.y} r={30} />
            </clipPath>
          ))}
        </defs>

        {/* Lines */}
        {nodes.map((n) => (
          <line
            key={`line-${n.person.id}`}
            x1={CENTER}
            y1={CENTER}
            x2={n.x}
            y2={n.y}
            stroke={KIND_COLOR[n.kind]}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={n.ended ? "5 7" : undefined}
            opacity={n.ended ? 0.45 : 0.7}
          />
        ))}

        {/* Center */}
        <circle cx={CENTER} cy={CENTER} r={52} fill="var(--color-ink)" stroke={GEN_ACCENT[character.generation].hex} strokeWidth={3} />
        {character.photo_url ? (
          <image href={character.photo_url} x={CENTER - 46} y={CENTER - 46} width={92} height={92} clipPath="url(#web-center)" preserveAspectRatio="xMidYMid slice" />
        ) : (
          <text x={CENTER} y={CENTER + 10} textAnchor="middle" className="font-display" fontSize={30} fontWeight={700} fill={GEN_ACCENT[character.generation].hex}>
            {initials(character.name)}
          </text>
        )}

        {/* People */}
        {nodes.map((n) => {
          const color = GEN_ACCENT[n.person.generation].hex;
          const below = n.y >= CENTER - 10;
          return (
            <Link key={n.person.id} href={`/characters/${n.person.slug}`} className="group">
              <circle cx={n.x} cy={n.y} r={34} fill="var(--color-ink-raised)" stroke={KIND_COLOR[n.kind]} strokeWidth={2} className="transition-all group-hover:stroke-[4]" />
              {n.person.photo_url ? (
                <image href={n.person.photo_url} x={n.x - 30} y={n.y - 30} width={60} height={60} clipPath={`url(#web-${n.person.id})`} preserveAspectRatio="xMidYMid slice" />
              ) : (
                <text x={n.x} y={n.y + 7} textAnchor="middle" className="font-display" fontSize={20} fontWeight={700} fill={color}>
                  {initials(n.person.name)}
                </text>
              )}
              <text x={n.x} y={below ? n.y + 54 : n.y - 58} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--color-chalk)" className="group-hover:underline">
                {n.person.name.split(" ")[0]}
              </text>
              <text x={n.x} y={below ? n.y + 72 : n.y - 42} textAnchor="middle" fontSize={12} fill="var(--color-chalk-faint)">
                {n.label.length > 26 ? `${n.label.slice(0, 25)}…` : n.label}
              </text>
            </Link>
          );
        })}
      </svg>

      <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-chalk-muted">
        {kinds.map((k) => (
          <li key={k} className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded-full" style={{ background: KIND_COLOR[k] }} />
            {KIND_LABEL[k]}
          </li>
        ))}
        {links.some((l) => l.ended) && (
          <li className="flex items-center gap-2">
            <span className="w-5 border-t-2 border-dashed border-chalk-faint" />
            Ended
          </li>
        )}
      </ul>
    </div>
  );
}
