import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  Mic,
  Send,
  Sparkles,
  Paperclip,
  Image,
  FileText,
  X,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Smile,
} from "lucide-react";

import "./TelvinChat.css";
import { streamChat } from "../../utils/geminiService";

const MODELS = ["Smart", "Creative", "Pro"];

const WELCOME_MESSAGES = [
  "Where should we begin?",
  "What's on the agenda?",
  "What are we building today?",
  "Welcome back.",
  "Let's make something.",
  "What can I help you explore?",
];

const INITIAL_MESSAGES = [];

const TelvinChat = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("Smart");
  const [showAttachments, setShowAttachments] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const [thinkingVersion, setThinkingVersion] = useState(0);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const isDark =
    document.documentElement.classList.contains("dark") ||
    document.body.classList.contains("dark");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
    setWelcomeIndex(randomIndex);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      180
    )}px`;
  }, [input]);

  const sendMessage = async () => {
    const trimmed = input.trim();

    if (!trimmed || isThinking) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      reactions: [],
    };

    const history = messages
      .filter(
        (message) =>
          message.role === "user" || message.role === "assistant"
      )
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setHasStarted(true);
    setShowAttachments(false);
    setIsThinking(true);

    try {
      const assistantId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          version: 0,
          versions: [""],
          reactions: [],
        },
      ]);

      let fullResponse = "";

      await streamChat({
        message: trimmed,
        history,
        model,
        onDelta: (partial) => {
          fullResponse = partial;
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? {
                  ...message,
                  content: fullResponse,
                  versions: [fullResponse],
                }
                : message
            )
          );
        },
      });
    } catch (error) {
      console.error("❌ TELVIN GEMINI ERROR:", error);

      const errorContent =
        error.message ||
        "I couldn't connect to Telvin's intelligence layer.";

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: errorContent,
          version: 0,
          versions: [errorContent],
          reactions: [],
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const reactToMessage = (messageId, reaction) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id !== messageId) return message;

        const reactions = message.reactions || [];

        if (reactions.includes(reaction)) {
          return {
            ...message,
            reactions: reactions.filter((item) => item !== reaction),
          };
        }

        return {
          ...message,
          reactions: [...reactions, reaction],
        };
      })
    );
  };

  const changeThinkingVersion = (messageId, direction) => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id !== messageId || !message.versions) {
          return message;
        }

        const current = message.version || 0;
        const next =
          direction === "next"
            ? Math.min(current + 1, message.versions.length - 1)
            : Math.max(current - 1, 0);

        return {
          ...message,
          version: next,
          content: message.versions[next],
        };
      })
    );
  };

  const newChat = () => {
    setMessages([]);
    setInput("");
    setHasStarted(false);
    setIsThinking(false);
    setThinkingVersion((value) => value + 1);

    const nextIndex =
      (welcomeIndex + 1 + Math.floor(Math.random() * 3)) %
      WELCOME_MESSAGES.length;

    setWelcomeIndex(nextIndex);
  };

  return (
    <main className={`telvin-chat ${isDark ? "telvin-dark" : ""}`}>
      <div className="telvin-liquid-background">
        <span className="liquid-orb liquid-orb-one" />
        <span className="liquid-orb liquid-orb-two" />
        <span className="liquid-orb liquid-orb-three" />
        <span className="liquid-orb liquid-orb-four" />
      </div>

      {!hasStarted ? (
        <section className="telvin-empty-state">
          <div className="telvin-brand-mark">
            <Sparkles size={19} strokeWidth={1.8} />
          </div>

          <div className="telvin-welcome">
            <span className="telvin-eyebrow">TELVIN</span>

            <h1 key={thinkingVersion}>
              {WELCOME_MESSAGES[welcomeIndex]}
            </h1>

            <p>
              Your Innoxation AI, ready to think, create and explore with you.
            </p>
          </div>
        </section>
      ) : (
        <section className="telvin-conversation">
          <div className="telvin-message-list">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onReact={reactToMessage}
                onChangeVersion={changeThinkingVersion}
              />
            ))}

            {isThinking && (
              <div className="telvin-thinking">
                <div className="telvin-avatar-small">
                  <Sparkles size={14} />
                </div>

                <div className="thinking-content">
                  <span className="thinking-label">Telvin is thinking</span>

                  <div className="thinking-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </section>
      )}

      <section
        className={`telvin-composer-wrapper ${hasStarted ? "composer-active" : ""
          }`}
      >
        {showAttachments && (
          <div className="telvin-attachment-menu">
            <button type="button">
              <Image size={17} />
              <span>Image</span>
            </button>

            <button type="button">
              <FileText size={17} />
              <span>File</span>
            </button>

            <button type="button">
              <Paperclip size={17} />
              <span>Attach</span>
            </button>
          </div>
        )}

        <div className="telvin-composer">
          <button
            type="button"
            className={`composer-plus ${showAttachments ? "composer-plus-active" : ""
              }`}
            onClick={() => setShowAttachments((value) => !value)}
            aria-label="Add attachment"
          >
            {showAttachments ? <X size={19} /> : <Plus size={20} />}
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Telvin chat is currently in cooldown..."
            rows={1}
            aria-label="Message Telvin"
            disabled
            style={{ opacity: 0.4 }}
          />

          <div className="composer-actions">
            <div className="model-selector">
              {MODELS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={model === item ? "model-active" : ""}
                  onClick={() => setModel(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="composer-mic"
              aria-label="Voice input"
            >
              <Mic size={18} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              className="composer-send"
              onClick={sendMessage}
              disabled={!input.trim() || isThinking}
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </div>
        </div>

        <div className="telvin-composer-hint">
          <span>
            Telvin can make mistakes. Check important information.
          </span>

          <span className="telvin-model-indicator">
            {model} mode
          </span>
        </div>
      </section>
    </main>
  );
};

const ChatMessage = ({
  message,
  onReact,
  onChangeVersion,
}) => {
  const isUser = message.role === "user";

  return (
    <article
      className={`telvin-message ${isUser ? "message-user" : "message-telvin"
        }`}
    >
      {!isUser && (
        <div className="telvin-avatar-small">
          <Sparkles size={14} />
        </div>
      )}

      <div className="message-column">
        <div className="message-header">
          <span>{isUser ? "You" : "Telvin"}</span>
        </div>

        <div className="message-body">
          {message.content}
        </div>

        {!isUser && (
          <div className="message-tools">
            <button
              type="button"
              onClick={() => onReact(message.id, "❤️")}
              className={
                message.reactions?.includes("❤️")
                  ? "reaction-active"
                  : ""
              }
            >
              <Smile size={15} />
            </button>

            {message.versions?.length > 1 && (
              <div className="thinking-version">
                <button
                  type="button"
                  onClick={() =>
                    onChangeVersion(message.id, "previous")
                  }
                  disabled={!message.version}
                  aria-label="Previous response"
                >
                  <ChevronLeft size={15} />
                </button>

                <span>
                  {(message.version || 0) + 1}/{message.versions.length}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    onChangeVersion(message.id, "next")
                  }
                  disabled={
                    message.version === message.versions.length - 1
                  }
                  aria-label="Next response"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                onChangeVersion(message.id, "next")
              }
              aria-label="Think again"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default TelvinChat;
