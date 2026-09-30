import WindowsOS from "./windows/WindowsOS";
import InnoxationPhone from "./phone/InnoxationPhone/InnoxationPhone";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";

/**
 * Public demo mode hides personal contact details and disables
 * Telvin input so the portfolio can be shared safely.
 */
const PUBLIC_DEMO =
  (import.meta.env.VITE_PUBLIC_DEMO || "").toString().toLowerCase() ===
  "true";

/**
 * Detect whether the visitor is using a phone or tablet.
 *
 * Phones/tablets → InnoxationPhone
 * Desktop/laptop → WindowsOS
 *
 * We don't rely only on screen width because tablets can have
 * desktop-sized resolutions.
 */
function isMobileOrTablet() {
  const userAgent = navigator.userAgent || navigator.vendor || "";

  const mobileOrTabletUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  // iPads using desktop-style Safari can sometimes identify as Macintosh.
  const isIPad =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return mobileOrTabletUA || isIPad;
}

if (PUBLIC_DEMO) {
  try {
    localStorage.setItem("innox_public_demo", "true");
  } catch {
    /* ignore */
  }
}

function App() {
  const mobileOrTablet = isMobileOrTablet();

  return (
    <ErrorBoundary>
      {PUBLIC_DEMO ? null : (
        mobileOrTablet ? <InnoxationPhone /> : <WindowsOS />
      )}

      <Analytics />
    </ErrorBoundary>
  );
}

export default App;
