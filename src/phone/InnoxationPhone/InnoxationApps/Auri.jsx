import React from "react";
import { useSurfaceManager } from "../Core/useSurfaceManager";
import "./Auri.css";

const FEATURES = [
  {
    icon: "✦",
    title: "Calm by design",
    text: "No endless feed. No algorithm chasing your attention.",
  },
  {
    icon: "◌",
    title: "Your space",
    text: "Explore communities, games, peaks and moments at your own pace.",
  },
  {
    icon: "⌁",
    title: "Connected",
    text: "Auri is part of the wider Innoxation ecosystem.",
  },
];

export default function Auri() {
  const { goBack } = useSurfaceManager();

  return (
    <main className="auri-app">
      <header className="auri-app__header">
        <button
          className="auri-app__back"
          onClick={goBack}
          aria-label="Go back"
        >
          ‹
        </button>

        <div className="auri-app__brand">
          <span className="auri-app__logo">A</span>

          <div>
            <strong>Auri</strong>
            <span>Innoxation</span>
          </div>
        </div>

        <button
          className="auri-app__menu"
          aria-label="More options"
        >
          •••
        </button>
      </header>

      <section className="auri-app__hero">
        <div className="auri-app__orb">
          <span>✦</span>
        </div>

        <p className="auri-app__eyebrow">
          WELCOME TO AURI
        </p>

        <h1>
          A calmer place
          <br />
          to be yourself.
        </h1>

        <p className="auri-app__description">
          Discover things worth experiencing without
          fighting an algorithm for your attention.
        </p>

        <div className="auri-app__actions">
          <button className="auri-app__primary">
            Explore Auri
          </button>

          <button className="auri-app__secondary">
            Community
          </button>
        </div>
      </section>

      <section className="auri-app__features">
        {FEATURES.map((feature) => (
          <article
            className="auri-app__feature"
            key={feature.title}
          >
            <span className="auri-app__feature-icon">
              {feature.icon}
            </span>

            <div>
              <h2>{feature.title}</h2>
              <p>{feature.text}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}