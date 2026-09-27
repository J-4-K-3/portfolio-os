import React, { useState } from "react";
import {
  Wifi,
  Bluetooth,
  Bell,
  Palette,
  Lock,
  Monitor,
  User,
  Battery,
  Search,
} from "lucide-react";

import "./MacSettings.css";

const settings = [
  {
    id: "general",
    label: "General",
    icon: Palette,
    description: "System appearance and behavior",
  },
  {
    id: "wifi",
    label: "Wi-Fi",
    icon: Wifi,
    description: "Connected to Innoxation Network",
  },
  {
    id: "bluetooth",
    label: "Bluetooth",
    icon: Bluetooth,
    description: "Bluetooth devices",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Alerts and notification behavior",
  },
  {
    id: "display",
    label: "Displays",
    icon: Monitor,
    description: "Resolution and display settings",
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: Lock,
    description: "Security and privacy controls",
  },
  {
    id: "users",
    label: "Users & Accounts",
    icon: User,
    description: "Account settings",
  },
];

function MacSettings() {
  const [activeSetting, setActiveSetting] = useState("general");
  const [search, setSearch] = useState("");

  const filteredSettings = settings.filter((setting) =>
    setting.label
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const active =
    settings.find(
      (setting) => setting.id === activeSetting
    ) || settings[0];

  const ActiveIcon = active.icon;

  return (
    <div className="mac-settings">
      <aside className="mac-settings-sidebar">
        <div className="mac-settings-profile">
          <div className="mac-settings-avatar">
            J
          </div>

          <div>
            <strong>Jacob</strong>
            <span>Apple Account</span>
          </div>
        </div>

        <div className="mac-settings-search">
          <Search size={14} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search"
          />
        </div>

        <div className="mac-settings-list">
          {filteredSettings.map((setting) => {
            const Icon = setting.icon;

            return (
              <button
                key={setting.id}
                className={
                  activeSetting === setting.id
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveSetting(setting.id)
                }
              >
                <Icon size={17} />
                <span>{setting.label}</span>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="mac-settings-content">
        <div className="mac-settings-heading">
          <div className="mac-settings-heading-icon">
            <ActiveIcon size={25} />
          </div>

          <div>
            <h1>{active.label}</h1>
            <p>{active.description}</p>
          </div>
        </div>

        {active.id === "general" && (
          <section className="mac-settings-card">
            <div>
              <strong>Appearance</strong>
              <p>Choose how Innoxation Mac looks.</p>
            </div>

            <div className="mac-settings-segment">
              <button className="selected">
                Light
              </button>
              <button>Dark</button>
              <button>Auto</button>
            </div>
          </section>
        )}

        {active.id === "wifi" && (
          <section className="mac-settings-card">
            <Wifi size={22} />

            <div>
              <strong>Innoxation Network</strong>
              <p>
                Connected · Private network
              </p>
            </div>

            <span className="mac-settings-status">
              Connected
            </span>
          </section>
        )}

        {active.id === "bluetooth" && (
          <section className="mac-settings-card">
            <Bluetooth size={22} />

            <div>
              <strong>Bluetooth</strong>
              <p>
                Bluetooth is currently available.
              </p>
            </div>

            <button className="mac-settings-toggle active">
              <span />
            </button>
          </section>
        )}

        {active.id === "notifications" && (
          <section className="mac-settings-card">
            <Bell size={22} />

            <div>
              <strong>Notifications</strong>
              <p>
                Manage how applications notify you.
              </p>
            </div>
          </section>
        )}

        {active.id === "display" && (
          <section className="mac-settings-card">
            <Monitor size={22} />

            <div>
              <strong>Built-in Display</strong>
              <p>
                2560 × 1600 · Default resolution
              </p>
            </div>
          </section>
        )}

        {active.id === "privacy" && (
          <section className="mac-settings-card">
            <Lock size={22} />

            <div>
              <strong>Privacy & Security</strong>
              <p>
                Your system permissions and security
                settings.
              </p>
            </div>
          </section>
        )}

        {active.id === "users" && (
          <section className="mac-settings-card">
            <User size={22} />

            <div>
              <strong>Jacob</strong>
              <p>Administrator · This Mac</p>
            </div>
          </section>
        )}

        <section className="mac-settings-about">
          <Battery size={17} />

          <div>
            <strong>Innoxation Mac</strong>
            <span>
              Apple Silicon · Innoxation Environment
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MacSettings;