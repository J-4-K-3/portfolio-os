import {
  createContext,
  useContext,
} from "react";

/*
 * SurfaceManagerContext lives outside SurfaceManager.jsx.
 *
 * This prevents Vite Fast Refresh from treating the context
 * export as an incompatible component export.
 */
export const SurfaceManagerContext = createContext(null);

/*
 * useSurfaceManager
 *
 * Central hook for navigating between:
 *
 * - Home
 * - Apps
 * - Recents
 * - Notifications
 * - Pulse
 * - Settings
 */
export function useSurfaceManager() {
  const context = useContext(
    SurfaceManagerContext
  );

  if (!context) {
    throw new Error(
      "useSurfaceManager must be used inside SurfaceManagerProvider."
    );
  }

  return context;
}