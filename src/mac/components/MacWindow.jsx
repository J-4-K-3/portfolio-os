/*import {
  Minus,
  Square,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./MacWindow.css";

function MacWindow({
  id,
  title = "Window",
  icon = null,
  children,
  zIndex = 500,
  minimized = false,
  maximized = false,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}) {
  const windowRef =
    useRef(null);

  const dragRef =
    useRef(null);

  const resizeRef =
    useRef(null);

  const [
    position,
    setPosition,
  ] = useState({
    x: 0,
    y: 0,
  });

  const [
    size,
    setSize,
  ] = useState({
    width: 720,
    height: 430,
  });

  const [
    hasPositioned,
    setHasPositioned,
  ] = useState(false);

  const centerWindow =
    () => {
      const width =
        window.innerWidth;

      const height =
        window.innerHeight;

      setPosition({
        x:
          (width - 720) /
          2,

        y:
          Math.max(
            55,
            (height -
              430) /
              2
          ),
      });

      setHasPositioned(true);
    };

  useEffect(() => {
    if (!hasPositioned) {
      centerWindow();
    }
  }, [hasPositioned]);

  useEffect(() => {
    const handlePointerMove =
      (event) => {
        if (
          dragRef.current
        ) {
          const {
            startX,
            startY,
            originalX,
            originalY,
          } =
            dragRef.current;

          setPosition({
            x:
              originalX +
              event.clientX -
              startX,

            y:
              originalY +
              event.clientY -
              startY,
          });
        }

        if (
          resizeRef.current
        ) {
          const {
            startX,
            startY,
            originalWidth,
            originalHeight,
          } =
            resizeRef.current;

          setSize({
            width: Math.max(
              480,
              originalWidth +
                event.clientX -
                startX
            ),

            height: Math.max(
              300,
              originalHeight +
                event.clientY -
                startY
            ),
          });
        }
      };

    const handlePointerUp =
      () => {
        dragRef.current =
          null;

        resizeRef.current =
          null;

        document.body.style
          .cursor = "";

        document.body.style
          .userSelect = "";
      };

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };
  }, []);

  const startDragging =
    (event) => {
      if (
        maximized ||
        event.button !== 0
      ) {
        return;
      }

      onFocus?.(id);

      dragRef.current = {
        startX:
          event.clientX,

        startY:
          event.clientY,

        originalX:
          position.x,

        originalY:
          position.y,
      };

      document.body.style
        .cursor = "grabbing";

      document.body.style
        .userSelect = "none";
    };

  const startResizing =
    (event) => {
      if (
        maximized ||
        event.button !== 0
      ) {
        return;
      }

      event.stopPropagation();

      onFocus?.(id);

      resizeRef.current = {
        startX:
          event.clientX,

        startY:
          event.clientY,

        originalWidth:
          size.width,

        originalHeight:
          size.height,
      };

      document.body.style
        .cursor = "nwse-resize";

      document.body.style
        .userSelect = "none";
    };

  const handleTitleDoubleClick =
    () => {
      onMaximize?.(id);
    };

  if (minimized) {
    return null;
  }

  const style = maximized
    ? undefined
    : {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      };

  return (
    <section
      ref={windowRef}
      className={`mac-window ${
        maximized
          ? "maximized"
          : ""
      }`}
      style={style}
      onPointerDown={() =>
        onFocus?.(id)
      }
    >
      <header
        className="mac-window-titlebar"
        onPointerDown={
          startDragging
        }
        onDoubleClick={
          handleTitleDoubleClick
        }
      >
        <div className="mac-window-controls">
          <button
            type="button"
            className="mac-window-control close"
            aria-label="Close"
            onPointerDown={(event) =>
              event.stopPropagation()
            }
            onClick={() =>
              onClose?.(id)
            }
          >
            <X size={9} />
          </button>

          <button
            type="button"
            className="mac-window-control minimize"
            aria-label="Minimize"
            onPointerDown={(event) =>
              event.stopPropagation()
            }
            onClick={() =>
              onMinimize?.(id)
            }
          >
            <Minus size={9} />
          </button>

          <button
            type="button"
            className="mac-window-control maximize"
            aria-label="Maximize"
            onPointerDown={(event) =>
              event.stopPropagation()
            }
            onClick={() =>
              onMaximize?.(id)
            }
          >
            <Square size={8} />
          </button>
        </div>

        <div className="mac-window-title">
          {icon}

          <span>
            {title}
          </span>
        </div>
      </header>

      <div className="mac-window-content">
        {children}
      </div>

      {!maximized && (
        <div
          className="mac-window-resize-handle"
          onPointerDown={
            startResizing
          }
        />
      )}
    </section>
  );
}

export default MacWindow;*/
import React, { useEffect, useRef, useState } from "react";
import {
  Maximize2,
  Minimize2,
  X,
  Minus,
  Square,
} from "lucide-react";
import "./MacWindow.css";

