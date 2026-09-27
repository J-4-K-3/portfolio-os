import React, { useCallback, useMemo, useState } from "react";
import { AppRegistryContext } from "./useAppRegistry";

const APP_DEFINITIONS = [
  { id: "auri", name: "Auri", subtitle: "A calmer way to connect", icon: "A", type: "innoxation", category: "Social", rating: "4.9", size: "38 MB", accent: "auri" },
  { id: "natter", name: "Natter", subtitle: "Talk freely, together", icon: "N", type: "innoxation", category: "Social", rating: "4.8", size: "52 MB", accent: "natter" },
  { id: "telvin", name: "Telvin", subtitle: "Your AI companion", icon: "T", type: "innoxation", category: "AI & tools", rating: "4.9", size: "64 MB", accent: "telvin" },
  { id: "moon", name: "Moon", subtitle: "A quiet place of your own", icon: "M", type: "innoxation", category: "Lifestyle", rating: "4.7", size: "31 MB", accent: "moon" },
  { id: "appgrade", name: "Appgrade", subtitle: "Ideas, turned into apps", icon: "A", type: "innoxation", category: "Productivity", rating: "4.8", size: "46 MB", accent: "appgrade" },
  { id: "groa", name: "G.R.O.A", subtitle: "Understand risk with clarity", icon: "G", type: "innoxation", category: "Finance", rating: "4.6", size: "42 MB", accent: "groa" },
  { id: "files", name: "Google Files", subtitle: "Your files, all in one place", icon: "F", type: "system", category: "System", accent: "files" },
  { id: "photos", name: "Google Photos", subtitle: "Your memories and project visuals", icon: "G", type: "system", category: "System", accent: "photos" },
  { id: "store", name: "Play Store", subtitle: "Discover and install apps", icon: "P", type: "system", category: "System", accent: "store" },
  { id: "browser", name: "Opera Browser", subtitle: "Search and explore the web", icon: "O", type: "system", category: "System", accent: "browser" },
  { id: "vscode", name: "VS Code", subtitle: "Browse project source on mobile", icon: "</>", type: "system", category: "Productivity", accent: "vscode" },
  { id: "clock", name: "Clock", subtitle: "Local time and Lubumbashi time", icon: "C", type: "system", category: "System", accent: "clock" },
  { id: "contacts", name: "Google Contacts", subtitle: "Jacob Mon", icon: "J", type: "system", category: "System", accent: "contacts" },
  { id: "music", name: "Xiaomi Music", subtitle: "Play music from your device", icon: "M", type: "system", category: "Entertainment", accent: "music" },
];
const SYSTEM_APP_IDS = ["files", "photos", "store", "browser", "vscode", "clock", "contacts", "music"];
const INITIAL_INSTALLED = ["auri", "telvin"];
const STORAGE_KEY = "innoxation-phone-installed-apps-v1";
function readInstalled() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === null) return INITIAL_INSTALLED;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter((id) => APP_DEFINITIONS.some((app) => app.id === id && !SYSTEM_APP_IDS.includes(id))) : INITIAL_INSTALLED;
  } catch { return INITIAL_INSTALLED; }
}

export default function AppRegistry({ children }) {
  const [openApps, setOpenApps] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [installedAppIds, setInstalledAppIds] = useState(readInstalled);
  const getApp = useCallback((appId) => APP_DEFINITIONS.find((app) => app.id === appId) || null, []);
  const installApp = useCallback((appId) => {
    const app = APP_DEFINITIONS.find((item) => item.id === appId && !SYSTEM_APP_IDS.includes(item.id));
    if (!app) return false;
    setInstalledAppIds((current) => {
      const next = current.includes(appId) ? current : [...current, appId];
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Storage can be unavailable. */ }
      return next;
    });
    return true;
  }, []);
  const uninstallApp = useCallback((appId) => {
    if (SYSTEM_APP_IDS.includes(appId)) return;
    setInstalledAppIds((current) => {
      const next = current.filter((id) => id !== appId);
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Storage can be unavailable. */ }
      return next;
    });
    setOpenApps((current) => current.filter((id) => id !== appId));
    setRecentApps((current) => current.filter((id) => id !== appId));
  }, []);
  const openApp = useCallback((appId) => {
    if (!getApp(appId)) return false;
    setOpenApps((current) => current.includes(appId) ? current : [...current, appId]);
    setRecentApps((current) => [appId, ...current.filter((id) => id !== appId)]);
    return true;
  }, [getApp]);
  const closeApp = useCallback((appId) => {
    setOpenApps((current) => current.filter((id) => id !== appId));
    setRecentApps((current) => current.filter((id) => id !== appId));
  }, []);
  const clearRecents = useCallback(() => setRecentApps([]), []);
  const apps = useMemo(() => [
    ...APP_DEFINITIONS.filter((app) => SYSTEM_APP_IDS.includes(app.id)),
    ...installedAppIds.map((id) => APP_DEFINITIONS.find((app) => app.id === id)).filter(Boolean),
  ], [installedAppIds]);
  const value = useMemo(() => ({
    apps, catalog: APP_DEFINITIONS, installedAppIds,
    isInstalled: (id) => SYSTEM_APP_IDS.includes(id) || installedAppIds.includes(id),
    installApp, uninstallApp, openApps, recentApps, getApp, openApp, closeApp, clearRecents,
  }), [apps, installedAppIds, installApp, uninstallApp, openApps, recentApps, getApp, openApp, closeApp, clearRecents]);
  return <AppRegistryContext.Provider value={value}>{children}</AppRegistryContext.Provider>;
}

export { APP_DEFINITIONS, AppRegistry as AppRegistryProvider };
