import React, {
  useMemo,
  useState,
} from "react";

import {
  useSurfaceManager,
} from "../Core/useSurfaceManager";

import "./Files.css";

/*
 * Virtual filesystem
 *
 * This is intentionally represented as data rather than
 * hard-coded UI. Later, this can be replaced with a real
 * storage layer without rebuilding the interface.
 */
const FILE_SYSTEM = {
  "/": [
    {
      id: "documents",
      name: "Documents",
      type: "folder",
      modified: "Today",
    },
    {
      id: "projects",
      name: "Projects",
      type: "folder",
      modified: "Today",
    },
    {
      id: "media",
      name: "Media",
      type: "folder",
      modified: "Yesterday",
    },
    {
      id: "downloads",
      name: "Downloads",
      type: "folder",
      modified: "Sep 18",
    },
    {
      id: "resume",
      name: "Jacob_Resume.pdf",
      type: "pdf",
      size: "482 KB",
      modified: "Sep 18",
    },
    {
      id: "portfolio",
      name: "Portfolio",
      type: "file",
      size: "2.8 MB",
      modified: "Sep 17",
    },
  ],

  "/Documents": [
    {
      id: "cv",
      name: "Jacob_CV.pdf",
      type: "pdf",
      size: "318 KB",
      modified: "Today",
    },
    {
      id: "notes",
      name: "Ideas.txt",
      type: "text",
      size: "12 KB",
      modified: "Sep 18",
    },
  ],

  "/Projects": [
    {
      id: "auri",
      name: "Auri",
      type: "folder",
      modified: "Today",
    },
    {
      id: "natter",
      name: "Natter",
      type: "folder",
      modified: "Today",
    },
    {
      id: "innoxation",
      name: "Innoxation",
      type: "folder",
      modified: "Sep 18",
    },
  ],

  "/Media": [
    {
      id: "wallpapers",
      name: "Wallpapers",
      type: "folder",
      modified: "Yesterday",
    },
    {
      id: "screenshots",
      name: "Screenshots",
      type: "folder",
      modified: "Sep 17",
    },
    {
      id: "app_icons",
      name: "App Icons",
      type: "folder",
      modified: "Today",
    },
  ],

  "/Media/Wallpapers": [
    {
      id: "minecraft",
      name: "minecraft_sunset_wallpaper.mp4",
      type: "video",
      size: "6.2 MB",
      modified: "Yesterday",
    },
  ],

  "/Media/App Icons": [
    {
      id: "auri_logo",
      name: "auri_logo.png",
      type: "image",
      size: "28 KB",
      modified: "Today",
    },
    {
      id: "natter_logo",
      name: "natter_logo.png",
      type: "image",
      size: "154 KB",
      modified: "Today",
    },
    {
      id: "appgrade_logo",
      name: "appgrade_logo.png",
      type: "image",
      size: "573 KB",
      modified: "Today",
    },
    {
      id: "telvin_logo",
      name: "telvin_logo.png",
      type: "image",
      size: "884 KB",
      modified: "Today",
    },
  ],

  "/Media/Screenshots": [
    {
      id: "auri_promo",
      name: "auri_promo.mp4",
      type: "video",
      size: "2.8 MB",
      modified: "Sep 16",
    },
    {
      id: "auri_vid_1",
      name: "auri_vid_1.mp4",
      type: "video",
      size: "4.6 MB",
      modified: "Sep 16",
    },
  ],

  "/Downloads": [
    {
      id: "package",
      name: "package.json",
      type: "code",
      size: "3 KB",
      modified: "Sep 16",
    },
    {
      id: "archive",
      name: "portfolio-assets.zip",
      type: "archive",
      size: "14.2 MB",
      modified: "Sep 15",
    },
  ],

  "/Projects/Auri": [
    {
      id: "src",
      name: "src",
      type: "folder",
      modified: "Today",
    },
    {
      id: "readme",
      name: "README.md",
      type: "text",
      size: "8 KB",
      modified: "Today",
    },
  ],

  "/Projects/Natter": [
    {
      id: "landing",
      name: "landing",
      type: "folder",
      modified: "Today",
    },
    {
      id: "package",
      name: "package.json",
      type: "code",
      size: "4 KB",
      modified: "Today",
    },
  ],

  "/Projects/Innoxation": [
    {
      id: "ecosystem",
      name: "Ecosystem",
      type: "folder",
      modified: "Sep 18",
    },
    {
      id: "techid",
      name: "TechID.md",
      type: "text",
      size: "16 KB",
      modified: "Sep 18",
    },
  ],
};

/*
 * Icons are represented by simple system glyphs for now.
 *
 * The architecture deliberately keeps the icon decision
 * separate, so custom Innoxation SVG assets can replace
 * these later without changing the filesystem logic.
 */
