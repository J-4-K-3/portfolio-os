import { useEffect, useMemo, useState } from "react";
import { FileText, Save, Search, X, FolderOpen, FilePlus2, ChevronDown } from "lucide-react";
import "./Notepad.css";

const STARTER_DOCS = {
  "Mission.txt": `INNOXATION

Push the limitations of what exists
or create something beyond what exists.

This is the mission.
`,
  "Thoughts.txt": `Ideas are everywhere.

The interesting part is turning an idea
into something that actually exists.
`,
  "Resume.txt": "Loading resume...",
  "CV.txt": "Loading CV...",
};
const DOC_KEY = "innox-notepad-documents";
const readDocs = () => { try { return { ...STARTER_DOCS, ...(JSON.parse(localStorage.getItem(DOC_KEY)) || {}) }; } catch { return { ...STARTER_DOCS }; } };
function Notepad({ initialFilePath = null, initialContent = null }) {
  const initialName = initialFilePath?.split("/").pop() || "Untitled.txt";
  const [documents, setDocuments] = useState(readDocs);
  const [activeFile, setActiveFile] = useState(initialName);
  const [content, setContent] = useState(() => initialContent ?? readDocs()[initialName] ?? "");
  const [savedContent, setSavedContent] = useState(() => initialContent ?? readDocs()[initialName] ?? "");
  const [dialog, setDialog] = useState("");
  const [fileName, setFileName] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const isDirty = content !== savedContent;
  const wordCount = useMemo(() => content.trim() ? content.trim().split(/\s+/).length : 0, [content]);
  useEffect(() => { localStorage.setItem(DOC_KEY, JSON.stringify(documents)); }, [documents]);
  useEffect(() => {
    let cancelled = false;
    ["Resume.txt", "CV.txt"].forEach((name) => fetch(`/${encodeURIComponent(name)}`).then((r) => r.ok ? r.text() : "").then((text) => {
      if (!text || cancelled) return;
      setDocuments((current) => ({ ...current, [name]: text }));
      if (initialFilePath?.split("/").pop() === name && initialContent == null) { setActiveFile(name); setContent(text); setSavedContent(text); }
    }).catch(() => {}));
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    if (!initialFilePath) return;
    const name = initialFilePath.split("/").pop();
    if (initialContent != null) { setActiveFile(name); setContent(initialContent); setSavedContent(initialContent); setDocuments((docs) => ({ ...docs, [name]: initialContent })); return; }
    if (documents[name] && documents[name] !== "Loading resume..." && documents[name] !== "Loading CV...") { setActiveFile(name); setContent(documents[name]); setSavedContent(documents[name]); }
  }, [initialFilePath, initialContent]);
  const saveAs = (name = activeFile) => {
    const clean = (name || "Untitled.txt").trim().replace(/[\\/:*?"<>|]/g, "") || "Untitled.txt";
    const fullName = /\.txt$/i.test(clean) ? clean : `${clean}.txt`;
    setDocuments((docs) => ({ ...docs, [fullName]: content })); setActiveFile(fullName); setSavedContent(content); setDialog("");
  };
  const createFile = () => { setContent(""); setSavedContent(""); setActiveFile("Untitled.txt"); setFileName("Untitled.txt"); setDialog("save"); };
  const openFile = (name) => { setActiveFile(name); setContent(documents[name] || ""); setSavedContent(documents[name] || ""); setDialog(""); };
  const openDownload = (name) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = name; link.click(); URL.revokeObjectURL(link.href);
  };
  useEffect(() => {
    const handler = (event) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      if (event.key.toLowerCase() === "s") { event.preventDefault(); setDialog("save"); setFileName(activeFile); }
      if (event.key.toLowerCase() === "o") { event.preventDefault(); setDialog("open"); }
      if (event.key.toLowerCase() === "n") { event.preventDefault(); createFile(); }
      if (event.key.toLowerCase() === "f") { event.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  }, [activeFile, content]);
  return <div className="notepad-app">
    <header className="notepad-menu"><div className="notepad-menu-left">
      <button type="button" onClick={createFile}><FilePlus2 size={14} /> New</button>
      <button type="button" onClick={() => setDialog("open")}><FolderOpen size={14} /> Open</button>
      <button type="button" onClick={() => { setFileName(activeFile); setDialog("save"); }}><Save size={14} /> Save {isDirty && "*"}</button>
      <button type="button" onClick={() => setSearchOpen(true)}><Search size={14} /> Find</button>
      <button type="button" className="notepad-more" onClick={() => setDialog(dialog === "menu" ? "" : "menu")} aria-label="More file actions"><ChevronDown size={14} /></button>
    </div><div className="notepad-document-title"><FileText size={15} /><span>{activeFile}</span>{isDirty && <span className="notepad-dirty">*</span>}</div></header>
    <div className="notepad-workspace"><aside className="notepad-files"><div className="notepad-files-title">OPEN DOCUMENTS</div>{Object.keys(documents).map((name) => <button key={name} type="button" className={name === activeFile ? "notepad-file active" : "notepad-file"} onClick={() => openFile(name)}><FileText size={13} /><span>{name}</span></button>)}</aside>
      <div className="notepad-editor"><textarea value={content} onChange={(event) => setContent(event.target.value)} spellCheck={false} aria-label="Notepad content" /></div></div>
    <footer className="notepad-statusbar"><span>{wordCount} words</span><span>{content.length} chars</span><span>{content ? content.split("\n").length : 1} lines</span><span className="notepad-status-spacer" />{isDirty ? "Unsaved changes" : "Saved"}</footer>
    {searchOpen && <div className="notepad-search"><div className="notepad-search-box"><Search size={14} /><input placeholder="Find in document" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} autoFocus /><span>{searchTerm ? (content.match(new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")) || []).length : ""}</span><button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={14} /></button></div></div>}
    {dialog && <div className="notepad-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(""); }}>
      {dialog === "open" && <section className="notepad-dialog"><header><strong>Open a text document</strong><button onClick={() => setDialog("")} aria-label="Close"><X size={16} /></button></header><div className="notepad-dialog-files">{Object.keys(documents).map((name) => <button key={name} onDoubleClick={() => openFile(name)} onClick={() => setFileName(name)} className={fileName === name ? "selected" : ""}><FileText size={18} /><span><strong>{name}</strong><small>Text document | {documents[name].length} characters</small></span></button>)}</div><footer><button className="secondary" onClick={() => setDialog("")}>Cancel</button><button className="primary" disabled={!fileName || documents[fileName] === undefined} onClick={() => openFile(fileName)}>Open</button></footer></section>}
      {dialog === "save" && <section className="notepad-dialog notepad-save-dialog"><header><strong>Save text document</strong><button onClick={() => setDialog("")} aria-label="Close"><X size={16} /></button></header><label>File name<input autoFocus value={fileName} onChange={(event) => setFileName(event.target.value)} onKeyDown={(event) => event.key === "Enter" && saveAs(fileName)} /></label><div className="notepad-dialog-hint">This file is saved in this portfolio desktop.</div><footer><button className="secondary" onClick={() => setDialog("")}>Cancel</button><button className="primary" onClick={() => saveAs(fileName)}>Save</button>{isDirty && <button className="secondary" onClick={() => openDownload(fileName || activeFile)}>Download copy</button>}</footer></section>}
      {dialog === "menu" && <div className="notepad-file-menu"><button onClick={createFile}>New document <kbd>Ctrl+N</kbd></button><button onClick={() => { setDialog("open"); setFileName(""); }}>Open... <kbd>Ctrl+O</kbd></button><button onClick={() => { setDialog("save"); setFileName(activeFile); }}>Save as... <kbd>Ctrl+S</kbd></button><button onClick={() => openDownload(activeFile)}>Download a copy</button></div>}
    </div>}
  </div>;
}
export default Notepad;
