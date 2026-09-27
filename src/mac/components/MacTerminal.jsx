import React, { useState } from "react";
import {
  Terminal as TerminalIcon,
  ChevronRight,
} from "lucide-react";

import "./MacTerminal.css";

const initialLines = [
  {
    type: "system",
    text: "Last login: Thu Sep 17 19:42:11 on console",
  },
  {
    type: "prompt",
    text: "jacob@Innoxation-Mac ~ %",
  },
];

function MacTerminal() {
  const [lines, setLines] = useState(initialLines);
  const [command, setCommand] = useState("");

  const runCommand = (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    let output = [];

    switch (trimmed.toLowerCase()) {
      case "help":
        output = [
          "Available commands:",
          "  help       Show available commands",
          "  clear      Clear terminal",
          "  whoami     Show current user",
          "  pwd        Show current directory",
          "  ls         List directory contents",
          "  neofetch   Show Innoxation system information",
        ];
        break;

      case "whoami":
        output = ["jacob"];
        break;

      case "pwd":
        output = ["/Users/Jacob"];
        break;

      case "ls":
        output = [
          "Desktop",
          "Documents",
          "Downloads",
          "Pictures",
          "Projects",
          "Applications",
        ];
        break;

      case "neofetch":
        output = [
          "            INNOXATION",
          "",
          "OS: Innoxation macOS Environment",
          "User: Jacob",
          "Shell: zsh",
          "Architecture: Apple Silicon",
          "Projects: Innoxation",
        ];
        break;

      case "clear":
        setLines([]);
        setCommand("");
        return;

      default:
        output = [
          `zsh: command not found: ${trimmed}`,
        ];
    }

    setLines((current) => [
      ...current,
      {
        type: "command",
        text: `jacob@Innoxation-Mac ~ % ${trimmed}`,
      },
      ...output.map((text) => ({
        type: "output",
        text,
      })),
    ]);

    setCommand("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    runCommand(command);
  };

  return (
    <div className="mac-terminal">
      <div className="mac-terminal-header">
        <div className="mac-terminal-header-title">
          <TerminalIcon size={15} />
          <span>Terminal</span>
        </div>

        <div className="mac-terminal-header-dots">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="mac-terminal-body">
        {lines.map((line, index) => (
          <div
            key={`${line.text}-${index}`}
            className={`mac-terminal-line ${line.type}`}
          >
            {line.text}
          </div>
        ))}

        <form
          className="mac-terminal-input-row"
          onSubmit={handleSubmit}
        >
          <ChevronRight size={14} />

          <span>jacob@Innoxation-Mac ~ %</span>

          <input
            autoFocus
            value={command}
            onChange={(event) =>
              setCommand(event.target.value)
            }
            aria-label="Terminal command"
          />
        </form>
      </div>
    </div>
  );
}

export default MacTerminal;