import { useEffect, useMemo, useState } from "react";

import {
  Bug,
  ChevronDown,
  Files,
  GitBranch,
  Search,
  Settings,
  TerminalSquare,
  X,
} from "lucide-react";

import { Editor } from "./Editor";
import Terminal from "./Terminal";
import SearchPanel from "./SearchPanel";
import QuickOpen from "./QuickOpen";
import ProjectTree from "./ProjectTree";

import {
  projectFiles,
  getFileExtension,
  getProjectId,
  getAvailableProjects,
  filterFilesByProject,
} from "../../data/projectFiles";

import "./ProjectTree.css";
import "./VSCode.css";
import "./SearchPanel.css";
import "./QuickOpen.css";
import "./Editor.css";
import "./Terminal.css";

function buildTree(files) {
  const root = [];

  files.forEach((filePath) => {
    const parts = filePath.split("/");

    let currentLevel = root;
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath = currentPath
        ? `${currentPath}/${part}`
        : part;

      const isFile = index === parts.length - 1;

      let existing = currentLevel.find(
        (item) => item.path === currentPath
      );

      if (!existing) {
        existing = {
          path: currentPath,
          type: isFile ? "file" : "folder",
          depth: index,
          children: isFile ? undefined : [],
        };

        currentLevel.push(existing);
      }

      if (!isFile) {
        currentLevel = existing.children;
      }
    });
  });

  const sortTree = (items) => {
    items.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }

      return a.path.localeCompare(b.path);
    });

    items.forEach((item) => {
      if (item.children) {
        sortTree(item.children);
      }
    });

    return items;
  };

  return sortTree(root);
}

