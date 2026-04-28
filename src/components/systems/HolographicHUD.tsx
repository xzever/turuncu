import { Card } from "@/components/ui/card";

interface KPI {
  label: string;
  value: string;
  description?: string;
  icon?: "roi" | "independence" | "investment";
}

interface HolographicHUDProps {
  kpis: ReadonlyArray<KPI>;
  isVisible: boolean;
}

function KPIIcon({ icon }: { icon?: KPI["icon"] }) {
  if (icon === "independence") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <path d="M12 3v18M3 12h18" />
        <circle cx="12" cy="12" r="8.5" />
      </svg>
    );
  }

  if (icon === "investment") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.4 10c0-1 1-1.8 2.4-1.8 1.3 0 2.3.7 2.3 1.7s-.8 1.5-2.3 1.8c-1.4.3-2.4.8-2.4 1.9 0 1 1 1.8 2.4 1.8 1.3 0 2.3-.7 2.3-1.7M12 7v10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2v5.2l3.4 2" />
    </svg>
  );
}

export default function HolographicHUD({ kpis, isVisible }: HolographicHUDProps) {
  const fallback: KPI = { label: "", value: "" };
  const roi = kpis[0] ?? fallback;
  const independence = kpis[1] ?? fallback;
  const investment = kpis[2] ?? fallback;

  return (
    <div className={`systems-hud ${isVisible ? "is-visible" : ""}`} aria-hidden="true">
      <Card className="systems-hud__card systems-hud__card--left">
        <span className="systems-hud__label">
          <KPIIcon icon={roi.icon} />
          <em>{roi.label}</em>
        </span>
        <strong>{roi.value}</strong>
        {roi.description ? <small>{roi.description}</small> : null}
      </Card>

      <Card className="systems-hud__card systems-hud__card--right">
        <span className="systems-hud__label">
          <KPIIcon icon={independence.icon} />
          <em>{independence.label}</em>
        </span>
        <strong>{independence.value}</strong>
        {independence.description ? <small>{independence.description}</small> : null}
      </Card>

      <div className="systems-hud__pill">
        <i aria-hidden="true" />
        <span className="systems-hud__label">
          <KPIIcon icon={investment.icon} />
          <em>{investment.label}</em>
        </span>
        <strong>{investment.value}</strong>
        {investment.description ? <small>{investment.description}</small> : null}
      </div>
    </div>
  );
}
