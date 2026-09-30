import { useEffect, useState } from "react";
import { AppWindow, Info, Monitor, Moon, Network, Palette, Search, Settings as SettingsIcon, ShieldCheck, Volume2, Wifi, Sun, Check, RotateCcw } from "lucide-react";
import "./Settings.css";

const sections = [
  { id: "system", label: "System", Icon: Monitor, description: "Display, sound and power" },
  { id: "personalization", label: "Personalization", Icon: Palette, description: "Background, colors and theme" },
  { id: "apps", label: "Apps", Icon: AppWindow, description: "Your portfolio applications" },
  { id: "network", label: "Network", Icon: Network, description: "Connectivity and status" },
  { id: "about", label: "About", Icon: Info, description: "Device and portfolio details" },
];
const saved = (key, fallback) => { try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; } };
function Settings() {
  const [section, setSection] = useState("system");
  const [query, setQuery] = useState("");
  const [brightness, setBrightness] = useState(() => Number(saved("innox_brightness", "100")));
  const [volume, setVolume] = useState(() => Number(saved("innox_volume", "100")));
  const [wallpaper, setWallpaper] = useState(() => saved("innox_wallpaper", "wallpaper-video"));
  const [theme, setTheme] = useState(() => saved("innox_theme", "light"));
  const [language, setLanguage] = useState(() => saved("innox_lang", "en"));
  const [sounds, setSounds] = useState(() => saved("innox_sounds", "true") !== "false");
  const [wifi, setWifi] = useState(() => saved("innox_wifi", "true") !== "false");
  const [bluetooth, setBluetooth] = useState(() => saved("innox_bluetooth", "false") === "true");
  const [bootAppsEnabled, setBootAppsEnabled] = useState(() => saved("innox_boot_apps_enabled", "true") !== "false");
  const emit = () => window.dispatchEvent(new CustomEvent("innox-settings-change"));
  useEffect(() => {
    document.documentElement.style.setProperty("--desktop-dim", String(1 - brightness / 100));
    document.documentElement.dataset.innoxTheme = theme;
    document.documentElement.style.setProperty("--app-font-family", saved("innox_font", "Inter, system-ui, -apple-system, 'Segoe UI', Roboto"));
    document.body.classList.remove("wallpaper-1", "wallpaper-2", "wallpaper-3", "wallpaper-video");
    document.body.classList.add(wallpaper);
    localStorage.setItem("innox_brightness", String(brightness)); localStorage.setItem("innox_volume", String(volume));
    localStorage.setItem("innox_wallpaper", wallpaper); localStorage.setItem("innox_theme", theme);
    localStorage.setItem("innox_lang", language); localStorage.setItem("innox_sounds", String(sounds));
    localStorage.setItem("innox_wifi", String(wifi)); localStorage.setItem("innox_bluetooth", String(bluetooth));
    localStorage.setItem("innox_boot_apps_enabled", String(bootAppsEnabled));
    emit();
    if (bootAppsEnabled) {
      window.dispatchEvent(new CustomEvent("innox-boot-apps-reset"));
    } else {
      window.dispatchEvent(new CustomEvent("innox-boot-apps-dismissed"));
    }
  }, [brightness, volume, wallpaper, theme, language, sounds, wifi, bluetooth, bootAppsEnabled]);
  useEffect(() => { const sync = () => { setLanguage(saved("innox_lang", "en")); setBrightness(Number(saved("innox_brightness", "100"))); setVolume(Number(saved("innox_volume", "100"))); }; window.addEventListener("innox-settings-change", sync); return () => window.removeEventListener("innox-settings-change", sync); }, []);
  const updateLevel = (key, setValue, value) => { setValue(value); localStorage.setItem(key, String(value)); emit(); };
  const toggle = (label, description, value, onChange) => <div className="settings-row"><div><strong>{label}</strong><small>{description}</small></div><button type="button" className={`settings-switch ${value ? "on" : ""}`} role="switch" aria-checked={value} aria-label={label} onClick={() => onChange(!value)}><span/></button></div>;
  const renderSection = () => {
    if (section === "system") return <><div className="settings-page-title"><span>System</span><small>Display, sound and system behavior</small></div><article className="settings-card"><div className="settings-card-heading"><Sun/><div><strong>Display</strong><small>Adjust the brightness of the desktop preview.</small></div></div><label className="settings-range"><span>Brightness</span><input type="range" min="20" max="100" value={brightness} onChange={e => updateLevel("innox_brightness", setBrightness, Number(e.target.value))}/><b>{brightness}%</b></label><div className="settings-divider"/><div className="settings-card-heading"><Volume2/><div><strong>Sound</strong><small>Control interaction audio and output level.</small></div></div>{toggle("Interface sounds", "Play sound effects while navigating the OS", sounds, setSounds)}<label className="settings-range"><span>Volume</span><input type="range" min="0" max="100" value={volume} onChange={e => updateLevel("innox_volume", setVolume, Number(e.target.value))}/><b>{volume}%</b></label></article><article className="settings-card settings-info-card"><ShieldCheck/><div><strong>System status</strong><small>Changes preview immediately and are saved on this device.</small></div><Check size={16}/></article></>;
    if (section === "personalization") return <><div className="settings-page-title"><span>Personalization</span><small>Make this desktop feel like yours.</small></div><article className="settings-card"><div className="settings-card-heading"><Palette/><div><strong>Background</strong><small>Choose a desktop background.</small></div></div><div className="settings-wallpapers">{[["wallpaper-1","Aurora","linear-gradient(135deg,#193b5a,#77b7d7 52%,#edd6a2)"],["wallpaper-2","Coast","linear-gradient(135deg,#182e53,#61a6db 52%,#f2b598)"],["wallpaper-3","Dusk","linear-gradient(135deg,#35265c,#bf6b83 53%,#efbd83)"],["wallpaper-video","Motion","linear-gradient(135deg,#18384a,#5d998c 50%,#c6d7bd)"]].map(([id,name,bg])=><button key={id} className={`settings-wallpaper ${wallpaper===id?"active":""}`} onClick={()=>setWallpaper(id)}><span style={{background:bg}}>{wallpaper===id&&<Check size={17}/>}</span><small>{name}</small></button>)}</div></article><article className="settings-card"><div className="settings-card-heading"><Moon/><div><strong>App appearance</strong><small>Preview a light or dark application surface.</small></div></div><div className="settings-choice-row">{["light","dark"].map(mode=><button key={mode} className={`settings-choice ${theme===mode?"active":""}`} onClick={()=>setTheme(mode)}>{mode==="light"?"Light":"Dark"}{theme===mode&&<Check size={14}/>}</button>)}</div></article></>;
    if (section === "apps") return <><div className="settings-page-title"><span>Apps</span><small>Applications available in this portfolio desktop.</small></div><article className="settings-card settings-app-list">{[["Files","Browse the portfolio workspace"],["Notepad","Read the CV and resume"],["Sticky Notes","Recruiter guide and tips"],["Browser","Explore project links"],["VS Code","Inspect example source files"]].map(([name,desc],i)=><div className="settings-row" key={name}><span className="settings-app-mark">{["F","N","S","B","V"][i]}</span><div><strong>{name}</strong><small>{desc}</small></div><span className="settings-installed">Available</span></div>)}</article><article className="settings-card"><div className="settings-card-heading"><AppWindow/><div><strong>Startup apps</strong><small>Open Sticky Notes and Notepad with Resume when the desktop boots.</small></div></div>{toggle("Auto-open startup apps", "Sticky Notes and Notepad open after the boot screen finishes.", bootAppsEnabled, setBootAppsEnabled)}<div className="settings-divider"/><button type="button" className="settings-reset-button" onClick={() => { setBootAppsEnabled(true); localStorage.removeItem("innox_boot_apps_dismissed"); window.dispatchEvent(new CustomEvent("innox-boot-apps-reset")); }}><RotateCcw size={14}/> Reset auto-open for this session</button></article></>;
    if (section === "network") return <><div className="settings-page-title"><span>Network</span><small>Manage simulated connectivity for this desktop.</small></div><article className="settings-card"><div className="settings-card-heading"><Wifi/><div><strong>Connections</strong><small>These controls are reflected in the system tray.</small></div></div>{toggle("Wi-Fi", wifi ? "Connected ? Innoxation Guest" : "Disconnected", wifi, setWifi)}{toggle("Bluetooth", bluetooth ? "Discoverable for nearby devices" : "Not connected", bluetooth, setBluetooth)}</article><article className="settings-card settings-network-card"><span className={`settings-network-dot ${wifi?"connected":""}`}/><div><strong>{wifi?"Connected":"Not connected"}</strong><small>{wifi?"Internet access is simulated for this portfolio preview.":"Turn Wi-Fi on to show a connected state."}</small></div></article></>;
    return <><div className="settings-page-title"><span>About</span><small>Information about this portfolio environment.</small></div><article className="settings-card settings-about-hero"><div className="settings-about-logo">W</div><div><strong>Innoxation Portfolio OS</strong><small>Windows inspired interactive portfolio</small></div></article><article className="settings-card settings-about-details">{[["Creator","Jacob B Mongolo"],["Purpose","Engineering portfolio for recruiters"],["Environment","Browser based desktop simulation"],["Opportunity","Open to relocation and roles in Germany"]].map(([label,value])=><div className="settings-about-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</article></>;
  };
  const filtered = sections.filter(s => `${s.label} ${s.description}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="settings-app"><aside className="settings-sidebar"><div className="settings-profile"><div className="settings-avatar">JM</div><div><strong>Jacob B Mongolo</strong><small>Portfolio account</small></div></div><label className="settings-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a setting"/></label><nav className="settings-nav">{filtered.map(({id,label,Icon,description})=><button key={id} className={section===id?"active":""} onClick={()=>setSection(id)}><Icon size={18}/><span><strong>{label}</strong><small>{description}</small></span></button>)}</nav><div className="settings-sidebar-footer"><SettingsIcon size={14}/> Settings</div></aside><main className="settings-main">{renderSection()}</main></section>;
}
export default Settings;
