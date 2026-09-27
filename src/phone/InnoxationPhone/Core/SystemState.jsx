/*import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import { SystemStateContext } from "./SystemStateContext";

const INITIAL_STATE = {
  booted: false,
  locked: true,

  theme: "system",
  language: "en",

  notifications: [
    {
      id: "welcome",
      title: "Welcome to Xiaomi HyperOS",
      message: "Swipe down for notifications and quick settings. Search apps and files from Home.",
      time: "Now",
      unread: true,
    },
  ],

  navigationVisible: false,
  navigationExpanded: false,

  battery: 87,
  network: "online",

  bluetooth: false,
  airplaneMode: false,

  sound: true,
  vibration: true,

  brightness: 80,
  volume: 65,
  wallpaper: "aurora",
  touchSensitivity: 58,
};

export function SystemStateProvider({ children }) {
  const [systemState, setSystemState] = useState(INITIAL_STATE);

  const updateSystemState = useCallback((updates) => {
    setSystemState((current) => ({
      ...current,
      ...updates,
    }));
  }, []);

  const setBooted = useCallback(
    (booted) => {
      updateSystemState({ booted });
    },
    [updateSystemState]
  );

  const setLocked = useCallback(
    (locked) => {
      updateSystemState({ locked });
    },
    [updateSystemState]
  );

  const setTheme = useCallback(
    (theme) => {
      updateSystemState({ theme });
    },
    [updateSystemState]
  );

  const setLanguage = useCallback(
    (language) => {
      updateSystemState({ language });
    },
    [updateSystemState]
  );

  const setNavigationState = useCallback(
    ({ visible, expanded }) => {
      updateSystemState({
        navigationVisible: visible,
        navigationExpanded: expanded,
      });
    },
    [updateSystemState]
  );

  const addNotification = useCallback((notification) => {
    setSystemState((current) => ({
      ...current,

      notifications: [
        {
          ...notification,
          id:
            notification.id ||
            `${Date.now()}-${Math.random()}`,
        },
        ...current.notifications,
      ],
    }));
  }, []);

  const dismissNotification = useCallback((notificationId) => {
    setSystemState((current) => ({
      ...current,

      notifications: current.notifications.filter(
        (notification) =>
          notification.id !== notificationId
      ),
    }));
  }, []);

  const clearNotifications = useCallback(() => {
    setSystemState((current) => ({
      ...current,
      notifications: [],
    }));
  }, []);

  const value = useMemo(
    () => ({
      systemState,

      updateSystemState,

      setBooted,
      setLocked,
      setTheme,
      setLanguage,

      setNavigationState,

      addNotification,
      dismissNotification,
      clearNotifications,
    }),
    [
      systemState,
      updateSystemState,

      setBooted,
      setLocked,
      setTheme,
      setLanguage,

      setNavigationState,

      addNotification,
      dismissNotification,
      clearNotifications,
    ]
  );

  return (
    <SystemStateContext.Provider value={value}>
      {children}
    </SystemStateContext.Provider>
  );
}*/
import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import { SystemStateContext } from "./SystemStateContext";

const INITIAL_STATE = {
  booted: false,
  locked: true,

  theme: "system",
  language: "en",

  notifications: [
    {
      id: "welcome",
      title: "Welcome to Xiaomi HyperOS",
      message: "Swipe down for notifications and quick settings. Search apps and files from Home.",
      time: "Now",
      unread: true,
    },
  ],

  navigationVisible: false,
  navigationExpanded: false,

  battery: 87,
  network: "online",

  bluetooth: false,
  airplaneMode: false,

  sound: true,
  vibration: true,

  brightness: 80,
  volume: 65,
  wallpaper: "aurora",
  touchSensitivity: 58,
};

export function SystemStateProvider({ children }) {
  const [systemState, setSystemState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("xiaomi-phone-settings") || "{}");
      return { ...INITIAL_STATE, ...saved };
    } catch { return INITIAL_STATE; }
  });
  const updateSystemState = useCallback((updates) => {
    setSystemState((current) => {
      const next = { ...current, ...(typeof updates === "function" ? updates(current) : updates) };
      const saved = { theme: next.theme, wallpaper: next.wallpaper, touchSensitivity: next.touchSensitivity, vibration: next.vibration, sound: next.sound, brightness: next.brightness, volume: next.volume };
      try { localStorage.setItem("xiaomi-phone-settings", JSON.stringify(saved)); } catch { /* Settings remain active for this visit. */ }
      return next;
    });
  }, []);
  const setBooted = useCallback(
    (booted) => {
      updateSystemState({ booted });
    },
    [updateSystemState]
  );

  const setLocked = useCallback(
    (locked) => {
      updateSystemState({
        locked,
        navigationVisible: false,
        navigationExpanded: false,
      });
    },
    [updateSystemState]
  );

  const setTheme = useCallback(
    (theme) => {
      updateSystemState({ theme });
    },
    [updateSystemState]
  );

  const setLanguage = useCallback(
    (language) => {
      updateSystemState({ language });
    },
    [updateSystemState]
  );

  const setNavigationState = useCallback(
    ({ visible, expanded = false }) => {
      updateSystemState({
        navigationVisible: visible,
        navigationExpanded:
          visible && expanded,
      });
    },
    [updateSystemState]
  );

  const resetNavigation = useCallback(() => {
    updateSystemState({
      navigationVisible: false,
      navigationExpanded: false,
    });
  }, [updateSystemState]);

  const addNotification = useCallback(
    (notification) => {
      if (systemState.vibration && typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([18, 28, 18]);
      setSystemState((current) => ({
        ...current,
        notifications: [
          { ...notification, id: notification.id || `${Date.now()}-${Math.random()}` },
          ...current.notifications,
        ],
      }));
    },
    [systemState.vibration]
  );
  const dismissNotification = useCallback(
    (notificationId) => {
      setSystemState((current) => ({
        ...current,

        notifications:
          current.notifications.filter(
            (notification) =>
              notification.id !== notificationId
          ),
      }));
    },
    []
  );

  const clearNotifications = useCallback(() => {
    setSystemState((current) => ({
      ...current,
      notifications: [],
    }));
  }, []);

  const value = useMemo(
    () => ({
      systemState,

      updateSystemState,

      setBooted,
      setLocked,
      setTheme,
      setLanguage,

      setNavigationState,
      resetNavigation,

      addNotification,
      dismissNotification,
      clearNotifications,
    }),
    [
      systemState,
      updateSystemState,

      setBooted,
      setLocked,
      setTheme,
      setLanguage,

      setNavigationState,
      resetNavigation,

      addNotification,
      dismissNotification,
      clearNotifications,
    ]
  );

  return (
    <SystemStateContext.Provider value={value}>
      {children}
    </SystemStateContext.Provider>
  );
}