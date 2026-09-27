import { useEffect } from "react";
import "./BootScreen.css";
import startupSound from "../../assets/sounds/windows_11_startup.mp3";

function BootScreen({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const enabled = localStorage.getItem("innox_sounds"); if (enabled !== "false") {
          const audio = new Audio(startupSound); const volume = Math.max(0,
            Math.min(100, Number(localStorage.getItem("innox_volume") ?? 100))) / 100; audio.volume = 0.9 * volume; audio.play().catch(() => { });
        }
      } catch (e) { } onComplete();
    }, 5000);
    return () => { window.clearTimeout(timer); };
  }, [onComplete]); return (<main className="boot-screen boot-windows">
    {/* Windows-style background */}
    <div className="boot-wallpaper" />
    {/* Subtle translucent overlay */}
    <div className="boot-overlay" />
    <div className="boot-center"> {/* Your profile photo */}
      <div className="windows-spinner">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  </main>);
} export default BootScreen;