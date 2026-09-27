
import React, { useCallback, useState } from "react";

import { DeviceProvider } from "./Core/DeviceContext";
import { SystemStateProvider } from "./Core/SystemState";
import { useSystemState } from "./Core/useSystemState";

import { AppRegistryProvider } from "./Core/AppRegistry";
import { SurfaceManagerProvider } from "./Core/SurfaceManager";

import Viewport from "./Core/Viewport";
import BootScreen from "./Shell/BootScreen";
import LockScreen from "./Shell/LockScreen";
import PhoneSurface from "./Shell/PhoneSurface";
import NavigationSystem from "./Core/NavigationSystem";

import "./InnoxationPhone.css";

function PhoneRuntime() {
  const { systemState, setBooted, setLocked } =
    useSystemState();

  const [bootComplete, setBootComplete] = useState(false);

  /*
   * Boot is finished.
   *
   * IMPORTANT:
   * We intentionally DO NOT open Home here.
   *
   * The correct flow is:
   *
   * Boot → Lock Screen → Unlock → Home
   */
  const handleBootComplete = useCallback(() => {
    setBooted(true);
    setLocked(true);
    setBootComplete(true);
  }, [setBooted, setLocked]);

  /*
   * The LockScreen calls this after the user unlocks.
   */
  const handleUnlock = useCallback(() => {
    setLocked(false);
  }, [setLocked]);

  if (!bootComplete || !systemState.booted) {
    return (
      <BootScreen
        onComplete={handleBootComplete}
      />
    );
  }

  if (systemState.locked) {
    return (
      <LockScreen
        onUnlock={handleUnlock}
      />
    );
  }

  return (
    <div className="innoxation-phone-runtime">
      <PhoneSurface />

      <NavigationSystem />
    </div>
  );
}

export default function InnoxationPhone() {
  return (
    <DeviceProvider>
      <SystemStateProvider>
        <AppRegistryProvider>
          <SurfaceManagerProvider>
            <Viewport>
              <div className="innoxation-phone-root">
                <div className="innoxation-device-shell">
                  <div className="innoxation-phone-environment">
                    <PhoneRuntime />
                  </div>
                </div>
              </div>
            </Viewport>
          </SurfaceManagerProvider>
        </AppRegistryProvider>
      </SystemStateProvider>
    </DeviceProvider>
  );
}