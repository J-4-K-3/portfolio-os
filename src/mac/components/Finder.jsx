import {
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  List,
  Search,
  Folder,
  FileText,
  Image,
  Package,
  HardDrive,
  Home,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getNode,
  getPath,
  isFolder,
} from "../data/fileSystem";

import "./Finder.css";

function getItemIcon(name) {
  if (
    name.endsWith(".png") ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg")
  ) {
    return Image;
  }

  if (
    name.endsWith(".app") ||
    name.endsWith(".zip")
  ) {
    return Package;
  }

  if (
    name.endsWith(".txt") ||
    name.endsWith(".md") ||
    name.endsWith(".pdf")
  ) {
    return FileText;
  }

  return Folder;
}

function Finder({
  initialPath = "/Users/Jacob",
}) {
  const [currentPath, setCurrentPath] =
    useState(initialPath);

  const [history, setHistory] =
    useState([initialPath]);

  const [historyIndex, setHistoryIndex] =
    useState(0);

  const [view, setView] =
    useState("grid");

  const [search, setSearch] =
    useState("");

  const [selected, setSelected] =
    useState(null);

  useEffect(() => {
    setCurrentPath(initialPath); setHistory([initialPath]); setHistoryIndex(0); setSelected(null);
  }, [initialPath]);

  const node =
    getNode(currentPath);

  const items = useMemo(() => {
    if (!node?.children) {
      return [];
    }

    return node.children
      .map((name) => ({
        name,
        path: getPath(
          currentPath,
          name
        ),
      }))
      .filter((item) =>
        item.name
          .toLowerCase()
          .includes(
            search
              .trim()
              .toLowerCase()
          )
      );
  }, [
    node,
    currentPath,
    search,
  ]);

  const navigate = (
    path,
    addHistory = true
  ) => {
    if (!isFolder(path)) {
      return;
    }

    setCurrentPath(path);
    setSelected(null);

    if (addHistory) {
      const nextHistory =
        history.slice(
          0,
          historyIndex + 1
        );

      nextHistory.push(path);

      setHistory(nextHistory);
      setHistoryIndex(
        nextHistory.length - 1
      );
    }
  };

  const goBack = () => {
    if (historyIndex <= 0) {
      return;
    }

    const nextIndex =
      historyIndex - 1;

    setHistoryIndex(nextIndex);
    setCurrentPath(
      history[nextIndex]
    );
    setSelected(null);
  };

  const goForward = () => {
    if (
      historyIndex >=
      history.length - 1
    ) {
      return;
    }

    const nextIndex =
      historyIndex + 1;

    setHistoryIndex(nextIndex);
    setCurrentPath(
      history[nextIndex]
    );
    setSelected(null);
  };

  const goHome = () => {
    navigate("/Users/Jacob");
  };

  return (
    <div className="mac-finder">
      <header className="finder-toolbar">
        <div className="finder-navigation">
          <button
            type="button"
            disabled={
              historyIndex === 0
            }
            onClick={goBack}
            title="Back"
          >
            <ChevronLeft
              size={16}
            />
          </button>

          <button
            type="button"
            disabled={
              historyIndex >=
              history.length - 1
            }
            onClick={goForward}
            title="Forward"
          >
            <ChevronRight
              size={16}
            />
          </button>

          <button
            type="button"
            onClick={goHome}
            title="Home"
          >
            <Home size={15} />
          </button>
        </div>

        <div className="finder-path">
          {node?.name ||
            "Finder"}
        </div>

        <div className="finder-actions">
          <button
            type="button"
            className={
              view === "grid"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("grid")
            }
            title="Icon View"
          >
            <Grid2X2 size={15} />
          </button>

          <button
            type="button"
            className={
              view === "list"
                ? "active"
                : ""
            }
            onClick={() =>
              setView("list")
            }
            title="List View"
          >
            <List size={15} />
          </button>

          <div className="finder-search">
            <Search size={13} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search"
            />
          </div>
        </div>
      </header>

      <div className="finder-body">
        <aside className="finder-sidebar">
          <div className="finder-sidebar-title">
            Favorites
          </div>

          <button
            type="button"
            className={
              currentPath ===
              "/Users/Jacob"
                ? "active"
                : ""
            }
            onClick={goHome}
          >
            <Home size={14} />
            Home
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/Users/Jacob/Desktop"
              )
            }
          >
            <Folder size={14} />
            Desktop
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/Users/Jacob/Documents"
              )
            }
          >
            <FileText size={14} />
            Documents
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/Users/Jacob/Pictures"
              )
            }
          >
            <Image size={14} />
            Pictures
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/Users/Jacob/Projects"
              )
            }
          >
            <Folder size={14} />
            Projects
          </button>

          <div className="finder-sidebar-title storage">
            Locations
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
          >
            <HardDrive size={14} />
            Macintosh HD
          </button>
        </aside>

        <main
          className={`finder-items ${
            view === "list"
              ? "list-view"
              : "grid-view"
          }`}
        >
          {items.length === 0 ? (
            <div className="finder-no-results">
              <Search size={28} />

              <strong>
                No results
              </strong>

              <span>
                Nothing matches your
                search.
              </span>
            </div>
          ) : (
            items.map((item) => {
              const Icon =
                getItemIcon(
                  item.name
                );

              const folder =
                isFolder(
                  item.path
                );

              return (
                <button
                  type="button"
                  key={item.path}
                  className={`finder-item ${
                    selected ===
                    item.path
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setSelected(
                      item.path
                    )
                  }
                  onDoubleClick={() => {
                    if (folder) {
                      navigate(
                        item.path
                      );
                    }
                  }}
                >
                  <span className="finder-item-icon">
                    <Icon
                      size={
                        view ===
                        "list"
                          ? 19
                          : 38
                      }
                    />
                  </span>

                  <span className="finder-item-name">
                    {item.name}
                  </span>
                </button>
              );
            })
          )}
        </main>
      </div>

      <footer className="finder-status">
        {items.length} items
      </footer>
    </div>
  );
}

export default Finder;