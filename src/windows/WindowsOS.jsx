import {
  useCallback,
  useEffect,
  useState,
} from "react";

import BootScreen from "../components/BootScreen/BootScreen";
import Desktop from "../components/Desktop/Desktop";

import "./WindowsOS.css";

function WindowsOS() {
  const [booting, setBooting] =
    useState(true);

  const finishBoot = useCallback(
    () => {
      setBooting(false);
    },
    []
  );

  useEffect(() => {
    let wallpaper = "wallpaper-video";
    try {
      const migrated = localStorage.getItem("innox_wallpaper_default_migrated");
      const savedWallpaper = localStorage.getItem("innox_wallpaper");
      if (!migrated) {
        if (!savedWallpaper || savedWallpaper === "wallpaper-1") {
          localStorage.setItem("innox_wallpaper", "wallpaper-video");
        }
        localStorage.setItem("innox_wallpaper_default_migrated", "true");
      }
      wallpaper = localStorage.getItem("innox_wallpaper") || "wallpaper-video";
    } catch {}
    document.body.classList.remove("wallpaper-1", "wallpaper-2", "wallpaper-3", "wallpaper-video");
    document.body.classList.add(wallpaper);
  }, []);

  return (
    <main className="windows-os">
      {booting ? (
        <BootScreen onComplete={finishBoot} />
      ) : (
        <Desktop />
      )}
    </main>
  );
}

export default WindowsOS;