const MIN_WIDTH = 320;
const MIN_HEIGHT = 220;

export default function MacWindow({
  id,
  title,
  icon,
  children,
  zIndex = 1,
  minimized = false,
  maximized = false,
  x = 120,
  y = 90,
  width = 760,
  height = 520,
  onClose,
  onMinimize,
  onFocus,
  onToggleMaximize,
  onUpdateGeometry,
}) {
  const windowRef = useRef(null);

  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height });

  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);

  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  /*
   * Keep local geometry synchronized with the window manager.
   */
  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);

  /*
   * Window dragging.
   */
  const handleDragStart = (event) => {
    if (maximized) return;

    /*
     * Only allow the primary mouse button.
     */
    if (event.button !== 0) return;

    onFocus?.(id);

    const rect = windowRef.current?.getBoundingClientRect();

    if (!rect) return;

    dragOffset.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    setDragging(true);

    event.preventDefault();
  };

  /*
   * Resize from the bottom-right corner.
   */
  const handleResizeStart = (event) => {
    if (maximized) return;

    if (event.button !== 0) return;

    onFocus?.(id);

    resizeStart.current = {
      x: event.clientX,
      y: event.clientY,
      width: size.width,
      height: size.height,
    };

    setResizing(true);

    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    if (!dragging && !resizing) return;

    const handlePointerMove = (event) => {
      /*
       * DRAG
       */
      if (dragging) {
        const nextX = event.clientX - dragOffset.current.x;
        const nextY = event.clientY - dragOffset.current.y;

        const nextPosition = {
          x: Math.max(0, nextX),
          y: Math.max(28, nextY),
        };

        setPosition(nextPosition);

        onUpdateGeometry?.(id, {
          ...nextPosition,
          width: size.width,
          height: size.height,
        });
      }

      /*
       * RESIZE
       */
      if (resizing) {
        const deltaX = event.clientX - resizeStart.current.x;
        const deltaY = event.clientY - resizeStart.current.y;

        const nextSize = {
          width: Math.max(
            MIN_WIDTH,
            resizeStart.current.width + deltaX
          ),
          height: Math.max(
            MIN_HEIGHT,
            resizeStart.current.height + deltaY
          ),
        };

        setSize(nextSize);

        onUpdateGeometry?.(id, {
          ...position,
          width: nextSize.width,
          height: nextSize.height,
        });
      }
    };

    const handlePointerUp = () => {
      setDragging(false);
      setResizing(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    dragging,
    resizing,
    id,
    onUpdateGeometry,
    position,
    size,
  ]);

  /*
   * Double-clicking the title bar toggles maximize.
   */
  const handleTitleDoubleClick = () => {
    onToggleMaximize?.(id);
  };

  if (minimized) {
    return null;
  }

  const style = maximized
    ? {
        zIndex,
      }
    : {
        zIndex,
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      };

  return (
    <section
      ref={windowRef}
      className={[
        "mac-window",
        maximized ? "mac-window-maximized" : "",
        dragging ? "mac-window-dragging" : "",
        resizing ? "mac-window-resizing" : "",
      ].join(" ")}
      style={style}
      onPointerDown={() => onFocus?.(id)}
    >
      <header
        className="mac-window-titlebar"
        onPointerDown={handleDragStart}
        onDoubleClick={handleTitleDoubleClick}
      >
        <div className="mac-window-traffic-lights">
          <button
            type="button"
            className="mac-window-control mac-window-close"
            aria-label="Close window"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onClose?.(id)}
          >
            <X size={10} strokeWidth={3} />
          </button>

          <button
            type="button"
            className="mac-window-control mac-window-minimize"
            aria-label="Minimize window"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onMinimize?.(id)}
          >
            <Minus size={10} strokeWidth={3} />
          </button>

          <button
            type="button"
            className="mac-window-control mac-window-maximize"
            aria-label={
              maximized
                ? "Restore window"
                : "Maximize window"
            }
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onToggleMaximize?.(id)}
          >
            {maximized ? (
              <Square size={8} strokeWidth={3} />
            ) : (
              <Maximize2 size={9} strokeWidth={3} />
            )}
          </button>
        </div>

        <div className="mac-window-title">
          {icon && (
            <img
              src={icon}
              alt=""
              className="mac-window-title-icon"
            />
          )}

          <span>{title}</span>
        </div>

        <div className="mac-window-title-spacer" />
      </header>

      <div className="mac-window-content">
        {children}
      </div>

      {!maximized && (
        <div
          className="mac-window-resize-handle"
          onPointerDown={handleResizeStart}
          aria-hidden="true"
        />
      )}
    </section>
  );
}