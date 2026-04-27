import type { CSSProperties, ReactNode } from "react";

type SystemType = "grid" | "hybrid-no-battery" | "hybrid-with-battery" | "off-grid";
type NodeTone = "source" | "device" | "storage" | "grid" | "load";
type IconKey = "panel" | "inverter" | "board" | "grid" | "meter" | "home" | "battery" | "generator" | "smart";
type LineTone = "solar" | "grid" | "storage";
type LineDirection = "forward" | "reverse";

interface SystemSimulationProps {
  type: SystemType;
}

type DiagramNode = {
  id: string;
  label: string;
  icon: IconKey;
  tone: NodeTone;
  x: number;
  y: number;
  caption?: string;
};

type DiagramLine = {
  id: string;
  x: number;
  y: number;
  length: number;
  axis: "h" | "v";
  tone: LineTone;
  direction?: LineDirection;
};

type DiagramConfig = {
  title: string;
  subtitle: string;
  nodes: ReadonlyArray<DiagramNode>;
  lines: ReadonlyArray<DiagramLine>;
};

const ICONS: Record<IconKey, ReactNode> = {
  panel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2.2" />
      <path d="M3 10h18M3 15h18M9 4v16M15 4v16" />
    </svg>
  ),
  inverter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="3.5" width="16" height="17" rx="3" />
      <path d="M12 7v10M8 12h8" />
    </svg>
  ),
  board: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="3.5" width="16" height="17" rx="2.5" />
      <path d="M13.4 3.5v17M8.3 8h2.8M8.3 12h2.8M8.3 16h2.8" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M12 2 6.4 10.8h11.2z" />
      <path d="M8 10.8V22M16 10.8V22M10.2 15.4h3.6M9 18.9h6" />
    </svg>
  ),
  meter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4.5" y="2.8" width="15" height="18.4" rx="2.8" />
      <path d="M8 7h8M9.2 13.4 12 10.6l2.8 2.8M12 10.6V16.8" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 10.2 12 3l9 7.2V21h-6.4v-6.6h-5.2V21H3z" />
      <path d="M9.3 21v-4.2h5.4V21" />
    </svg>
  ),
  battery: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.8" y="6.2" width="17.2" height="11.6" rx="2.5" />
      <path d="M21 9.3h1.6v5.4H21M7.8 12h8.4M12 7.8v8.4" />
    </svg>
  ),
  generator: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3.3" y="5.2" width="17.4" height="13.6" rx="2.8" />
      <path d="M7.5 12h9M12 7.5V16.5M7.2 20.5h9.6" />
    </svg>
  ),
  smart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="5.2" y="2.8" width="13.6" height="18.4" rx="3.2" />
      <path d="M8.5 7.8h7M8.5 11.6h7M10.4 15.6h3.2" />
    </svg>
  ),
};

const GRID_DIAGRAM: DiagramConfig = {
  title: "On Grid Enerji Akışı",
  subtitle: "Şebekeye bağlı çalışır; üretim yetmediğinde enerji şebekeden tamamlanır",
  nodes: [
    { id: "panel", label: "Solar Panel", icon: "panel", tone: "source", x: 50, y: 16 },
    { id: "inverter", label: "On Grid Inverter", icon: "inverter", tone: "device", x: 50, y: 38 },
    { id: "board", label: "GES Panosu", icon: "board", tone: "device", x: 50, y: 67 },
    { id: "home", label: "Yük / Bina", icon: "home", tone: "load", x: 76, y: 67 },
    { id: "meter", label: "Çift Yönlü Sayaç", icon: "meter", tone: "device", x: 28, y: 67 },
    { id: "grid", label: "Şebeke", icon: "grid", tone: "grid", x: 10, y: 67 },
  ],
  lines: [
    { id: "grid-panel-inverter", x: 50, y: 21.6, length: 11.2, axis: "v", tone: "solar" },
    { id: "grid-inverter-board", x: 50, y: 44, length: 17.4, axis: "v", tone: "solar" },
    { id: "grid-board-home", x: 55, y: 67, length: 17, axis: "h", tone: "solar" },
    { id: "grid-meter-board-a", x: 32, y: 65.9, length: 14, axis: "h", tone: "grid" },
    { id: "grid-meter-board-b", x: 32, y: 68.1, length: 14, axis: "h", tone: "grid", direction: "reverse" },
    { id: "grid-grid-meter-a", x: 14, y: 65.9, length: 10, axis: "h", tone: "grid" },
    { id: "grid-grid-meter-b", x: 14, y: 68.1, length: 10, axis: "h", tone: "grid", direction: "reverse" },
  ],
};

