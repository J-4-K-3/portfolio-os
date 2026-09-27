import React from "react";
import { useDevice } from "./DeviceContext";
import "./Viewport.css";

function Viewport({ children }) {
  const {
    device,
    isPhone,
    isTablet,
    isPortrait,
    isLandscape,
  } = useDevice();

  return (
    <div
      className={[
        "innoxation-viewport",
        `innoxation-viewport--${device.type}`,
        `innoxation-viewport--${device.orientation}`,
      ].join(" ")}
      data-device={device.type}
      data-orientation={device.orientation}
      data-phone={isPhone}
      data-tablet={isTablet}
      data-portrait={isPortrait}
      data-landscape={isLandscape}
    >
      {children}
    </div>
  );
}

export default Viewport;