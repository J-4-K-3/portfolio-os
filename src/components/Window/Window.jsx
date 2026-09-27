import { useEffect, useRef, useState } from "react";
import { X, Minus, Square, Copy } from "lucide-react";
import "./Window.css";

const resizeEdges = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

function Window({ id, title, icon: Icon, children, zIndex = 500, hiddenOnMonitor = false, focused = false, onClose, onMinimize, onFocus, onDragStateChange, onFileDrop }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: null, height: null });
  const [isMaximized, setIsMaximized] = useState(false);
  const [snap, setSnap] = useState(null);
  const restoreState = useRef(null);
  const interaction = useRef(null);
  const geometryRef = useRef({ position, size });
  geometryRef.current = { position, size };
  const callbackRef = useRef({ onFocus, onDragStateChange });
  callbackRef.current = { onFocus, onDragStateChange };

  useEffect(() => {
    const move = (event) => {
      const active = interaction.current;
      if (!active) return;
      active.lastX = event.clientX;
      active.lastY = event.clientY;
      const dx = event.clientX - active.startX;
      const dy = event.clientY - active.startY;
      if (active.type === "drag") {
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) active.moved = true;
        setPosition({ x: active.position.x + dx, y: active.position.y + dy });
        return;
      }

      const edges = active.edge;
      let width = active.rect.width;
      let height = active.rect.height;
      if (edges.includes("e")) width = Math.max(300, active.rect.width + dx);
      if (edges.includes("w")) width = Math.max(300, active.rect.width - dx);
      if (edges.includes("s")) height = Math.max(200, active.rect.height + dy);
      if (edges.includes("n")) height = Math.max(200, active.rect.height - dy);
      setSize({ width, height });
      const effectiveX = edges.includes("w") ? active.rect.width - width : edges.includes("e") ? width - active.rect.width : 0;
      const effectiveY = edges.includes("n") ? active.rect.height - height : edges.includes("s") ? height - active.rect.height : 0;
      setPosition({
        x: active.position.x + effectiveX / 2,
        y: active.position.y + effectiveY / 2,
      });
    };

    const up = (event) => {
      const active = interaction.current;
      if (!active) return;
      interaction.current = null;
      document.body.classList.remove("window-dragging", "window-resizing");
      document.body.style.cursor = "";
      if (active.type === "drag") {
        callbackRef.current.onDragStateChange?.(null);
        if (active.moved) {
          if (event.clientY <= 14) {
            restoreState.current = { ...geometryRef.current, snap: null };
            setIsMaximized(true);
            setSnap(null);
          } else if (event.clientX <= 12) {
            setIsMaximized(false);
            setSnap("left");
          } else if (event.clientX >= window.innerWidth - 12) {
            setIsMaximized(false);
            setSnap("right");
          } else {
            setSnap(null);
          }
        }
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      document.body.classList.remove("window-dragging", "window-resizing");
      document.body.style.cursor = "";
    };
  }, []);

  const handleDragStart = (event) => {
    if (event.button !== 0 || event.target.closest("button")) return;
    event.preventDefault();
    onFocus?.();
    const element = event.currentTarget.closest(".window");
    const rect = element.getBoundingClientRect();
    let nextPosition = position;
    if (isMaximized) {
      const previous = restoreState.current;
      const width = previous?.size.width || Math.min(900, window.innerWidth - 80);
      const height = previous?.size.height || Math.min(620, window.innerHeight - 110);
      const titleOffsetX = (event.clientX - rect.left) / rect.width * width;
      const titleOffsetY = event.clientY - rect.top;
      nextPosition = {
        x: event.clientX - titleOffsetX + width / 2 - window.innerWidth / 2,
        y: event.clientY - titleOffsetY + height / 2 - window.innerHeight / 2,
      };
      setPosition(nextPosition);
      setSize({ width, height });
      setIsMaximized(false);
      setSnap(null);
      restoreState.current = null;
    } else if (snap) {
      nextPosition = {
        x: rect.left + rect.width / 2 - window.innerWidth / 2,
        y: rect.top + rect.height / 2 - window.innerHeight / 2,
      };
      setPosition(nextPosition);
      setSize({ width: rect.width, height: rect.height });
      setSnap(null);
    }
    interaction.current = { type: "drag", startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastY: event.clientY, position: nextPosition, moved: false };
    onDragStateChange?.(id);
    document.body.classList.add("window-dragging");
  };

  const startResize = (event, edge) => {
    if (event.button !== 0 || isMaximized) return;
    event.preventDefault();
    event.stopPropagation();
    onFocus?.();
    const rect = event.currentTarget.closest(".window").getBoundingClientRect();
    let startPosition = position;
    if (snap) {
      startPosition = { x: rect.left + rect.width / 2 - window.innerWidth / 2, y: rect.top + rect.height / 2 - window.innerHeight / 2 };
      setPosition(startPosition);
      setSize({ width: rect.width, height: rect.height });
      setSnap(null);
    }
    interaction.current = { type: "resize", edge, startX: event.clientX, startY: event.clientY, rect, position: startPosition };
    document.body.classList.add("window-resizing");
    const cursor = edge.includes("n") && edge.includes("w") || edge.includes("s") && edge.includes("e") ? "nwse-resize" : edge.includes("n") && edge.includes("e") || edge.includes("s") && edge.includes("w") ? "nesw-resize" : edge === "n" || edge === "s" ? "ns-resize" : "ew-resize";
    document.body.style.cursor = cursor;
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      const previous = restoreState.current;
      setIsMaximized(false);
      setSnap(previous?.snap || null);
      if (previous) {
        setPosition(previous.position);
        setSize(previous.size);
      }
      restoreState.current = null;
    } else {
      restoreState.current = { position, size, snap };
      setSnap(null);
      setIsMaximized(true);
    }
    onFocus?.();
  };

  return (
    <section
      className={`window ${isMaximized ? "window-maximized" : ""} ${snap ? `window-snap-${snap}` : ""} ${hiddenOnMonitor ? "window-monitor-hidden" : ""} ${focused ? "window-focused" : ""}`}
      style={{ zIndex, ...( !isMaximized && !snap ? { transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`, ...(size.width ? { width: size.width } : {}), ...(size.height ? { height: size.height } : {}) } : {}) }}
      onMouseDown={onFocus}
      onDragOver={(event) => { if (event.dataTransfer.types.includes("application/x-innox-file")) event.preventDefault(); }}
      onDrop={(event) => { const raw = event.dataTransfer.getData("application/x-innox-file"); if (!raw) return; event.preventDefault(); event.stopPropagation(); try { const file = JSON.parse(raw); if (file.type === "file") onFileDrop?.(file.path); } catch {} }}
      aria-hidden={hiddenOnMonitor}
    >
      <header className="window-titlebar" data-window-title={title} onMouseDown={handleDragStart} onDoubleClick={(event) => { if (!event.target.closest("button")) toggleMaximize(); }}>
        <div className="window-title">
          {Icon && (typeof Icon === "string" ? <img src={Icon} alt="" className="window-icon" /> : <Icon size={16} strokeWidth={1.8} />)}
          <span>{title}</span>
        </div>
        <div className="window-controls" onMouseDown={(event) => event.stopPropagation()} onDoubleClick={(event) => event.stopPropagation()}>
          <button type="button" className="window-control" onClick={onMinimize} aria-label="Minimize"><Minus size={15} /></button>
          <button type="button" className="window-control" onClick={toggleMaximize} aria-label={isMaximized ? "Restore" : "Maximize"}>{isMaximized ? <Copy size={13} /> : <Square size={13} />}</button>
          <button type="button" className="window-control window-close" onClick={onClose} aria-label="Close"><X size={15} /></button>
        </div>
      </header>
      <div className="window-content">{children}</div>
      {!isMaximized && resizeEdges.map((edge) => <div key={edge} className={`window-resize-handle resize-${edge}`} onMouseDown={(event) => startResize(event, edge)} aria-hidden="true" />)}
    </section>
  );
}

export default Window;
