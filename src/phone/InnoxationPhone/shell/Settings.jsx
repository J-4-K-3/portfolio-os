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

import "./Settings.css";

function SettingRow({
  label,
  description,
  value,
  children,
}) {
  return (
    <div className="phone-settings__row">
      <div className="phone-settings__row-info">
        <strong>{label}</strong>

        {description && (
          <span>{description}</span>
        )}
      </div>

      {value !== undefined && (
        <span className="phone-settings__value">
          {value}
        </span>
      )}

      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}) {
  return (
    <button
      type="button"
      className={[
        "phone-settings__toggle",
        checked
          ? "phone-settings__toggle--active"
          : "",
      ].join(" ")}
      onClick={() =>
        onChange(!checked)
      }
      aria-pressed={checked}
    >
      <span />
    </button>
  );
}

export default function Settings() {
  const {
    systemState,
    updateSystemState,
  } = useSystemState();

  const {
    openHome,
  } = useSurfaceManager();

  const {
    isTablet,
    isPhone,
    isTouchDevice,
  } = useDevice();

  const update = (
    key,
    value
  ) => {
    updateSystemState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <section
      className={[
        "phone-settings",
        isTablet
          ? "phone-settings--tablet"
          : "",
      ].join(" ")}
    >
      <div className="phone-settings__background" />

      <main className="phone-settings__panel">
        <header className="phone-settings__header">
          <div>
            <span className="phone-settings__eyebrow">
              XIAOMI HYPEROS
            </span>

            <h1>Settings</h1>

            <p>
              Personalize your Xiaomi phone.

            </p>
          </div>

          <button
            type="button"
            className="phone-settings__close"
            onClick={openHome}
            aria-label="Close Settings"
          >
            ×
          </button>
        </header>

        <section className="phone-settings__section">
          <span className="phone-settings__section-title">
            APPEARANCE
          </span>

          <div className="phone-settings__card">
            <SettingRow
              label="Theme"
              description="System appearance"
              value={
                systemState.theme ===
                "dark"
                  ? "Dark"
                  : "Light"
              }
            >
              <Toggle
                checked={
                  systemState.theme ===
                  "dark"
                }
                onChange={(value) =>
                  update(
                    "theme",
                    value
                      ? "dark"
                      : "light"
                  )
                }
              />
            </SettingRow>
          </div>
        </section>

        <section className="phone-settings__section phone-settings__section--wallpaper">
          <span className="phone-settings__section-title">HOME SCREEN WALLPAPER</span>
          <div className="phone-settings__wallpapers">
            {[["aurora", "Aurora"], ["sunset", "Sunset"], ["ocean", "Ocean"], ["midnight", "Midnight"]].map(([value, label]) => <button type="button" key={value} className={`phone-settings__wallpaper phone-settings__wallpaper--${value}${(systemState.wallpaper || "aurora") === value ? " is-active" : ""}`} onClick={() => update("wallpaper", value)} aria-pressed={(systemState.wallpaper || "aurora") === value}><span /><small>{label}</small></button>)}
          </div>
        </section>

        {isPhone && isTouchDevice && <section className="phone-settings__section">
          <span className="phone-settings__section-title">TOUCH</span>
          <div className="phone-settings__card">
            <SettingRow label="Touch sensitivity" description="Swipe response for this touchscreen" value={`${systemState.touchSensitivity ?? 58}%`}>
              <input className="phone-settings__range" type="range" min="20" max="90" value={systemState.touchSensitivity ?? 58} onChange={(event) => update("touchSensitivity", Number(event.target.value))} aria-label="Touch sensitivity" />
            </SettingRow>
          </div>
        </section>}
        <section className="phone-settings__section">
          <span className="phone-settings__section-title">
            CONNECTIVITY
          </span>

          <div className="phone-settings__card">
            <SettingRow
              label="Network"
              description="Internet connection"
              value={
                systemState.network ===
                "online"
                  ? "Online"
                  : "Offline"
              }
            >
              <Toggle
                checked={
                  systemState.network ===
                  "online"
                }
                onChange={(value) =>
                  update(
                    "network",
                    value
                      ? "online"
                      : "offline"
                  )
                }
              />
            </SettingRow>

            <SettingRow
              label="Bluetooth"
              description="Nearby device connections"
            >
              <Toggle
                checked={
                  systemState.bluetooth
                }
                onChange={(value) =>
                  update(
                    "bluetooth",
                    value
                  )
                }
              />
            </SettingRow>

            <SettingRow
              label="Airplane Mode"
              description="Disable wireless connections"
            >
              <Toggle
                checked={
                  systemState.airplaneMode
                }
                onChange={(value) =>
                  update(
                    "airplaneMode",
                    value
                  )
                }
              />
            </SettingRow>
          </div>
        </section>

        <section className="phone-settings__section">
          <span className="phone-settings__section-title">
            SOUND & HAPTICS
          </span>

          <div className="phone-settings__card">
            <SettingRow
              label="Sound"
              description="System sounds"
            >
              <Toggle
                checked={
                  systemState.sound
                }
                onChange={(value) =>
                  update(
                    "sound",
                    value
                  )
                }
              />
            </SettingRow>

            <SettingRow
              label="Vibration"
              description="Touch feedback"
            >
              <Toggle
                checked={
                  systemState.vibration
                }
                onChange={(value) =>
                  update(
                    "vibration",
                    value
                  )
                }
              />
            </SettingRow>
          </div>
        </section>

        <section className="phone-settings__section">
          <span className="phone-settings__section-title">
            DISPLAY
          </span>

          <div className="phone-settings__card">
            <SettingRow
              label="Brightness"
              value={`${systemState.brightness}%`}
            >
              <input
                className="phone-settings__range"
                type="range"
                min="10"
                max="100"
                value={
                  systemState.brightness
                }
                onChange={(event) =>
                  update(
                    "brightness",
                    Number(
                      event.target.value
                    )
                  )
                }
                aria-label="Brightness"
              />
            </SettingRow>

            <SettingRow
              label="Volume"
              value={`${systemState.volume}%`}
            >
              <input
                className="phone-settings__range"
                type="range"
                min="0"
                max="100"
                value={
                  systemState.volume
                }
                onChange={(event) =>
                  update(
                    "volume",
                    Number(
                      event.target.value
                    )
                  )
                }
                aria-label="Volume"
              />
            </SettingRow>
          </div>
        </section>

        <section className="phone-settings__section">
          <span className="phone-settings__section-title">
            SYSTEM
          </span>

          <div className="phone-settings__card">
            <SettingRow
              label="Language"
              description="System language"
              value={
                systemState.language?.toUpperCase() ??
                "EN"
              }
            />

            <SettingRow
              label="Battery"
              description="Current charge"
              value={`${systemState.battery}%`}
            />

            <SettingRow
              label="Device ID"
              description="This phone"
              value="Available"
            />

            <SettingRow
              label="Network services"
              description="Phone connectivity"
              value="Ready"
            />

            <SettingRow
              label="System"
              description="Xiaomi HyperOS"
              value="Xiaomi phone"
            />
          </div>
        </section>

        <button
          type="button"
          className="phone-settings__return"
          onClick={openHome}
        >
          Return to Home
        </button>
      </main>
    </section>
  );
}