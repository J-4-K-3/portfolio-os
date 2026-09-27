
import React, { useState } from "react";
import FullscreenPrompt from "../../components/Notifications/FullscreenPrompt";

import MenuBar from "./MenuBar";
import Dock from "./Dock";
import MacWindow from "./MacWindow";

import Finder from "./Finder";
import MacSafari from "./MacSafari";
import MacVSCode from "./MacVSCode";
import MacPhotos from "./MacPhotos";
import MacTerminal from "./MacTerminal";
import MacSettings from "./MacSettings";
import Portfolio from "../../apps/Portfolio/Portfolio";
import VoiceAssistant from "../../components/VoiceAssistant/VoiceAssistant";

import {
  HardDrive,
  Folder,
  Globe2,
} from "lucide-react";

import "./MacDesktop.css";

const DESKTOP_ICONS = [
  {
    id: "macintosh-hd",
    label: "Macintosh HD",
    icon: HardDrive,
    appId: "finder",
  },
  {
    id: "projects",
    label: "Projects",
    icon: Folder,
    appId: "finder",
  },
  {
    id: "innoxation",
    label: "Innoxation",
    icon: Globe2,
    appId: "safari",
  },
];

const DEFAULT_GEOMETRY = {
  finder: {
    x: 120,
    y: 90,
    width: 780,
    height: 540,
  },

  safari: {
    x: 170,
    y: 110,
    width: 850,
    height: 560,
  },

  vscode: {
    x: 210,
    y: 75,
    width: 920,
    height: 620,
  },

  photos: {
    x: 150,
    y: 105,
    width: 820,
    height: 570,
  },

  terminal: {
    x: 260,
    y: 150,
    width: 700,
    height: 440,
  },

  settings: {
    x: 190,
    y: 80,
    width: 820,
    height: 600,
  },
  portfolio_profile: { x: 175, y: 90, width: 850, height: 590 },
  portfolio_project: { x: 195, y: 105, width: 820, height: 540 },
};

