import { useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";
import "./FullscreenPrompt.css";
function FullscreenPrompt({ variant = "windows" }) {
  const [visible, setVisible] = useState(false);
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement));
  const [error, setError] = useState("");
  useEffect(() => {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem(`innox-fullscreen-${variant}-prompt-dismissed`) === "1"; } catch {}
    if (!dismissed && !document.fullscreenElement) {
      const timer = window.setTimeout(() => setVisible(true), 2600);
      return () => window.clearTimeout(timer);
    }
  }, []);
  useEffect(() => { const change = () => { setFullscreen(Boolean(document.fullscreenElement)); if (document.fullscreenElement) setVisible(false); }; document.addEventListener("fullscreenchange", change); return () => document.removeEventListener("fullscreenchange", change); }, []);
  const dismiss = () => { setVisible(false); try { sessionStorage.setItem(`innox-fullscreen-${variant}-prompt-dismissed`, "1"); } catch {} };
  const toggle = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      dismiss();
    } catch {
      setError("Full screen is unavailable in this preview.");
    }
  };
  if (!visible || fullscreen) return null;
  return <aside className={`fullscreen-prompt ${variant}`} role="status"><div className="fullscreen-prompt-icon"><Maximize2 size={17} /></div><div className="fullscreen-prompt-copy"><strong>{variant === "mac" ? "Explore in full screen" : "Get the full desktop experience"}</strong><span>{error || "Switch to full screen to explore this portfolio desktop."}</span><button type="button" onClick={toggle}>Turn on full screen</button></div><button type="button" className="fullscreen-prompt-dismiss" onClick={dismiss} aria-label="Dismiss full-screen tip"><X size={15} /></button></aside>;
}
export default FullscreenPrompt;
