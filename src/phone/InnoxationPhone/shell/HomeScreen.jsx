import React, { useEffect, useMemo, useRef, useState } from "react";
import { Battery, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun, HelpCircle, Search, Signal, Sun, X } from "lucide-react";
import { projectFiles } from "../../../data/projectFiles";
import { useAppRegistry } from "../Core/useAppRegistry";
import { useSurfaceManager } from "../Core/useSurfaceManager";
import { useSystemState } from "../Core/useSystemState";
import { useDevice } from "../Core/DeviceContext";
import PhoneAppIcon from "./PhoneAppIcon";
import "./HomeScreen.css";

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=-11.66&longitude=27.48&current=temperature_2m,weather_code&timezone=Africa%2FLubumbashi";
function weatherLabel(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2].includes(code)) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorms";
  return "Current conditions";
}
function WeatherIcon({ code }) {
  if ([95, 96, 99].includes(code)) return <CloudLightning size={21} />;
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return <CloudRain size={21} />;
  if ([51, 53, 55, 56, 57].includes(code)) return <CloudDrizzle size={21} />;
  if ([45, 48].includes(code)) return <CloudFog size={21} />;
  if (code === 0) return <Sun size={21} />;
  if (code <= 2) return <CloudSun size={21} />;
  return <Cloud size={21} />;
}
function clockText(date, timeZone) {
  return new Intl.DateTimeFormat(undefined, { timeZone, hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
}

export default function HomeScreen() {
  const { apps, installedAppIds, installApp } = useAppRegistry();
  const { openAppSurface, openNotifications } = useSurfaceManager();
  const { systemState, addNotification, dismissNotification } = useSystemState();
  const { isTablet, isTouchDevice } = useDevice();
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState("");
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(false);
  const [tutorial, setTutorial] = useState(false);
  const touchStart = useRef(null);
  const suppressClick = useRef(false);
  const hasSeenTutorial = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const fetchWeather = () => fetch(WEATHER_URL, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Weather request failed"); return response.json(); })
      .then((data) => { if (!data.current) throw new Error("Weather data unavailable"); setWeather(data.current); setWeatherError(false); })
      .catch((error) => { if (error.name !== "AbortError") setWeatherError(true); });
    fetchWeather();
    const timer = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => { controller.abort(); clearInterval(timer); };
  }, []);
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("xiaomi-hyperos-home-tutorial")) {
        setTutorial(true);
        sessionStorage.setItem("xiaomi-hyperos-home-tutorial", "seen");
      }
    } catch { setTutorial(true); }
  }, []);
  const pages = useMemo(() => {
    const output = [];
    for (let i = 0; i < apps.length; i += 12) output.push(apps.slice(i, i + 12));
    return output;
  }, [apps]);
  useEffect(() => { if (currentPage >= pages.length) setCurrentPage(Math.max(0, pages.length - 1)); }, [currentPage, pages.length]);
  const query = search.trim().toLowerCase();
  const appResults = query ? apps.filter((app) => `${app.name} ${app.subtitle} ${app.category}`.toLowerCase().includes(query)).slice(0, 6) : [];
  const contactMatches = query && "jacob mon +860020805".includes(query.replace(/\s/g, "")) || query && "jacob mon".includes(query);
  const fileResults = query ? Object.keys(projectFiles).filter((path) => path.toLowerCase().includes(query)).slice(0, 5) : [];
  const isSearching = Boolean(query);
  const pageApps = pages[currentPage] || [];
  const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";

  const handlePointerDown = (event) => {
    if (!event.isPrimary || event.target.closest("input,textarea")) return;
    touchStart.current = { x: event.clientX, y: event.clientY, top: event.clientY < 72 };
  };
  const handlePointerUp = (event) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const sensitivity = isTouchDevice && !isTablet ? Number(systemState.touchSensitivity ?? 58) : 55;
    const threshold = Math.max(24, 95 - sensitivity * 0.75);
    if (start.top && dy > threshold && Math.abs(dy) > Math.abs(dx)) { openNotifications(); return; }
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
    suppressClick.current = true;
    window.setTimeout(() => { suppressClick.current = false; }, 350);
    if (isSearching) { setSearch(""); return; }
    setCurrentPage((page) => (page + (dx < 0 ? 1 : -1) + Math.max(pages.length, 1)) % Math.max(pages.length, 1));
  };
  const openResult = (app) => {
    if (!installedAppIds.includes(app.id) && app.type !== "system") installApp(app.id);
    openAppSurface(app.id);
    setSearch("");
  };
  const openFileResult = (path) => { try { sessionStorage.setItem("xiaomi-code-file", path); } catch {} openAppSurface("vscode"); setSearch(""); };
  const dismissTutorial = () => { setTutorial(false); const item = systemState.notifications.find((notification) => notification.id === "xiaomi-tutorial"); if (item) dismissNotification(item.id); };
  const showTutorial = () => {
    setTutorial(true);
    if (!hasSeenTutorial.current) {
      hasSeenTutorial.current = true;
      addNotification({ id: "xiaomi-tutorial", title: "A quick HyperOS tip", message: "Swipe left or right anywhere on Home to change app pages. Pull down from the status bar for notifications.", time: "Now", unread: true });
    }
  };
  const temperature = weather ? `${Math.round(weather.temperature_2m)}�` : weatherError ? "�" : "�";
  const condition = weather ? weatherLabel(weather.weather_code) : weatherError ? "Weather unavailable" : "Getting local weather";
  return (
    <section className={`phone-home${isTablet ? " phone-home--tablet" : ""}`} data-wallpaper={systemState.wallpaper || "aurora"} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onClickCapture={(event) => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}>
      <div className="phone-home__wallpaper" aria-hidden="true" />
      <header className="phone-home__statusbar"><span>{clockText(time, localZone)}</span><div><Signal size={13} /><span>{systemState.network === "offline" ? "Offline" : "5G"}</span><Battery size={15} /><span>{systemState.battery}%</span></div><button type="button" className="phone-home__help" onClick={showTutorial} aria-label="How to use Xiaomi HyperOS"><HelpCircle size={14} /></button></header>
      <div className="phone-home__hero">
        <div className="phone-home__time-block"><div className="phone-home__clock">{clockText(time, localZone)}</div><p className="phone-home__date">{time.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</p><small className="phone-home__world-clock">Lubumbashi <b>{clockText(time, "Africa/Lubumbashi")}</b></small></div>
        <div className="phone-home__weather"><WeatherIcon code={weather?.weather_code} /><span><strong>{temperature}</strong><small>{condition}</small><em>Lubumbashi</em></span></div>
      </div>
      <label className="phone-home__search"><Search size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(0); }} placeholder="Search apps, contacts & files" aria-label="Search all apps and project files" />{search && <button type="button" onClick={() => setSearch("")} aria-label="Clear search"><X size={15} /></button>}</label>
      {isSearching ? <div className="phone-home__results"><small>APPS</small>{appResults.map((app) => <button type="button" key={app.id} onClick={() => openResult(app)}><PhoneAppIcon app={app} /><span><b>{app.name}</b><small>{app.subtitle}</small></span></button>)}{contactMatches && <><small>CONTACTS</small><button type="button" onClick={() => openAppSurface("contacts")}><span className="phone-home__file-icon">JM</span><span><b>Jacob Mon</b><small>+243 860 020 805</small></span></button></>}{fileResults.length > 0 && <><small>PROJECT FILES</small>{fileResults.map((path) => <button type="button" key={path} onClick={() => openFileResult(path)}><Code2Icon /><span><b>{path.split("/").pop()}</b><small>{path}</small></span></button>)}</>}{!appResults.length && !fileResults.length && !contactMatches && <p>No matching apps, contacts or project files.</p>}<button className="phone-home__web-search" onClick={() => { try { sessionStorage.setItem("xiaomi-browser-query", search); } catch {} setSearch(""); openAppSurface("browser"); }}>Search the web for {search}</button></div> : <>
        <div className="phone-home__apps phone-home__apps--page" key={currentPage}>
          {pageApps.map((app) => <button key={app.id} type="button" className="phone-home__app" onClick={() => openAppSurface(app.id)} aria-label={`Open ${app.name}`}><PhoneAppIcon app={app} /><span className="phone-home__app-name">{app.name}</span></button>)}
        </div>
        {pages.length > 1 && <div className="phone-home__pager">{pages.map((_, index) => <button key={index} type="button" className={index === currentPage ? "is-active" : ""} onClick={() => setCurrentPage(index)} aria-label={`Open launcher page ${index + 1}`} />)}</div>}
        <div className="phone-home__dock" aria-label="Favorite apps">{apps.filter((app) => ["browser", "photos", "contacts", "music"].includes(app.id)).map((app) => <button type="button" key={app.id} onClick={() => openAppSurface(app.id)} aria-label={`Open ${app.name}`}><PhoneAppIcon app={app} /></button>)}</div>
      </>}
      {tutorial && <aside className="phone-home__tutorial" role="status"><span>?</span><div><b>Welcome to HyperOS</b><small>Swipe across Home to browse apps. Pull down from the top for notifications.</small></div><button type="button" onClick={dismissTutorial} aria-label="Dismiss tip"><X size={15} /></button><button className="phone-home__tutorial-help" type="button" onClick={showTutorial}>How to use</button></aside>}
      <a className="phone-home__weather-credit" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Weather by Open-Meteo</a>
    </section>
  );
}
function Code2Icon() { return <span className="phone-home__file-icon">{`</>`}</span>; }