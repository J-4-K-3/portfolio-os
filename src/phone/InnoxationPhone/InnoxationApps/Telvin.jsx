import React, { useState } from "react";
import {
  ArrowUp,
  Brain,
  Clock3,
  Sparkles,
} from "lucide-react";

import "./Telvin.css";

const suggestions = [
  "Explain something",
  "Help me build",
  "Analyze an idea",
];

const responses = {
  "Explain something":
    "Tell me what you want to understand. I can break complex ideas into smaller pieces.",
  "Help me build":
    "Absolutely. Give me the goal, the constraints, and what you already have.",
  "Analyze an idea":
    "Send me the idea. We can examine its structure, possibilities, limitations, and next steps.",
};

export default function Telvin() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const submitMessage = (value = message) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    const reply =
      responses[trimmed] ||
      `I received: "${trimmed}". This Telvin surface is ready for deeper interaction.`;

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: trimmed,
      },
      {
        role: "telvin",
        text: reply,
      },
    ]);

    setMessage("");
  };

  return (
    <section className="telvin-app">
      <div className="telvin-app__ambient">
        <div className="telvin-app__orb telvin-app__orb--one" />
        <div className="telvin-app__orb telvin-app__orb--two" />
      </div>

      <header className="telvin-app__header">
        <div className="telvin-app__brand">
          <div className="telvin-app__logo">
            <Brain size={21} />
          </div>

          <div>
            <strong>Telvin</strong>
            <span>Innoxation AI</span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Conversation history"
        >
          <Clock3 size={18} />
        </button>
      </header>

      <main className="telvin-app__content">
        {messages.length === 0 ? (
          <section className="telvin-app__welcome">
            <div className="telvin-app__welcome-icon">
              <Sparkles size={25} />
            </div>

            <span className="telvin-app__eyebrow">
              HELLO
            </span>

            <h1>
              What are we
              <br />
              creating today?
            </h1>

            <p>
              Telvin is the intelligence layer
              of the Innoxation ecosystem.
            </p>

            <div className="telvin-app__suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() =>
                    submitMessage(suggestion)
                  }
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section className="telvin-app__conversation">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`telvin-message telvin-message--${item.role}`}
              >
                {item.text}
              </div>
            ))}
          </section>
        )}
      </main>

      <footer className="telvin-app__composer">
        <input
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              submitMessage();
            }
          }}
          placeholder="Ask Telvin..."
          aria-label="Ask Telvin"
        />

        <button
          type="button"
          onClick={() => submitMessage()}
          aria-label="Send message"
        >
          <ArrowUp size={18} />
        </button>
      </footer>
    </section>
  );
}