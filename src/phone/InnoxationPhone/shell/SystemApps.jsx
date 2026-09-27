import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Code2,
  ExternalLink,
  Globe2,
  Music2,
  Pause,
  Play,
  Search,
  UserRound
} from "lucide-react";
import { projectFiles } from "../../../data/projectFiles";
import { useSurfaceManager } from "../Core/useSurfaceManager";
import "./SystemApps.css";

function PhonePage({ title, eyebrow, icon: Icon, children }) {
  const { goBack } = useSurfaceManager();
  return (<main className="xiaomi-app">
    <header className="xiaomi-app__header">
      <button type="button" onClick={goBack} aria-label="Back">
        <ArrowLeft size={19} />
      </button>
      <div>
        <small>{eyebrow || "XIAOMI HYPEROS"}</small>
        <h1>{title}</h1>
      </div>
      {Icon && <Icon size={20} />}
    </header>
    <div className="xiaomi-app__body">{children}</div>
  </main>);
}

function ClockApp() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);
  const format = (zone) => new Intl.DateTimeFormat(undefined, { timeZone: zone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(now);
  return (
    <PhonePage title="Clock" icon={Clock3}>
      <div className="xiaomi-clock__hero">
        <span>Local time</span>
        <strong>
          {format(Intl.DateTimeFormat().resolvedOptions().timeZone)}
        </strong>
        <small>{Intl.DateTimeFormat().resolvedOptions().timeZone || "Device time zone"}</small>
      </div>
      <article className="xiaomi-clock__world">
        <div>
          <span className="xiaomi-utility-icon">
            <Globe2 size={19} />
          </span><span>
            <strong>Lubumbashi</strong>
            <small>Democratic Republic of the Congo</small>
          </span>
        </div>
        <strong>{format("Africa/Lubumbashi")}</strong>
      </article>
      <p className="xiaomi-app__note">Both clocks follow the time zones reported by your device and Lubumbashi.</p>
    </PhonePage>
  );
}

function ContactsApp() {
  return (
    <PhonePage title="Google Contacts" icon={UserRound}>
      <label className="xiaomi-contact">
        <span className="xiaomi-contact__avatar">JM</span>
        <span>
          <strong>Jacob Mon</strong>
          <small>My contact</small>
          <b>+860 020 805</b>
        </span>
      </label>
      <a className="xiaomi-contact__call" href="tel:+243860020805">Call Jacob</a>
      <p className="xiaomi-app__note">This contact card contains the number provided for the portfolio.</p>
    </PhonePage>
  );
}

function MusicApp() {
  const audioRef = useRef(null);
  const [track, setTrack] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [url, setUrl] = useState("");
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  const chooseTrack = (event) => { const file = event.target.files?.[0]; if (!file) return; if (url) URL.revokeObjectURL(url); const next = URL.createObjectURL(file); setUrl(next); setTrack(file.name); setPlaying(false); };
  const togglePlayback = async () => { if (!audioRef.current) return; if (playing) { audioRef.current.pause(); setPlaying(false); } else { try { await audioRef.current.play(); setPlaying(true); } catch { setPlaying(false); } } };
  return (
    <PhonePage title="Xiaomi Music" icon={Music2}>
      <div className="xiaomi-music__art">
        <Music2 size={42} />
        <span>MI MUSIC</span>
      </div>
      <div className="xiaomi-music__track">
        <strong>{track || "Choose a track"}</strong>
        <small>{track ? "On this device" : "Listen to an audio file from your phone"}</small>
      </div>
      <div className="xiaomi-music__controls">
        <label className="xiaomi-music__choose">Add music
          <input type="file" accept="audio/*" onChange={chooseTrack} />
        </label>
        <button type="button" disabled={!track} onClick={togglePlayback} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause size={20} /> : <Play size={20} />}</button>
      </div>
      {url && <audio ref={audioRef} src={url} onEnded={() => setPlaying(false)} controls />}

    </PhonePage>
  );
}

function VSCodeMobile() {
  const paths = Object.keys(projectFiles).filter((path) => /\.(jsx?|tsx?|css|json|md|html)$/i.test(path)).sort();
  const [active, setActive] = useState(() => { try { const requested = sessionStorage.getItem("xiaomi-code-file"); sessionStorage.removeItem("xiaomi-code-file"); if (requested && projectFiles[requested]) return requested; } catch { } return paths.includes("src/App.jsx") ? "src/App.jsx" : paths[0]; });
  const [query, setQuery] = useState("");
  const shown = paths.filter((path) => path.toLowerCase().includes(query.toLowerCase()));
  return (
    <PhonePage title="VS Code" eyebrow="PORTFOLIO WORKSPACE" icon={Code2}>
      <label className="xiaomi-code__search">
        <Search size={16} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a project file" />
      </label>
      <div className="xiaomi-code__layout">
        <nav className="xiaomi-code__files" aria-label="Project files">
          {shown.slice(0, 100).map((path) =>
            <button type="button" key={path} className={path === active ? "is-active" : ""} onClick={() => setActive(path)}>{path.split("/").pop()}
            </button>)}
        </nav>
        <section className="xiaomi-code__editor">
          <small>{active}</small>
          <pre>{projectFiles[active] || "Choose a file from the explorer."}</pre>
        </section>
      </div>
    </PhonePage>
  );
}

function BrowserApp() {
  const [address, setAddress] = useState(() => {
    try {
      return sessionStorage.getItem("xiaomi-browser-query") || "";
    } catch {
      return "";
    }
  });

  const [url, setUrl] = useState("");

  const makeTarget = (value) =>
    /^https?:\/\//i.test(value)
      ? value
      : value.includes(".") && !value.includes(" ")
        ? `https://${value}`
        : `https://www.google.com/search?q=${encodeURIComponent(value)}`;

  useEffect(() => {
    if (address) {
      setUrl(makeTarget(address));

      try {
        sessionStorage.removeItem("xiaomi-browser-query");
      } catch { }
    }
  }, []);

  const navigate = (event) => {
    event.preventDefault();

    const value = address.trim();

    if (!value) return;

    const target = makeTarget(value);

    setUrl(target);
    setAddress(target);
  };

  return (
    <PhonePage title="Opera Browser" icon={Globe2}>
      <form className="xiaomi-browser__address" onSubmit={navigate}>
        <Search size={16} />

        <input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Search or enter address"
        />

        <button type="submit" aria-label="Go">
          <ExternalLink size={16} />
        </button>
      </form>

      {url ? (
        <>
          <iframe
            className="xiaomi-browser__frame"
            title="Mobile browser page"
            src={url}
            referrerPolicy="no-referrer"
          />

          <a
            className="xiaomi-browser__open"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            Open this page outside the phone browser
          </a>
        </>
      ) : (
        <div className="xiaomi-browser__welcome">
          <Globe2 size={36} />

          <strong>Browse the web</strong>

          <span>
            Open a site or search from the address bar.
          </span>

          <div>
            <button
              type="button"
              onClick={() => {
                setAddress("https://github.com");
                setUrl("https://github.com");
              }}
            >
              GitHub
            </button>

            <button
              type="button"
              onClick={() => {
                setAddress("https://www.linkedin.com");
                setUrl("https://www.linkedin.com");
              }}
            >
              LinkedIn
            </button>
          </div>
        </div>
      )}
    </PhonePage>
  );
}

export default function SystemApps({ appId }) {
  if (appId === "clock") return <ClockApp />;
  if (appId === "contacts") return <ContactsApp />;
  if (appId === "music") return <MusicApp />;
  if (appId === "vscode") return <VSCodeMobile />;
  if (appId === "browser") return <BrowserApp />;
  return null;
}