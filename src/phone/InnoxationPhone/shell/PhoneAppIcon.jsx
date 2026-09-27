import React, { useState } from "react";
import auriLogo from "../../../assets/app_icons/auri_logo.png";
import telvinLogo from "../../../assets/app_icons/telvin_logo.png";
import natterLogo from "../../../assets/app_icons/natter_logo.png";
import appgradeLogo from "../../../assets/app_icons/appgrade_logo.png";

const APP_ICON_SOURCES = {
  auri: auriLogo,
  telvin: telvinLogo,
  natter: natterLogo,
  appgrade: appgradeLogo,
};

export default function PhoneAppIcon({ app, className = "" }) {
  const [failed, setFailed] = useState(false);
  const source = APP_ICON_SOURCES[app.id] || `/phone-icons/${app.id}.png`;

  return (
    <span
      className={`phone-app-icon phone-app-icon--${app.accent || app.id} ${className}`}
      aria-hidden="true"
    >
      {!failed && <img src={source} alt="" onError={() => setFailed(true)} />}
      {failed && (
        <span className="phone-app-icon__fallback">
          {app.icon || app.name?.slice(0, 1) || "?"}
        </span>
      )}
    </span>
  );
}