function VSCode({ initialFilePath = null, project = "all" }) {
  const [activeSidePanel, setActiveSidePanel] =
    useState("explorer");

  const [selectedProject, setSelectedProject] =
    useState(project);

  const availableProjects = useMemo(
    () => getAvailableProjects(),
    []
  );

  const activeFileMap = useMemo(
    () => filterFilesByProject(projectFiles, selectedProject),
    [selectedProject]
  );

  /**
   * If a file is opened from the Files app, derive the
   * project from its path so the tree filters accordingly.
   */
  useEffect(() => {
    if (!initialFilePath) {
      return;
    }

    const derivedProject =
      initialFilePath.startsWith("projects/")
        ? initialFilePath.split("/")[1]
        : "all";

    if (derivedProject && derivedProject !== selectedProject) {
      setSelectedProject(derivedProject);
    }
  }, [initialFilePath]);

  const [selectedFile, setSelectedFile] =
    useState("App.jsx");

  const [openFiles, setOpenFiles] = useState([
    "src/App.jsx",
  ]);

  const [activeFile, setActiveFile] =
    useState("src/App.jsx");

  const [fileContents, setFileContents] =
    useState(activeFileMap);

  const [savedContents, setSavedContents] =
    useState(activeFileMap);

  const [terminalOpen, setTerminalOpen] =
    useState(true);

  const [terminalHeight, setTerminalHeight] =
    useState(220);

  const [quickOpen, setQuickOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const activeCode =
    fileContents[selectedFile] || "";

  const isDirty =
    activeCode !==
    savedContents[selectedFile];

  const [expandedFolders, setExpandedFolders] =
    useState(
      new Set([
        "src",
        "src/components",
        "src/apps",
        "src/windows",
      ])
    );

  /**
   * Open a file inside VS Code.
   *
   * This is deliberately centralized so every
   * part of the application uses the same behavior.
   */

  const openFile = (path) => {
    if (!fileContents[path]) {
      return;
    }

    /**
     * If the requested file belongs to a different
     * project, switch the project filter so the tree
     * only shows that project's files.
     */
    const fileProject = getProjectId(path);
    if (
      fileProject !== "all" &&
      fileProject !== selectedProject
    ) {
      setSelectedProject(fileProject);
      return;
    }

    setOpenFiles((current) => {
      if (current.includes(path)) {
        return current;
      }

      return [...current, path];
    });

    setActiveFile(path);

    setQuickOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    if (!initialFilePath) {
      return;
    }

    openFile(initialFilePath);
  }, [initialFilePath]);

  /**
   * When the user switches projects, reset the open tabs and
   * active file so only files from the selected project remain.
   * If a file was requested via initialFilePath and it exists
   * in the new scope, open it instead of the first file.
   */
  useEffect(() => {
    setFileContents(activeFileMap);
    setSavedContents(activeFileMap);

    const keys = Object.keys(activeFileMap).sort();

    let nextFile = "";

    if (
      initialFilePath &&
      activeFileMap[initialFilePath]
    ) {
      nextFile = initialFilePath;
    } else if (keys.length > 0) {
      nextFile = keys[0];
    }

    setOpenFiles(nextFile ? [nextFile] : []);
    setActiveFile(nextFile || "");
    setSelectedFile(nextFile || "");
  }, [activeFileMap]);

  const updateFile = (path, value) => {
    setFileContents((current) => ({
      ...current,
      [path]: value,
    }));
  };

  /**
   * Files app can launch VS Code with a requested
   * file. This effect handles that incoming request.
   *
   * It also means that if VS Code is already open,
   * the same instance can switch to another file.
   */

  const closeFile = (path) => {
    setOpenFiles((current) => {
      const index = current.indexOf(path);

      const next = current.filter(
        (file) => file !== path
      );

      if (path === activeFile) {
        if (next.length > 0) {
          const fallback =
            next[Math.max(0, index - 1)];

          setActiveFile(fallback);
        } else {
          setActiveFile("");
        }
      }

      return next;
    });
  };

  const toggleFolder = (path) => {
    setExpandedFolders((current) => {
      const next = new Set(current);

      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }

      return next;
    });
  };

  const handleSave = () => {
    // Changes are stored in the simulated workspace.
    // Nothing is written to the visitor's real disk.
    setSavedContents({ ...fileContents });
  };

  useEffect(() => {
    const handleKeyboard = (event) => {
      const modifier = event.ctrlKey || event.metaKey;

      if (modifier && event.key.toLowerCase() === "p") {
        event.preventDefault();
        setQuickOpen(true);
        setSearchOpen(false);
      }

      if (
        modifier &&
        event.shiftKey &&
        event.key.toLowerCase() === "f"
      ) {
        event.preventDefault();
        setSearchOpen(true);
        setQuickOpen(false);
        setActiveSidePanel("search");
      }

      if (modifier && event.key.toLowerCase() === "j") {
        event.preventDefault();
        setTerminalOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setQuickOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
  }, []);

  const tree = useMemo(
    () => buildTree(Object.keys(fileContents)),
    [fileContents]
  );

  const breadcrumbs = activeFile
    ? activeFile.split("/")
    : [];

  const activeExtension = getFileExtension(activeFile);

  return (
    <div className="vscode">
      <aside className="vscode-activity">
        <button
          className={
            activeSidePanel === "explorer"
              ? "activity-button active"
              : "activity-button"
          }
          title="Explorer"
          onClick={() => {
            setActiveSidePanel("explorer");
            setSearchOpen(false);
          }}
        >
          <Files size={21} />
        </button>

        <button
          className={
            activeSidePanel === "search"
              ? "activity-button active"
              : "activity-button"
          }
          title="Search"
          onClick={() => {
            setActiveSidePanel("search");
            setSearchOpen(true);
          }}
        >
          <Search size={21} />
        </button>

        <button
          className="activity-button"
          title="Source Control"
        >
          <GitBranch size={21} />
        </button>

        <button
          className="activity-button"
          title="Run and Debug"
        >
          <Bug size={21} />
        </button>

        <div className="activity-spacer" />

        <button
          className="activity-button"
          title="Settings"
        >
          <Settings size={20} />
        </button>

      </aside>

      <aside className="vscode-sidebar">
        {activeSidePanel === "explorer" && (
          <>
            <div className="vscode-sidebar-header">
              <span>EXPLORER</span>
              <ChevronDown size={14} />
            </div>

            <div className="vscode-workspace-title">
              <ChevronDown size={14} />
              <span>INNOXATION-PORTFOLIO</span>
            </div>

            <div className="vscode-project-selector">
              <label htmlFor="vscode-project-select">
                Project
              </label>
              <select
                id="vscode-project-select"
                value={selectedProject}
                onChange={(event) =>
                  setSelectedProject(event.target.value)
                }
              >
                <option value="all">All projects</option>
                {availableProjects.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            <ProjectTree
              tree={tree}
              expandedFolders={expandedFolders}
              selectedPath={activeFile}
              onToggleFolder={toggleFolder}
              onOpenFile={openFile}
            />
          </>
        )}

        {activeSidePanel === "search" && (
          <SearchPanel
            fileContents={fileContents}
            onOpenFile={openFile}
          />
        )}
      </aside>


      <main className="vscode-main">
        <div className="vscode-tabs">
          {openFiles.map((file) => {
            const isActive = file === activeFile;
            const isDirty =
              fileContents[file] !== savedContents[file];

            return (
              <button
                key={file}
                className={
                  isActive
                    ? "vscode-tab active"
                    : "vscode-tab"
                }
                onClick={() => setActiveFile(file)}
              >
                <span>
                  {file.split("/").pop()}
                </span>

                {isDirty && (
                  <span className="vscode-dirty-dot">
                    ●
                  </span>
                )}

                <span
                  className="vscode-tab-close"
                  onClick={(event) => {
                    event.stopPropagation();
                    closeFile(file);
                  }}
                >
                  <X size={13} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="vscode-breadcrumbs">
          {breadcrumbs.map((part, index) => (
            <span key={`${part}-${index}`}>
              {part}
              {index < breadcrumbs.length - 1 && (
                <span className="breadcrumb-separator">
                  /
                </span>
              )}
            </span>
          ))}
        </div>

        <section className="vscode-editor-area">
          {activeFile ? (
            <Editor
              filePath={activeFile}
              value={
                fileContents[activeFile] || ""
              }
              onChange={(value) =>
                updateFile(
                  activeFile,
                  value
                )
              }
              onSave={handleSave}
            />
          ) : (
            <div className="vscode-empty-editor">
              <p>
                Select a file to begin editing.
              </p>
            </div>
          )}
          {/*<Editor
            filePath={activeFile}
            value={fileContents[activeFile] || ""}
            onChange={(value) =>
              updateFile(activeFile, value)
            }
            onSave={handleSave}
          />*/}
        </section>

        {terminalOpen && (
          <section
            className="vscode-terminal"
            style={{ height: terminalHeight }}
          >
            <div
              className="terminal-resize-handle"
              onMouseDown={(event) => {
                const startY = event.clientY;
                const startHeight = terminalHeight;

                const move = (moveEvent) => {
                  const difference =
                    startY - moveEvent.clientY;

                  const nextHeight =
                    startHeight + difference;

                  setTerminalHeight(
                    Math.max(
                      110,
                      Math.min(480, nextHeight)
                    )
                  );
                };

                const stop = () => {
                  window.removeEventListener(
                    "mousemove",
                    move
                  );

                  window.removeEventListener(
                    "mouseup",
                    stop
                  );
                };

                window.addEventListener(
                  "mousemove",
                  move
                );

                window.addEventListener(
                  "mouseup",
                  stop
                );
              }}
            />

            <div className="terminal-header">
              <div className="terminal-tabs">
                <span className="terminal-tab active">
                  TERMINAL
                </span>
              </div>

              <button
                onClick={() => setTerminalOpen(false)}
                title="Close terminal"
              >
                <X size={14} />
              </button>
            </div>

            <Terminal
              fileContents={fileContents}
            />
          </section>
        )}

        <footer className="vscode-status">
          <div className="status-left">
            <span>
              <GitBranch size={13} />
              main
            </span>
          </div>

          <span>
            {activeExtension === "jsx"
              ? "JavaScript React"
              : activeExtension === "py"
                ? "Python"
                : activeExtension || "Plain Text"}
          </span>

          <span>UTF-8</span>

          <span>Spaces: 2</span>

          {/*<div className="status-right">
            <span>Ln 1, Col 1</span>
            <span>Spaces: 2</span>
            <span>UTF-8</span>
            <span>
              {selectedFile.endsWith(".jsx")
                ? "JavaScript React"
                : selectedFile.endsWith(
                    ".json"
                  )
                  ? "JSON"
                  : "Markdown"}
            </span>
            <span>Prettier</span>
          </div>*/}
        </footer>
      </main>

      {quickOpen && (
        <QuickOpen
          fileContents={fileContents}
          onOpenFile={openFile}
          onClose={() => setQuickOpen(false)}
        />
      )}

      {searchOpen && activeSidePanel === "search" && (
        <div className="vscode-search-overlay">
          <button
            onClick={() => setSearchOpen(false)}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <button
        className="vscode-terminal-toggle"
        onClick={() =>
          setTerminalOpen((current) => !current)
        }
        title="Toggle terminal"
      >
        <TerminalSquare size={16} />
      </button>
    </div>
  );
}

export default VSCode;