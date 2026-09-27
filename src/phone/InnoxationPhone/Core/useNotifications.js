/*
import { useSystemState } from "./useSystemState";

export function useNotifications() {
  const {
    systemState,
    updateSystemState,
  } = useSystemState();

  const notifications = systemState.notifications ?? [];

  const dismissNotification = (notificationId) => {
    updateSystemState((current) => ({
      ...current,
      notifications: current.notifications.filter(
        (notification) =>
          notification.id !== notificationId
      ),
    }));
  };

  const clearNotifications = () => {
    updateSystemState((current) => ({
      ...current,
      notifications: [],
    }));
  };

  const addNotification = (notification) => {
    const nextNotification = {
      id:
        notification.id ??
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,

      timestamp:
        notification.timestamp ??
        Date.now(),

      ...notification,
    };

    updateSystemState((current) => ({
      ...current,

      notifications: [
        nextNotification,
        ...current.notifications,
      ],
    }));

    return nextNotification.id;
  };

  return {
    notifications,
    notificationCount: notifications.length,

    dismissNotification,
    clearNotifications,
    addNotification,
  };
}*/
import { useCallback, useMemo } from "react";
import { useSystemState } from "./useSystemState";

export function useNotifications() {
  const {
    systemState,
    addNotification,
    dismissNotification,
    clearNotifications,
  } = useSystemState();

  const notifications =
    systemState.notifications || [];

  const notificationCount = notifications.length;

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const dismiss = useCallback(
    (notificationId) => {
      dismissNotification(notificationId);
    },
    [dismissNotification]
  );

  const clear = useCallback(() => {
    clearNotifications();
  }, [clearNotifications]);

  return useMemo(
    () => ({
      notifications,
      notificationCount,
      unreadCount,

      addNotification,
      dismissNotification: dismiss,
      clearNotifications: clear,
    }),
    [
      notifications,
      notificationCount,
      unreadCount,
      addNotification,
      dismiss,
      clear,
    ]
  );
}