export default function MacDesktop() {
  const [windows, setWindows] = useState([]);
  const [iconOrder, setIconOrder] = useState(() => { try { return JSON.parse(localStorage.getItem("innox-mac-icon-order")) || []; } catch { return []; } });
  const [draggedIcon, setDraggedIcon] = useState(null);
  const orderedDesktopIcons = [...DESKTOP_ICONS].sort((a, b) => { const ai = iconOrder.indexOf(a.id); const bi = iconOrder.indexOf(b.id); return (ai < 0 ? 100 : ai) - (bi < 0 ? 100 : bi); });
  const reorderDesktopIcon = (targetId) => { if (!draggedIcon || draggedIcon === targetId) return; const items = [...orderedDesktopIcons]; const from = items.findIndex((item) => item.id === draggedIcon); const to = items.findIndex((item) => item.id === targetId); const [item] = items.splice(from, 1); items.splice(to, 0, item); const order = items.map((entry) => entry.id); setIconOrder(order); try { localStorage.setItem("innox-mac-icon-order", JSON.stringify(order)); } catch {} };

  const getNextZIndex = (currentWindows) => {
    if (!currentWindows.length) {
      return 10;
    }

    return (
      Math.max(
        ...currentWindows.map(
          (window) => window.zIndex || 0
        )
      ) + 1
    );
  };

  const openApp = (appId, payload = null) => {
    setWindows((currentWindows) => {
      const existing = currentWindows.find(
        (window) => window.appId === appId
      );

      const nextZIndex =
        getNextZIndex(currentWindows);

      if (existing) {
        return currentWindows.map((window) =>
          window.id === existing.id
            ? {
                ...window,
                ...(payload ? { payload } : {}),
                minimized: false,
                zIndex: nextZIndex,
              }
            : window
        );
      }

      const geometry =
        DEFAULT_GEOMETRY[appId] ||
        DEFAULT_GEOMETRY.finder;

      return [
        ...currentWindows,
        {
          id: `${appId}-${Date.now()}`,
          appId,
          title: getWindowTitle(appId),
          payload,
          zIndex: nextZIndex,
          minimized: false,
          maximized: false,
          ...geometry,
        },
      ];
    });
  };

  const closeWindow = (id) => {
    setWindows((currentWindows) =>
      currentWindows.filter(
        (window) => window.id !== id
      )
    );
  };

  const minimizeWindow = (id) => {
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id
          ? {
              ...window,
              minimized: true,
            }
          : window
      )
    );
  };

  const minimizeAllWindows = () => {
    setWindows((currentWindows) =>
      currentWindows.map((window) => ({
        ...window,
        minimized: true,
      }))
    );
  };

  const closeAllWindows = () => {
    setWindows([]);
  };

  const focusWindow = (id) => {
    setWindows((currentWindows) => {
      const nextZIndex =
        getNextZIndex(currentWindows);

      return currentWindows.map((window) =>
        window.id === id
          ? {
              ...window,
              minimized: false,
              zIndex: nextZIndex,
            }
          : window
      );
    });
  };

  const toggleMaximize = (id) => {
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id
          ? {
              ...window,
              maximized: !window.maximized,
            }
          : window
      )
    );
  };

  const updateGeometry = (
    id,
    geometry
  ) => {
    setWindows((currentWindows) =>
      currentWindows.map((window) =>
        window.id === id
          ? {
              ...window,
              x: geometry.x,
              y: geometry.y,
              width: geometry.width,
              height: geometry.height,
            }
          : window
      )
    );
  };

  const runVoiceAction = ({ action, target }) => {
    if (action === "close_window") {
      const focused = [...windows].filter((window) => !window.minimized).sort((a, b) => b.zIndex - a.zIndex)[0];
      if (focused) closeWindow(focused.id);
      return;
    }
    if (action === "open_projects") { openApp("finder", { initialPath: "/Users/Jacob/Projects" }); return; }
    if (action === "open_resume") { openApp("finder", { initialPath: "/Users/Jacob/Documents" }); return; }
    if (action === "open_profile") { openApp("portfolio_profile", { view: target || "about" }); return; }
    if (action === "open_project") { openApp("portfolio_project", { project: target }); return; }
    if (action === "open_url") { openApp("safari", { url: target }); return; }
    if (action === "open_app") {
      const aliases = { browser: "safari", files: "finder", vscode: "vscode", settings: "settings", terminal: "terminal", notepad: "finder" };
      const appId = aliases[target]; if (appId) openApp(appId, target === "notepad" ? { initialPath: "/Users/Jacob/Documents" } : null);
    }
  };

  const renderApp = (window) => {
    switch (window.appId) {
      case "finder":
        return <Finder initialPath={window.payload?.initialPath || "/Users/Jacob"} />;

      case "safari":
        return <MacSafari initialUrl={window.payload?.url || "innoxation://home"} />;

      case "vscode":
        return <MacVSCode />;

      case "photos":
        return <MacPhotos />;

      case "terminal":
        return <MacTerminal />;

      case "settings":
        return <MacSettings />;

      case "portfolio_profile":
        return <Portfolio view={window.payload?.view || "about"} />;

      case "portfolio_project":
        return <Portfolio view="project" project={window.payload?.project || "auri"} />;

      default:
        return null;
    }
  };

  return (
    <main className="mac-desktop">
      <MenuBar
        onOpenApp={openApp}
        onCloseAllWindows={closeAllWindows}
        onMinimizeAllWindows={
          minimizeAllWindows
        }
      />

      <div className="mac-desktop-background">
        <div className="mac-desktop-glow mac-desktop-glow-one" />

        <div className="mac-desktop-glow mac-desktop-glow-two" />

        <div className="mac-desktop-brand">
          <span className="mac-desktop-brand-title">
            INNOXATION
          </span>

          <span className="mac-desktop-brand-subtitle">
            Mac Environment
          </span>
        </div>

        <div className="mac-desktop-icons">
          {orderedDesktopIcons.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                className="mac-desktop-icon"
                draggable
                onDragStart={(event) => { setDraggedIcon(item.id); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", item.id); }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => { event.preventDefault(); reorderDesktopIcon(item.id); }}
                onDragEnd={() => setDraggedIcon(null)}
                onDoubleClick={() => openApp(item.appId)}
              >
                <span className="mac-desktop-icon-image">
                  <Icon
                    size={35}
                    strokeWidth={1.5}
                  />
                </span>

                <span className="mac-desktop-icon-label">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <VoiceAssistant onAction={runVoiceAction} label="Mac voice assistant" />
      <FullscreenPrompt variant="mac" />

      {windows.map((window) => (
        <MacWindow
          key={window.id}
          id={window.id}
          title={window.title}
          zIndex={window.zIndex}
          minimized={window.minimized}
          maximized={window.maximized}
          x={window.x}
          y={window.y}
          width={window.width}
          height={window.height}
          onClose={closeWindow}
          onMinimize={minimizeWindow}
          onFocus={focusWindow}
          onToggleMaximize={toggleMaximize}
          onUpdateGeometry={updateGeometry}
        >
          {renderApp(window)}
        </MacWindow>
      ))}

      <Dock
        onOpenApp={openApp}
        windows={windows}
      />
    </main>
  );
}

function getWindowTitle(appId) {
  switch (appId) {
    case "finder":
      return "Finder";

    case "safari":
      return "Safari";

    case "vscode":
      return "Visual Studio Code";

    case "photos":
      return "Photos";

    case "terminal":
      return "Terminal";

    case "settings":
      return "System Settings";

    case "portfolio_profile":
      return "Jacob Mon - Profile";

    case "portfolio_project":
      return "Portfolio Project";

    default:
      return "Application";
  }
}