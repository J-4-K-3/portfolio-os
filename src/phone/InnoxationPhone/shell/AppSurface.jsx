import React from "react";

import { useAppRegistry } from "../Core/useAppRegistry";
import { useSurfaceManager } from "../Core/useSurfaceManager";

import Files from "./Files";
import Photos from "./Photos";
import Store from "./Store";

import Auri from "../InnoxationApps/Auri";
import Natter from "../InnoxationApps/Natter";
import Telvin from "../InnoxationApps/Telvin";
import Moon from "../InnoxationApps/Moon";
import Appgrade from "../InnoxationApps/Appgrade";
import GROA from "../InnoxationApps/GROA";
import SystemApps from "./SystemApps";

import "./AppSurface.css";

export default function AppSurface({ appId }) {
  const { getApp } = useAppRegistry();
  const { goBack } = useSurfaceManager();

  const app = getApp(appId);

  if (!app) {
    return (
      <section className="app-surface app-surface--error">
        <div className="app-surface__error-card">
          <span>⚠</span>

          <h2>App unavailable</h2>

          <p>
            Xiaomi HyperOS could not locate
            this application.
          </p>

          <button onClick={goBack}>
            Go Back
          </button>
        </div>
      </section>
    );
  }

  /*
   * Native Innoxation applications.
   *
   * Appgrade and G.R.O.A. intentionally do NOT
   * appear here because they are browser-based
   * experiences.
   */
  switch (appId) {
    case "auri":
      return <Auri />;

    case "natter":
      return <Natter />;

    case "telvin":
      return <Telvin />;

    case "moon":
      return <Moon />;

    case "files":
      return <Files />;

    case "photos":
      return <Photos />;

    case "store":
      return <Store />;

    case "browser":
    case "vscode":
    case "clock":
    case "contacts":
    case "music":
      return <SystemApps appId={appId} />;

    case "appgrade":
      return <Appgrade />;

    case "groa":
      return <GROA />;

    default:
      return (
        <section className="app-surface">
          <div className="app-surface__fallback">
            <div className="app-surface__fallback-card">
              <div className="app-surface__icon">
                {app.icon || "◈"}
              </div>

              <h1>{app.name}</h1>

              <p>
                {app.subtitle ||
                  "Phone application"}
              </p>

              <span className="app-surface__status">
                Application surface ready
              </span>

              <button onClick={goBack}>
                Back
              </button>
            </div>
          </div>
        </section>
      );
  }
}