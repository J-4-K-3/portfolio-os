import {
  Code2,
  FileText,
  Folder,
  Globe,
  Image,
  Monitor,
  Settings,
  Sparkles,
  Mail,
  Gamepad,
  HelpCircle,
} from "lucide-react";

import icons from "./icons";

export const desktopApps = [
  {
    id: "files",
    name: "Files",
    description:
      "Browse your virtual files and projects.",
    category: "System",
    pinned: true,
    recent: true,
    icon: icons.fileExplorer || Folder,
  },

  {
    id: "vscode",
    name: "VS Code",
    description:
      "Write, inspect, and develop software.",
    category: "Development",
    pinned: true,
    recent: true,
    icon: icons.vscodeIcon || Code2,
  },

  {
    id: "notepad",
    name: "Notepad",
    description:
      "Write quick notes and text documents.",
    category: "Productivity",
    pinned: true,
    recent: true,
    icon: icons.notepad || FileText,
  },

  {
    id: "photos",
    name: "Photos",
    description:
      "View images and visual project assets.",
    category: "Media",
    pinned: true,
    recent: false,
    icon: icons.photos || Image,
  },

  {
    id: "browser",
    name: "Browser",
    description:
      "Explore the virtual Innoxation web.",
    category: "Internet",
    pinned: true,
    recent: true,
    icon: icons.microsoftEdge || Globe,
  },

  {
    id: "downloads",
    name: "Downloads",
    description:
      "Access downloadable assets (Resume, CV, guides).",
    category: "System",
    pinned: true,
    recent: false,
    icon: Folder,
  },

  {
    id: "telvin",
    name: "Telvin",
    description:
      "Interact with the official Innoxation AI.",
    category: "Artificial Intelligence",
    pinned: false,
    recent: false,
    icon: icons.telvin || Sparkles,
  },

  {
    id: "settings",
    name: "Settings",
    description:
      "Configure the virtual computer.",
    category: "System",
    pinned: false,
    recent: false,
    icon: Settings,
  },

  {
    id: "terminal",
    name: "Terminal",
    description:
      "Interact with the development environment.",
    category: "Development",
    pinned: false,
    recent: false,
    icon: Monitor,
  },

  {
    id: "email",
    name: "Outlook",
    description:
      "Browse the inbox and compose recruiter messages.",
    category: "Communication",
    pinned: true,
    recent: false,
    icon: icons.outlook || Mail,
  },
  {
    id: "stickynotes",
    name: "Sticky Notes",
    description: "Quick notes and the How-to guide.",
    category: "Productivity",
    pinned: true,
    recent: false,
    icon: icons.stickyNotes || FileText,
    payload: {
      filePath: "/Downloads/How to use.txt",
    },
  },

  {
    id: "tic_tac_toe",
    name: "Tic Tac Toe",
    description:
      "Play a quick game of Tic-tac-toe.",
    category: "Games",
    pinned: false,
    recent: false,
    icon: Gamepad,
  },

  {
    id: "trivia",
    name: "Trivia",
    description:
      "Test your knowledge with short trivia.",
    category: "Games",
    pinned: false,
    recent: false,
    icon: HelpCircle,
  },
  {
    id: "demos",
    name: "Demos",
    description: "Video demos and app screenshots.",
    category: "Media",
    pinned: false,
    recent: false,
    icon: Image,
  },
  {
    id: "groa_external",
    name: "G.R.O.A.",
    description: "Open G.R.O.A. in the browser.",
    category: "Projects",
    pinned: false,
    recent: false,
    icon: "🌍",
    payload: {
      openIn: "browser",
      url: "https://groa.example"
    }
  },
  {
    id: "appgrade_external",
    name: "Appgrade",
    description: "Open Appgrade in the browser.",
    category: "Projects",
    pinned: false,
    recent: false,
    icon: "🛠️",
    payload: {
      openIn: "browser",
      url: "https://appgrade.example"
    }
  },
];

export function getAppById(id) {
  return desktopApps.find(
    (app) => app.id === id
  );
}

export function getPinnedApps() {
  return desktopApps.filter(
    (app) => app.pinned
  );
}

export function getRecentApps() {
  return desktopApps.filter(
    (app) => app.recent
  );
}

export function searchApps(query) {
  const normalized =
    query.trim().toLowerCase();

  if (!normalized) {
    return desktopApps;
  }

  return desktopApps.filter(
    (app) => {
      const searchable = [
        app.name,
        app.description,
        app.category,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(
        normalized
      );
    }
  );
}