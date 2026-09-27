import { useState, useEffect, useRef, forwardRef } from "react";

import DesktopIcons from "./DesktopIcons";
import Taskbar from "../Taskbar/Taskbar";
import StartMenu from "../StartMenu/StartMenu";

import ContextMenu from "../ContextMenu/ContextMenu";
import Notifications from "../Notifications/Notifications";

import Window from "../Window/Window";
import WindowManager from "../Window/WindowManager";

import Files from "../../apps/Files/Files";
import VSCode from "../../apps/VSCode/VSCode";
import Notepad from "../../apps/Notepad/Notepad";
import StickyNotes from "../../apps/StickyNotes/StickyNotes";
import Terminal from "../../apps/VSCode/Terminal";
import FullscreenPrompt from "../Notifications/FullscreenPrompt";
import recruiterGuide from "../../data/recruiterGuide";
import Photos from "../../apps/Photos/Photos";
import Browser from "../../apps/Browser/Browser";
import Settings from "../../apps/Settings/Settings";
import Email from "../../apps/Email/Email";

import TicTacToe from "../../apps/Games/TicTacToe";
import Trivia from "../../apps/Games/Trivia";

import Demos from "../../apps/Demos/Demos";
import Portfolio from "../../apps/Portfolio/Portfolio";
import VoiceAssistant from "../VoiceAssistant/VoiceAssistant";
import TelvinChat from "../../apps/Telvin/TelvinChat";

import { playClick } from "../../utils/soundUtils";
import { trackPortfolioEntered, trackTelvinOpened, trackResumeOpened } from "../../utils/analytics";
import VideoWallpaper from "../VideoWallpaper/VideoWallpaper";

/**
 * Opens Sticky Notes and Notepad (with Resume) once the
 * boot screen finishes. Closing both during the session
 * stops them from reopening until the user resets it.
 */
