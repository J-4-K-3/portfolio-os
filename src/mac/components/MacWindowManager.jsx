import {
  useCallback,
  useState,
} from "react";

function getTopZIndex(windows) {
  if (!windows.length) {
    return 500;
  }

  return Math.max(
    ...windows.map(
      (window) =>
        window.zIndex || 500
    )
  );
}

function MacWindowManager({
  children,
}) {
  const [windows, setWindows] =
    useState([]);

  const openWindow = useCallback(
    (windowData) => {
      setWindows((current) => {
        const existing =
          current.find(
            (window) =>
              window.id ===
              windowData.id
          );

        if (existing) {
          return current.map(
            (window) =>
              window.id ===
              windowData.id
                ? {
                    ...window,
                    minimized: false,
                    zIndex:
                      getTopZIndex(
                        current
                      ) + 1,
                  }
                : window
          );
        }

        return [
          ...current,
          {
            ...windowData,
            minimized: false,
            maximized: false,
            zIndex:
              getTopZIndex(
                current
              ) + 1,
          },
        ];
      });
    },
    []
  );

  const closeWindow =
    useCallback((id) => {
      setWindows((current) =>
        current.filter(
          (window) =>
            window.id !== id
        )
      );
    }, []);

  const minimizeWindow =
    useCallback((id) => {
      setWindows((current) =>
        current.map(
          (window) =>
            window.id === id
              ? {
                  ...window,
                  minimized: true,
                }
              : window
        )
      );
    }, []);

  const restoreWindow =
    useCallback((id) => {
      setWindows((current) =>
        current.map(
          (window) =>
            window.id === id
              ? {
                  ...window,
                  minimized: false,
                  zIndex:
                    getTopZIndex(
                      current
                    ) + 1,
                }
              : window
        )
      );
    }, []);

  const focusWindow =
    useCallback((id) => {
      setWindows((current) =>
        current.map(
          (window) =>
            window.id === id
              ? {
                  ...window,
                  zIndex:
                    getTopZIndex(
                      current
                    ) + 1,
                }
              : window
        )
      );
    }, []);

  const toggleMaximize =
    useCallback((id) => {
      setWindows((current) =>
        current.map(
          (window) =>
            window.id === id
              ? {
                  ...window,
                  maximized:
                    !window.maximized,
                  minimized: false,
                  zIndex:
                    getTopZIndex(
                      current
                    ) + 1,
                }
              : window
        )
      );
    }, []);

  return children({
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
    toggleMaximize,
  });
}

export default MacWindowManager;