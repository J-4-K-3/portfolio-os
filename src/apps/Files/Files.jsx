import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, Copy, Download, FileText, Folder, FolderOpen, HardDrive, Home, Image, Monitor, MoreHorizontal, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { getFileIcon, getFileName } from "../../utils/fileUtils";
import "./Files.css";

const STORAGE_KEY = "innox_virtual_filesystem_v1";
const makeFolder = (name) => ({ name, type: "folder" });
const makeFile = (name, openPath = null, extra = {}) => ({ name, type: "file", ...(openPath ? { openPath } : {}), ...extra });
const defaultFS = {
  "/": [makeFolder("Desktop"), makeFolder("Documents"), makeFolder("Downloads"), makeFolder("Pictures"), makeFolder("Innoxation")],
  "/Desktop": [makeFolder("Portfolio"), makeFile("Resume.txt", "/Innoxation/Mission.txt"), makeFile("README.md", "README.md")],
  "/Documents": [makeFolder("Resume"), makeFile("Mission.txt", "/Innoxation/Mission.txt")],
  "/Documents/Resume": [makeFile("Resume.txt", "/Resume.txt", { downloadUrl: "/Resume.txt" }), makeFile("CV.txt", "/CV.txt", { downloadUrl: "/CV.txt" })],
  "/Pictures": ["Portfolio Desktop.png", "Innoxation.png", "Auri.png", "Natter.png", "GROA.png", "Telvin.png"].map((name) => makeFile(name, `/Pictures/${name}`)),
  "/Innoxation": [makeFolder("Projects"), makeFile("Mission.txt", "/Innoxation/Mission.txt"), makeFile("README.md", "/Innoxation/README.md")],
"/Innoxation/Projects": ["Portfolio", "Auri", "Natter", "GROA", "NORMAL", "Appgrade", "Moon"].map(makeFolder),
  "/Innoxation/Projects/GROA": [makeFile("README.md", "projects/GROA/README.md"), makeFolder("src")],
  "/Innoxation/Projects/GROA/src": [makeFile("App.jsx", "projects/GROA/src/App.jsx"), makeFolder("lib")],
  "/Innoxation/Projects/GROA/src/lib": ["ventService.js", "time.js"].map((name) => makeFile(name, `projects/GROA/src/lib/${name}`)),
  "/Innoxation/Projects/AURI": [makeFile("README.md", "projects/AURI/README.md"), makeFolder("src")],
  "/Innoxation/Projects/AURI/src": [makeFile("App.jsx", "projects/AURI/src/App.jsx"), makeFolder("lib"), makeFolder("hooks")],
  "/Innoxation/Projects/AURI/src/lib": ["Auth.js", "videoCacheManager.js"].map((name) => makeFile(name, `projects/AURI/src/lib/${name}`)),
  "/Innoxation/Projects/AURI/src/hooks": ["useRegisterPushNotifications.js"].map((name) => makeFile(name, `projects/AURI/src/hooks/${name}`)),
  "/Innoxation/Projects/NORMAL": [makeFile("README.md", "projects/NORMAL/README.md"), makeFolder("src"), makeFolder("tasks")],
  "/Innoxation/Projects/NORMAL/src": [makeFile("pipeline.py", "projects/NORMAL/src/pipeline.py"), makeFolder("lib")],
  "/Innoxation/Projects/NORMAL/src/lib": ["model_manager.py", "lang_tokenizer.py"].map((name) => makeFile(name, `projects/NORMAL/src/lib/${name}`)),
  "/Innoxation/Projects/NORMAL/tasks": ["image_tasks.py"].map((name) => makeFile(name, `projects/NORMAL/tasks/${name}`)),
  "/Innoxation/Projects/Portfolio": ["App.jsx", "main.jsx", "WindowsOS.jsx", "Desktop.jsx", "Taskbar.jsx", "package.json", "README.md"].map((name) => makeFile(name, name.endsWith(".jsx") ? `src/${name}` : name)),
  "/Downloads": [makeFile("Resume.txt", null, { downloadUrl: "/Resume.txt" }), makeFile("CV.txt", null, { downloadUrl: "/CV.txt" }), makeFile("How to use.txt", null, { downloadUrl: "/How%20to%20use.txt" })],
};
const loadFS = () => {
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (value && value["/"]) { const savedProjects = Array.isArray(value["/Innoxation/Projects"]) ? value["/Innoxation/Projects"] : []; const defaults = defaultFS["/Innoxation/Projects"]; return { ...defaultFS, ...value, "/Innoxation/Projects": [...savedProjects, ...defaults.filter((item) => !savedProjects.some((saved) => saved.name === item.name))] }; } } catch {}
  return JSON.parse(JSON.stringify(defaultFS));
};
const joinPath = (base, name) => `${base === "/" ? "" : base}/${name}`;
const parentPath = (path) => path === "/" ? "/" : path.slice(0, path.lastIndexOf("/")) || "/";
const uniqueName = (items, name) => {
  const names = new Set(items.map((item) => item.name.toLowerCase()));
  if (!names.has(name.toLowerCase())) return name;
  const dot = name.lastIndexOf("."); const stem = dot > 0 ? name.slice(0, dot) : name; const ext = dot > 0 ? name.slice(dot) : "";
  let n = 2; while (names.has(`${stem} (${n})${ext}`.toLowerCase())) n++;
  return `${stem} (${n})${ext}`;
};

