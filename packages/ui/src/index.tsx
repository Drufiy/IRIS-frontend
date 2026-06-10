import type { ReactNode } from "react";

import type { IrisState, SidebarItem, SurfaceKey } from "../../types/src/index";

interface WindowChromeProps {
  title: string;
  subtitle: string;
  status: ReactNode;
  children: ReactNode;
}

interface ShellSidebarProps {
  items: SidebarItem[];
  active: SurfaceKey;
}

interface SectionCardProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

interface SignalBadgeProps {
  state: IrisState;
  label: string;
  detail: string;
}

export function WindowChrome({ title, subtitle, status, children }: WindowChromeProps) {
  return (
    <div className="desktop-window">
      <div className="desktop-window__bar">
        <div className="desktop-window__lights" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="desktop-window__title-group">
          <strong>{title}</strong>
          <span>{subtitle}</span>
        </div>
        <div className="desktop-window__status">{status}</div>
      </div>
      {children}
    </div>
  );
}

export function ShellSidebar({ items, active }: ShellSidebarProps) {
  return (
    <aside className="desktop-sidebar-shell">
      <div className="desktop-sidebar-shell__brand">
        <span className="desktop-sidebar-shell__mark" />
        <div>
          <strong>IRIS</strong>
          <span>Desktop shell</span>
        </div>
      </div>

      <nav className="desktop-sidebar-shell__nav" aria-label="Desktop surfaces">
        {items.map((item) => (
          <div
            key={item.key}
            className={`desktop-sidebar-shell__item${item.key === active ? " is-active" : ""}`}
          >
            <strong>{item.label}</strong>
            <span>{item.hint}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export function SectionCard({ eyebrow, title, children }: SectionCardProps) {
  return (
    <section className="desktop-card">
      <span className="desktop-card__eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function SignalBadge({ state, label, detail }: SignalBadgeProps) {
  return (
    <div className={`signal-badge signal-badge--${state}`}>
      <strong>{label}</strong>
      <span>{detail}</span>
    </div>
  );
}
