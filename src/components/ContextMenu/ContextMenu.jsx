import {
  RefreshCw,
  FolderPlus,
  Monitor,
  Settings,
  Copy,
  Clipboard,
} from "lucide-react";

import "./ContextMenu.css";

function ContextMenu({
  x,
  y,
  items = [],
  onClose,
}) {
  return (
    <div
      className="context-menu"
      style={{
        left: x,
        top: y,
      }}
      onMouseDown={(event) => event.stopPropagation()}
    >
      {items.map((item, index) => {
        if (item.type === "divider") {
          return <div key={`divider-${index}`} className="context-divider" />;
        }

        const Icon = item.icon;

        return (
          <button
            key={item.label || `menu-item-${index}`}
            type="button"
            onClick={() => {
              item.onClick?.();
              onClose?.();
            }}
            disabled={item.disabled}
          >
            {Icon ? <Icon size={15} /> : null}

            <span>{item.label}</span>

            {item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
          </button>
        );
      })}
    </div>
  );
}

export default ContextMenu;