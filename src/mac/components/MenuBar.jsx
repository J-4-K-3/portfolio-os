/*import React, { useEffect, useRef, useState } from "react";
import {
  Apple,
  Search,
  Wifi,
  BatteryFull,
  ChevronDown,
} from "lucide-react";

import "./MenuBar.css";

function MenuBar({
  onOpenApp,
  onCloseAllWindows,
  onMinimizeAllWindows,
}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(null);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setActiveMenu(null);
        setStatusOpen(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const toggleMenu = (menu) => {
    setStatusOpen(null);

    setActiveMenu((current) =>
      current === menu ? null : menu
    );
  };

  const openApp = (app) => {
    setActiveMenu(null);

    if (onOpenApp) {
      onOpenApp(app);
    }
  };

  const runAction = (action) => {
    setActiveMenu(null);

    if (action === "minimize") {
      onMinimizeAllWindows?.();
    }

    if (action === "close") {
      onCloseAllWindows?.();
    }
  };

  return (
    <header
      className="mac-menu-bar"
      ref={menuRef}
    >
      <div className="mac-menu-left">
        <button
          className="mac-menu-apple"
          onClick={() => toggleMenu("apple")}
        >
          <Apple size={16} fill="currentColor" />
        </button>

        <button
          className="mac-menu-app-name"
          onClick={() => toggleMenu("finder")}
        >
          Finder
        </button>

        {["File", "Edit", "View", "Go", "Window", "Help"].map(
          (menu) => (
            <button
              key={menu}
              className="mac-menu-item"
              onClick={() => toggleMenu(menu)}
            >
              {menu}
            </button>
          )
        )}
      </div>

      <div className="mac-menu-right">
        <button
          className="mac-status-button"
          onClick={() =>
            setStatusOpen((current) =>
              current === "wifi" ? null : "wifi"
            )
          }
        >
          <Wifi size={14} />
        </button>

        <button
          className="mac-status-button"
          onClick={() =>
            setStatusOpen((current) =>
              current === "battery" ? null : "battery"
            )
          }
        >
          <BatteryFull size={15} />
        </button>

        <button
          className="mac-status-button"
          onClick={() =>
            setSearchOpen((current) => !current)
          }
        >
          <Search size={14} />
        </button>

        <span className="mac-menu-date">
          Thu Sep 18
        </span>

        <span className="mac-menu-time">
          09:44
        </span>
      </div>

      {activeMenu && (
        <div className="mac-dropdown-menu">
          {activeMenu === "apple" && (
            <>
              <div className="mac-dropdown-title">
                Innoxation Mac
              </div>

              <button
                onClick={() => openApp("settings")}
              >
                System Settings...
              </button>

              <button
                onClick={() => openApp("terminal")}
              >
                Open Terminal
              </button>

              <div className="mac-dropdown-divider" />

              <button
                onClick={() => runAction("minimize")}
              >
                Minimize All Windows
              </button>

              <button
                onClick={() => runAction("close")}
              >
                Close All Windows
              </button>
            </>
          )}

          {activeMenu === "finder" && (
            <>
              <div className="mac-dropdown-title">
                Finder
              </div>

              <button onClick={() => openApp("finder")}>
                New Finder Window
              </button>

              <button onClick={() => openApp("terminal")}>
                Open Terminal
              </button>
            </>
          )}

          {activeMenu === "File" && (
            <>
              <button onClick={() => openApp("finder")}>
                New Finder Window
              </button>

              <button onClick={() => openApp("vscode")}>
                Open Project
              </button>
            </>
          )}

          {activeMenu === "Edit" && (
            <>
              <button>Undo</button>
              <button>Redo</button>

              <div className="mac-dropdown-divider" />

              <button>Cut</button>
              <button>Copy</button>
              <button>Paste</button>
            </>
          )}

          {activeMenu === "View" && (
            <>
              <button onClick={() => openApp("finder")}>
                Show Finder
              </button>

              <button onClick={() => openApp("photos")}>
                Show Photos
              </button>
            </>
          )}

          {activeMenu === "Go" && (
            <>
              <button onClick={() => openApp("finder")}>
                Home
              </button>

              <button onClick={() => openApp("finder")}>
                Applications
              </button>

              <button onClick={() => openApp("finder")}>
                Downloads
              </button>
            </>
          )}

          {activeMenu === "Window" && (
            <>
              <button
                onClick={() => runAction("minimize")}
              >
                Minimize All
              </button>

              <button
                onClick={() => openApp("finder")}
              >
                Bring Finder to Front
              </button>

              <button
                onClick={() => openApp("vscode")}
              >
                Bring VS Code to Front
              </button>
            </>
          )}

          {activeMenu === "Help" && (
            <>
              <button onClick={() => openApp("safari")}>
                Innoxation Help
              </button>

              <button onClick={() => openApp("telvin")}>
                Ask Telvin
              </button>
            </>
          )}
        </div>
      )}

      {searchOpen && (
        <div className="mac-menu-search">
          <Search size={15} />

          <input
            autoFocus
            placeholder="Search"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setSearchOpen(false);
              }
            }}
          />
        </div>
      )}

      {statusOpen === "wifi" && (
        <div className="mac-status-popover">
          <strong>Wi-Fi</strong>

          <div className="mac-status-row">
            <Wifi size={15} />
            <span>Innoxation Network</span>
            <span>✓</span>
          </div>

          <small>Connected</small>
        </div>
      )}

      {statusOpen === "battery" && (
        <div className="mac-status-popover">
          <strong>Battery</strong>

          <div className="mac-battery-value">
            <BatteryFull size={22} />
            <span>87%</span>
          </div>

          <small>Power Source: Battery</small>
        </div>
      )}
    </header>
  );
}

export default MenuBar;*/
import React, { useEffect, useState } from "react";
import {
  Apple,
  BatteryFull,
  Search,
  Wifi,
  Settings,
  Terminal,
  Folder,
  Image,
  Code2,
  HelpCircle,
} from "lucide-react";
import "./MenuBar.css";

