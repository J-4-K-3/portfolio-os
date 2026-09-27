/*import { useEffect, useRef, useState } from "react";

function Terminal() {
  const [history, setHistory] = useState([
    {
      type: "system",
      text: "Innoxation Portfolio Development Environment",
    },
    {
      type: "system",
      text: "Type 'help' to see available commands.",
    },
  ]);

  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] = useState("~/portfolio");

  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const fileSystem = {
    "~/portfolio": [
      "src",
      "public",
      "package.json",
      "README.md",
      "vite.config.js",
    ],
    "~/portfolio/src": [
      "apps",
      "components",
      "data",
      "hooks",
      "styles",
      "App.jsx",
      "main.jsx",
    ],
    "~/portfolio/src/apps": [
      "Files",
      "VSCode",
      "Notepad",
      "Photos",
      "Browser",
      "Telvin",
    ],
    "~/portfolio/src/components": [
      "Desktop",
      "Taskbar",
      "Window",
      "StartMenu",
      "ContextMenu",
      "Notifications",
    ],
    "~/portfolio/src/data": [
      "apps.js",
    ],
  };

  const packageJson = `{
  "name": "innoxation-portfolio",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}`;

  const normalizePath = (path) => {
    if (path === "~") return "~/portfolio";

    if (path === ".") return currentPath;

    if (path === "..") {
      if (currentPath === "~/portfolio") {
        return "~";
      }

      const parts = currentPath.split("/");

      parts.pop();

      return parts.join("/") || "~";
    }

    if (path.startsWith("~/")) {
      return path;
    }

    if (path.startsWith("/")) {
      return path;
    }

    return `${currentPath}/${path}`;
  };

  const runCommand = (command) => {
    const trimmed = command.trim();

    if (!trimmed) {
      return;
    }

    setHistory((current) => [
      ...current,
      {
        type: "command",
        text: `${currentPath} $ ${trimmed}`,
      },
    ]);

    const [baseCommand, ...args] = trimmed.split(/\s+/);

    switch (baseCommand.toLowerCase()) {
      case "help":
        addOutput([
          "Available commands:",
          "",
          "  help             Show available commands",
          "  clear            Clear terminal",
          "  pwd              Show current directory",
          "  ls               List files",
          "  cd <directory>   Change directory",
          "  cat <file>       Display a file",
          "  git status       Show repository status",
          "  npm --version    Show npm version",
          "  node --version   Show Node.js version",
          "  npm run dev      Start development server",
          "  whoami           Show current user",
        ]);
        break;

      case "clear":
        setHistory([]);
        break;

      case "pwd":
        addOutput([currentPath]);
        break;

      case "ls": {
        const files = fileSystem[currentPath];

        if (!files) {
          addOutput(["Directory not found."]);
          break;
        }

        addOutput(files);
        break;
      }

      case "cd": {
        const target = args[0];

        if (!target) {
          setCurrentPath("~/portfolio");
          break;
        }

        const nextPath = normalizePath(target);

        if (fileSystem[nextPath]) {
          setCurrentPath(nextPath);
        } else if (nextPath === "~") {
          setCurrentPath("~");
        } else {
          addOutput([
            `cd: no such directory: ${target}`,
          ]);
        }

        break;
      }

      case "cat": {
        const file = args[0];

        if (file === "package.json") {
          addOutput(packageJson.split("\n"));
        } else if (file === "README.md") {
          addOutput([
            "# Innoxation Portfolio",
            "",
            "Interactive developer portfolio built with React and Vite.",
          ]);
        } else {
          addOutput([
            `cat: ${file || "missing file"}: No such file`,
          ]);
        }

        break;
      }

      case "git": {
        if (args[0] === "status") {
          addOutput([
            "On branch main",
            "",
            "Changes not staged for commit:",
            "  modified:   src/apps/VSCode/VSCode.jsx",
            "  modified:   src/components/Window/WindowManager.jsx",
            "",
            "Untracked files:",
            "  src/apps/VSCode/Terminal.jsx",
            "  src/apps/VSCode/Terminal.css",
          ]);
        } else {
          addOutput([
            "git: simulated repository environment",
            "Try: git status",
          ]);
        }

        break;
      }

      case "npm": {
        if (args[0] === "--version") {
          addOutput(["10.8.2"]);
        } else if (args[0] === "run" && args[1] === "dev") {
          addOutput([
            "",
            "> innoxation-portfolio@1.0.0 dev",
            "> vite",
            "",
            "VITE ready in 342 ms",
            "",
            "➜  Local:   http://localhost:5173/",
            "➜  Network: use --host to expose",
            "",
            "Development server simulated.",
          ]);
        } else {
          addOutput([
            "npm: simulated package environment",
            "Try: npm --version",
            "Try: npm run dev",
          ]);
        }

        break;
      }

      case "node":
        if (args[0] === "--version") {
          addOutput(["v22.14.0"]);
        } else {
          addOutput([
            "Node.js runtime is simulated inside this portfolio.",
          ]);
        }
        break;

      case "whoami":
        addOutput(["jacob"]);
        break;

      default:
        addOutput([
          `'${baseCommand}' is not recognized as a simulated command.`,
          "Type 'help' for available commands.",
        ]);
    }
  };

  const addOutput = (lines) => {
    setHistory((current) => [
      ...current,
      ...lines.map((line) => ({
        type: "output",
        text: line,
      })),
    ]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    runCommand(input);
    setInput("");
  };

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="vscode-terminal"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-output" ref={terminalRef}>
        {history.map((item, index) => (
          <div
            key={`${item.type}-${index}`}
            className={`terminal-line terminal-${item.type}`}
          >
            {item.text || "\u00A0"}
          </div>
        ))}

        <form
          className="terminal-input-line"
          onSubmit={handleSubmit}
        >
          <span>{currentPath} $</span>

          <input
            ref={inputRef}
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            autoComplete="off"
            spellCheck="false"
            aria-label="Terminal input"
          />
        </form>
      </div>
    </div>
  );
}

export default Terminal;*/

