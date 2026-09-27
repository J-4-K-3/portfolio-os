import React, { useState } from "react";
import {
  Files,
  Search,
  GitBranch,
  Bug,
  Blocks,
  Settings,
  ChevronRight,
  ChevronDown,
  FileCode2,
  Folder,
  Terminal,
} from "lucide-react";
import "./MacVSCode.css";

const projectFiles = [
  {
    name: "src",
    type: "folder",
    children: [
      { name: "App.jsx", type: "file" },
      { name: "main.jsx", type: "file" },
      { name: "styles.css", type: "file" },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [
      { name: "favicon.svg", type: "file" },
    ],
  },
  { name: "package.json", type: "file" },
  { name: "README.md", type: "file" },
];

function MacVSCode() {
  const [activePanel, setActivePanel] = useState("explorer");
  const [expanded, setExpanded] = useState({
    src: true,
    public: false,
  });

  const [activeFile, setActiveFile] = useState("App.jsx");

  const toggleFolder = (folder) => {
    setExpanded((previous) => ({
      ...previous,
      [folder]: !previous[folder],
    }));
  };

  const renderFile = (file, level = 0) => {
    if (file.type === "folder") {
      const isOpen = expanded[file.name];

      return (
        <React.Fragment key={file.name}>
          <button
            className="mac-vscode-tree-row"
            style={{ paddingLeft: `${12 + level * 16}px` }}
            onClick={() => toggleFolder(file.name)}
          >
            {isOpen ? (
              <ChevronDown size={13} />
            ) : (
              <ChevronRight size={13} />
            )}

            <Folder size={14} />

            <span>{file.name}</span>
          </button>

          {isOpen &&
            file.children?.map((child) =>
              renderFile(child, level + 1)
            )}
        </React.Fragment>
      );
    }

    return (
      <button
        key={file.name}
        className={`mac-vscode-tree-row ${
          activeFile === file.name ? "active" : ""
        }`}
        style={{ paddingLeft: `${28 + level * 16}px` }}
        onClick={() => setActiveFile(file.name)}
      >
        <FileCode2 size={14} />
        <span>{file.name}</span>
      </button>
    );
  };

  return (
    <div className="mac-vscode">
      <aside className="mac-vscode-sidebar">
        <div className="mac-vscode-activity">
          <button
            className={activePanel === "explorer" ? "active" : ""}
            onClick={() => setActivePanel("explorer")}
          >
            <Files size={22} />
          </button>

          <button
            className={activePanel === "search" ? "active" : ""}
            onClick={() => setActivePanel("search")}
          >
            <Search size={22} />
          </button>

          <button
            className={activePanel === "git" ? "active" : ""}
            onClick={() => setActivePanel("git")}
          >
            <GitBranch size={22} />
          </button>

          <button
            className={activePanel === "debug" ? "active" : ""}
            onClick={() => setActivePanel("debug")}
          >
            <Bug size={22} />
          </button>

          <button
            className={activePanel === "extensions" ? "active" : ""}
            onClick={() => setActivePanel("extensions")}
          >
            <Blocks size={22} />
          </button>

          <button className="activity-bottom">
            <Settings size={21} />
          </button>
        </div>

        <div className="mac-vscode-explorer">
          <div className="mac-vscode-explorer-title">
            EXPLORER
          </div>

          <div className="mac-vscode-project">
            <ChevronDown size={13} />
            <span>INNOXATION</span>
          </div>

          {projectFiles.map((file) => renderFile(file))}
        </div>
      </aside>

      <main className="mac-vscode-editor">
        <div className="mac-vscode-tabs">
          <div className="mac-vscode-tab active">
            <FileCode2 size={14} />
            <span>{activeFile}</span>
            <span className="mac-vscode-tab-close">×</span>
          </div>
        </div>

        <div className="mac-vscode-breadcrumb">
          src
          <ChevronRight size={13} />
          {activeFile}
        </div>

        <div className="mac-vscode-code">
          <div className="line-numbers">
            {Array.from({ length: 18 }, (_, index) => (
              <span key={index}>{index + 1}</span>
            ))}
          </div>

          <pre>
            <code>
{`import React from "react";

function ${activeFile.replace(/\..*/, "")}() {
  const project = "Innoxation";

  return (
    <main>
      <h1>{project}</h1>

      <p>
        Building beyond what already exists.
      </p>
    </main>
  );
}

export default ${activeFile.replace(/\..*/, "")};`}
            </code>
          </pre>
        </div>

        <div className="mac-vscode-terminal">
          <div className="mac-vscode-terminal-header">
            <span>TERMINAL</span>
            <span className="terminal-shell">
              zsh
            </span>
          </div>

          <div className="mac-vscode-terminal-content">
            <span className="terminal-prompt">
              jacob@innoxation
            </span>
            <span> % npm run dev</span>

            <div className="terminal-output">
              VITE ready in 412 ms
            </div>

            <div className="terminal-output">
              Local: http://localhost:5173/
            </div>

            <div className="terminal-cursor">
              ▌
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MacVSCode;