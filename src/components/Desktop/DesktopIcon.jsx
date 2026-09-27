function DesktopIcon({ 
  icon: Icon,
  name,
  selected,
  onSelect,
  onOpen,
  onContextMenu,
}) {
  const handleClick = (event) => {
    event.stopPropagation();
    onSelect();
  };

  const handleDoubleClick = (event) => {
    event.stopPropagation();
    onOpen();
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onContextMenu?.(event);
  };

  return (
    <button
      type="button"
      className={`desktop-icon ${selected ? "is-selected" : ""}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      aria-label={name}
      aria-selected={selected}
    >
      <span className="desktop-icon-image">
        {typeof Icon === "string" ? (
          <img src={Icon} alt="" />
        ) : (
          <Icon size={29} strokeWidth={1.6} />
        )}
      </span>

      <span className="desktop-icon-name">{name}</span>
    </button>
  );
}

export default DesktopIcon;