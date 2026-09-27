import { useMemo, useState } from "react";
import DesktopIcon from "./DesktopIcon";
import { desktopApps } from "../../data/app";
import "./DesktopIcons.css";
const ORDER_KEY = "innox-desktop-icon-order";
function DesktopIcons({ onOpenApp, onContextMenu }) {
  const [selectedApp, setSelectedApp] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [savedOrder, setSavedOrder] = useState(() => { try { return JSON.parse(localStorage.getItem(ORDER_KEY)) || []; } catch { return []; } });
  const apps = useMemo(() => [...desktopApps].sort((a, b) => { const ai = savedOrder.indexOf(a.id); const bi = savedOrder.indexOf(b.id); return (ai < 0 ? 1000 : ai) - (bi < 0 ? 1000 : bi); }), [savedOrder]);
  const reorder = (targetId) => {
    if (!draggedId || draggedId === targetId) return;
    const next = [...apps]; const from = next.findIndex((app) => app.id === draggedId); const to = next.findIndex((app) => app.id === targetId);
    if (from < 0 || to < 0) return;
    const [item] = next.splice(from, 1); next.splice(to, 0, item);
    const order = next.map((app) => app.id); setSavedOrder(order); try { localStorage.setItem(ORDER_KEY, JSON.stringify(order)); } catch {}
  };
  return <div className="desktop-icons" onClick={() => setSelectedApp(null)} role="presentation">
    {apps.map((app) => <div className="desktop-icon-slot" key={app.id} draggable onDragStart={(event) => { setDraggedId(app.id); event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", app.id); }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); reorder(app.id); }} onDragEnd={() => setDraggedId(null)}>
      <DesktopIcon icon={app.icon} name={app.name} selected={selectedApp === app.id} onSelect={() => setSelectedApp(app.id)} onOpen={() => onOpenApp(app)} onContextMenu={(event) => onContextMenu?.(event, app)} />
    </div>)}
  </div>;
}
export default DesktopIcons;
