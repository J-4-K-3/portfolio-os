import React from "react";
import { useSurfaceManager } from "../Core/useSurfaceManager";
import "./Natter.css";

const CONVERSATIONS = [
  {
    name: "Natalie",
    message: "Hey Jacob 👋 Ready to explore?",
    time: "Now",
    online: true,
  },
  {
    name: "Auri Community",
    message: "Someone shared a new Peak.",
    time: "8m",
    online: false,
  },
  {
    name: "Innoxation",
    message: "Your ecosystem is connected.",
    time: "1h",
    online: false,
  },
];

export default function Natter() {
  const { goBack } = useSurfaceManager();

  return (
    <main className="natter-app">
      <header className="natter-app__header">
        <button
          className="natter-app__back"
          onClick={goBack}
          aria-label="Go back"
        >
          ‹
        </button>

        <div className="natter-app__title">
          <strong>Natter</strong>
          <span>Conversations that matter</span>
        </div>

        <button
          className="natter-app__compose"
          aria-label="New conversation"
        >
          +
        </button>
      </header>

      <section className="natter-app__intro">
        <div className="natter-app__avatar">
          N
        </div>

        <div>
          <p className="natter-app__eyebrow">
            NATTER
          </p>

          <h1>
            Talk to
            <br />
            someone.
          </h1>

          <p>
            Meet Natalie, connect with people and keep
            your conversations in one calm place.
          </p>
        </div>
      </section>

      <section className="natter-app__conversations">
        <div className="natter-app__section-header">
          <h2>Recent</h2>
          <span>{CONVERSATIONS.length}</span>
        </div>

        {CONVERSATIONS.map((conversation) => (
          <button
            className="natter-app__conversation"
            key={conversation.name}
          >
            <div className="natter-app__conversation-avatar">
              {conversation.name.charAt(0)}
              {conversation.online && (
                <span className="natter-app__online" />
              )}
            </div>

            <div className="natter-app__conversation-body">
              <div className="natter-app__conversation-top">
                <strong>{conversation.name}</strong>
                <time>{conversation.time}</time>
              </div>

              <p>{conversation.message}</p>
            </div>

            <span className="natter-app__arrow">
              ›
            </span>
          </button>
        ))}
      </section>

      <button className="natter-app__natalie">
        <span>✦</span>

        <div>
          <strong>Talk with Natalie</strong>
          <small>Your AI companion is waiting.</small>
        </div>

        <b>›</b>
      </button>
    </main>
  );
}