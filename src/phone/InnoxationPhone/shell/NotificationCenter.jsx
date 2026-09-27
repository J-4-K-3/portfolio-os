import React from "react";

import { useNotifications } from "../Core/useNotifications";
import { useSurfaceManager } from "../Core/useSurfaceManager";

import "./NotificationCenter.css";

function formatTime(timestamp) {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationCenter() {
  const {
    notifications,
    dismissNotification,
    clearNotifications,
  } = useNotifications();

  const {
    openHome,
  } = useSurfaceManager();

  return (
    <section className="phone-notifications">
      <div className="phone-notifications__backdrop" />

      <main className="phone-notifications__panel">
        <header className="phone-notifications__header">
          <div>
            <span className="phone-notifications__eyebrow">
              XIAOMI HYPEROS
            </span>

            <h1>
              Notifications
            </h1>
          </div>

          {notifications.length > 0 && (
            <button
              type="button"
              className="phone-notifications__clear"
              onClick={clearNotifications}
            >
              Clear
            </button>
          )}
        </header>

        <div className="phone-notifications__list">
          {notifications.length === 0 ? (
            <div className="phone-notifications__empty">
              <span className="phone-notifications__empty-icon">
                ✓
              </span>

              <strong>
                You're all caught up.
              </strong>

              <span>
                New notifications will appear here.
              </span>
            </div>
          ) : (
            notifications.map((notification) => (
              <article
                key={notification.id}
                className="phone-notifications__card"
              >
                <div className="phone-notifications__icon">
                  {notification.icon ?? "•"}
                </div>

                <div className="phone-notifications__content">
                  <div className="phone-notifications__meta">
                    <strong>
                      {notification.title ??
                        "Notification"}
                    </strong>

                    <time>
                      {formatTime(
                        notification.timestamp
                      )}
                    </time>
                  </div>

                  <p>
                    {notification.message ??
                      notification.body ??
                      ""}
                  </p>
                </div>

                <button
                  type="button"
                  className="phone-notifications__dismiss"
                  onClick={() =>
                    dismissNotification(
                      notification.id
                    )
                  }
                  aria-label={`Dismiss ${
                    notification.title ??
                    "notification"
                  }`}
                >
                  ×
                </button>
              </article>
            ))
          )}
        </div>

        <button
          type="button"
          className="phone-notifications__home"
          onClick={openHome}
        >
          Back to Home
        </button>
      </main>
    </section>
  );
}