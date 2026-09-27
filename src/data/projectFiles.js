import { groaProjectFiles } from "./groaProjectFiles.js";
import { auriProjectFiles } from "./auriProjectFiles.js";
import { normalProjectFiles } from "./normalProjectFiles.js";

export const projectFiles = {
  ...groaProjectFiles,
  ...auriProjectFiles,
  ...normalProjectFiles,
  "src/App.jsx": `import WindowsOS from "./windows/WindowsOS";

function App() {
  return <WindowsOS />;
}

export default App;
`,

  "src/main.jsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,

  "src/windows/WindowsOS.jsx": `import Desktop from "../components/Desktop/Desktop";

function WindowsOS() {
  return (
    <main className="windows-os">
      <Desktop />
    </main>
  );
}

export default WindowsOS;
`,

  "src/components/Desktop/Desktop.jsx": `import DesktopIcons from "./DesktopIcons";
import Taskbar from "../Taskbar/Taskbar";

function Desktop() {
  return (
    <section className="desktop">
      <DesktopIcons />
      <Taskbar />
    </section>
  );
}

export default Desktop;
`,

  "src/components/Desktop/DesktopIcons.jsx": `function DesktopIcons() {
  return (
    <div className="desktop-icons">
      <p>Applications</p>
    </div>
  );
}

export default DesktopIcons;
`,

  "src/components/Taskbar/Taskbar.jsx": `function Taskbar() {
  return (
    <footer className="taskbar">
      <span>INNOXATION</span>
    </footer>
  );
}

export default Taskbar;
`,

  "src/components/Window/Window.jsx": `function Window({ title, children }) {
  return (
    <section className="window">
      <header className="window-titlebar">
        <span>{title}</span>
      </header>

      <div className="window-content">
        {children}
      </div>
    </section>
  );
}

export default Window;
`,

  "src/components/StartMenu/StartMenu.jsx": `function StartMenu() {
  return (
    <aside className="start-menu">
      <h2>Start</h2>
      <p>Applications and system tools.</p>
    </aside>
  );
}

export default StartMenu;
`,

  "src/components/ContextMenu/ContextMenu.jsx": `function ContextMenu() {
  return (
    <menu className="context-menu">
      <button>Open</button>
      <button>Properties</button>
    </menu>
  );
}

export default ContextMenu;
`,

  "src/components/Notifications/Notifications.jsx": `function Notifications() {
  return (
    <aside className="notifications">
      <p>No new notifications.</p>
    </aside>
  );
}

export default Notifications;
`,

  "src/apps/Files/Files.jsx": `function Files() {
  return (
    <div className="files-app">
      <h1>Files</h1>
      <p>Browse the Innoxation virtual filesystem.</p>
    </div>
  );
}

export default Files;
`,

  "src/apps/VSCode/VSCode.jsx": `function VSCode() {
  return (
    <div className="vscode-app">
      <h1>VS Code</h1>
    </div>
  );
}

export default VSCode;
`,

  "src/apps/Notepad/Notepad.jsx": `function Notepad() {
  return (
    <div className="notepad-app">
      <textarea placeholder="Start writing..." />
    </div>
  );
}

export default Notepad;
`,

  "src/apps/Photos/Photos.jsx": `function Photos() {
  return (
    <div className="photos-app">
      <h1>Photos</h1>
    </div>
  );
}

export default Photos;
`,

  "src/apps/Browser/Browser.jsx": `function Browser() {
  return (
    <div className="browser-app">
      <h1>Browser</h1>
    </div>
  );
}

export default Browser;
`,

  "src/apps/Telvin/Telvin.jsx": `function Telvin() {
  return (
    <div className="telvin-app">
      <h1>Telvin</h1>
      <p>Innoxation intelligence.</p>
    </div>
  );
}

export default Telvin;
`,

  "src/data/apps.js": `export const desktopApps = [
  {
    id: "files",
    name: "Files",
  },
  {
    id: "vscode",
    name: "VS Code",
  },
  {
    id: "notepad",
    name: "Notepad",
  },
  {
    id: "photos",
    name: "Photos",
  },
  {
    id: "browser",
    name: "Browser",
  },
  {
    id: "telvin",
    name: "Telvin",
  },
];
`,

  "src/styles/global.css": `* {
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
}

body {
  font-family: Inter, system-ui, sans-serif;
  overflow: hidden;
}
`,

  "package.json": `{
  "name": "innoxation-portfolio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.468.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "vite": "^6.0.0"
  }
}
`,

  "README.md": `# Innoxation Portfolio

An interactive virtual computer designed to present Jacob's software engineering work.

## Concept

Instead of a traditional portfolio website, the visitor enters a simulated operating system.

## Applications

- Files
- VS Code
- Notepad
- Photos
- Browser
- Telvin

## Goal

Demonstrate software engineering experience through an interactive environment.
`,

  "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Innoxation Portfolio</title>
  </head>

  <body>
    <div id="root"></div>
    <script
      type="module"
      src="/src/main.jsx"
    ></script>
  </body>
</html>
`,
};

export function getFileExtension(path) {
  const fileName = path.split("/").pop();

  if (!fileName.includes(".")) {
    return "";
  }

  return fileName.split(".").pop().toLowerCase();
}

/**
 * Determine which project a file path belongs to.
 * Returns "portfolio" for the main app source, or the project id (e.g. "GROA").
 */
export function getProjectId(filePath) {
  if (filePath.startsWith("projects/")) {
    const parts = filePath.split("/");
    return parts[1] || "portfolio";
  }
  return "portfolio";
}

/**
 * Get all unique project ids present in the file map.
 */
export function getAvailableProjects() {
  const ids = new Set();
  Object.keys(projectFiles).forEach((path) => {
    ids.add(getProjectId(path));
  });
  return Array.from(ids).sort();
}

/**
 * Filter a file map to only files belonging to a given project.
 * Pass null or "all" to get all files.
 */
export function filterFilesByProject(fileMap, projectId) {
  if (!projectId || projectId === "all") {
    return fileMap;
  }
  const filtered = {};
  Object.keys(fileMap).forEach((path) => {
    if (getProjectId(path) === projectId) {
      filtered[path] = fileMap[path];
    }
  });
  return filtered;
}