import { useState, useEffect, useRef } from "react";
import {
  BatteryFull,
  Globe,
  Search,
  Settings,
  Volume2,
  Wifi,
  Folder,
  Code2,
  FileText,
  Image,
  Sparkles,
  Monitor,
  Bell,
  Bluetooth,
  Plane,
  Moon,
  BatteryCharging,
  Sun,
  WifiOff,
  VolumeX,
  X,
  Trash2,
} from "lucide-react";

import "./Taskbar.css";
import icons from "../../data/icons";
import { desktopApps, searchApps } from "../../data/app";
import t from "../../utils/i18n";

const iconMap = {
  files: Folder,
  vscode: Code2,
  notepad: FileText,
  photos: Image,
  browser: Globe,
  telvin: Sparkles,
};

function getAppIcon(id) {
  return iconMap[id] || Monitor;
}

function isImagePath(value) {
  if (typeof value !== "string") return false;
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(value) || value.includes("/");
}

function readSavedLevel(key, fallback) {
  try {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) && localStorage.getItem(key) !== null ? Math.max(0, Math.min(100, value)) : fallback;
  } catch { return fallback; }
}

function Taskbar({
  windows = [],
  onRestore,
  onMinimize,
  onStart,
  onOpenApp,
  onContextMenu,
  pinnedAppIds = [],
  activeMonitor = 0,
  onSwitchMonitor,
  onMoveDraggedWindowToDisplay,
  notificationHistory = [],
  onDismissHistory,
  onClearNotifications,
  onOpenSettings,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const trayRef = useRef(null);
  const [actionCenterOpen, setActionCenterOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState(() => { try { return localStorage.getItem("innox_lang") === "de" ? "de" : "en"; } catch { return "en"; } });
  const [volume, setVolume] = useState(() => readSavedLevel("innox_volume", 100));
  const [brightness, setBrightness] = useState(() => readSavedLevel("innox_brightness", 100));
  const [quickToggles, setQuickToggles] = useState(() => ({ wifi: localStorage.getItem("innox_wifi") !== "false", bluetooth: localStorage.getItem("innox_bluetooth") === "true", airplane: false, focus: false, batterySaver: false }));
  const [currentTime, setCurrentTime] = useState(() => new Date());

  const activeWindowId =
    [...windows]
      .filter((window) => !window.minimized && (window.monitorId || 0) === activeMonitor)
      .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))[0]?.id || null;

  useEffect(() => {
    setResults(searchApps(query));
  }, [query]);

  useEffect(() => {
    document.documentElement.style.setProperty("--desktop-dim", String(1 - brightness / 100));
    try { localStorage.setItem("innox_brightness", String(brightness)); } catch { /* Keep the value for this session. */ }
  }, [brightness]);

  const updateVolume = (value) => {
    setVolume(value);
    try { localStorage.setItem("innox_volume", String(value)); } catch { /* Keep the value for this session. */ }
  };

  const openSettings = () => {
    setActionCenterOpen(false);
    setNotificationCenterOpen(false);
    onOpenSettings?.();
  };

  useEffect(() => {
    const clock = window.setInterval(() => setCurrentTime(new Date()), 1000);
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setActionCenterOpen(false);
        setNotificationCenterOpen(false);
        setLanguageOpen(false);
      }
    };
    const syncSettings = () => {
      setLanguage(localStorage.getItem("innox_lang") === "de" ? "de" : "en");
      setBrightness(readSavedLevel("innox_brightness", 100));
      setVolume(readSavedLevel("innox_volume", 100));
      setQuickToggles((current) => ({ ...current, wifi: localStorage.getItem("innox_wifi") !== "false", bluetooth: localStorage.getItem("innox_bluetooth") === "true" }));
    };
    const onOutsideClick = (event) => {
      if (!trayRef.current?.contains(event.target)) {
        setActionCenterOpen(false);
        setNotificationCenterOpen(false);
        setLanguageOpen(false);
      }
    };
    window.addEventListener("innox-settings-change", syncSettings);
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onOutsideClick);
    return () => {
      window.clearInterval(clock);
      window.removeEventListener("innox-settings-change", syncSettings);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onOutsideClick);
    };
  }, []);
  const pinnedApps = pinnedAppIds
    .map((id) => desktopApps.find((app) => app.id === id))
    .filter(Boolean);
  const taskbarItems = [
    ...pinnedApps.map((app) => {
      const running = windows.find((item) => item.id === app.id);
      return { ...app, ...(running || {}), isPinnedItem: true, isRunning: !!running };
    }),
    ...windows.filter((item) => !pinnedAppIds.includes(item.id)).map((item) => ({ ...item, isPinnedItem: false, isRunning: true })),
  ];

  const time =
    currentTime.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  const date =
    currentTime.toLocaleDateString(
      [],
      {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }
    );

  return (
    <footer className="taskbar" onContextMenu={(event) => onContextMenu?.(event, null)}>
      <div className="taskbar-left">
        <button
          type="button"
          className="taskbar-start"
          onClick={onStart}
          onContextMenu={(event) => event.stopPropagation()}
          title="Start"
        >
          {icons.windowsIcon ? (
            <img src={icons.windowsIcon} alt="Start" className="windows-logo-img" />
          ) : (
            <span className="windows-logo">
              <span />
              <span />
              <span />
              <span />
            </span>
          )}
        </button>

        <div className="taskbar-search">
          <Search size={15} />

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={t("search.placeholder")}
            aria-label="Search"
            onContextMenu={(event) => event.stopPropagation()}
          />

          {open && results && results.length > 0 && (
            <div className="taskbar-search-dropdown">
              {results.slice(0, 8).map((app) => (
                <button
                  key={app.id}
                  type="button"
                  className="taskbar-search-item"
                  onClick={() => {
                    setQuery("");
                    setOpen(false);
                    if (onOpenApp) onOpenApp(app);
                  }}
                >
                  <span className="taskbar-search-item-icon">
                    {(() => {
                      if (isImagePath(app.icon)) {
                        return <img src={app.icon} alt="" className="taskbar-icon-img" />;
                      }

                      if (typeof app.icon === "string") {
                        return <span>{app.icon}</span>;
                      }

                      const Icon = getAppIcon(app.id);
                      return <Icon size={14} />;
                    })()}
                  </span>

                  <span className="taskbar-search-item-label">
                    <strong>{app.name}</strong>
                    <small>{app.description}</small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="taskbar-apps">
        {taskbarItems.map((window) => {
          const Icon =
            typeof window.icon === "string" ? null : (window.icon || getAppIcon(window.id));

          return (
            <button
              type="button"
              key={window.id}
              className={
                window.minimized
                  ? "taskbar-app minimized"
                  : activeWindowId === window.id
                    ? "taskbar-app active"
                    : "taskbar-app"
              }
              onClick={() => {
                if (!window.isRunning) onOpenApp?.(window);
                else if (window.id === activeWindowId && !window.minimized) onMinimize?.(window.id);
                else onRestore(window.id);
              }}
              onContextMenu={(event) => { event.stopPropagation(); onContextMenu?.(event, window); }}
              title={window.name}
            >
              {typeof window.icon === "string" && isImagePath(window.icon) ? (
                <img src={window.icon} alt={window.name} className="taskbar-icon-img" />
              ) : typeof window.icon === "string" ? (
                <span>{window.icon}</span>
              ) : Icon ? (
                <Icon size={22} />
              ) : (
                <Monitor size={17} />
              )}

              <span className="taskbar-app-label">
                {window.name}
              </span>

              <span className="taskbar-app-indicator" />
            </button>
          );
        })}
      </div>

      <div className="taskbar-right" ref={trayRef}>
        <button type="button" className="taskbar-tray-button taskbar-display-switch" title={`Virtual display ${activeMonitor + 1} - click to switch, drag a window here to move it`} aria-label={`Virtual display ${activeMonitor + 1}; click to switch displays or drag a window here`} onClick={onSwitchMonitor} onMouseEnter={() => {
          if (document.body.classList.contains("window-dragging")) onMoveDraggedWindowToDisplay?.();
        }}>
          <Monitor size={18} /><span>{activeMonitor + 1}</span>
        </button>

        <button type="button" className={`taskbar-tray-button taskbar-language-button ${languageOpen ? "is-open" : ""}`} title={language === "de" ? "Sprache: Deutsch" : "Language: English"} aria-label="Choose interface language" aria-expanded={languageOpen} onClick={() => setLanguageOpen((value) => !value)}><Globe size={16}/><span>{language.toUpperCase()}</span></button>
        {languageOpen && <div className="language-menu" role="menu" aria-label="Choose language"><strong>Language / Sprache</strong>{[["en","English"],["de","Deutsch"]].map(([code,label])=><button type="button" role="menuitemradio" aria-checked={language===code} className={language===code?"active":""} key={code} onClick={()=>{setLanguage(code);localStorage.setItem("innox_lang",code);window.dispatchEvent(new CustomEvent("innox-settings-change"));setLanguageOpen(false);}}><span>{label}</span><small>{code.toUpperCase()}</small></button>)}</div>}

        <button type="button" className={`taskbar-tray-button taskbar-status-group ${actionCenterOpen ? "is-open" : ""}`} title="Quick settings" aria-label="Open quick settings" aria-expanded={actionCenterOpen} onClick={() => { setNotificationCenterOpen(false); setActionCenterOpen((value) => !value); }}>
          {quickToggles.wifi && !quickToggles.airplane ? <Wifi size={16} /> : <WifiOff size={16} />}
          {volume > 0 ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <BatteryFull size={16} />
        </button>

        <button type="button" className={`taskbar-tray-button taskbar-notification-button ${notificationCenterOpen ? "is-open" : ""}`} title="Notification center" aria-label={`Notifications, ${notificationHistory.length} items`} aria-expanded={notificationCenterOpen} onClick={() => { setActionCenterOpen(false); setNotificationCenterOpen((value) => !value); }}>
          <Bell size={17} />
          {notificationHistory.length > 0 && <span className="notification-count">{notificationHistory.length > 9 ? "9+" : notificationHistory.length}</span>}
        </button>

        <button type="button" className="taskbar-clock" title="Open notification center" aria-label={`Current time ${time}; open notifications`} onClick={() => { setActionCenterOpen(false); setNotificationCenterOpen((value) => !value); }}>
          <strong>{time}</strong><span>{date}</span>
        </button>

        {actionCenterOpen && <section className="system-panel quick-settings-panel" aria-label="Quick settings" onMouseDown={(event) => event.stopPropagation()}>
          <header className="system-panel-header"><div><strong>Quick settings</strong><small>Connected devices and controls</small></div><span className="quick-panel-status">Display {activeMonitor + 1}</span></header>
          <div className="quick-settings-grid">
            {[
              { key: "wifi", label: "Wi-Fi", Icon: quickToggles.airplane ? Plane : (quickToggles.wifi ? Wifi : WifiOff), enabled: quickToggles.wifi && !quickToggles.airplane },
              { key: "bluetooth", label: "Bluetooth", Icon: Bluetooth, enabled: quickToggles.bluetooth },
              { key: "airplane", label: "Airplane mode", Icon: Plane, enabled: quickToggles.airplane },
              { key: "focus", label: "Focus assist", Icon: Moon, enabled: quickToggles.focus },
              { key: "batterySaver", label: "Battery saver", Icon: BatteryCharging, enabled: quickToggles.batterySaver },
            ].map(({ key, label, Icon, enabled }) => <button key={key} type="button" className={`quick-setting-tile ${enabled ? "enabled" : ""}`} aria-pressed={enabled} onClick={() => { setQuickToggles((current) => { const next = { ...current, [key]: !current[key] }; if (key === "wifi") localStorage.setItem("innox_wifi", String(next.wifi)); if (key === "bluetooth") localStorage.setItem("innox_bluetooth", String(next.bluetooth)); return next; }); window.dispatchEvent(new CustomEvent("innox-settings-change")); }}><Icon size={18} /><span>{label}</span><small>{enabled ? "On" : "Off"}</small></button>)}
          </div>
          <label className="quick-slider"><Sun size={17} /><span>Brightness</span><input type="range" min="0" max="100" value={brightness} onChange={(event) => setBrightness(Number(event.target.value))} aria-label="Brightness" /><strong>{brightness}%</strong></label>
          <label className="quick-slider"><Volume2 size={17} /><span>Volume</span><input type="range" min="0" max="100" value={volume} onChange={(event) => updateVolume(Number(event.target.value))} aria-label="Volume" /><strong>{volume}%</strong></label>
          <footer className="system-panel-footer"><span>Battery 86% | {quickToggles.batterySaver ? "Saver on" : "Power mode: balanced"}</span><button type="button" onClick={openSettings}><Settings size={15} /> Settings</button></footer>
        </section>}

        {notificationCenterOpen && <section className="system-panel notification-center-panel" aria-label="Notification center" onMouseDown={(event) => event.stopPropagation()}>
          <header className="system-panel-header"><div><strong>Notifications</strong><small>{currentTime.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</small></div><button type="button" className="clear-notifications" onClick={onClearNotifications} disabled={!notificationHistory.length}><Trash2 size={14} /> Clear all</button></header>
          <div className="notification-history-list">{notificationHistory.length ? notificationHistory.map((item) => <article className={`history-notification ${item.type || "info"}`} key={item.id}><div className="history-notification-heading"><strong>{item.title}</strong><time>{new Date(item.createdAt || item.id).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time><button type="button" aria-label={`Dismiss ${item.title}`} onClick={() => onDismissHistory?.(item.id)}><X size={14} /></button></div><p>{item.message}</p></article>) : <div className="notification-center-empty"><Bell size={24} /><strong>All caught up</strong><span>No new notifications</span></div>}</div>
          <footer className="system-panel-footer"><span>{notificationHistory.length} recent {notificationHistory.length === 1 ? "notification" : "notifications"}</span><button type="button" onClick={openSettings}><Settings size={15} /> Notification settings</button></footer>
        </section>}
      </div>
    </footer>
  );
}

export default Taskbar;
