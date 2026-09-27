import { useEffect, useRef, useState } from "react";
import videoSrc from "../../assets/wallpapers/minecraft_sunset_wallpaper.mp4";
import "./VideoWallpaper.css";
function VideoWallpaper({ enabled }) {
  const ref = useRef(null);
  const [isEnabled, setIsEnabled] = useState(enabled);
  useEffect(() => { setIsEnabled(enabled); }, [enabled]);
  useEffect(() => {
    const syncWallpaper = () => {
      try { setIsEnabled((localStorage.getItem("innox_wallpaper") || "wallpaper-video") === "wallpaper-video"); }
      catch { setIsEnabled(true); }
    };
    window.addEventListener("innox-settings-change", syncWallpaper);
    return () => window.removeEventListener("innox-settings-change", syncWallpaper);
  }, []);
  useEffect(() => {
    if (!isEnabled) return;
    const video = ref.current;
    if (video) { const playPromise = video.play(); if (playPromise?.catch) playPromise.catch(() => {}); }
  }, [isEnabled]);
  if (!isEnabled) return null;
  return <div className="video-wallpaper"><video ref={ref} src={videoSrc} muted loop autoPlay playsInline aria-hidden="true" /></div>;
}
export default VideoWallpaper;
