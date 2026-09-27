import React from "react";

import {
  useSystemState,
} from "../Core/useSystemState";

import {
  useSurfaceManager,
} from "../Core/useSurfaceManager";

import {
  useDevice,
} from "../Core/DeviceContext";

import "./Pulse.css";

function Control({
  label,
  value,
  active,
  onClick,
  icon,
}) {
  return (
    <button
      type="button"
      className={[
        "phone-pulse__control",
        active
          ? "phone-pulse__control--active"
          : "",
      ].join(" ")}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="phone-pulse__control-icon">
        {icon}
      </span>

      <span className="phone-pulse__control-text">
        <strong>{label}</strong>

        <small>{value}</small>
      </span>
    </button>
  );
}

export default function Pulse() {
  const {
    systemState,
    updateSystemState,
  } = useSystemState();

  const {
    openHome,
  } = useSurfaceManager();

  const {
    isTablet,
  } = useDevice();

  const {
    theme,
    language,
    network,
    battery,
  } = systemState;

  const toggleTheme = () => {
    updateSystemState((current) => ({
      ...current,
      theme:
        current.theme === "dark"
          ? "light"
          : "dark",
    }));
  };

  const toggleNetwork = () => {
    updateSystemState((current) => ({
      ...current,
      network:
        current.network === "offline"
          ? "online"
          : "offline",
    }));
  };

  const toggleNavigation = () => {
    updateSystemState((current) => ({
      ...current,
      navigationVisible:
        !current.navigationVisible,
      navigationExpanded:
        !current.navigationExpanded,
    }));
  };

  return (
    <section
      className={[
        "phone-pulse",
        isTablet
          ? "phone-pulse--tablet"
          : "",
      ].join(" ")}
    >
      <div className="phone-pulse__background" />

      <main className="phone-pulse__panel">
        <header className="phone-pulse__header">
          <div>
            <span className="phone-pulse__eyebrow">
              XIAOMI SYSTEM
            </span>

            <h1>Pulse</h1>

            <p>
              Your system, at a glance.
            </p>
          </div>

          <button
            type="button"
            className="phone-pulse__close"
            onClick={openHome}
            aria-label="Close Pulse"
          >
            ×
          </button>
        </header>

        <section className="phone-pulse__status">
          <div>
            <span>Battery</span>

            <strong>
              {battery ?? 87}%
            </strong>
          </div>

          <div>
            <span>Network</span>

            <strong>
              {network === "online"
                ? "Online"
                : "Offline"}
            </strong>
          </div>

          <div>
            <span>Language</span>

            <strong>
              {language?.toUpperCase() ??
                "EN"}
            </strong>
          </div>
        </section>

        <section className="phone-pulse__controls">
          <Control
            icon="◐"
            label="Network"
            value={
              network === "online"
                ? "Connected"
                : "Offline"
            }
            active={
              network === "online"
            }
            onClick={toggleNetwork}
          />

          <Control
            icon="☼"
            label="Appearance"
            value={
              theme === "dark"
                ? "Dark"
                : "Light"
            }
            active={
              theme === "dark"
            }
            onClick={toggleTheme}
          />

          <Control
            icon="‹"
            label="Navigation"
            value="System controls"
            active={
              systemState
                .navigationVisible
            }
            onClick={
              toggleNavigation
            }
          />

          <Control
            icon="⌁"
            label="IIC"
            value="Ready"
            active={true}
            onClick={() => {}}
          />
        </section>

        <section className="phone-pulse__ecosystem">
          <span>
            ECOSYSTEM STATUS
          </span>

          <div>
            <strong>
              TechID
            </strong>

            <small>
              Available
            </small>
          </div>

          <div>
            <strong>
              IIC
            </strong>

            <small>
              Standing by
            </small>
          </div>

          <div>
            <strong>
              Telvin
            </strong>

            <small>
              Available
            </small>
          </div>
        </section>

        <button
          type="button"
          className="phone-pulse__return"
          onClick={openHome}
        >
          Return to Home
        </button>
      </main>
    </section>
  );
}