import React from "react";
import MacWindow from "./MacWindow";

function MacApp({
  id,
  title,
  icon,
  children,
  windowManager,
}) {
  if (!windowManager) {
    return null;
  }

  const {
    windows = [],
    closeWindow,
    minimizeWindow,
    focusWindow,
    toggleMaximize,
  } = windowManager;

  const currentWindow = windows.find(
    (window) => window.id === id
  );

  if (!currentWindow) {
    return null;
  }

  return (
    <MacWindow
      id={currentWindow.id}
      title={currentWindow.title || title}
      icon={currentWindow.icon || icon}
      zIndex={currentWindow.zIndex}
      minimized={currentWindow.minimized}
      maximized={currentWindow.maximized}
      onClose={closeWindow}
      onMinimize={minimizeWindow}
      onFocus={focusWindow}
      onToggleMaximize={toggleMaximize}
    >
      {children}
    </MacWindow>
  );
}

export default MacApp;