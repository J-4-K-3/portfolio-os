import { useRef, useState } from "react";

function WindowManager({ children }) {
  const [windows, setWindows] = useState([]);
  const zCounter = useRef(500);
  const nextZIndex = () => ++zCounter.current;

  const openWindow = (windowData, payload = null, monitorId = 0) => {
    try {
      const recent = JSON.parse(localStorage.getItem("innox_recent_apps") || "[]");
      localStorage.setItem("innox_recent_apps", JSON.stringify([windowData.id, ...recent.filter((id) => id !== windowData.id)].slice(0, 8)));
    } catch { /* Recent app history is an optional convenience. */ }

    setWindows((current) => {
      const existing = current.find((item) => item.id === windowData.id);
      if (existing) return current.map((item) => item.id === windowData.id
        ? { ...item, minimized: false, zIndex: nextZIndex(), payload, monitorId }
        : item);
      return [...current, { ...windowData, payload, monitorId, minimized: false, zIndex: nextZIndex() }];
    });
  };

  const closeWindow = (id) => setWindows((current) => current.filter((item) => item.id !== id));
  const minimizeWindow = (id) => setWindows((current) => current.map((item) => item.id === id ? { ...item, minimized: true } : item));
  const restoreWindow = (id) => setWindows((current) => current.map((item) => item.id === id ? { ...item, minimized: false, zIndex: nextZIndex() } : item));
  const focusWindow = (id) => setWindows((current) => current.map((item) => item.id === id && !item.minimized ? { ...item, zIndex: nextZIndex() } : item));
  const moveWindowToMonitor = (id, monitorId) => setWindows((current) => current.map((item) => item.id === id ? { ...item, monitorId } : item));
  const updateWindow = (id, updates) => setWindows((current) => current.map((item) => item.id === id ? { ...item, ...updates } : item));

  return children({ windows, openWindow, closeWindow, minimizeWindow, restoreWindow, focusWindow, moveWindowToMonitor, updateWindow });
}

export default WindowManager;
