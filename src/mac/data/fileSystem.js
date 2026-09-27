export const macFileSystem = {
  "/": {
    type: "folder",
    name: "Macintosh HD",
    children: [
      "Applications",
      "Library",
      "System",
      "Users",
    ],
  },

  "/Applications": {
    type: "folder",
    name: "Applications",
    children: [
      "Finder.app",
      "Safari.app",
      "Visual Studio Code.app",
      "Photos.app",
      "Natter.app",
      "Telvin.app",
    ],
  },

  "/Library": {
    type: "folder",
    name: "Library",
    children: [
      "Application Support",
      "Preferences",
      "Caches",
    ],
  },

  "/Library/Application Support": {
    type: "folder",
    name: "Application Support",
    children: [
      "Innoxation",
    ],
  },

  "/Library/Application Support/Innoxation":
    {
      type: "folder",
      name: "Innoxation",
      children: [
        "TechID",
        "IIC",
        "Platform Sync",
      ],
    },

  "/Library/Preferences": {
    type: "folder",
    name: "Preferences",
    children: [],
  },

  "/Library/Caches": {
    type: "folder",
    name: "Caches",
    children: [],
  },

  "/System": {
    type: "folder",
    name: "System",
    children: [
      "Library",
      "CoreServices",
    ],
  },

  "/System/Library": {
    type: "folder",
    name: "Library",
    children: [
      "Frameworks",
      "LaunchDaemons",
    ],
  },

  "/System/Library/CoreServices": {
    type: "folder",
    name: "CoreServices",
    children: [],
  },

  "/Users": {
    type: "folder",
    name: "Users",
    children: [
      "Jacob",
      "Shared",
    ],
  },

  "/Users/Jacob": {
    type: "folder",
    name: "Jacob",
    children: [
      "Desktop",
      "Documents",
      "Downloads",
      "Pictures",
      "Projects",
    ],
  },

  "/Users/Jacob/Desktop": {
    type: "folder",
    name: "Desktop",
    children: [
      "Portfolio",
      "Projects",
      "README.md",
    ],
  },

  "/Users/Jacob/Documents": {
    type: "folder",
    name: "Documents",
    children: [
      "Resume.pdf",
      "Mission.txt",
      "Thoughts.txt",
    ],
  },

  "/Users/Jacob/Downloads": {
    type: "folder",
    name: "Downloads",
    children: [
      "innoxation-assets.zip",
    ],
  },

  "/Users/Jacob/Pictures": {
    type: "folder",
    name: "Pictures",
    children: [
      "Portfolio.png",
      "Auri.png",
      "Natter.png",
      "Innoxation.png",
    ],
  },

  "/Users/Jacob/Projects": {
    type: "folder",
    name: "Projects",
    children: [
      "Innoxation",
      "Auri",
      "Natter",
      "GROA",
      "Appgrade",
      "Moon",
    ],
  },

  "/Users/Jacob/Projects/Innoxation": {
    type: "folder",
    name: "Innoxation",
    children: [
      "src",
      "public",
      "package.json",
      "README.md",
    ],
  },

  "/Users/Jacob/Projects/Auri": {
    type: "folder",
    name: "Auri",
    children: [
      "src",
      "package.json",
      "README.md",
    ],
  },

  "/Users/Jacob/Projects/Natter": {
    type: "folder",
    name: "Natter",
    children: [
      "src",
      "package.json",
      "README.md",
    ],
  },

  "/Users/Jacob/Projects/GROA": {
    type: "folder",
    name: "GROA",
    children: [
      "src",
      "package.json",
      "README.md",
    ],
  },

  "/Users/Jacob/Projects/Appgrade": {
    type: "folder",
    name: "Appgrade",
    children: [
      "src",
      "package.json",
      "README.md",
    ],
  },

  "/Users/Jacob/Projects/Moon": {
    type: "folder",
    name: "Moon",
    children: [
      "src",
      "package.json",
      "README.md",
    ],
  },

  "/Users/Shared": {
    type: "folder",
    name: "Shared",
    children: [],
  },
};

export function getPath(
  parent,
  child
) {
  if (parent === "/") {
    return `/${child}`;
  }

  return `${parent}/${child}`;
}

export function getNode(path) {
  return macFileSystem[path] || null;
}

export function isFolder(path) {
  return (
    macFileSystem[path]?.type ===
    "folder"
  );
}