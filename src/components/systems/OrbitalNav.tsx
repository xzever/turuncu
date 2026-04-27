import { type CSSProperties, type ReactNode } from "react";

export type SystemSectionId =
  | "grid"
  | "hybrid-no-battery"
  | "hybrid-with-battery"
  | "off-grid"
  | "kurulum"
  | "karsilastirma";

const TAB_ICONS: Record<SystemSectionId, ReactNode> = {
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 2 6.4 10.8h11.2z" />
      <path d="M8 10.8V22M16 10.8V22" />
    </svg>
  ),
  "hybrid-no-battery": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="4" y="4" width="7" height="16" rx="2" />
      <rect x="13" y="4" width="7" height="16" rx="2" />
    </svg>
  ),
  "hybrid-with-battery": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3.8" y="6.2" width="17.2" height="11.6" rx="2.5" />
      <path d="M21 9.3h1.6v5.4H21M7.8 12h8.4" />
    </svg>
  ),
  "off-grid": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 4h16v16H4z" />
      <path d="m8 8 8 8M16 8l-8 8" />
    </svg>
  ),
  kurulum: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 6h9m0 0-2.2-2.2M13 6 10.8 8.2M20 18H11m0 0 2.2-2.2M11 18l2.2 2.2" />
      <path d="M9 6v12M15 6v12" />
    </svg>
  ),
  karsilastirma: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M8.5 5 4 12l4.5 7M15.5 5 20 12l-4.5 7" />
      <path d="M9.5 10h5M9.5 14h5" />
    </svg>
  ),
};

interface OrbitalNavProps<T extends string> {
  activeSection: T;
  onSelect: (id: T) => void;
  sectionOrder: ReadonlyArray<T>;
  labels: Record<T, string>;
  icons?: Record<T, ReactNode>;
  classPrefix?: string;
  navAriaLabel?: string;
  /** Son butonun sağında render edilecek ekstra içerik (ör. Link). */
  trailing?: ReactNode;
}

export default function OrbitalNav<T extends string>({
  activeSection,
  onSelect,
  sectionOrder,
  labels,
  icons,
  classPrefix = "systems",
  navAriaLabel = "Sistem navigasyonu",
  trailing,
}: OrbitalNavProps<T>) {
  const currentIcons = icons || (TAB_ICONS as unknown as Record<T, ReactNode>);

  return (
    <nav className={`${classPrefix}-tabs`} aria-label={navAriaLabel}>
      {sectionOrder.map((id, index) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={`${classPrefix}-tab ${activeSection === id ? "is-active" : ""}`.trim()}
          data-system-id={id}
          style={{ "--tab-delay": `${index * 70}ms` } as CSSProperties}
          aria-current={activeSection === id ? "true" : undefined}
        >
          <span className={`${classPrefix}-tab__icon`} aria-hidden="true">
            {currentIcons[id]}
          </span>
          <span>{labels[id]}</span>
        </button>
      ))}
      {trailing}
    </nav>
  );
}
