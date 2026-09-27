import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const DeviceContext = createContext(null);

function detectDeviceType() {
  if (typeof window === "undefined") {
    return "phone";
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  const shortestSide = Math.min(width, height);

  /*
    This is intentionally based on viewport characteristics rather
    than specific device names.

    The OS should behave according to available space, not according
    to whether the visitor owns a particular brand of device.
  */

  if (shortestSide >= 700) {
    return "tablet";
  }

  return "phone";
}

function detectOrientation() {
  if (typeof window === "undefined") {
    return "portrait";
  }

  return window.innerWidth > window.innerHeight
    ? "landscape"
    : "portrait";
}

export function DeviceProvider({ children, initialDevice }) {
  const [device, setDevice] = useState({
    type: initialDevice?.type || detectDeviceType(),
    orientation:
      initialDevice?.orientation || detectOrientation(),
  });

  useEffect(() => {
    const updateDevice = () => {
      setDevice({
        type: detectDeviceType(),
        orientation: detectOrientation(),
      });
    };

    updateDevice();

    window.addEventListener("resize", updateDevice);
    window.addEventListener("orientationchange", updateDevice);

    return () => {
      window.removeEventListener("resize", updateDevice);
      window.removeEventListener("orientationchange", updateDevice);
    };
  }, []);

  const value = useMemo(
    () => ({
      device,
      isPhone: device.type === "phone",
      isTablet: device.type === "tablet",
      isTouchDevice: typeof window !== "undefined" && (navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches),
      isPortrait: device.orientation === "portrait",
      isLandscape: device.orientation === "landscape",
    }),
    [device]
  );

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);

  if (!context) {
    throw new Error(
      "useDevice must be used inside DeviceProvider."
    );
  }

  return context;
}