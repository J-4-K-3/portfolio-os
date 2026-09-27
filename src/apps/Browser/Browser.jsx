import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, ChevronDown, Download, Globe, Home, Plus, RotateCw, Search, ShieldCheck, Star, X, Clock3, Trash2, ExternalLink } from "lucide-react";
import { browserPages, browserSearch, getPage } from "../../data/browserData";
import { normalizeUrl, isInternalUrl, isExternalUrl } from "../../utils/browserUtils";
import "./Browser.css";

const STORAGE = { favorites: "innox-browser-favorites", history: "innox-browser-history", downloads: "innox-browser-downloads" };
const readStore = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const writeStore = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage can be unavailable */ } };
const DEFAULT_FAVORITES = ["innoxation://home", "innoxation://projects", "innoxation://auri", "innoxation://natter"];
const titleFor = (url) => {
  if (url === "innoxation://newtab") return "New Tab";
  if (url.startsWith("innoxation://search")) return `Search: ${new URLSearchParams(url.split("?")[1]).get("q") || "Search"}`;
  const page = getPage(url);
  if (page) return page.title;
  try { return new URL(url).hostname || "Web page"; } catch { return "Web page"; }
};
const addressFor = (url) => url || "";
const shortName = (url) => getPage(url)?.title?.replace(/\s*(?:\u2014|-)\s*Innoxation/i, "") || url.replace("innoxation://", "");
function createTab(id) { return { id, title: "New Tab", history: ["innoxation://newtab"], historyIndex: 0, loading: false, reloadToken: 0 }; }