export default function MenuBar({
  onOpenApp,
  onCloseAllWindows,
  onMinimizeAllWindows,
}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showStatus, setShowStatus] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState(
    new Date()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const formattedDate = currentTime.toLocaleDateString(
    [],
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    }
  );

  const toggleMenu = (menu) => {
    setShowStatus(null);
    setShowSearch(false);

    setActiveMenu((current) =>
      current === menu ? null : menu
    );
  };

  const closePopovers = () => {
    setActiveMenu(null);
    setShowStatus(null);
    setShowSearch(false);
  };

  const runAction = (callback) => {
    closePopovers();
    callback?.();
  };

  return (
    <header
      className="mac-menubar"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          closePopovers();
        }
      }}
    >
      <div className="mac-menubar-left">
        <button
          type="button"
          className="mac-menubar-apple"
          onClick={() => toggleMenu("apple")}
          aria-label="Apple menu"
        >
          <Apple size={16} fill="currentColor" />
        </button>

        <button
          type="button"
          className={[
            "mac-menubar-item",
            activeMenu === "finder"
              ? "active"
              : "",
          ].join(" ")}
          onClick={() => toggleMenu("finder")}
        >
          Finder
        </button>

        <button
          type="button"
          className={[
            "mac-menubar-item",
            activeMenu === "file" ? "active" : "",
          ].join(" ")}
          onClick={() => toggleMenu("file")}
        >
          File
        </button>

        <button
          type="button"
          className={[
            "mac-menubar-item",
            activeMenu === "edit" ? "active" : "",
          ].join(" ")}
          onClick={() => toggleMenu("edit")}
        >
          Edit
        </button>

        <button
          type="button"
          className={[
            "mac-menubar-item",
            activeMenu === "view" ? "active" : "",
          ].join(" ")}
          onClick={() => toggleMenu("view")}
        >
          View
        </button>

        <button
          type="button"
          className={[
            "mac-menubar-item",
            activeMenu === "go" ? "active" : "",
          ].join(" ")}
          onClick={() => toggleMenu("go")}
        >
          Go
        </button>

        <button
          type="button"
          className={[
            "mac-menubar-item",
            activeMenu === "window"
              ? "active"
              : "",
          ].join(" ")}
          onClick={() => toggleMenu("window")}
        >
          Window
        </button>

        <button
          type="button"
          className={[
            "mac-menubar-item",
            activeMenu === "help" ? "active" : "",
          ].join(" ")}
          onClick={() => toggleMenu("help")}
        >
          Help
        </button>
      </div>

      <div className="mac-menubar-right">
        <button
          type="button"
          className="mac-status-button"
          onClick={() => {
            setActiveMenu(null);
            setShowSearch(false);
            setShowStatus(
              showStatus === "wifi"
                ? null
                : "wifi"
            );
          }}
          aria-label="Wi-Fi status"
        >
          <Wifi size={15} />
        </button>

        <button
          type="button"
          className="mac-status-button"
          onClick={() => {
            setActiveMenu(null);
            setShowSearch(false);
            setShowStatus(
              showStatus === "battery"
                ? null
                : "battery"
            );
          }}
          aria-label="Battery status"
        >
          <BatteryFull size={17} />
        </button>

        <button
          type="button"
          className="mac-status-button"
          onClick={() => {
            setActiveMenu(null);
            setShowStatus(null);
            setShowSearch(!showSearch);
          }}
          aria-label="Search"
        >
          <Search size={15} />
        </button>

        <span className="mac-menubar-date">
          {formattedDate}
        </span>

        <span className="mac-menubar-time">
          {formattedTime}
        </span>
      </div>

      {activeMenu === "apple" && (
        <MenuDropdown className="mac-menu-apple-dropdown">
          <MenuItem
            icon={<Settings size={15} />}
            label="System Settings…"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("settings")
              )
            }
          />

          <MenuDivider />

          <MenuItem
            label="Sleep"
            onClick={closePopovers}
          />

          <MenuItem
            label="Restart…"
            onClick={closePopovers}
          />

          <MenuItem
            label="Shut Down…"
            onClick={closePopovers}
          />

          <MenuDivider />

          <MenuItem
            label="Minimize All Windows"
            onClick={() =>
              runAction(onMinimizeAllWindows)
            }
          />

          <MenuItem
            label="Close All Windows"
            onClick={() =>
              runAction(onCloseAllWindows)
            }
          />
        </MenuDropdown>
      )}

      {activeMenu === "finder" && (
        <MenuDropdown>
          <MenuItem
            icon={<Folder size={15} />}
            label="New Finder Window"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("finder")
              )
            }
          />

          <MenuItem
            icon={<Terminal size={15} />}
            label="Open Terminal"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("terminal")
              )
            }
          />
        </MenuDropdown>
      )}

      {activeMenu === "file" && (
        <MenuDropdown>
          <MenuItem
            label="New Finder Window"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("finder")
              )
            }
          />

          <MenuItem
            label="Open Project"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("vscode")
              )
            }
          />
        </MenuDropdown>
      )}

      {activeMenu === "edit" && (
        <MenuDropdown>
          <MenuItem label="Undo" />
          <MenuItem label="Redo" />

          <MenuDivider />

          <MenuItem label="Cut" />
          <MenuItem label="Copy" />
          <MenuItem label="Paste" />
        </MenuDropdown>
      )}

      {activeMenu === "view" && (
        <MenuDropdown>
          <MenuItem
            icon={<Folder size={15} />}
            label="Show Finder"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("finder")
              )
            }
          />

          <MenuItem
            icon={<Image size={15} />}
            label="Show Photos"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("photos")
              )
            }
          />
        </MenuDropdown>
      )}

      {activeMenu === "go" && (
        <MenuDropdown>
          <MenuItem
            label="Home"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("finder")
              )
            }
          />

          <MenuItem
            label="Applications"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("finder")
              )
            }
          />

          <MenuItem
            label="Downloads"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("finder")
              )
            }
          />
        </MenuDropdown>
      )}

      {activeMenu === "window" && (
        <MenuDropdown>
          <MenuItem
            label="Minimize All"
            onClick={() =>
              runAction(onMinimizeAllWindows)
            }
          />

          <MenuItem
            label="Bring Finder to Front"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("finder")
              )
            }
          />

          <MenuItem
            icon={<Code2 size={15} />}
            label="Bring VS Code to Front"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("vscode")
              )
            }
          />
        </MenuDropdown>
      )}

      {activeMenu === "help" && (
        <MenuDropdown>
          <MenuItem
            icon={<HelpCircle size={15} />}
            label="Innoxation Help"
            onClick={() =>
              runAction(() =>
                onOpenApp?.("safari")
              )
            }
          />

          <MenuItem
            label="Ask Telvin"
            onClick={() => closePopovers()}
          />
        </MenuDropdown>
      )}

      {showStatus === "wifi" && (
        <StatusPopover>
          <div className="mac-status-title">
            Wi-Fi
          </div>

          <div className="mac-status-main">
            <Wifi size={20} />
            <span>Innoxation Network</span>
          </div>

          <div className="mac-status-secondary">
            Connected
          </div>
        </StatusPopover>
      )}

      {showStatus === "battery" && (
        <StatusPopover>
          <div className="mac-status-title">
            Battery
          </div>

          <div className="mac-status-main">
            <BatteryFull size={20} />
            <span>100%</span>
          </div>

          <div className="mac-status-secondary">
            Power Source: Battery
          </div>
        </StatusPopover>
      )}

      {showSearch && (
        <div className="mac-search-popover">
          <Search size={16} />

          <input
            autoFocus
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search"
          />

          {search && (
            <div className="mac-search-result">
              Search results for “{search}”
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function MenuDropdown({ children, className = "" }) {
  return (
    <div
      className={[
        "mac-menu-dropdown",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}) {
  return (
    <button
      type="button"
      className="mac-menu-item"
      onClick={onClick}
    >
      <span className="mac-menu-item-icon">
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}

function MenuDivider() {
  return <div className="mac-menu-divider" />;
}

function StatusPopover({ children }) {
  return (
    <div className="mac-status-popover">
      {children}
    </div>
  );
}