function Files({ onOpenFile, initialPath }) {
  const [filesystem, setFilesystem] = useState(loadFS);
  const [history, setHistory] = useState([initialPath || "/"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [context, setContext] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const currentPath = history[historyIndex] || "/";
  const items = filesystem[currentPath] || [];
  const visibleItems = useMemo(() => items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())), [items, search]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(filesystem)); } catch {} }, [filesystem]);
  useEffect(() => {
    if (!initialPath) return;
    setHistory([initialPath]); setHistoryIndex(0); setSelected(""); setSearch("");
  }, [initialPath]);
  useEffect(() => {
    const close = (event) => { if (event.key === "Escape") { setContext(null); setRenaming(null); } };
    window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close);
  }, []);
  const navigate = (path) => {
    if (!filesystem[path]) return;
    setHistory((old) => [...old.slice(0, historyIndex + 1), path]); setHistoryIndex((i) => i + 1); setSelected(""); setSearch(""); setContext(null);
  };
  const openItem = (item) => {
    if (item.type === "folder") return navigate(joinPath(currentPath, item.name));
    if (item.downloadUrl) { const a = document.createElement("a"); a.href = item.downloadUrl; a.download = item.name; a.click(); return; }
    if (item.openPath) onOpenFile?.(item.openPath);
  };
  const mutateRename = (oldName, newName) => {
    const name = newName.trim(); if (!name || name === oldName) { setRenaming(null); return; }
    if (items.some((item) => item.name.toLowerCase() === name.toLowerCase())) return;
    const oldPath = joinPath(currentPath, oldName); const newPath = joinPath(currentPath, name);
    setFilesystem((fs) => { const next = { ...fs, [currentPath]: fs[currentPath].map((item) => item.name === oldName ? { ...item, name } : item) };
      if (fs[oldPath]) { next[newPath] = fs[oldPath]; delete next[oldPath]; Object.keys(fs).filter((key) => key.startsWith(`${oldPath}/`)).forEach((key) => { next[`${newPath}${key.slice(oldPath.length)}`] = fs[key]; delete next[key]; }); }
      return next; }); setSelected(name); setRenaming(null);
  };
  const removeItem = (name) => { const path = joinPath(currentPath, name); setFilesystem((fs) => { const next = { ...fs, [currentPath]: fs[currentPath].filter((item) => item.name !== name) }; Object.keys(fs).filter((key) => key === path || key.startsWith(`${path}/`)).forEach((key) => delete next[key]); return next; }); setSelected(""); setContext(null); };
  const duplicateOrMove = (sourcePath, destinationPath, cut = false) => {
    if (destinationPath === sourcePath || destinationPath.startsWith(`${sourcePath}/`)) return;
    const srcParent = parentPath(sourcePath); const originalName = getFileName(sourcePath); const source = filesystem[srcParent]?.find((item) => item.name === originalName); if (!source || !filesystem[destinationPath]) return;
    const name = uniqueName(filesystem[destinationPath], cut ? originalName : `${originalName}`);
    setFilesystem((fs) => {
      const next = { ...fs, [srcParent]: cut ? fs[srcParent].filter((item) => item.name !== originalName) : fs[srcParent], [destinationPath]: [...fs[destinationPath], { ...source, name }] };
      if (source.type === "folder") {
        const oldRoot = sourcePath; const newRoot = joinPath(destinationPath, name); const keys = Object.keys(fs).filter((key) => key === oldRoot || key.startsWith(`${oldRoot}/`));
        keys.forEach((key) => { const mapped = `${newRoot}${key.slice(oldRoot.length)}`; next[mapped] = cut ? fs[key] : JSON.parse(JSON.stringify(fs[key])); if (cut) delete next[key]; });
      }
      return next;
    });
    if (cut) setClipboard(null);
  };
  const pasteInto = (destinationPath) => { if (clipboard) duplicateOrMove(clipboard.path, destinationPath, clipboard.mode === "cut"); setContext(null); };
  const createFolder = (destination = currentPath) => {
    const name = uniqueName(filesystem[destination] || [], "New folder"); setFilesystem((fs) => ({ ...fs, [destination]: [...(fs[destination] || []), makeFolder(name)], [joinPath(destination, name)]: [] })); setSelected(name); setRenaming(name); setRenameValue(name); setContext(null);
  };
  const beginDrag = (event, item) => { const path = joinPath(currentPath, item.name); event.dataTransfer.setData("application/x-innox-file", JSON.stringify({ path, name: item.name, type: item.type })); event.dataTransfer.setData("text/plain", path); event.dataTransfer.effectAllowed = "copyMove"; };
  const dropOnFolder = (event, folderName) => { event.preventDefault(); event.stopPropagation(); try { const data = JSON.parse(event.dataTransfer.getData("application/x-innox-file")); duplicateOrMove(data.path, joinPath(currentPath, folderName), true); } catch {} };
  const dropOnCurrent = (event) => { const raw = event.dataTransfer.getData("application/x-innox-file"); if (!raw) return; event.preventDefault(); event.stopPropagation(); try { const data = JSON.parse(raw); duplicateOrMove(data.path, currentPath, true); } catch {} };
  const showContext = (event, item = null) => { event.preventDefault(); event.stopPropagation(); if (item) setSelected(item.name); setContext({ x: Math.min(event.clientX, window.innerWidth - 190), y: Math.min(event.clientY, window.innerHeight - 240), item }); };
  const contextAction = (action) => {
    const item = context?.item; if (action === "new") return createFolder();
    if (action === "paste") return pasteInto(item?.type === "folder" ? joinPath(currentPath, item.name) : currentPath);
    if (!item) return setContext(null);
    const path = joinPath(currentPath, item.name);
    if (action === "open") openItem(item);
    if (action === "rename") { setRenaming(item.name); setRenameValue(item.name); }
    if (action === "copy" || action === "cut") setClipboard({ path, mode: action });
    if (action === "delete") removeItem(item.name);
    setContext(null);
  };
  const crumbs = ["/", ...currentPath.split("/").filter(Boolean).map((_, index, parts) => `/${parts.slice(0, index + 1).join("/")}`)];
  const tree = (path, depth = 0) => (filesystem[path] || []).filter((item) => item.type === "folder").map((item) => {
    const next = joinPath(path, item.name); const active = currentPath === next || currentPath.startsWith(`${next}/`); const Icon = path === "/" ? ({ Desktop: Monitor, Downloads: Download, Pictures: Image, Innoxation: HardDrive }[item.name] || Folder) : Folder;
    return <div key={next}><button type="button" className={`explorer-tree-row ${active ? "active" : ""}`} style={{ paddingLeft: 12 + depth * 14 }} onClick={() => navigate(next)}><ChevronRight size={13} className={active ? "expanded" : ""}/><Icon size={16}/><span>{item.name}</span></button>{active && tree(next, depth + 1)}</div>;
  });
  return <section className="files-app" onContextMenu={(event) => showContext(event)} onDragOver={(event) => event.preventDefault()} onDrop={dropOnCurrent}>
    <header className="files-toolbar">
      <div className="files-navigation"><button type="button" title="Back" disabled={historyIndex <= 0} onClick={() => setHistoryIndex((i) => Math.max(0, i - 1))}><ArrowLeft size={17}/></button><button type="button" title="Forward" disabled={historyIndex >= history.length - 1} onClick={() => setHistoryIndex((i) => Math.min(history.length - 1, i + 1))}><ArrowRight size={17}/></button><button type="button" title="This PC" onClick={() => navigate("/")}><Home size={16}/></button></div>
      <div className="files-address">{crumbs.map((path, index) => <span className="files-breadcrumb" key={`${path}-${index}`}>{index > 0 && <ChevronRight size={13}/>}<button type="button" className={index === crumbs.length - 1 ? "current" : ""} onClick={() => navigate(path)}>{index === 0 ? "This PC" : getFileName(path)}</button></span>)}</div>
      <label className="files-search"><Search size={15}/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${getFileName(currentPath) || "This PC"}`}/><button type="button" title="Clear search" onClick={() => setSearch("")}><X size={13}/></button></label>
      <button type="button" className="explorer-toolbar-action" title="New folder" onClick={() => createFolder()}><Plus size={16}/> New</button>
    </header>
    <div className="files-content">
      <aside className="files-sidebar"><div className="explorer-side-heading">Quick access</div><button className={`explorer-tree-row ${currentPath === "/" ? "active" : ""}`} onClick={() => navigate("/")}><HardDrive size={16}/>This PC</button><div className="explorer-tree">{tree("/")}</div></aside>
      <main className="files-main" onContextMenu={(event) => showContext(event)}><div className="explorer-heading"><div><h2>{currentPath === "/" ? "This PC" : getFileName(currentPath)}</h2><p>{visibleItems.length} items{clipboard ? ` ? ${clipboard.mode === "cut" ? "Cut" : "Copied"}: ${getFileName(clipboard.path)}` : ""}</p></div><button type="button" className="explorer-more" title="More options" onClick={(event) => showContext(event)}><MoreHorizontal size={18}/></button></div>
        {currentPath === "/" && <div className="explorer-drive-card"><HardDrive size={23}/><div><strong>Innoxation (C:)</strong><span>Local portfolio files</span></div><div className="explorer-drive-meter"><i/></div></div>}
        <div className="files-grid">{visibleItems.map((item) => { const Icon = item.type === "folder" ? (selected === item.name ? FolderOpen : Folder) : getFileIcon(item.name, false); const renamingThis = renaming === item.name; return <button type="button" draggable={!renamingThis} key={item.name} className={`file-item ${selected === item.name ? "selected" : ""}`} onClick={() => setSelected(item.name)} onDoubleClick={() => openItem(item)} onContextMenu={(event) => showContext(event, item)} onDragStart={(event) => beginDrag(event, item)} onDragOver={item.type === "folder" ? (event) => event.preventDefault() : undefined} onDrop={item.type === "folder" ? (event) => dropOnFolder(event, item.name) : undefined}>
          <Icon className="file-item-icon" size={38} strokeWidth={1.5}/>{renamingThis ? <input className="explorer-rename" autoFocus value={renameValue} onChange={(event) => setRenameValue(event.target.value)} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key === "Enter") mutateRename(item.name, renameValue); if (event.key === "Escape") setRenaming(null); }} onBlur={() => mutateRename(item.name, renameValue)}/> : <span className="file-item-name">{item.name}</span>}{item.type === "folder" ? <small>File folder</small> : <small>{item.name.split(".").pop().toUpperCase()} file</small>}
        </button>; })}{visibleItems.length === 0 && <div className="files-empty">{search ? "No items match your search." : "This folder is empty. Drop files here or create a folder."}</div>}</div>
      </main>
    </div>
    {context && <><button className="explorer-dismiss" aria-label="Close menu" onClick={() => setContext(null)}/><div className="explorer-context-menu" style={{ left: context.x, top: context.y }}>
      {context.item && <button onClick={() => contextAction("open")}><FolderOpen size={15}/> Open</button>}
      {context.item && <button onClick={() => contextAction("rename")}><Pencil size={15}/> Rename <kbd>F2</kbd></button>}
      {context.item && <button onClick={() => contextAction("copy")}><Copy size={15}/> Copy</button>}
      {context.item && <button onClick={() => contextAction("cut")}><FileText size={15}/> Cut</button>}
      {clipboard && <button onClick={() => contextAction("paste")}><Copy size={15}/> Paste</button>}
      {context.item?.type === "folder" && clipboard && <button onClick={() => contextAction("paste")}><Copy size={15}/> Paste into folder</button>}
      <button onClick={() => contextAction("new")}><Plus size={15}/> New folder</button>
      {context.item && <div className="explorer-menu-divider"/>}
      {context.item && <button className="danger" onClick={() => contextAction("delete")}><Trash2 size={15}/> Delete</button>}
    </div></>}
  </section>;
}
export default Files;
