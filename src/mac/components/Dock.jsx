/*import React, { useState } from "react";
import {
  Compass,
  Folder,
  Image,
  Settings,
  Terminal,
  Code2,
} from "lucide-react";
import "./Dock.css";

const DOCK_APPS = [
  {
    id: "finder",
    label: "Finder",
    icon: Folder,
  },
  {
    id: "safari",
    label: "Safari",
    icon: Compass,
  },
  {
    id: "vscode",
    label: "Visual Studio Code",
    icon: Code2,
  },
  {
    id: "photos",
    label: "Photos",
    icon: Image,
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: Terminal,
  },
  {
    id: "settings",
    label: "System Settings",
    icon: Settings,
  },
];

export default function Dock({
  onOpenApp,
  windows = [],
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const isAppOpen = (id) =>
    windows.some(
      (window) =>
        window.appId === id && !window.minimized
    );

  const isAppMinimized = (id) =>
    windows.some(
      (window) =>
        window.appId === id && window.minimized
    );

  return (
    <nav
      className="mac-dock"
      aria-label="Dock"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="mac-dock-inner">
        {DOCK_APPS.map((app, index) => {
          const Icon = app.icon;

          const distance =
            hoveredIndex === null
              ? 0
              : Math.abs(index - hoveredIndex);

          const scale =
            hoveredIndex === null
              ? 1
              : distance === 0
                ? 1.42
                : distance === 1
                  ? 1.2
                  : distance === 2
                    ? 1.08
                    : 1;

          return (
            <button
              key={app.id}
              type="button"
              className="mac-dock-item"
              style={{
                "--dock-scale": scale,
              }}
              title={app.label}
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => onOpenApp?.(app.id)}
            >
              <span className="mac-dock-icon">
                <Icon size={27} strokeWidth={1.7} />
              </span>

              <span className="mac-dock-tooltip">
                {app.label}
              </span>

              {(isAppOpen(app.id) ||
                isAppMinimized(app.id)) && (
                <span
                  className={[
                    "mac-dock-indicator",
                    isAppMinimized(app.id)
                      ? "mac-dock-indicator-minimized"
                      : "",
                  ].join(" ")}
                />
              )}
            </button>
          );
        })}

        <span className="mac-dock-divider" />

        <button
          type="button"
          className="mac-dock-trash"
          title="Trash"
          onClick={() => {}}
        >
          <span className="mac-trash-icon">
            <span />
            <span />
            <span />
          </span>

          <span className="mac-dock-tooltip">
            Trash
          </span>
        </button>
      </div>
    </nav>
  );
}*/
import React, { useState } from "react";
import {
  Compass,
  Folder,
  Image,
  Settings,
  Terminal,
  Code2,
  Trash2,
} from "lucide-react";
import "./Dock.css";

const DOCK_APPS = [
  {
    id: "finder",
    label: "Finder",
    icon: Folder,
  },
  {
    id: "safari",
    label: "Safari",
    icon: Compass,
  },
  {
    id: "vscode",
    label: "Visual Studio Code",
    icon: Code2,
  },
  {
    id: "photos",
    label: "Photos",
    icon: Image,
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: Terminal,
  },
  {
    id: "settings",
    label: "System Settings",
    icon: Settings,
  },
];

export default function Dock({
  onOpenApp,
  windows = [],
}) {
  const [hoveredIndex, setHoveredIndex] = useState(
    null
  );

  const isRunning = (id) =>
    windows.some(
      (window) =>
        window.appId === id &&
        !window.minimized
    );

  const isMinimized = (id) =>
    windows.some(
      (window) =>
        window.appId === id &&
        window.minimized
    );

  return (
    <nav
      className="mac-dock"
      aria-label="Dock"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <div className="mac-dock-inner">
        {DOCK_APPS.map((app, index) => {
          const Icon = app.icon;

          const distance =
            hoveredIndex === null
              ? Infinity
              : Math.abs(index - hoveredIndex);

          let scale = 1;

          if (distance === 0) {
            scale = 1.45;
          } else if (distance === 1) {
            scale = 1.22;
          } else if (distance === 2) {
            scale = 1.09;
          }

          return (
            <button
              key={app.id}
              type="button"
              className="mac-dock-item"
              style={{
                "--dock-scale": scale,
              }}
              onMouseEnter={() =>
                setHoveredIndex(index)
              }
              onClick={() =>
                onOpenApp?.(app.id)
              }
            >
              <span className="mac-dock-icon">
                <Icon
                  size={27}
                  strokeWidth={1.7}
                />
              </span>

              <span className="mac-dock-tooltip">
                {app.label}
              </span>

              {(isRunning(app.id) ||
                isMinimized(app.id)) && (
                <span
                  className={[
                    "mac-dock-indicator",
                    isMinimized(app.id)
                      ? "mac-dock-indicator-minimized"
                      : "",
                  ].join(" ")}
                />
              )}
            </button>
          );
        })}

        <span className="mac-dock-divider" />

        <button
          type="button"
          className="mac-dock-trash"
          title="Trash"
        >
          <Trash2
            size={31}
            strokeWidth={1.35}
          />

          <span className="mac-dock-tooltip">
            Trash
          </span>
        </button>
      </div>
    </nav>
  );
}