function Browser({ initialUrl }) {
  const [tabs, setTabs] = useState([createTab(1)]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [addressValue, setAddressValue] = useState("");
  const [addressFocused, setAddressFocused] = useState(false);
  const [panel, setPanel] = useState("");
  const [favorites, setFavorites] = useState(() => readStore(STORAGE.favorites, DEFAULT_FAVORITES));
  const [history, setHistory] = useState(() => readStore(STORAGE.history, []));
  const [downloads, setDownloads] = useState(() => readStore(STORAGE.downloads, []));
  const addressRef = useRef(null);
  const activeTab = useMemo(() => tabs.find((tab) => tab.id === activeTabId) || tabs[0], [tabs, activeTabId]);
  const activeUrl = activeTab?.history[activeTab.historyIndex] || "innoxation://newtab";
  const activePage = getPage(activeUrl);
  const canGoBack = activeTab?.historyIndex > 0;
  const canGoForward = activeTab && activeTab.historyIndex < activeTab.history.length - 1;

  useEffect(() => { setAddressValue(addressFor(activeUrl)); }, [activeUrl, activeTabId]);
  useEffect(() => { writeStore(STORAGE.favorites, favorites); }, [favorites]);
  useEffect(() => { writeStore(STORAGE.history, history); }, [history]);
  useEffect(() => { writeStore(STORAGE.downloads, downloads); }, [downloads]);
  useEffect(() => { if (initialUrl) navigate(initialUrl); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [initialUrl]);

  const updateTab = (id, updates) => setTabs((items) => items.map((tab) => tab.id === id ? { ...tab, ...updates } : tab));
  const recordVisit = (url, title) => setHistory((items) => [{ url, title, visitedAt: Date.now() }, ...items.filter((item) => item.url !== url)].slice(0, 100));
  const resolveDestination = (value) => {
    const destination = normalizeUrl(value);
    if (!destination.startsWith("innoxation://search")) return destination;
    const query = new URLSearchParams(destination.split("?")[1]).get("q") || "";
    return browserSearch(query).length ? destination : `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };
  const navigate = (value) => {
    const input = String(value || "").trim();
    if (!input || !activeTab) return;
    const destination = resolveDestination(input);
    const currentUrl = activeTab.history[activeTab.historyIndex];
    setPanel(""); setAddressFocused(false);
    if (destination === currentUrl) { setAddressValue(destination); return; }
    const next = [...activeTab.history.slice(0, activeTab.historyIndex + 1), destination];
    const title = titleFor(destination);
    updateTab(activeTabId, { history: next, historyIndex: next.length - 1, title, loading: false, reloadToken: 0 });
    recordVisit(destination, title);
  };
  const navigateHistory = (delta) => {
    if (!activeTab) return;
    const index = activeTab.historyIndex + delta;
    if (index < 0 || index >= activeTab.history.length) return;
    const url = activeTab.history[index];
    updateTab(activeTabId, { historyIndex: index, title: titleFor(url), loading: false });
    recordVisit(url, titleFor(url));
  };
  const goBack = () => canGoBack && navigateHistory(-1);
  const goForward = () => canGoForward && navigateHistory(1);
  const reloadPage = () => {
    if (!activeTab) return;
    updateTab(activeTabId, { loading: true, reloadToken: (activeTab.reloadToken || 0) + 1 });
    window.setTimeout(() => updateTab(activeTabId, { loading: false }), 450);
  };
  const goHome = () => navigate("innoxation://newtab");
  const createNewTab = () => {
    const id = Date.now() + Math.floor(Math.random() * 10000);
    setTabs((items) => [...items, createTab(id)]); setActiveTabId(id); setPanel("");
  };
  const closeTab = (id) => {
    if (tabs.length === 1) { updateTab(id, createTab(id)); return; }
    const index = tabs.findIndex((tab) => tab.id === id);
    const remaining = tabs.filter((tab) => tab.id !== id);
    setTabs(remaining);
    if (id === activeTabId) setActiveTabId(remaining[Math.max(0, index - 1)].id);
  };
  const toggleFavorite = () => setFavorites((items) => items.includes(activeUrl) ? items.filter((url) => url !== activeUrl) : [activeUrl, ...items]);
  const addDownload = (name, url) => {
    const item = { id: Date.now(), name, url, downloadedAt: Date.now() };
    setDownloads((items) => [item, ...items]);
    const link = document.createElement("a"); link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove();
    setPanel("downloads");
  };
  const suggestions = useMemo(() => {
    const query = addressValue.trim().toLowerCase();
    if (!addressFocused) return [];
    const pages = browserPages.map((page) => ({ url: page.url, title: page.title }));
    const visits = history.map((item) => ({ url: item.url, title: item.title }));
    const saved = favorites.map((url) => ({ url, title: shortName(url) }));
    const pool = [...pages, ...visits, ...saved].filter((item, index, all) => all.findIndex((other) => other.url === item.url) === index);
    return (query ? pool.filter((item) => `${item.title} ${item.url}`.toLowerCase().includes(query)) : saved).slice(0, 6);
  }, [addressValue, addressFocused, favorites, history]);
  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") { event.preventDefault(); addressRef.current?.focus(); addressRef.current?.select(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") { event.preventDefault(); reloadPage(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "t") { event.preventDefault(); createNewTab(); }
      if (event.altKey && event.key === "ArrowLeft") { event.preventDefault(); goBack(); }
      if (event.altKey && event.key === "ArrowRight") { event.preventDefault(); goForward(); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  });
  const submitAddress = (event) => { event.preventDefault(); navigate(addressValue); };
  const openPage = (url) => navigate(url);
  const renderPage = () => {
    if (activeTab?.loading) return <div className="browser-loading"><div className="browser-loading-spinner" /><span>Loading...</span></div>;
    if (isExternalUrl(activeUrl)) return <ExternalPage key={`${activeUrl}-${activeTab.reloadToken}`} url={activeUrl} />;
    if (activeUrl.startsWith("innoxation://search")) {
      const query = new URLSearchParams(activeUrl.split("?")[1]).get("q") || "";
      return <SearchPage query={query} results={browserSearch(query)} onOpen={openPage} />;
    }
    if (!activePage || activeUrl === "innoxation://newtab") return <NewTab onNavigate={openPage} onSearch={navigate} onDownload={addDownload} />;
    return <BrowserPage page={activePage} onNavigate={openPage} />;
  };

  return <section className="browser-app">
    <div className="browser-tabs"><div className="browser-tab-list">
      {tabs.map((tab) => <div key={tab.id} className={`browser-tab-wrap ${tab.id === activeTabId ? "active" : ""}`}>
        <button type="button" className="browser-tab" onClick={() => setActiveTabId(tab.id)} title={tab.title}><Globe size={13} /><span>{tab.title}</span></button>
        {tabs.length > 1 && <button type="button" className="browser-tab-close" aria-label={`Close ${tab.title}`} onClick={() => closeTab(tab.id)}><X size={13} /></button>}
      </div>)}
      <button type="button" className="browser-new-tab" onClick={createNewTab} title="New tab"><Plus size={16} /></button>
    </div></div>
    <div className="browser-toolbar">
      <div className="browser-navigation">
        <button type="button" onClick={goBack} disabled={!canGoBack} title="Back"><ArrowLeft size={17} /></button>
        <button type="button" onClick={goForward} disabled={!canGoForward} title="Forward"><ArrowRight size={17} /></button>
        <button type="button" onClick={reloadPage} title="Refresh"><RotateCw size={16} /></button>
        <button type="button" onClick={goHome} title="Home"><Home size={16} /></button>
      </div>
      <form className="browser-address" onSubmit={submitAddress}>
        <ShieldCheck size={15} />
        <input ref={addressRef} value={addressValue} placeholder="Search or enter web address" onFocus={() => setAddressFocused(true)} onChange={(event) => setAddressValue(event.target.value)} onBlur={() => window.setTimeout(() => setAddressFocused(false), 140)} onKeyDown={(event) => { if (event.key === "Escape") setAddressFocused(false); }} />
        {addressFocused && addressValue && <button type="button" className="address-clear" onMouseDown={(event) => event.preventDefault()} onClick={() => setAddressValue("")}><X size={14} /></button>}
        {addressFocused && suggestions.length > 0 && <div className="browser-suggestions">{suggestions.map((item) => <button type="button" key={item.url} onMouseDown={(event) => event.preventDefault()} onClick={() => navigate(item.url)}><Clock3 size={14} /><span><strong>{item.title}</strong><small>{item.url}</small></span></button>)}</div>}
      </form>
      <div className="browser-toolbar-actions">
        <button type="button" title={favorites.includes(activeUrl) ? "Remove favorite" : "Add favorite"} className={favorites.includes(activeUrl) ? "is-favorite" : ""} onClick={toggleFavorite}><Star size={16} /></button>
        <button type="button" title="Favorites" onClick={() => setPanel(panel === "favorites" ? "" : "favorites")}><Bookmark size={16} /></button>
        <button type="button" title="Downloads" onClick={() => setPanel(panel === "downloads" ? "" : "downloads")}><Download size={16} /></button>
        <button type="button" title="History" onClick={() => setPanel(panel === "history" ? "" : "history")}><Clock3 size={16} /></button>
        <button type="button" title="More options" onClick={() => setPanel(panel === "more" ? "" : "more")}><ChevronDown size={16} /></button>
      </div>
    </div>
    <div className="browser-favorites-bar"><span>Favorites</span>{favorites.map((url) => <button type="button" key={url} onClick={() => navigate(url)} title={url}><span>{getPage(url)?.icon || "?"}</span>{shortName(url)}</button>)}<button type="button" className="favorites-add" onClick={toggleFavorite}>+ Add current page</button></div>
    <div className="browser-main"><div className="browser-content">{renderPage()}</div>
      {panel && <aside className="browser-panel">
        <div className="browser-panel-heading"><strong>{panel === "more" ? "Browser menu" : panel[0].toUpperCase() + panel.slice(1)}</strong><button type="button" onClick={() => setPanel("")} aria-label="Close panel"><X size={15} /></button></div>
        {panel === "more" && <div className="browser-panel-menu"><button onClick={() => setPanel("history")}>History</button><button onClick={() => setPanel("downloads")}>Downloads</button><button onClick={() => setPanel("favorites")}>Favorites</button><button onClick={() => { setPanel(""); createNewTab(); }}>New tab <kbd>Ctrl+T</kbd></button></div>}
        {panel === "favorites" && <div className="browser-panel-list">{favorites.length ? favorites.map((url) => <div key={url}><button className="browser-panel-item" onClick={() => navigate(url)}><Star size={14} /><span><strong>{shortName(url)}</strong><small>{url}</small></span></button><button className="panel-remove" title="Remove favorite" onClick={() => setFavorites((items) => items.filter((item) => item !== url))}><X size={13} /></button></div>) : <p className="browser-panel-empty">Pages you save will appear here.</p>}</div>}
        {panel === "history" && <div className="browser-panel-list">{history.length ? <>{history.map((item) => <div key={`${item.url}-${item.visitedAt}`}><button className="browser-panel-item" onClick={() => navigate(item.url)}><Clock3 size={14} /><span><strong>{item.title}</strong><small>{item.url} | {new Date(item.visitedAt).toLocaleString()}</small></span></button></div>)}<button className="browser-panel-clear" onClick={() => setHistory([])}><Trash2 size={13} /> Clear browsing history</button></> : <p className="browser-panel-empty">Pages you visit will appear here.</p>}</div>}
        {panel === "downloads" && <div className="browser-panel-list">{downloads.length ? downloads.map((item) => <div key={item.id}><button className="browser-panel-item" onClick={() => { const a = document.createElement("a"); a.href = item.url; a.download = item.name; a.click(); }}><Download size={14} /><span><strong>{item.name}</strong><small>Downloaded {new Date(item.downloadedAt).toLocaleString()}</small></span></button><button className="panel-remove" title="Remove from list" onClick={() => setDownloads((items) => items.filter((download) => download.id !== item.id))}><X size={13} /></button></div>) : <p className="browser-panel-empty">Downloads will appear here. Try the CV or Resume on the new tab page.</p>}</div>}
      </aside>}
    </div>
    <footer className="browser-status"><span><ShieldCheck size={12} /> Innoxation Secure Environment</span><span>{isInternalUrl(activeUrl) ? "Internal page" : "Web"}</span></footer>
  </section>;
}

function NewTab({ onNavigate, onSearch, onDownload }) {
  const [query, setQuery] = useState("");
  const submit = (event) => { event.preventDefault(); if (query.trim()) onSearch(query); };
  return <main className="browser-new-page"><div className="browser-new-brand"><div className="browser-brand-mark">I</div><h1>Innoxation</h1><p>The web inside Jacob's virtual computer.</p></div>
    <form className="browser-search-box" onSubmit={submit}><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Innoxation or the web" /><button type="submit">Search</button></form>
    <div className="browser-shortcuts">{browserPages.filter((page) => page.featured).map((page) => <button type="button" key={page.url} onClick={() => onNavigate(page.url)}><span>{page.icon}</span><strong>{page.title}</strong></button>)}</div>
    <div className="browser-download-cards"><button onClick={() => onDownload("Jacob-CV.txt", "/CV.txt")}><Download size={15} /><span><strong>Download CV</strong><small>Recruiter profile</small></span></button><button onClick={() => onDownload("Jacob-Resume.txt", "/Resume.txt")}><Download size={15} /><span><strong>Download Resume</strong><small>Experience and skills</small></span></button></div>
  </main>;
}
function SearchPage({ query, results, onOpen }) { return <main className="browser-search-page"><div className="search-heading"><Search size={18} /><div><span>Innoxation search</span><h1>{query}</h1></div></div><div className="search-results">{results.map((result) => <button type="button" className="search-result" key={result.url} onClick={() => onOpen(result.url)}><div className="search-result-icon">{result.icon}</div><div><span>{result.url}</span><h2>{result.title}</h2><p>{result.description}</p></div></button>)}</div></main>; }
function BrowserPage({ page, onNavigate }) { return <main className="browser-webpage"><div className="webpage-hero"><span className="webpage-label">{page.category}</span><h1>{page.heading}</h1><p>{page.description}</p>{page.action && <button type="button" onClick={() => onNavigate(page.action.url)}>{page.action.label}</button>}</div>{page.sections?.map((section) => <section className="webpage-section" key={section.title}><div><span>{section.label}</span><h2>{section.title}</h2></div><p>{section.description}</p></section>)}</main>; }
function ExternalPage({ url }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => { setLoaded(false); setFailed(false); }, [url]);
  return <main className="browser-external"><div className="external-iframe">
    <iframe title={url} src={url} sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads" referrerPolicy="no-referrer" onLoad={() => setLoaded(true)} onError={() => { setFailed(true); setLoaded(true); }} />
    <div className={`external-fallback ${loaded ? "is-loaded" : ""}`}>
      {!loaded && <><Globe size={15} /><span>{failed ? "The embedded page could not be loaded." : "Loading external page..."}</span></>}
      <a href={url} target="_blank" rel="noreferrer">Open in new tab <ExternalLink size={13} /></a>
    </div>
  </div></main>;
}
export default Browser;
