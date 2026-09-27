import React from "react";

import { useAppRegistry } from "../Core/useAppRegistry";
import { useSurfaceManager } from "../Core/useSurfaceManager";

import "./RecentSurfaces.css";

export default function RecentSurfaces() {
  const {
    recentApps,
    closeApp,
    getApp,
  } = useAppRegistry();

  const {
    openAppSurface,
    openHome,
  } = useSurfaceManager();

  const apps = recentApps
    .map((id) => getApp(id))
    .filter(Boolean);

  const handleClose = (event, appId) => {
    event.stopPropagation();
    closeApp(appId);
  };

  return (
    <section className="phone-recents">
      <div className="phone-recents__background">
        <span />
        <span />
        <span />
      </div>

      <header className="phone-recents__header">
        <div>
          <span>XIAOMI HYPEROS</span>
          <h1>Recent</h1>
        </div>

        <button
          type="button"
          onClick={openHome}
        >
          Home
        </button>
      </header>

      {apps.length > 0 ? (
        <div className="phone-recents__list">
          {apps.map((app, index) => (
            <button
              key={app.id}
              type="button"
              className="phone-recents__card"
              onClick={() =>
                openAppSurface(app.id)
              }
            >
              <div className="phone-recents__card-top">
                <span className="phone-recents__index">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </span>

                <button
                  type="button"
                  className="phone-recents__close"
                  onClick={(event) =>
                    handleClose(
                      event,
                      app.id
                    )
                  }
                  aria-label={`Close ${app.name}`}
                >
                  ×
                </button>
              </div>

              <div className="phone-recents__icon">
                {app.icon}
              </div>

              <strong>{app.name}</strong>

              <span>{app.subtitle}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="phone-recents__empty">
          <div>○</div>

          <strong>
            Nothing here yet.
          </strong>

          <span>
            Open an app and it will appear here.
          </span>
        </div>
      )}
    </section>
  );
}