import { useMemo, useState } from "react";
import {
  Search, Settings, Power, ChevronRight, Folder, Code2, FileText,
  Image, Globe, Sparkles, Mail, Gamepad2, HelpCircle, Monitor,
  Grid2X2, Clock3, ChevronDown, Moon, RotateCcw, PowerOff,
} from "lucide-react";
import { desktopApps } from "../../data/app";
import "./StartMenu.css";

const iconMap = {
  files: Folder, vscode: Code2, notepad: FileText, photos: Image,
  browser: Globe, telvin: Sparkles, settings: Settings, terminal: Monitor,
  email: Mail, tic_tac_toe: Gamepad2, trivia: HelpCircle, demos: Image,
};

function AppIcon({ app, size = 20 }) {
  const Icon = iconMap[app.id] || Sparkles;
  const source = app.icon;

  const isImage =
    typeof source === "string" &&
    (
      source.startsWith("data:image/") ||
      /^https?:\/\//i.test(source) ||
      /^\/?assets\//i.test(source) ||
      /\.(png|jpe?g|webp|svg)(\?.*)?$/i.test(source)
    );

  if (isImage) {
    return (
      <img
        src={source}
        alt=""
        width={size}
        height={size}
        draggable="false"
      />
    );
  }

  if (typeof source === "string") {
    return <span className="start-emoji">{source}</span>;
  }

  return <Icon size={size} />;
}

function readRecent() {
  try {
    return JSON.parse(localStorage.getItem("innox_recent_apps") || "[]");
  } catch {
    return [];
  }
}

function StartMenu({ onOpenApp, onClose, onPowerAction, closing = false }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("pinned");
  const [powerMenuOpen, setPowerMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const recentApps = readRecent()
    .map((id) => desktopApps.find((app) => app.id === id))
    .filter(Boolean)
    .slice(0, 4);

  const filteredApps = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return desktopApps;
    return desktopApps.filter((app) =>
      [app.name, app.description, app.category].some((value) => value?.toLowerCase().includes(needle)),
    );
  }, [query]);

  const groupedApps = useMemo(() => {
    const groups = new Map();
    filteredApps.forEach((app) => {
      const category = app.category || "Other";
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category).push(app);
    });
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filteredApps]);

  const handleOpen = (app) => {
    try {
      const next = [app.id, ...readRecent().filter((id) => id !== app.id)].slice(0, 8);
      localStorage.setItem("innox_recent_apps", JSON.stringify(next));
    } catch { /* Recent apps remain available for this session. */ }
    onOpenApp(app);
    onClose?.();
  };

  const showAll = query || view === "all";

  return (
    <aside className={`start-menu ${powerMenuOpen ? "power-open" : ""} ${closing ? "is-closing" : ""}`} onMouseDown={(event) => event.stopPropagation()}>
      <div className="start-menu-search">
        <Search size={17} aria-hidden="true" />
        <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search apps, files, and settings" aria-label="Search apps, files, and settings" />
        {query && <button type="button" onClick={() => setQuery("")}>Clear</button>}
      </div>

      <div className="start-menu-body">
        {showAll ? (
          <section className="start-section start-all-apps">
            <div className="start-section-heading">
              <h3>{query ? "Search results" : "All apps"}</h3>
              {!query && <button type="button" onClick={() => setView("pinned")}>Pinned <ChevronRight size={14} /></button>}
            </div>
            {groupedApps.length ? <div className="start-all-groups">
              {groupedApps.map(([category, apps]) => {
                const isExpanded = query || expanded[category];
                return <section key={category} className="start-all-group">
                  <button type="button" className="start-folder" aria-expanded={!!isExpanded} onClick={() => setExpanded((current) => ({ ...current, [category]: !current[category] }))}>
                    <Folder size={17} /><span>{category}</span><small>{apps.length} {apps.length === 1 ? "app" : "apps"}</small>{isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </button>
                  {isExpanded && <div className="start-all-list">{apps.map((app) => <button type="button" key={app.id} onClick={() => handleOpen(app)}><span className="start-list-icon"><AppIcon app={app} size={16} /></span><span>{app.name}</span></button>)}</div>}
                </section>;
              })}
            </div> : <div className="start-empty"><Search size={25} /><strong>No results</strong><span>Try a different search term.</span></div>}
          </section>
        ) : <>
          <section className="start-section">
            <div className="start-section-heading"><h3>Pinned</h3><button type="button" onClick={() => setView("all")}>All apps <ChevronRight size={14} /></button></div>
            <div className="start-app-grid">{desktopApps.filter((app) => app.pinned).map((app) => <button type="button" className="start-app" key={app.id} onClick={() => handleOpen(app)}><span className="start-app-icon"><AppIcon app={app} /></span><span className="start-app-name">{app.name}</span></button>)}</div>
          </section>
          <section className="start-section">
            <div className="start-section-heading"><h3><Clock3 size={14} /> Recently used</h3><span className="start-muted">Your recent apps</span></div>
            {recentApps.length ? <div className="start-recent-list">{recentApps.map((app) => <button type="button" className="start-recent" key={app.id} onClick={() => handleOpen(app)}><span className="start-recent-icon"><AppIcon app={app} size={18} /></span><span className="start-recent-info"><strong>{app.name}</strong><small>{app.description}</small></span><ChevronRight size={15} /></button>)}</div> : <p className="start-no-recent">Apps you open will appear here.</p>}
          </section>
        </>}
      </div>

      <footer className="start-menu-footer">
        <button type="button" className="start-profile" aria-label="Jacob, Innoxation"><span className="profile-avatar">J</span><span><strong>Jacob</strong><small>Innoxation</small></span></button>
        <div className="start-footer-actions">
          <button type="button" title="Settings" aria-label="Settings" onClick={() => { const app = desktopApps.find((item) => item.id === "settings"); if (app) handleOpen(app); }}><Settings size={17} /></button>
          <button type="button" title="Power" aria-label="Power" aria-expanded={powerMenuOpen} className={powerMenuOpen ? "active" : ""} onClick={() => setPowerMenuOpen((current) => !current)}><Power size={17} /></button>
        </div>
      </footer>

      {powerMenuOpen && <div className="start-power-panel" role="menu">{[
        ["Sleep", Moon], ["Restart", RotateCcw], ["Shut down", PowerOff],
      ].map(([label, Icon]) => <button key={label} type="button" role="menuitem" onClick={() => { onPowerAction?.(label); setPowerMenuOpen(false); onClose?.(); }}><Icon size={16} />{label}</button>)}</div>}
    </aside>
  );
}

export default StartMenu;
