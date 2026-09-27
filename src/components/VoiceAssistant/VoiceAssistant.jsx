import { useEffect, useRef, useState } from "react";
import {
  AudioLines,
  Check,
  Command,
  Keyboard,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import { interpretVoiceCommand } from "../../utils/voiceIntents";
import { streamChat } from "../../utils/geminiService";
import { playClick } from "../../utils/soundUtils";
import "./VoiceAssistant.css";

function responseForLanguage(result, language) {
  if (language !== "de") return result.response;

  const projects = {
    auri: "Auri ist Jacobs Full-Stack-Social-Plattform und mobiles Oekosystem mit React Native, Expo, Backend-Diensten und eigenentwickeltem Offline-Media-Caching. Moechtest du das Projekt oeffnen?",
    natter: "Natter ist eines von Jacobs Produktprojekten. Moechtest du die Projektuebersicht oeffnen?",
    groa: "G.R.O.A. ist eine Plattform zur Beobachtung globaler Risiken. Sie buendelt Krisen-, Erdbeben- und Wetterinformationen aus externen Quellen. Moechtest du das Projekt oeffnen?",
    normal: "N.O.R.M.A.L. ist Jacobs modulare KI-Plattform mit Generierungsablaeufen, Datenspeicherung und Sicherheitskontrollen. Moechtest du das Projekt oeffnen?",
    appgrade: "Appgrade ist eines von Jacobs Softwareprojekten. Moechtest du die Projektuebersicht oeffnen?",
  };

  if (result.pending) return projects[result.pending] || "Moechtest du dieses Projekt oeffnen?";
  if (result.action === "open_app") return ({ vscode: "Ich oeffne VS Code.", browser: "Ich oeffne Microsoft Edge.", files: "Ich oeffne den Datei-Explorer.", settings: "Ich oeffne die Einstellungen.", terminal: "Ich oeffne das Terminal.", notepad: "Ich oeffne den Editor." })[result.target] || "Anwendung wird geoeffnet.";
  if (result.action === "open_projects") return "Ich oeffne den Projektordner.";
  if (result.action === "open_resume") return "Ich oeffne Jacobs Lebenslauf im Editor.";
  if (result.action === "open_profile") return result.target === "experience" ? "Hier ist Jacobs Berufserfahrung." : result.target === "skills" ? "Jacob arbeitet in den Bereichen Full-Stack, Mobile, Backend und KI. Sein technisches Profil ist geoeffnet." : "Jacob B Mon ist Full-Stack- und KI-Engineer sowie Gruender von Innoxation. Sein Profil ist geoeffnet.";
  if (result.action === "open_project") return `Ich oeffne die Projektuebersicht ${String(result.target).toUpperCase()}.`;
  if (result.action === "open_url") return "Ich oeffne Jacobs GitHub-Profil.";
  if (result.action === "close_window") return "Ich schliesse das aktive Fenster.";
  if (/^Hello\./.test(result.response)) return "Hallo! Ich bin Telvin, Jacobs Portfolio-Assistent. Was moechtest du erkunden?";
  if (/^You're welcome/.test(result.response)) return "Gern geschehen. Was moechtest du als Naechstes ansehen?";
  if (/^I'm Telvin/.test(result.response)) return "Ich bin Telvin, ein regelbasierter Assistent, der dir Jacobs Portfolio zeigt.";
  if (/Jacob\./.test(result.response)) return "Jacob. Er fand offenbar, dass eine normale Portfolio-Website nicht ausreicht.";
  if (/No problem/.test(result.response)) return "Kein Problem. Was moechtest du dir ansehen?";
  if (/I don't know/.test(result.response)) return "Diesen Befehl kenne ich noch nicht. Du kannst eine App, ein Projekt oder Jacobs Profil oeffnen.";
  if (/Try: open/.test(result.response)) return "Versuche: Oeffne VS Code, Edge oder Projekte. Frage nach Auri oder Jacob, oder sage: Fenster schliessen.";
  if (/didn't catch/.test(result.response)) return "Ich habe den Befehl nicht verstanden. Sage zum Beispiel: Oeffne VS Code.";
  return result.response;
}

function VoiceAssistant({ onAction, label = "Voice assistant" }) {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const [lang, setLang] = useState(() => { try { return localStorage.getItem("innox_lang") === "de" ? "de" : "en"; } catch { return "en"; } });
  const [spoken, setSpoken] = useState("");
  const [recognized, setRecognized] = useState(false);
  const [draft, setDraft] = useState("");
  const [localModelState, setLocalModelState] = useState("unknown");
  const [localPreferred, setLocalPreferred] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(() => { try { return localStorage.getItem("innox_voice_output") !== "false"; } catch { return true; } });
  const [messages, setMessages] = useState
    ([{
      from: "assistant",
      text: "Hi, I'm Telvin. Try saying 'Open VS Code' or ask me about Jacob's projects."
    }]);
  const recognitionRef = useRef(null);
  const pendingRef = useRef(null);
  const listeningRef = useRef(false);
  const retryLocalRef = useRef(false);
  const abortRef = useRef(null);
  const langRef = useRef(lang);
  langRef.current = lang;
  useEffect(() => {
    const syncLang = () => {
      const next = localStorage.getItem("innox_lang") === "de" ? "de" : "en"; langRef.current = next; setLang(next);
    };
    window.addEventListener("innox-settings-change", syncLang);
    return () => window.removeEventListener("innox-settings-change", syncLang);
  }, []);
  useEffect(() => () => {
    try {
      recognitionRef.current?.abort();
    } catch { } window.speechSynthesis?.cancel();
    if (abortRef.current) {
      try { abortRef.current.abort(); } catch { /* ignore */ }
      abortRef.current = null;
    }
  }, []);
  const speak = (text) => {
    if (!speechEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langRef.current === "de" ? "de-DE" : "en-US";
    utterance.rate = 0.96; utterance.pitch = 1.02;
    window.speechSynthesis.speak(utterance);
  };
  const execute = async (text) => {
    setSpoken(text);
    setRecognized(true);
    window.setTimeout(() => setRecognized(false), 1800);

    setMessages((current) => [...current, { from: "you", text }, { from: "assistant", text: "..." }].slice(-8));

    // Rule-based interpreter still drives app actions
    const result = interpretVoiceCommand(text, pendingRef.current);
    playClick();
    if (result.pending) pendingRef.current = result.pending;
    if (result.clearPending) pendingRef.current = null;
    if (result.action) { pendingRef.current = null; onAction?.({ action: result.action, target: result.target }); }

    // Conversational reply comes from Telvin (Gemini), falling back to the
    // rule-based response when the model is unavailable or errors out.
    let answer = responseForLanguage(result, langRef.current);
    const history = messages
      .filter((message) => message.from === "you" || message.from === "assistant")
      .map((message) => ({
        role: message.from === "you" ? "user" : "assistant",
        content: message.text,
      }));

    let cancelled = false;
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat({
        message: text,
        history,
        model: "Smart",
        onDelta: (partial) => {
          if (cancelled) return;
          setMessages((current) => [...current.slice(0, -1), { from: "assistant", text: partial }].slice(-8));
        },
        signal: controller.signal,
      });
    } catch (error) {
      if (cancelled) return;
      console.warn("Telvin voice response failed, using fallback:", error);
    } finally {
      abortRef.current = null;
    }

    setMessages((current) => {
      const last = current[current.length - 1];
      if (last && last.from === "assistant" && last.text && last.text !== "...") {
        return current;
      }
      return [...current.slice(0, -1), { from: "assistant", text: answer }].slice(-8);
    });

    setMessages((current) => {
      const updated = current[current.length - 1];
      if (updated && updated.from === "assistant" && updated.text && updated.text !== "...") {
        speak(updated.text);
      }
      return current;
    });
  };
  const startListening = (forceLocal = false) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setSupported(false); setOpen(true); setMessages((current) => [...current, { from: "assistant", text: "Voice recognition is not available in this browser. You can type a command below." }].slice(-8)); return; }
    if (listeningRef.current) { recognitionRef.current?.stop(); return; }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langRef.current === "de" ? "de-DE" : "en-US";
      if ((forceLocal || localPreferred) && "processLocally" in recognition) recognition.processLocally = true;
      recognition.interimResults = true; recognition.continuous = false; recognition.maxAlternatives = 1;
      recognition.onstart = () => { listeningRef.current = true; setListening(true); setSpoken(""); };
      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const phrase = event.results[i][0].transcript;
          if (event.results[i].isFinal) { execute(phrase); interim = ""; }
          else interim += phrase;
        }
        if (interim) setSpoken(interim);
      };
      recognition.onerror = (event) => {
        const messages = {
          "not-allowed": "Microphone access is blocked. Allow it in your browser's site settings, then try again.",
          "audio-capture": "The browser could not capture audio. Check that a microphone is connected and not in use by another app.",
          "no-speech": "No speech was detected. Move closer to the microphone and try a short command.",
          network: "The browser's speech service could not be reached. Check your connection, or use on-device speech if available.",
          "service-not-allowed": "The browser blocked its speech service. Check browser privacy settings or try on-device speech.",
          "language-not-supported": `The browser does not support speech recognition in ${recognition.lang}. Change the tray language and try again.`,
          aborted: "Listening was stopped.",
        };
        const message = messages[event.error] || `Speech recognition failed (${event.error || "unknown error"}). You can retry or type a command.`;
        if (event.error !== "aborted") setMessages((current) => [...current, { from: "assistant", text: message }].slice(-8));
        if (["network", "service-not-allowed"].includes(event.error) && !forceLocal && typeof SpeechRecognition.available === "function") {
          SpeechRecognition.available({ langs: [recognition.lang], processLocally: true, quality: "command" }).then((status) => {
            if (status === "available") {
              setLocalModelState("available"); setLocalPreferred(true);
              setMessages((current) => [...current, { from: "assistant", text: "Online speech failed. Trying the available on-device model; please repeat your command." }].slice(-8));
              if (listeningRef.current) retryLocalRef.current = true;
              else window.setTimeout(() => startListening(true), 120);
            } else if (["downloadable", "downloading"].includes(status)) {
              setLocalModelState(status);
              setMessages((current) => [...current, { from: "assistant", text: status === "downloadable" ? "This browser can install an on-device speech model for this language." : "The on-device speech model is downloading. Try the microphone again when it is ready." }].slice(-8));
            } else {
              setLocalModelState("unavailable");
            }
          }).catch(() => setLocalModelState("unavailable"));
        }
      };
      recognition.onend = () => {
        listeningRef.current = false; setListening(false);
        if (retryLocalRef.current) { retryLocalRef.current = false; window.setTimeout(() => startListening(true), 120); }
      };
      recognitionRef.current = recognition; recognition.start(); setOpen(true);
    } catch (error) {
      setOpen(true);
      setMessages((current) => [...current, { from: "assistant", text: `Could not start speech recognition (${error?.name || "browser error"}). Check microphone permission and try again.` }].slice(-8));
    }
  };
  const submit = (event) => { event.preventDefault(); if (!draft.trim()) return; execute(draft); setDraft(""); };
  return (
    <div className="voice-assistant" aria-label={label}>
      {open &&
        <section className="voice-panel" aria-label="Telvin voice assistant">
          <header className="voice-panel-header">
            <div className="voice-brand">
              <span className="voice-brand-mark">
                <AudioLines size={17} />
              </span>
              <div>
                <strong>Telvin</strong>
                <small>Portfolio assistant</small>
              </div>
            </div>
            <div className="voice-header-actions">
              <button
                type="button"
                title={speechEnabled ? "Mute spoken replies" : "Enable spoken replies"}
                aria-label={speechEnabled ? "Mute spoken replies" : "Enable spoken replies"}
                onClick={() => {
                  const next = !speechEnabled; setSpeechEnabled(next);
                  localStorage.setItem("innox_voice_output", String(next));
                }}
              >
                {speechEnabled ?
                  <Volume2 size={16} /> :
                  <VolumeX size={16} />
                }
              </button>
              <button
                type="button"
                title="Close assistant"
                aria-label="Close assistant"
                onClick={() => {
                  setOpen(false);
                  if (listeningRef.current)
                    recognitionRef.current?.stop();
                }}>
                <X size={17} />
              </button>
            </div>
          </header>
          <div className="voice-status">
            <span className={listening ? "voice-pulse listening" : "voice-pulse"} /><span>
              {listening ?
                (lang === "de" ? "Ich hoere zu..." : "Listening...") :
                recognized ? (lang === "de" ? "Befehl erkannt." : "Command recognized.") :
                  spoken || (lang === "de" ? "Sag einen Befehl" : "Try saying something")}
            </span>
            <small>{lang.toUpperCase()}</small>
          </div>
          <div
            className="voice-messages"
            aria-live="polite">
            {messages.slice(-5).map((message, index) =>
              <div
                className={`voice-message ${message.from}`}
                key={`${index}-${message.text}`}>
                <span>{message.from === "you" ? "You" : "Telvin"}</span>
                <p>{message.text}</p>
              </div>
            )}
          </div>
          <div className="voice-prompt-row">
            <button
              className={`voice-listen-button ${listening ? "listening" : ""}`}
              type="button"
              onClick={startListening}
              aria-label={listening ? "Stop listening" : "Start voice command"}>
              {listening ?
                <MicOff size={19} /> :
                <Mic size={19} />
              }
            </button>
            <span>
              {listening ? "Listening - click to stop" :
                supported ? "Click the mic, or type below" : "Voice unavailable - type below"
              }
            </span>
            {localModelState === "downloadable" &&
              <button
                className="voice-local-install"
                type="button"
                onClick={async () => {
                  const SpeechRecognition = window.SpeechRecognition ||
                    window.webkitSpeechRecognition;
                  if (!SpeechRecognition?.install)
                    return; setLocalModelState("installing");
                  try {
                    const ready = await
                      SpeechRecognition
                        .install({
                          langs: [lang === "de" ? "de-DE" : "en-US"],
                          processLocally: true, quality: "command"
                        });
                    if (ready) {
                      setLocalModelState("available");
                      setLocalPreferred(true);
                      setMessages(current => [...current,
                      {
                        from: "assistant",
                        text: "On-device speech is ready. Click the microphone to try again."
                      }].slice(-8));
                    }
                    else
                      setLocalModelState("unavailable");
                  }
                  catch {
                    setLocalModelState("unavailable");
                    setMessages(current => [...current,
                    {
                      from: "assistant",
                      text: "The browser could not install its on-device speech model."
                    }].slice(-8));
                  }
                }}>
                Install on-device speech
              </button>
            }
            {localModelState === "installing" &&
              <small className="voice-local-progress">Installing...</small>
            }
            {supported && localModelState !== "downloadable" &&
              <Check size={14} />
            }
          </div>
          <form
            className="voice-command-form"
            onSubmit={submit}>
            <Keyboard size={15} />
            <input
              value={draft}
              onChange={event => setDraft(event.target.value)}
              placeholder="Type a command..." aria-label="Type a voice command" />
            <button
              type="submit"
              aria-label="Send command"
              disabled={!draft.trim()}>
              <Send size={15} />
            </button>
          </form>
          <footer
            className="voice-footer">
            <Command size={13} />
            <span>Open apps, projects, profile, GitHub, or close a window</span>
          </footer>
        </section>
      }
      <button
        type="button"
        className={`voice-launcher ${listening ? "listening" : ""} ${open ? "open" : ""}`}
        onClick={() => {
          if (!open) {
            setOpen(true);
            startListening();
          }
          else startListening();
        }}
        title="Talk to Telvin"
        aria-label="Talk to Telvin">
        <Mic size={19} />
        <span>{listening ? "Listening" : "Ask Telvin"}</span>
      </button>
    </div>
  );
}
export default VoiceAssistant;