import { useEffect, useRef, useState } from "react";

function Terminal({ fileContents = {} }) {
  const [history, setHistory] = useState([
    {
      type: "system",
      text: "Innoxation Portfolio Development Environment",
    },
    {
      type: "system",
      text: "Type 'help' to see available commands.",
    },
  ]);

  const [input, setInput] = useState("");
  const [currentPath, setCurrentPath] =
    useState("~/portfolio");

  const [commandHistory, setCommandHistory] =
    useState([]);

  const [historyIndex, setHistoryIndex] =
    useState(-1);

  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const fileSystem = {
    "~/portfolio": [
      "src",
      "public",
      "package.json",
      "README.md",
      "vite.config.js",
    ],

    "~/portfolio/src": [
      "apps",
      "components",
      "data",
      "hooks",
      "styles",
      "App.jsx",
      "main.jsx",
    ],

    "~/portfolio/src/apps": [
      "Files",
      "VSCode",
      "Notepad",
      "Photos",
      "Browser",
      "Telvin",
    ],

    "~/portfolio/src/components": [
      "Desktop",
      "Taskbar",
      "Window",
      "StartMenu",
      "ContextMenu",
      "Notifications",
    ],

    "~/portfolio/src/data": [
      "apps.js",
    ],
  };

  const addOutput = (lines) => {
    setHistory((current) => [
      ...current,
      ...lines.map((line) => ({
        type: "output",
        text: line,
      })),
    ]);
  };

  const runCommand = (command) => {
    const trimmed = command.trim();

    if (!trimmed) return;

    setCommandHistory((current) => [
      ...current.filter(
        (item) => item !== trimmed
      ),
      trimmed,
    ]);

    setHistoryIndex(-1);

    setHistory((current) => [
      ...current,
      {
        type: "command",
        text: `${currentPath} $ ${trimmed}`,
      },
    ]);

    const [baseCommand, ...args] =
      trimmed.split(/\s+/);

    switch (baseCommand.toLowerCase()) {
      case "help":
        addOutput([
          "Available commands:",
          "",
          "  help             Show available commands",
          "  clear            Clear terminal",
          "  pwd              Show current directory",
          "  ls               List files",
          "  cd <directory>   Change directory",
          "  cat <file>       Display a file",
          "  git status       Show repository status",
          "  npm --version    Show npm version",
          "  node --version   Show Node.js version",
          "  npm run dev      Start development server",
          "  whoami           Show current user",
        ]);
        break;

      case "clear":
        setHistory([]);
        break;

      case "pwd":
        addOutput([currentPath]);
        break;

      case "ls": {
        const files =
          fileSystem[currentPath];

        if (!files) {
          addOutput([
            "Directory not found.",
          ]);
          break;
        }

        addOutput(files);
        break;
      }

      case "cd": {
        const target = args[0];

        if (!target) {
          setCurrentPath("~/portfolio");
          break;
        }

        if (target === "..") {
          if (
            currentPath !== "~/portfolio"
          ) {
            const parts =
              currentPath.split("/");

            parts.pop();

            setCurrentPath(
              parts.join("/") || "~"
            );
          }

          break;
        }

        const nextPath = target.startsWith(
          "~/"
        )
          ? target
          : `${currentPath}/${target}`;

        if (fileSystem[nextPath]) {
          setCurrentPath(nextPath);
        } else {
          addOutput([
            `cd: no such directory: ${target}`,
          ]);
        }

        break;
      }

      case "cat": {
        const file = args[0];

        if (
          file &&
          fileContents[file]
        ) {
          addOutput(
            fileContents[file].split("\n")
          );
        } else if (
          file === "README.md"
        ) {
          addOutput([
            "# Innoxation Portfolio",
            "",
            "Interactive developer portfolio built with React and Vite.",
          ]);
        } else {
          addOutput([
            `cat: ${file || "missing file"}: No such file`,
          ]);
        }

        break;
      }

      case "git": {
        if (args[0] === "status") {
          addOutput([
            "On branch main",
            "",
            "Changes not staged for commit:",
            "  modified:   src/apps/VSCode/VSCode.jsx",
            "  modified:   src/apps/VSCode/Editor.jsx",
            "",
            "Untracked files:",
            "  src/apps/VSCode/Terminal.jsx",
            "  src/apps/VSCode/Terminal.css",
          ]);
        } else {
          addOutput([
            "git: simulated repository environment",
            "Try: git status",
          ]);
        }

        break;
      }

      case "npm": {
        if (args[0] === "--version") {
          addOutput(["10.8.2"]);
        } else if (
          args[0] === "run" &&
          args[1] === "dev"
        ) {
          addOutput([
            "",
            "> innoxation-portfolio@1.0.0 dev",
            "> vite",
            "",
            "VITE ready in 342 ms",
            "",
            "➜  Local:   http://localhost:5173/",
            "➜  Network: use --host to expose",
            "",
            "Development server simulated.",
          ]);
        } else {
          addOutput([
            "npm: simulated package environment",
            "Try: npm --version",
            "Try: npm run dev",
          ]);
        }

        break;
      }

      case "node":
        if (args[0] === "--version") {
          addOutput(["v22.14.0"]);
        } else {
          addOutput([
            "Node.js runtime is simulated inside this portfolio.",
          ]);
        }
        break;

      case "whoami":
        addOutput(["jacob"]);
        break;

      default:
        addOutput([
          `'${baseCommand}' is not recognized as a simulated command.`,
          "Type 'help' for available commands.",
        ]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!commandHistory.length) return;

      const nextIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(
              0,
              historyIndex - 1
            );

      setHistoryIndex(nextIndex);
      setInput(
        commandHistory[nextIndex]
      );
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (historyIndex === -1) return;

      const nextIndex =
        historyIndex + 1;

      if (
        nextIndex >=
        commandHistory.length
      ) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }

      setHistoryIndex(nextIndex);
      setInput(
        commandHistory[nextIndex]
      );

      return;
    }

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "l"
    ) {
      event.preventDefault();
      setHistory([]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    runCommand(input);
    setInput("");
  };

  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="vscode-terminal"
      onClick={() =>
        inputRef.current?.focus()
      }
    >
      <div
        className="terminal-output"
        ref={terminalRef}
      >
        {history.map((item, index) => (
          <div
            key={`${item.type}-${index}`}
            className={`terminal-line terminal-${item.type}`}
          >
            {item.text || "\u00A0"}
          </div>
        ))}

        <form
          className="terminal-input-line"
          onSubmit={handleSubmit}
        >
          <span>{currentPath} $</span>

          <input
            ref={inputRef}
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
            aria-label="Terminal input"
          />
        </form>
      </div>
    </div>
  );
}

export default Terminal;