const getFileIcon = (item) => {
  if (item.type === "folder") return "▱";
  if (item.type === "pdf") return "◇";
  if (item.type === "text") return "≡";
  if (item.type === "code") return "</>";
  if (item.type === "archive") return "▣";

  return "□";
};

export default function Files() {
  const {
    goBack,
  } = useSurfaceManager();

  const [
    currentPath,
    setCurrentPath,
  ] = useState("/");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    selectedId,
    setSelectedId,
  ] = useState(null);

  const [
    viewMode,
    setViewMode,
  ] = useState("grid");

  /*
   * Retrieve the current directory.
   */
  const currentItems =
    FILE_SYSTEM[currentPath] || [];

  /*
   * Search is local to the current directory.
   *
   * This can later become system-wide search.
   */
  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return currentItems;
    }

    return currentItems.filter((item) =>
      item.name
        .toLowerCase()
        .includes(query)
    );
  }, [
    currentItems,
    search,
  ]);

  /*
   * Build breadcrumb segments.
   */
  const breadcrumbs = useMemo(() => {
    if (currentPath === "/") {
      return [
        {
          name: "Files",
          path: "/",
        },
      ];
    }

    const parts = currentPath
      .split("/")
      .filter(Boolean);

    return [
      {
        name: "Files",
        path: "/",
      },
      ...parts.map((part, index) => ({
        name: part,
        path:
          "/" +
          parts
            .slice(0, index + 1)
            .join("/"),
      })),
    ];
  }, [currentPath]);

  const openItem = (item) => {
    if (item.type !== "folder") {
      setSelectedId(item.id);
      return;
    }

    const nextPath =
      currentPath === "/"
        ? `/${item.name}`
        : `${currentPath}/${item.name}`;

    setCurrentPath(nextPath);
    setSearch("");
    setSelectedId(null);
  };

  const handleBack = () => {
    if (currentPath === "/") {
      goBack();
      return;
    }

    const parts = currentPath
      .split("/")
      .filter(Boolean);

    parts.pop();

    setCurrentPath(
      parts.length
        ? `/${parts.join("/")}`
        : "/"
    );

    setSearch("");
    setSelectedId(null);
  };

  return (
    <section className="phone-files">
      <header className="phone-files__header">
        <div className="phone-files__top">
          <button
            type="button"
            className="phone-files__back"
            onClick={handleBack}
            aria-label="Go back"
          >
            ‹
          </button>

          <div className="phone-files__title">
            <span>Google Files</span>
            <small>
              {currentPath === "/"
                ? "On this device"
                : currentPath}
            </small>
          </div>

          <button
            type="button"
            className="phone-files__view"
            onClick={() =>
              setViewMode((current) =>
                current === "grid"
                  ? "list"
                  : "grid"
              )
            }
            aria-label="Change view"
          >
            {viewMode === "grid"
              ? "☷"
              : "▦"}
          </button>
        </div>

        <label className="phone-files__search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search files"
            aria-label="Search files"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </label>

        <div className="phone-files__breadcrumbs">
          {breadcrumbs.map(
            (breadcrumb, index) => (
              <React.Fragment
                key={breadcrumb.path}
              >
                {index > 0 && (
                  <span>/</span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setCurrentPath(
                      breadcrumb.path
                    );
                    setSearch("");
                    setSelectedId(null);
                  }}
                >
                  {breadcrumb.name}
                </button>
              </React.Fragment>
            )
          )}
        </div>
      </header>

      <main
        className={[
          "phone-files__content",
          viewMode === "list"
            ? "phone-files__content--list"
            : "",
        ].join(" ")}
      >
        {visibleItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={[
              "phone-files__item",
              selectedId === item.id
                ? "is-selected"
                : "",
            ].join(" ")}
            onClick={() =>
              openItem(item)
            }
            onDoubleClick={() =>
              item.type === "folder" &&
              openItem(item)
            }
          >
            <span
              className={[
                "phone-files__icon",
                `phone-files__icon--${item.type}`,
              ].join(" ")}
            >
              {getFileIcon(item)}
            </span>

            <span className="phone-files__details">
              <strong>{item.name}</strong>

              <small>
                {item.size || item.type}
              </small>
            </span>

            <span className="phone-files__modified">
              {item.modified}
            </span>

            {item.type === "folder" && (
              <span className="phone-files__arrow">
                ›
              </span>
            )}
          </button>
        ))}

        {visibleItems.length === 0 && (
          <div className="phone-files__empty">
            <span>⌕</span>
            <strong>No files found</strong>
            <small>
              Try another search.
            </small>
          </div>
        )}
      </main>

      <footer className="phone-files__footer">
        <span>
          {visibleItems.length}{" "}
          {visibleItems.length === 1
            ? "item"
            : "items"}
        </span>

        {selectedId && (
          <span>
            1 selected
          </span>
        )}
      </footer>
    </section>
  );
}