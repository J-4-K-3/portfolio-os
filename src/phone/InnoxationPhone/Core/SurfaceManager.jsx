
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  SurfaceManagerContext,
} from "./useSurfaceManager";

import {
  useAppRegistry,
} from "./useAppRegistry";

export default function SurfaceManager({
  children,
}) {
  const {
    getApp,
    openApp,
  } = useAppRegistry();

  const [
    currentSurface,
    setCurrentSurface,
  ] = useState("home");

  const [
    surfaceHistory,
    setSurfaceHistory,
  ] = useState([]);

  /*
   * Navigate to a new surface.
   *
   * History is intentionally maintained here rather than
   * relying on browser history. The phone OS owns its own
   * navigation model.
   */
  const setSurface = useCallback(
    (nextSurface) => {
      if (
        !nextSurface ||
        nextSurface === currentSurface
      ) {
        return;
      }

      setSurfaceHistory((history) => [
        ...history,
        currentSurface,
      ]);

      setCurrentSurface(nextSurface);
    },
    [currentSurface]
  );

  /*
   * Home always resets the active OS surface.
   */
  const openHome = useCallback(() => {
    setSurfaceHistory([]);
    setCurrentSurface("home");
  }, []);

  /*
   * Launch an application.
   *
   * We validate the ID before changing the visible
   * surface. This prevents invisible routing failures.
   */
  const openAppSurface = useCallback(
    (appId) => {
      const app = getApp(appId);

      if (!app) {
        console.warn(
          `[Innoxation Phone] Cannot launch unknown app: ${appId}`
        );

        return;
      }

      openApp(appId);

      setSurfaceHistory((history) => [
        ...history,
        currentSurface,
      ]);

      setCurrentSurface(
        `app:${appId}`
      );
    },
    [
      currentSurface,
      getApp,
      openApp,
    ]
  );

  /*
   * Open Recent Surfaces.
   */
  const openRecents = useCallback(() => {
    setSurfaceHistory((history) => [
      ...history,
      currentSurface,
    ]);

    setCurrentSurface("recents");
  }, [currentSurface]);

  /*
   * Open Notification Center.
   */
  const openNotifications = useCallback(() => {
    setSurfaceHistory((history) => [
      ...history,
      currentSurface,
    ]);

    setCurrentSurface("notifications");
  }, [currentSurface]);

  /*
   * Open Pulse.
   */
  const openPulse = useCallback(() => {
    setSurfaceHistory((history) => [
      ...history,
      currentSurface,
    ]);

    setCurrentSurface("pulse");
  }, [currentSurface]);

  /*
   * Open Settings.
   */
  const openSettings = useCallback(() => {
    setSurfaceHistory((history) => [
      ...history,
      currentSurface,
    ]);

    setCurrentSurface("settings");
  }, [currentSurface]);

  /*
   * Launch an application from Recent Surfaces.
   */
  const openRecentApp = useCallback(
    (appId) => {
      const app = getApp(appId);

      if (!app) {
        console.warn(
          `[Innoxation Phone] Cannot launch recent app: ${appId}`
        );

        return;
      }

      openApp(appId);

      setSurfaceHistory((history) => [
        ...history,
        currentSurface,
      ]);

      setCurrentSurface(
        `app:${appId}`
      );
    },
    [
      currentSurface,
      getApp,
      openApp,
    ]
  );

  /*
   * Close a temporary system surface.
   */
  const closeSystemSurface = useCallback(() => {
    openHome();
  }, [openHome]);

  /*
   * Back navigation.
   *
   * We consume the last OS surface from our own
   * history rather than using window.history.
   */
  const goBack = useCallback(() => {
    setSurfaceHistory((history) => {
      if (history.length === 0) {
        setCurrentSurface("home");
        return [];
      }

      const nextHistory = [
        ...history,
      ];

      const previousSurface =
        nextHistory.pop();

      setCurrentSurface(
        previousSurface || "home"
      );

      return nextHistory;
    });
  }, []);

  const value = useMemo(
    () => ({
      currentSurface,

      /*
       * Kept for compatibility with components that
       * previously consumed previousSurface.
       */
      previousSurface:
        surfaceHistory[
          surfaceHistory.length - 1
        ] || null,

      surfaceHistory,

      setSurface,

      openHome,
      openAppSurface,
      openRecents,
      openNotifications,
      openPulse,
      openSettings,
      openRecentApp,

      closeSystemSurface,
      goBack,
    }),
    [
      currentSurface,
      surfaceHistory,
      setSurface,
      openHome,
      openAppSurface,
      openRecents,
      openNotifications,
      openPulse,
      openSettings,
      openRecentApp,
      closeSystemSurface,
      goBack,
    ]
  );

  return (
    <SurfaceManagerContext.Provider
      value={value}
    >
      {children}
    </SurfaceManagerContext.Provider>
  );
}

export function SurfaceManagerProvider({
  children,
}) {
  return (
    <SurfaceManager>
      {children}
    </SurfaceManager>
  );
}