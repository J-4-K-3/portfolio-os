import {
  Compass,
  Code2,
  Folder,
  Image,
  Music2,
  Settings,
  Sparkles,
  Globe,
} from "lucide-react";

export const macApps = {
  finder: {
    id: "finder",
    title: "Finder",
    icon: Folder,
    type: "finder",
    dock: true,
  },

  safari: {
    id: "safari",
    title: "Safari",
    icon: Compass,
    type: "safari",
    dock: true,
  },

  vscode: {
    id: "vscode",
    title: "Visual Studio Code",
    icon: Code2,
    type: "vscode",
    dock: true,
  },

  photos: {
    id: "photos",
    title: "Photos",
    icon: Image,
    type: "photos",
    dock: true,
  },

  natter: {
    id: "natter",
    title: "Natter",
    icon: Globe,
    type: "placeholder",
    dock: false,
  },

  music: {
    id: "music",
    title: "Music",
    icon: Music2,
    type: "placeholder",
    dock: false,
  },

  telvin: {
    id: "telvin",
    title: "Telvin",
    icon: Sparkles,
    type: "placeholder",
    dock: false,
  },

  settings: {
    id: "settings",
    title: "System Settings",
    icon: Settings,
    type: "placeholder",
    dock: false,
  },
};

export function getMacApp(id) {
  return macApps[id] || null;
}

export function getDockApps() {
  return Object.values(macApps).filter(
    (app) => app.dock
  );
}