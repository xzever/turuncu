import { Instagram, Linkedin, Mail, Youtube, type LucideIcon } from "lucide-react";
import { SOCIAL_LINKS, type SocialKind } from "@/data/social";
import "./side-rail.css";

const ICONS: Record<SocialKind, LucideIcon> = {
  mail: Mail,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export default function SideRail() {
  return (
    <aside className="side-rail" aria-label="Sosyal baglantilar">
      <span className="rail-dot is-primary" aria-hidden="true" />
      <span className="rail-line" aria-hidden="true" />

      <nav className="side-rail__links" aria-label="Turuncu Solar sosyal medya">
        {SOCIAL_LINKS.map((item) => {
          const Icon = ICONS[item.kind];
          return (
            <a
              key={item.kind}
              className="rail-icon"
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={item.aria}
              data-label={item.label}
            >
              <Icon aria-hidden="true" size={18} strokeWidth={2} />
            </a>
          );
        })}
      </nav>

      <span className="rail-line" aria-hidden="true" />
      <span className="rail-dot" aria-hidden="true" />
    </aside>
  );
}
