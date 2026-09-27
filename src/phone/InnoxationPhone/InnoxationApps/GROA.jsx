import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Globe2,
  ShieldCheck,
} from "lucide-react";

const observations = [
  {
    title: "Network",
    value: "Stable",
    detail: "No unusual activity detected.",
    level: "normal",
  },
  {
    title: "Ecosystem",
    value: "Operational",
    detail: "Innoxation services are responding normally.",
    level: "normal",
  },
  {
    title: "External",
    value: "Monitor",
    detail: "Some external signals require observation.",
    level: "watch",
  },
];

export default function GROA() {
  const [active, setActive] = useState("overview");

  return (
    <section
      className="groa-app"
      style={{
        "--groa-background": "#10151a",
        "--groa-panel": "rgba(255,255,255,0.055)",
        "--groa-border": "rgba(255,255,255,0.09)",
        "--groa-text": "#f2f5f5",
        "--groa-muted": "rgba(242,245,245,0.48)",
        "--groa-accent": "#83d6a3",
        height: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--groa-background)",
        color: "var(--groa-text)",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "19px 17px 14px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              display: "grid",
              placeItems: "center",
              borderRadius: 13,
              background:
                "rgba(131,214,163,0.1)",
              border:
                "1px solid rgba(131,214,163,0.18)",
            }}
          >
            <Activity size={20} />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <strong>G.R.O.A</strong>

            <span
              style={{
                fontSize: 9,
                opacity: 0.42,
              }}
            >
              Global Risk Observation & Analysis
            </span>
          </div>
        </div>

        <ShieldCheck size={18} />
      </header>

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 17px 25px",
        }}
      >
        <section
          style={{
            padding: "14px 2px 19px",
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.15em",
              opacity: 0.4,
            }}
          >
            OBSERVATION
          </span>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "clamp(29px, 8vw, 42px)",
              lineHeight: 1,
              letterSpacing: "-0.045em",
            }}
          >
            Watch the
            <br />
            bigger picture.
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 310,
              fontSize: 11,
              lineHeight: 1.55,
              color: "var(--groa-muted)",
            }}
          >
            G.R.O.A observes signals across
            systems and organizes them into
            understandable observations.
          </p>
        </section>

        <nav
          style={{
            display: "flex",
            gap: 7,
            marginBottom: 12,
          }}
        >
          {[
            ["overview", "Overview"],
            ["signals", "Signals"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              style={{
                border:
                  active === id
                    ? "1px solid rgba(131,214,163,0.28)"
                    : "1px solid var(--groa-border)",
                borderRadius: 999,
                padding: "8px 12px",
                background:
                  active === id
                    ? "rgba(131,214,163,0.1)"
                    : "var(--groa-panel)",
                color: "inherit",
                font: "inherit",
                fontSize: 9,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {active === "overview" ? (
          <section
            style={{
              display: "grid",
              gap: 8,
            }}
          >
            {observations.map((item) => (
              <article
                key={item.title}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "34px 1fr auto",
                  alignItems: "center",
                  gap: 10,
                  padding: 12,
                  border:
                    "1px solid var(--groa-border)",
                  borderRadius: 16,
                  background:
                    "var(--groa-panel)",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 11,
                    background:
                      item.level === "watch"
                        ? "rgba(255,190,80,0.1)"
                        : "rgba(131,214,163,0.1)",
                  }}
                >
                  {item.level === "watch" ? (
                    <AlertTriangle size={16} />
                  ) : (
                    <ShieldCheck size={16} />
                  )}
                </div>

                <div>
                  <strong
                    style={{
                      display: "block",
                      fontSize: 11,
                    }}
                  >
                    {item.title}
                  </strong>

                  <span
                    style={{
                      display: "block",
                      marginTop: 3,
                      fontSize: 9,
                      lineHeight: 1.4,
                      color:
                        "var(--groa-muted)",
                    }}
                  >
                    {item.detail}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 750,
                    color:
                      item.level === "watch"
                        ? "#e7bd68"
                        : "var(--groa-accent)",
                  }}
                >
                  {item.value}
                </span>
              </article>
            ))}
          </section>
        ) : (
          <section
            style={{
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Globe2
              size={29}
              style={{ opacity: 0.5 }}
            />

            <strong
              style={{
                marginTop: 12,
                fontSize: 13,
              }}
            >
              Signal observation
            </strong>

            <span
              style={{
                maxWidth: 270,
                marginTop: 7,
                fontSize: 10,
                lineHeight: 1.5,
                color: "var(--groa-muted)",
              }}
            >
              This surface is prepared for
              deeper G.R.O.A. observation data.
            </span>
          </section>
        )}
      </main>
    </section>
  );
}