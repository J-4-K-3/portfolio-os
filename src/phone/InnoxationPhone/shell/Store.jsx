import React, { useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Download, Search, ShieldCheck, Star, Trash2, X } from "lucide-react";
import { useAppRegistry } from "../Core/useAppRegistry";
import { useSurfaceManager } from "../Core/useSurfaceManager";
import PhoneAppIcon from "./PhoneAppIcon";
import "./Store.css";

const tabs = ["For you", "Apps", "Installed"];
const categories = ["All", "Social", "AI & tools", "Productivity", "Lifestyle", "Finance"];

export default function Store() {
  const { catalog, installedAppIds, isInstalled, installApp, uninstallApp } = useAppRegistry();
  const { goBack, openAppSurface } = useSurfaceManager();
  const [activeTab, setActiveTab] = useState("For you");
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [busyId, setBusyId] = useState("");
  const userApps = catalog.filter((app) => app.type !== "system");
  const filtered = useMemo(() => userApps.filter((app) => {
    const matchesQuery = (app.name + " " + app.subtitle + " " + app.category).toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeTab !== "Apps" || category === "All" || app.category === category;
    const matchesInstalled = activeTab !== "Installed" || installedAppIds.includes(app.id);
    return matchesQuery && matchesCategory && matchesInstalled;
  }), [userApps, query, activeTab, category, installedAppIds]);
  const featured = userApps.find((app) => app.id === "auri");
  const doInstall = (app) => {
    if (isInstalled(app.id) || busyId) return;
    setBusyId(app.id);
    window.setTimeout(() => { installApp(app.id); setBusyId(""); }, 850);
  };
  return (
    <main className="phone-store">
      <header className="phone-store__top"><button className="phone-store__back" onClick={goBack} aria-label="Back"><ArrowLeft size={20} /></button><div><small>GOOGLE PLAY</small><h1>Play Store</h1></div><span className="phone-store__avatar">J</span></header>
      <label className="phone-store__search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search apps & games" aria-label="Search store" />{query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}</label>
      <nav className="phone-store__tabs" aria-label="Store sections">{tabs.map((tab) => <button key={tab} className={activeTab === tab ? "is-active" : ""} onClick={() => setActiveTab(tab)}>{tab}{tab === "Installed" && installedAppIds.length > 0 && <span>{installedAppIds.length}</span>}</button>)}</nav>
      <div className="phone-store__scroll">
        {activeTab === "For you" && !query && featured && <button className="phone-store__feature" onClick={() => setSelected(featured)}><span className="phone-store__feature-copy"><small>MADE FOR YOUR NEXT IDEA</small><strong>Meet Auri</strong><span>A calmer corner of the internet, built around meaningful connection.</span><em>Explore app <ChevronRight size={14} /></em></span><PhoneAppIcon app={featured} className="phone-store__feature-icon" /></button>}
        {activeTab === "Apps" && <div className="phone-store__categories">{categories.map((item) => <button type="button" key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>}
        <section className="phone-store__section"><div className="phone-store__section-heading"><div><small>{activeTab === "Installed" ? "READY WHEN YOU ARE" : activeTab === "Apps" ? "CURATED COLLECTION" : "HAND-PICKED FOR YOU"}</small><h2>{activeTab === "Installed" ? "Your apps" : activeTab === "Apps" ? "Explore apps" : "Discover"}</h2></div><span>{filtered.length} apps</span></div>
          {filtered.length ? <div className="phone-store__list">{filtered.map((app) => <article className="phone-store__app" key={app.id}><button className="phone-store__app-main" onClick={() => setSelected(app)}><PhoneAppIcon app={app} /><span className="phone-store__app-info"><strong>{app.name}</strong><small>{app.subtitle}</small><span className="phone-store__meta"><Star size={11} fill="currentColor" /> {app.rating} <i /> {app.category}</span></span></button><button className={"phone-store__action " + (isInstalled(app.id) ? "is-installed" : "")} onClick={() => isInstalled(app.id) ? openAppSurface(app.id) : doInstall(app)} disabled={Boolean(busyId) && busyId !== app.id}>{busyId === app.id ? <span className="phone-store__installing"><i /></span> : isInstalled(app.id) ? <><Check size={13} /> Open</> : <><Download size={13} /> Install</>}</button></article>)}</div> : <div className="phone-store__empty"><span>?</span><strong>{activeTab === "Installed" ? "Nothing installed yet" : "No matching apps"}</strong><small>{activeTab === "Installed" ? "Your installed apps will show up here." : "Try a different search or category."}</small>{activeTab === "Installed" && <button onClick={() => setActiveTab("Apps")}>Browse apps</button>}</div>}
        </section>
        {activeTab === "For you" && <div className="phone-store__trust"><ShieldCheck size={16} /><span><strong>Portfolio showcase</strong><small>Every app here is a locally simulated experience.</small></span></div>}
      </div>
      {selected && <div className="phone-store__scrim" role="presentation" onClick={() => setSelected(null)}><section className="phone-store__detail" role="dialog" aria-modal="true" aria-label={selected.name + " app details"} onClick={(event) => event.stopPropagation()}><button className="phone-store__detail-close" onClick={() => setSelected(null)} aria-label="Close details"><X size={18} /></button><PhoneAppIcon app={selected} className="phone-store__detail-icon" /><small>XIAOMI APP MARKET</small><h2>{selected.name}</h2><p>{selected.subtitle}. A portfolio app by Jacob, designed and built for this interactive phone.</p><div className="phone-store__detail-stats"><span><strong><Star size={13} fill="currentColor" /> {selected.rating}</strong><small>Rating</small></span><span><strong>{selected.size}</strong><small>Download size</small></span><span><strong>{selected.category}</strong><small>Category</small></span></div>{isInstalled(selected.id) ? <button className="phone-store__detail-install is-installed" onClick={() => uninstallApp(selected.id)}><Trash2 size={15} /> Uninstall</button> : <button className="phone-store__detail-install" onClick={() => doInstall(selected)} disabled={Boolean(busyId)}>{busyId === selected.id ? "Installing..." : "Install"}</button>}<small className="phone-store__detail-note">Demo app. No external download.</small></section></div>}
    </main>
  );
}
