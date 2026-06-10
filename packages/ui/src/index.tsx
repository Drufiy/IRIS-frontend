import type { ReactNode } from "react";

import type {
  ActionEntry,
  ApprovalRequest,
  DiagnosticEntry,
  IrisState,
  MemoryEntry,
  ProviderStatus,
  SettingEntry,
  SidebarItem,
  SurfaceKey,
  ConversationEntry,
} from "../../types/src/index";

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

interface ThreadFeedProps {
  entries: ConversationEntry[];
}

interface ActionQueueProps {
  entries: ActionEntry[];
}

interface ProviderGridProps {
  providers: ProviderStatus[];
}

interface MemoryListProps {
  entries: MemoryEntry[];
}

interface SettingsListProps {
  entries: SettingEntry[];
}

interface ApprovalPanelProps {
  request: ApprovalRequest;
}

interface DiagnosticsStripProps {
  entries: DiagnosticEntry[];
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

export function ThreadFeed({ entries }: ThreadFeedProps) {
  return (
    <div className="thread-list">
      {entries.map((entry) => (
        <article key={entry.id} className={`thread-entry${entry.emphasis === "active" ? " is-active" : ""}`}>
          <strong>{entry.speaker === "user" ? "You" : "IRIS"}</strong>
          <p>{entry.text}</p>
        </article>
      ))}
    </div>
  );
}

export function ActionQueue({ entries }: ActionQueueProps) {
  return (
    <div className="action-list">
      {entries.map((entry) => (
        <div key={entry.id} className={`action-row action-row--${entry.status}`}>
          <strong>{entry.label}</strong>
          <span>{entry.detail}</span>
        </div>
      ))}
    </div>
  );
}

export function ProviderGrid({ providers }: ProviderGridProps) {
  return (
    <div className="provider-list">
      {providers.map((provider) => (
        <div key={provider.id} className={`provider-row provider-row--${provider.health}`}>
          <strong>{provider.label}</strong>
          <span>{provider.value}</span>
        </div>
      ))}
    </div>
  );
}

export function MemoryList({ entries }: MemoryListProps) {
  return (
    <div className="memory-list">
      {entries.map((entry) => (
        <div key={entry.id} className="memory-row">
          <strong>{entry.title}</strong>
          <span>{entry.detail}</span>
        </div>
      ))}
    </div>
  );
}

export function SettingsList({ entries }: SettingsListProps) {
  return (
    <div className="settings-list">
      {entries.map((entry) => (
        <div key={entry.id} className="settings-row">
          <strong>{entry.label}</strong>
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ApprovalPanel({ request }: ApprovalPanelProps) {
  return (
    <div className="approval-block">
      <p>{request.summary}</p>
      <div className="approval-note">{request.consequence}</div>
      <div className="approval-actions">
        <button type="button">Confirm</button>
        <button type="button" className="is-secondary">
          Deny
        </button>
      </div>
    </div>
  );
}

export function DiagnosticsStrip({ entries }: DiagnosticsStripProps) {
  return (
    <footer className="desktop-footer-band">
      {entries.map((entry) => (
        <div key={entry.id} className={`diagnostic-card diagnostic-card--${entry.health}`}>
          <strong>{entry.label}</strong>
          <span>{entry.value}</span>
        </div>
      ))}
    </footer>
  );
}
