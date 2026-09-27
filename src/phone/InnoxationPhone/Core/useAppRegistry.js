/*import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const initialSystemState = {
  booted: false,

  locked: true,

  currentSurface: "home",

  previousSurface: null,

  theme: "dark",

  language: "en",

  notifications: [],

  navigationVisible: false,

  navigationExpanded: false,

  battery: 87,

  network: "offline",

  /*
   * System-level controls.
   *
   * These are intentionally kept in system state
   * instead of inside individual surfaces so future
   * apps can react to the same OS state.
   *
  bluetooth: false,

  airplaneMode: false,

  sound: true,

  vibration: true,

  brightness: 80,

  volume: 65,
};

const SystemStateContext =
  createContext(null);

export function SystemStateProvider({
  children,
}) {
  const [
    systemState,
    setSystemState,
  ] = useState(initialSystemState);

  const updateSystemState = (
    updater
  ) => {
    setSystemState((current) => {
      if (
        typeof updater === "function"
      ) {
        return updater(current);
      }

      return {
        ...current,
        ...updater,
      };
    });
  };

  const value = useMemo(
    () => ({
      systemState,
      updateSystemState,
    }),
    [systemState]
  );

  return (
    <SystemStateContext.Provider
      value={value}
    >
      {children}
    </SystemStateContext.Provider>
  );
}

export function useSystemState() {
  const context =
    useContext(
      SystemStateContext
    );

  if (!context) {
    throw new Error(
      "useSystemState must be used inside SystemStateProvider."
    );
  }

  return context;
}*/
import {
  createContext,
  useContext,
} from "react";

/*
 * AppRegistryContext
 *
 * This context belongs in its own module so AppRegistry.jsx can remain
 * a pure provider/component module. That keeps Vite Fast Refresh happy.
 */
export const AppRegistryContext = createContext(null);

/*
 * useAppRegistry
 *
 * Every component that needs access to the phone's application registry
 * consumes the same context through this hook.
 */
export function useAppRegistry() {
  const context = useContext(AppRegistryContext);

  if (!context) {
    throw new Error(
      "useAppRegistry must be used inside AppRegistryProvider."
    );
  }

  return context;
}