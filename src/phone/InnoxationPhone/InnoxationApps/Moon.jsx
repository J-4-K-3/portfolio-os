import React from "react";
import { useSurfaceManager } from "../Core/useSurfaceManager";

const MOON_STYLE = {
  width: "100%",
  height: "100%",
  overflow: "auto",
  padding: "24px 20px 40px",
  boxSizing: "border-box",
  background:
    "radial-gradient(circle at 50% 0%, rgba(123, 108, 255, .2), transparent 38%), linear-gradient(160deg, #0b0a18, #07070d)",
  color: "#fff",
};

const cardStyle = {
  padding: "18px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,.08)",
  background: "rgba(255,255,255,.045)",
};

export default function Moon() {
  const { goBack } = useSurfaceManager();

  return (
    <main style={MOON_STYLE}>
      <button
        onClick={goBack}
        style={{
          width: 40,
          height: 40,
          border: 0,
          borderRadius: "50%",
          background: "rgba(255,255,255,.08)",
          color: "#fff",
          fontSize: 28,
          cursor: "pointer",
        }}
        aria-label="Go back"
      >
        ‹
      </button>

      <div
        style={{
          maxWidth: 600,
          margin: "38px auto 0",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 92,
            height: 92,
            margin: "0 auto 24px",
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 30%, #ffffff, #a99cff 42%, #5447a8)",
            boxShadow: "0 0 80px rgba(116,101,255,.25)",
            fontSize: 40,
          }}
        >
          ☾
        </div>

        <p
          style={{
            margin: 0,
            color: "#a99cff",
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 3,
          }}
        >
          INNOXATION
        </p>

        <h1
          style={{
            margin: "10px 0 0",
            fontSize: 44,
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          Moon
        </h1>

        <p
          style={{
            margin: "16px auto 0",
            maxWidth: 420,
            color: "rgba(255,255,255,.5)",
            fontSize: 13,
            lineHeight: 1.7,
          }}
        >
          A quiet space for the moments when you want
          everything around you to slow down.
        </p>

        <div
          style={{
            display: "grid",
            gap: 10,
            marginTop: 30,
            textAlign: "left",
          }}
        >
          <div style={cardStyle}>
            <strong style={{ fontSize: 14 }}>
              Tonight
            </strong>

            <p
              style={{
                margin: "8px 0 0",
                color: "rgba(255,255,255,.45)",
                fontSize: 11,
                lineHeight: 1.6,
              }}
            >
              Your personal Moon space is ready.
              Relax, reflect and disconnect.
            </p>
          </div>

          <div style={cardStyle}>
            <strong style={{ fontSize: 14 }}>
              Your space
            </strong>

            <p
              style={{
                margin: "8px 0 0",
                color: "rgba(255,255,255,.45)",
                fontSize: 11,
                lineHeight: 1.6,
              }}
            >
              Moon will eventually connect your
              personal experience across the Innoxation
              ecosystem.
            </p>
          </div>
        </div>

        <button
          style={{
            width: "100%",
            minHeight: 48,
            marginTop: 16,
            border: 0,
            borderRadius: 15,
            background: "#8d80ff",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Enter Moon
        </button>
      </div>
    </main>
  );
}