const HYBRID_NO_BATTERY_DIAGRAM: DiagramConfig = {
  title: "Hibrit Grid Enerji Akışı",
  subtitle: "Hibrit inverter ile batarya eklemeye hazır, şebeke destekli akıllı kurgu",
  nodes: [
    { id: "panel", label: "Solar Panel", icon: "panel", tone: "source", x: 50, y: 16 },
    { id: "inverter", label: "Hybrid Inverter", icon: "inverter", tone: "device", x: 50, y: 38 },
    { id: "ems", label: "EMS", icon: "smart", tone: "device", x: 28, y: 38 },
    { id: "board", label: "GES Panosu", icon: "board", tone: "device", x: 50, y: 67 },
    { id: "home", label: "Yük / Bina", icon: "home", tone: "load", x: 76, y: 67 },
    { id: "meter", label: "Çift Yönlü Sayaç", icon: "meter", tone: "device", x: 28, y: 67 },
    { id: "grid", label: "Şebeke", icon: "grid", tone: "grid", x: 10, y: 67 },
  ],
  lines: [
    { id: "hy-panel-inverter", x: 50, y: 21.6, length: 11.2, axis: "v", tone: "solar" },
    { id: "hy-inverter-board", x: 50, y: 44, length: 17.4, axis: "v", tone: "solar" },
    { id: "hy-ems-inverter-a", x: 33, y: 36.9, length: 12, axis: "h", tone: "storage" },
    { id: "hy-ems-inverter-b", x: 33, y: 39.1, length: 12, axis: "h", tone: "storage", direction: "reverse" },
    { id: "hy-ems-meter", x: 28, y: 44, length: 17.4, axis: "v", tone: "storage" },
    { id: "hy-board-home", x: 55, y: 67, length: 17, axis: "h", tone: "solar" },
    { id: "hy-meter-board-a", x: 32, y: 65.9, length: 14, axis: "h", tone: "grid" },
    { id: "hy-meter-board-b", x: 32, y: 68.1, length: 14, axis: "h", tone: "grid", direction: "reverse" },
    { id: "hy-grid-meter-a", x: 14, y: 65.9, length: 10, axis: "h", tone: "grid" },
    { id: "hy-grid-meter-b", x: 14, y: 68.1, length: 10, axis: "h", tone: "grid", direction: "reverse" },
  ],
};

const HYBRID_WITH_BATTERY_DIAGRAM: DiagramConfig = {
  title: "Hibrit + Batarya Akışı",
  subtitle: "Gündüz depolama, akşam batarya tüketimi ve kesinti anında kritik yük koruması",
  nodes: [
    { id: "panel", label: "Solar Panel", icon: "panel", tone: "source", x: 50, y: 16 },
    { id: "inverter", label: "Hybrid Inverter", icon: "inverter", tone: "device", x: 50, y: 38 },
    { id: "battery", label: "Batarya", icon: "battery", tone: "storage", x: 72, y: 38 },
    { id: "ems", label: "EMS", icon: "smart", tone: "device", x: 28, y: 38 },
    { id: "board", label: "GES Panosu", icon: "board", tone: "device", x: 50, y: 67 },
    { id: "home", label: "Kritik Yük", icon: "home", tone: "load", x: 76, y: 67 },
    { id: "meter", label: "Çift Yönlü Sayaç", icon: "meter", tone: "device", x: 28, y: 67 },
    { id: "grid", label: "Şebeke", icon: "grid", tone: "grid", x: 10, y: 67 },
  ],
  lines: [
    { id: "hb-panel-inverter", x: 50, y: 21.6, length: 11.2, axis: "v", tone: "solar" },
    { id: "hb-inverter-board", x: 50, y: 44, length: 17.4, axis: "v", tone: "solar" },
    { id: "hb-battery-inverter-a", x: 55, y: 36.9, length: 12, axis: "h", tone: "storage" },
    { id: "hb-battery-inverter-b", x: 55, y: 39.1, length: 12, axis: "h", tone: "storage", direction: "reverse" },
    { id: "hb-ems-inverter-a", x: 33, y: 36.9, length: 12, axis: "h", tone: "storage" },
    { id: "hb-ems-inverter-b", x: 33, y: 39.1, length: 12, axis: "h", tone: "storage", direction: "reverse" },
    { id: "hb-ems-meter", x: 28, y: 44, length: 17.4, axis: "v", tone: "storage" },
    { id: "hb-board-home", x: 55, y: 67, length: 17, axis: "h", tone: "solar" },
    { id: "hb-meter-board-a", x: 32, y: 65.9, length: 14, axis: "h", tone: "grid" },
    { id: "hb-meter-board-b", x: 32, y: 68.1, length: 14, axis: "h", tone: "grid", direction: "reverse" },
    { id: "hb-grid-meter-a", x: 14, y: 65.9, length: 10, axis: "h", tone: "grid" },
    { id: "hb-grid-meter-b", x: 14, y: 68.1, length: 10, axis: "h", tone: "grid", direction: "reverse" },
  ],
};