function BootLauncher({ hasBooted, windows, openWindow, activeMonitor }) {
  const [bootDismissed, setBootDismissed] = useState(false);
  const launchedRef = useRef(false);

  useEffect(() => {
    if (!hasBooted || bootDismissed || launchedRef.current) return;
    const enabled = localStorage.getItem("innox_boot_apps_enabled") !== "false";
    if (!enabled) return;

    const timer = window.setTimeout(() => {
      if (launchedRef.current) return;
      launchedRef.current = true;

      const existing = new Set(windows.map((item) => item.id));
      if (!existing.has("stickynotes")) {
        openWindow(
          { id: "stickynotes", name: "Sticky Notes" },
          null,
          activeMonitor
        );
      }
      if (!existing.has("notepad")) {
        openWindow(
          { id: "notepad", name: "Notepad" },
          { filePath: "/Resume.txt" },
          activeMonitor
        );
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [hasBooted, bootDismissed, windows, openWindow, activeMonitor]);

  /**
   * If the user closes both auto-opened apps during this
   * session, stop reopening them until they are reset.
   */
  useEffect(() => {
    if (bootDismissed || !launchedRef.current) return;
    const hasSticky = windows.some((item) => item.id === "stickynotes");
    const hasNotepad = windows.some((item) => item.id === "notepad");
    if (!hasSticky && !hasNotepad) {
      const timer = window.setTimeout(() => setBootDismissed(true), 400);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [windows, bootDismissed]);

  useEffect(() => {
    const onBootDismissed = () => setBootDismissed(true);
    const onBootReset = () => {
      launchedRef.current = false;
      setBootDismissed(false);
    };
    window.addEventListener("innox-boot-apps-dismissed", onBootDismissed);
    window.addEventListener("innox-boot-apps-reset", onBootReset);
    return () => {
      window.removeEventListener("innox-boot-apps-dismissed", onBootDismissed);
      window.removeEventListener("innox-boot-apps-reset", onBootReset);
    };
  }, []);

  return null;
}

function Desktop() {
  const [startOpen, setStartOpen] = useState(false);
  const [startClosing, setStartClosing] = useState(false);
  const startCloseTimer = useRef(null);

  const [contextMenu, setContextMenu] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [activeMonitor, setActiveMonitor] = useState(0);
  const [draggingWindowId, setDraggingWindowId] = useState(null);
  const [hasBooted, setHasBooted] = useState(false);
  const [taskbarPins, setTaskbarPins] = useState(() => {
    try { return JSON.parse(localStorage.getItem("innox_taskbar_pins") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setHasBooted(true), 2800);
    return () => window.clearTimeout(timer);
  }, []);

  const updateTaskbarPins = (updater) => {
    setTaskbarPins((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      try { localStorage.setItem("innox_taskbar_pins", JSON.stringify(next)); }
      catch { /* Pins remain available for this session. */ }
      return next;
    });
  };

  const closeStartMenu = () => {
    window.clearTimeout(startCloseTimer.current);
    setStartClosing(true);
    startCloseTimer.current = window.setTimeout(() => {
      setStartOpen(false);
      setStartClosing(false);
    }, 145);
  };

  const toggleStartMenu = () => {
    if (startOpen) closeStartMenu();
    else {
      window.clearTimeout(startCloseTimer.current);
      setStartClosing(false);
      setStartOpen(true);
    }
  };

  /*
   * --------------------------------------------------
   * NOTIFICATIONS
   * --------------------------------------------------
   */

  const addNotification = (
    title,
    message,
    type = "info"
  ) => {
    const id = Date.now() + Math.random();

    const notification = { id, title, message, type, createdAt: Date.now() };
    setNotifications((current) => [...current, notification]);
    setNotificationHistory((current) => [notification, ...current].slice(0, 30));

    window.setTimeout(() => {
      setNotifications((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );
    }, 5000);
  };

  const dismissNotification = (
    notificationId
  ) => {
    setNotifications((current) =>
      current.filter(
        (notification) =>
          notification.id !== notificationId
      )
    );
  };

  const dismissHistoryNotification = (notificationId) => {
    dismissNotification(notificationId);
    setNotificationHistory((current) => current.filter((item) => item.id !== notificationId));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setNotificationHistory([]);
  };

  /*
   * --------------------------------------------------
   * CONTEXT MENU
   * --------------------------------------------------
   */

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const showContextMenu = (
    event,
    items
  ) => {
    event.preventDefault();

    const menuWidth = 235;
    const menuHeight = 260;

    const x = Math.min(
      event.clientX,
      window.innerWidth -
        menuWidth -
        8
    );

    const y = Math.min(
      event.clientY,
      window.innerHeight -
        menuHeight -
        55
    );

    setContextMenu({
      x: Math.max(x, 8),
      y: Math.max(y, 8),
      items,
    });
  };

  /*
   * --------------------------------------------------
   * DESKTOP CONTEXT MENU
   * --------------------------------------------------
   */

  const handleDesktopContextMenu = (
    event
  ) => {
    event.preventDefault();

    closeStartMenu();

    showContextMenu(event, [
      {
        label: "Refresh",
        onClick: () => {
          addNotification(
            "Desktop refreshed",
            "The virtual desktop is up to date.",
            "success"
          );
        },
      },

      {
        type: "divider",
      },

      {
        label: "New folder",
        onClick: () => {
          addNotification(
            "New folder",
            "Open Files to create and manage project folders.",
            "info"
          );
        },
      },

      {
        type: "divider",
      },

      {
        label: "Display settings",
        onClick: () => {
          addNotification(
            "Display settings",
            "Display configuration is part of the virtual OS environment.",
            "info"
          );
        },
      },

      {
        label: "Personalization",
        onClick: () => {
          addNotification(
            "Personalization",
            "OS personalization controls are coming together.",
            "info"
          );
        },
      },
    ]);
  };

  /*
   * --------------------------------------------------
   * DESKTOP ICON CONTEXT MENU
   * --------------------------------------------------
   */

  const handleIconContextMenu = (
    event,
    app,
    openWindow
  ) => {
    if (!app) return;

    showContextMenu(event, [
      {
        label: "Open",
        onClick: () => {
          openWindow(app);
        },
      },

      {
        label: taskbarPins.includes(app.id) ? "Unpin from taskbar" : "Pin to taskbar",
        onClick: () => {
          const wasPinned = taskbarPins.includes(app.id);
          updateTaskbarPins((current) => wasPinned
            ? current.filter((id) => id !== app.id)
            : [...current, app.id]);
          addNotification(
            wasPinned ? "Unpinned" : "Pinned",
            wasPinned ? `${app.name} was removed from the taskbar.` : `${app.name} is ready on the taskbar.`,
            "success"
          );
        },
      },

      {
        type: "divider",
      },

      {
        label: "Properties",
        onClick: () => {
          addNotification(
            "Properties",
            `${app.name} is a virtual desktop app.`,
            "info"
          );
        },
      },
    ]);
  };

  /*
   * --------------------------------------------------
   * TASKBAR CONTEXT MENU
   * --------------------------------------------------
   */

  const handleTaskbarContextMenu = (
    event,
    taskWindow,
    restoreWindow,
    minimizeWindow,
    closeWindow,
    openWindow
  ) => {
    if (!taskWindow) {
      showContextMenu(event, [
        { label: "Taskbar settings", onClick: () => addNotification("Taskbar settings", "Taskbar controls are part of the virtual desktop.", "info") },
        { label: "Open Settings", onClick: () => openWindow({ id: "settings", name: "Settings" }) },
      ]);
      return;
    }

    if (taskWindow.isPinnedItem) {
      showContextMenu(event, [
        { label: taskWindow.isRunning ? "Restore window" : "Open", onClick: () => taskWindow.isRunning ? restoreWindow(taskWindow.id) : openWindow(taskWindow) },
        ...(taskWindow.isRunning ? [
          { label: "Minimize", onClick: () => minimizeWindow(taskWindow.id) },
          { type: "divider" },
          { label: "Close", onClick: () => closeWindow(taskWindow.id) },
          { type: "divider" },
        ] : []),
        { label: "Unpin from taskbar", onClick: () => updateTaskbarPins((current) => current.filter((id) => id !== taskWindow.id)) },
      ]);
      return;
    }

    const isMinimized =
      !!taskWindow.minimized;

    showContextMenu(event, [
      {
        label: isMinimized
          ? "Restore"
          : "Restore window",

        onClick: () => {
          restoreWindow(taskWindow.id);
        },
      },

      {
        label: "Minimize",

        onClick: () => {
          minimizeWindow(
            taskWindow.id
          );
        },
      },

      {
        type: "divider",
      },

      {
        label: "Close",

        onClick: () => {
          closeWindow(taskWindow.id);

          addNotification(
            taskWindow.name,
            `${taskWindow.name} was closed.`,
            "info"
          );
        },
      },
    ]);
  };

  /*
   * --------------------------------------------------
   * FILE OPENING
   * --------------------------------------------------
   */

  const openFile = (
    openWindow,
    filePath
  ) => {
    const extension = filePath
      .split(".")
      .pop()
      ?.toLowerCase();

    const vscodeExtensions = [
      "js",
      "jsx",
      "ts",
      "tsx",
      "css",
      "html",
      "json",
      "md",
      "py",
    ];

    if (
      vscodeExtensions.includes(
        extension
      )
    ) {
      openWindow(
        {
          id: "vscode",
          name: "VS Code",
        },
        {
          filePath,
        }
      );

      addNotification(
        "VS Code",
        `Opened ${filePath
          .split("/")
          .pop()}.`,
        "success"
      );

      return;
    }

    if (extension === "txt") {
      openWindow(
        {
          id: "notepad",
          name: "Notepad",
        },
        {
          filePath,
        }
      );

      addNotification(
        "Notepad",
        `Opened ${filePath
          .split("/")
          .pop()}.`,
        "success"
      );

      return;
    }

    const imageExtensions = [
      "png",
      "jpg",
      "jpeg",
      "webp",
      "gif",
    ];

    if (
      imageExtensions.includes(
        extension
      )
    ) {
      openWindow(
        {
          id: "photos",
          name: "Photos",
        },
        {
          filePath,
        }
      );
    }
  };

  /*
   * --------------------------------------------------
   * APPLICATION RENDERING
   * --------------------------------------------------
   */

  const renderApplication = (
    app,
    openWindow
  ) => {
    /*
     * Allow applications to request
     * opening a URL inside Browser.
     */

    if (
      app.payload &&
      app.payload.openIn ===
        "browser"
    ) {
      return (
        <Browser
          initialUrl={
            app.payload.url
          }
        />
      );
    }

    switch (app.id) {
      case "files":
        return (
          <Files
            initialPath={app.payload?.initialPath || "/"}
            onOpenFile={(filePath) =>
              openFile(
                openWindow,
                filePath
              )
            }
          />
        );

      case "downloads":
        return (
          <Files
            initialPath={app.payload?.initialPath || "/Downloads"}
            onOpenFile={(filePath) =>
              openFile(
                openWindow,
                filePath
              )
            }
          />
        );

      case "vscode":
        return (
          <VSCode
            initialFilePath={
              app.payload
                ?.filePath
            }
          />
        );

      case "notepad":
        return (
          <Notepad
            initialFilePath={
              app.payload
                ?.filePath
            }
          />
        );

      case "stickynotes":
        return <StickyNotes initialContent={recruiterGuide} />;

      case "terminal":
        return <Terminal />;

      case "photos":
        return (
          <Photos
            initialFilePath={
              app.payload
                ?.filePath
            }
          />
        );

      case "settings":
        return <Settings />;

      case "portfolio_profile":
        return <Portfolio view={app.payload?.view || "about"} />;

      case "portfolio_project":
        return <Portfolio view="project" project={app.payload?.project || "auri"} />;

      case "browser":
        return <Browser />;

      case "email":
        return <Email />;

      case "tic_tac_toe":
        return <TicTacToe />;

      case "trivia":
        return <Trivia />;

      case "demos":
        return <Demos />;

      case "telvin":
        trackTelvinOpened();
        return <TelvinChat />;

      default:
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              gap: "8px",
              textAlign: "center",
            }}
          >
            <h2>{app.name}</h2>

            <p
              style={{
                marginTop: "8px",
                opacity: 0.45,
                fontSize: "13px",
              }}
            >
              Application environment
              initializing...
            </p>
          </div>
        );
    }
  };

  /*
   * --------------------------------------------------
   * GLOBAL KEYBOARD SHORTCUTS
   * --------------------------------------------------
   */

  useEffect(() => {
    const handleKeyboard = (
      event
    ) => {
      const key =
        event.key.toLowerCase();

      /*
       * Escape
       */

      if (key === "escape") {
        closeStartMenu();
        closeContextMenu();
        return;
      }

      /*
       * F5
       */

      if (event.key === "F5") {
        event.preventDefault();

        addNotification(
          "Desktop refreshed",
          "The virtual desktop is up to date.",
          "success"
        );

        closeContextMenu();

        return;
      }

      /*
       * Ctrl + N
       */

      if (
        event.ctrlKey &&
        key === "n"
      ) {
        event.preventDefault();

        addNotification(
          "New folder",
          "Folder creation is available from Files.",
          "info"
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  /*
   * --------------------------------------------------
   * KEYBOARD SHORTCUT COMPONENT
   * --------------------------------------------------
   */

  const KeyboardShortcuts = ({
    windows,
    openWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
  }) => {
    useEffect(() => {
      const handler = (event) => {
        const key =
          (
            event.key || ""
          ).toLowerCase();

        /*
         * Escape
         */

        if (key === "escape") {
          closeStartMenu();
          closeContextMenu();
          return;
        }

        /*
         * Ctrl + E / Cmd + E
         * Open Files
         */

        if (
          (event.ctrlKey ||
            event.metaKey) &&
          key === "e"
        ) {
          event.preventDefault();

          openWindow({
            id: "files",
            name: "Files",
          });

          return;
        }

        /*
         * Ctrl + D / Cmd + D
         * Show desktop
         */

        if (
          (event.ctrlKey ||
            event.metaKey) &&
          key === "d"
        ) {
          event.preventDefault();

          const anyOpen =
            windows.some(
              (window) =>
                !window.minimized
            );

          if (anyOpen) {
            windows.forEach(
              (window) =>
                minimizeWindow(
                  window.id
                )
            );
          } else {
            windows.forEach(
              (window) =>
                restoreWindow(
                  window.id
                )
            );
          }

          return;
        }

        /*
         * Alt + Tab
         */

        if (
          event.altKey &&
          event.key === "Tab"
        ) {
          event.preventDefault();

          const visible =
            windows.filter(
              (window) =>
                !window.minimized
            );

          if (visible.length <= 1) {
            return;
          }

          const sorted = [
            ...visible,
          ].sort(
            (a, b) =>
              a.zIndex - b.zIndex
          );

          const top =
            sorted[
              sorted.length - 1
            ];

          const topIndex =
            sorted.indexOf(top);

          const nextIndex =
            (topIndex -
              1 +
              sorted.length) %
            sorted.length;

          const next =
            sorted[nextIndex];

          if (next) {
            focusWindow(next.id);
          }
        }
      };

      window.addEventListener(
        "keydown",
        handler
      );

      return () => {
        window.removeEventListener(
          "keydown",
          handler
        );
      };
    }, [
      windows,
      openWindow,
      minimizeWindow,
      restoreWindow,
      focusWindow,
    ]);

    return null;
  };

  /*
   * --------------------------------------------------
   * DESKTOP
   * --------------------------------------------------
   */

  return (
    <WindowManager>
      {({
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        restoreWindow,
        focusWindow,
        moveWindowToMonitor,
      }) => {
        const openOnActiveDisplay = (app, payload = null) => openWindow(app, payload, activeMonitor);
        const focusedWindowId = windows
          .filter((item) => !item.minimized && (item.monitorId || 0) === activeMonitor)
          .reduce((top, item) => !top || item.zIndex > top.zIndex ? item : top, null)?.id;
        const activateTaskbarWindow = (id) => {
          const target = windows.find((item) => item.id === id);
          if (target) setActiveMonitor(target.monitorId || 0);
          restoreWindow(id);
        };
        const moveDraggedWindowToNextDisplay = () => {
          if (!draggingWindowId) return;
          const next = activeMonitor === 0 ? 1 : 0;
          moveWindowToMonitor(draggingWindowId, next);
          setActiveMonitor(next);
        };
        const runVoiceAction = ({ action, target }) => {
          if (action === "close_window") {
            if (focusedWindowId) closeWindow(focusedWindowId);
            return;
          }
          if (action === "open_projects") {
            openOnActiveDisplay({ id: "files", name: "File Explorer" }, { initialPath: "/Innoxation/Projects" });
            return;
          }
          if (action === "open_resume") {
            trackResumeOpened();
            openOnActiveDisplay({ id: "notepad", name: "Notepad" }, { filePath: "/Resume.txt" });
            return;
          }
          if (action === "open_profile") {
            openOnActiveDisplay({ id: "portfolio_profile", name: "Jacob Mon - Profile" }, { view: target || "about" });
            return;
          }
          if (action === "open_project") {
            openOnActiveDisplay({ id: "portfolio_project", name: `${String(target).toUpperCase()} - Project` }, { project: target });
            return;
          }
          if (action === "open_url") {
            openOnActiveDisplay({ id: "browser", name: "Microsoft Edge" }, { openIn: "browser", url: target });
            return;
          }
          const apps = {
            vscode: { id: "vscode", name: "VS Code" },
            browser: { id: "browser", name: "Microsoft Edge" },
            files: { id: "files", name: "File Explorer" },
            settings: { id: "settings", name: "Settings" },
            notepad: { id: "notepad", name: "Notepad" },
            terminal: { id: "terminal", name: "Terminal" },
          };
          if (apps[target]) openOnActiveDisplay(apps[target]);
        };
        return (
        <>
          <KeyboardShortcuts
            windows={windows}
            openWindow={openOnActiveDisplay}
            minimizeWindow={
              minimizeWindow
            }
            restoreWindow={
              restoreWindow
            }
            focusWindow={
              focusWindow
            }
          />

          <BootLauncher
            hasBooted={hasBooted}
            windows={windows}
            openWindow={openOnActiveDisplay}
            activeMonitor={activeMonitor}
          />

          <section
            className="desktop"
            onMouseDown={() => {
              if (startOpen) closeStartMenu();

              closeContextMenu();
            }}
            onContextMenu={
              handleDesktopContextMenu
            }
          >
            <DesktopIcons
              onOpenApp={(app) => {
                playClick();

                openOnActiveDisplay(app);

                addNotification(
                  app.name,
                  `${app.name} is now running.`,
                  "success"
                );
              }}
              onContextMenu={(
                event,
                app
              ) =>
                handleIconContextMenu(
                  event,
                  app,
                  openOnActiveDisplay
                )
              }
            />

            <VoiceAssistant onAction={runVoiceAction} />
            <FullscreenPrompt variant="windows" />

            <VideoWallpaper
              enabled={
                typeof localStorage !==
                  "undefined" &&
                (localStorage.getItem("innox_wallpaper") || "wallpaper-video") === "wallpaper-video"
              }
            />

            {windows.map(
              (window) => (
                  <Window
                    key={window.id}
                    id={window.id}
                    hiddenOnMonitor={window.minimized || (window.monitorId || 0) !== activeMonitor}
                    focused={window.id === focusedWindowId}
                    onDragStateChange={setDraggingWindowId}
                    title={window.name}
                    icon={window.icon}
                    zIndex={window.zIndex}
                    onClose={() => {
                      closeWindow(
                        window.id
                      );

                      addNotification(
                        window.name,
                        `${window.name} was closed.`,
                        "info"
                      );
                    }}
                    onMinimize={() =>
                      minimizeWindow(
                        window.id
                      )
                    }
                    onFocus={() =>
                      focusWindow(
                        window.id
                      )
                    }
                    onFileDrop={(filePath) =>
                      openFile(
                        (app, payload = null) => openWindow(app, payload, window.monitorId || 0),
                        filePath
                      )
                    }
                  >
                    {renderApplication(
                      window,
                      (app, payload = null) => openWindow(app, payload, window.monitorId || 0)
                    )}
                  </Window>
                )
              )}

            {contextMenu && (
              <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                items={
                  contextMenu.items
                }
                onClose={
                  closeContextMenu
                }
              />
            )}

            {startOpen && (
              <StartMenu
                onOpenApp={openOnActiveDisplay}
                closing={startClosing}
                onClose={closeStartMenu}
                onPowerAction={(action) => addNotification(action, `${action} is simulated in this portfolio environment.`, "info")}
              />
            )}

            <Notifications
              notifications={
                notifications
              }
              onDismiss={
                dismissNotification
              }
            />

            <Taskbar
              windows={windows}
              pinnedAppIds={taskbarPins}
              onRestore={activateTaskbarWindow}
              onMinimize={minimizeWindow}
              activeMonitor={activeMonitor}
              onSwitchMonitor={() => setActiveMonitor((current) => current === 0 ? 1 : 0)}
              onMoveDraggedWindowToDisplay={moveDraggedWindowToNextDisplay}
              notificationHistory={notificationHistory}
              onDismissHistory={dismissHistoryNotification}
              onClearNotifications={clearNotifications}
              onOpenSettings={() => openOnActiveDisplay({ id: "settings", name: "Settings" })}
              onOpenApp={openOnActiveDisplay}
              onContextMenu={(
                event,
                taskWindow
              ) =>
                handleTaskbarContextMenu(
                  event,
                  taskWindow,
                  activateTaskbarWindow,
                  minimizeWindow,
                  closeWindow,
                  openOnActiveDisplay
                )
              }
              onStart={toggleStartMenu}
            />
          </section>
        </>
        );
      }}
    </WindowManager>
  );
}

export default Desktop;
