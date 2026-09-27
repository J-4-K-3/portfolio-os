import React from "react";

import {
  useSurfaceManager,
} from "../Core/useSurfaceManager";

import {
  useSystemState,
} from "../Core/useSystemState";

import HomeScreen from "./HomeScreen";
import AppSurface from "./AppSurface";
import RecentSurfaces from "./RecentSurfaces";
import NotificationCenter from "./NotificationCenter";
import Pulse from "./Pulse";
import Settings from "./Settings";

import "./PhoneSurface.css";

export default function PhoneSurface() {
  const {
    currentSurface,
  } = useSurfaceManager();

  const {
    systemState,
  } = useSystemState();

  const surfaceClass = [
    "phone-surface",
    `phone-surface--${currentSurface
      ?.replace(":", "-")
      .replace(
        /[^a-zA-Z0-9-_]/g,
        ""
      )}`,
    `phone-surface--theme-${systemState.theme}`,
  ].join(" ");

  /*
   * Home
   */
  if (
    !currentSurface ||
    currentSurface === "home"
  ) {
    return (
      <section className={surfaceClass}>
        <HomeScreen />
      </section>
    );
  }

  /*
   * Application
   */
  if (
    currentSurface.startsWith(
      "app:"
    )
  ) {
    const appId =
      currentSurface.slice(4);

    return (
      <section className={surfaceClass}>
        <AppSurface
          key={appId}
          appId={appId}
        />
      </section>
    );
  }

  /*
   * Recents
   */
  if (
    currentSurface === "recents"
  ) {
    return (
      <section className={surfaceClass}>
        <RecentSurfaces />
      </section>
    );
  }

  /*
   * Notification Center
   */
  if (
    currentSurface ===
    "notifications"
  ) {
    return (
      <section className={surfaceClass}>
        <NotificationCenter />
      </section>
    );
  }

  /*
   * Pulse
   */
  if (
    currentSurface === "pulse"
  ) {
    return (
      <section className={surfaceClass}>
        <Pulse />
      </section>
    );
  }

  /*
   * Settings
   */
  if (
    currentSurface === "settings"
  ) {
    return (
      <section className={surfaceClass}>
        <Settings />
      </section>
    );
  }

  /*
   * Unknown surface fallback.
   */
  return (
    <section
      className={[
        "phone-surface",
        "phone-surface--unknown",
      ].join(" ")}
    >
      <div className="phone-surface__unknown">
        <span>?</span>

        <strong>
          Surface unavailable
        </strong>

        <small>
          The requested surface could
          not be loaded.
        </small>
      </div>
    </section>
  );
}