const OFF_GRID_DIAGRAM: DiagramConfig = {
  title: "Off-Grid Enerji Akışı",
  subtitle: "Şebekeden bağımsız üretim ve depolama; enerji tamamen sahada yönetilir",
  nodes: [
    { id: "panel", label: "Solar Panel", icon: "panel", tone: "source", x: 50, y: 16 },
    { id: "inverter", label: "Off Grid Inverter", icon: "inverter", tone: "device", x: 50, y: 38 },
    { id: "battery", label: "Batarya Bankı", icon: "battery", tone: "storage", x: 72, y: 38 },
    { id: "ems", label: "Enerji Kontrol", icon: "smart", tone: "device", x: 28, y: 38 },
    { id: "generator", label: "Jeneratör", icon: "generator", tone: "grid", x: 28, y: 67 },
    { id: "home", label: "Yük / Bina", icon: "home", tone: "load", x: 76, y: 67 },
  ],
  lines: [
    { id: "off-panel-inverter", x: 50, y: 21.6, length: 11.2, axis: "v", tone: "solar" },
    { id: "off-ems-inverter-a", x: 33, y: 36.9, length: 12, axis: "h", tone: "storage" },
    { id: "off-ems-inverter-b", x: 33, y: 39.1, length: 12, axis: "h", tone: "storage", direction: "reverse" },
    { id: "off-battery-inverter-a", x: 55, y: 36.9, length: 12, axis: "h", tone: "storage" },
    { id: "off-battery-inverter-b", x: 55, y: 39.1, length: 12, axis: "h", tone: "storage", direction: "reverse" },
    { id: "off-inverter-home", x: 50, y: 44, length: 17.4, axis: "v", tone: "solar" },
    { id: "off-home-tail", x: 55, y: 67, length: 17, axis: "h", tone: "solar" },
    { id: "off-generator-ems-a", x: 28, y: 44, length: 17.4, axis: "v", tone: "grid" },
    { id: "off-generator-ems-b", x: 30, y: 44, length: 17.4, axis: "v", tone: "grid", direction: "reverse" },
  ],
};

const DIAGRAMS: Record<SystemType, DiagramConfig> = {
  grid: GRID_DIAGRAM,
  "hybrid-no-battery": HYBRID_NO_BATTERY_DIAGRAM,
  "hybrid-with-battery": HYBRID_WITH_BATTERY_DIAGRAM,
  "off-grid": OFF_GRID_DIAGRAM,
};

function SystemNode({
  node,
  delay,
}: {
  node: DiagramNode;
  delay: string;
}) {
  return (
    <article
      className={`system-sim__node system-sim__node--${node.tone}`}
      style={{ "--x": `${node.x}%`, "--y": `${node.y}%`, "--delay": delay } as CSSProperties}
    >
      <div className="system-sim__node-icon">{ICONS[node.icon]}</div>
      <p>{node.label}</p>
      {node.caption ? <span>{node.caption}</span> : null}
    </article>
  );
}

export default function SystemSimulation({ type }: SystemSimulationProps) {
  const diagram = DIAGRAMS[type] ?? DIAGRAMS.grid;

  return (
    <div className="system-sim">
      <div className="system-sim__board" role="img" aria-label={diagram.subtitle}>
        {diagram.lines.map((line, index) => (
          <span
            key={line.id}
            className={[
              "system-sim__line",
              `system-sim__line--${line.axis}`,
              `system-sim__line--${line.tone}`,
              line.direction === "reverse" ? "is-reverse" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={
              {
                "--x": `${line.x}%`,
                "--y": `${line.y}%`,
                "--len": `${line.length}%`,
                "--delay": `${index * 130}ms`,
              } as CSSProperties
            }
            aria-hidden="true"
          />
        ))}

        {diagram.nodes.map((node, index) => (
          <SystemNode key={node.id} node={node} delay={`${index * 120}ms`} />
        ))}

        <div className="system-sim__legend">
          <strong>{diagram.title}</strong>
          <p>{diagram.subtitle}</p>
        </div>
      </div>
    </div>
  );
}
