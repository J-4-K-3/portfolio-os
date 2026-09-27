import {
  ArrowLeft,
  ArrowRight,
  Plus,
  RotateCw,
  Search,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useState } from "react";

import "./MacSafari.css";

function MacSafari({ initialUrl = "innoxation://home" }) {
  const [url, setUrl] = useState(initialUrl);
  const [submittedUrl, setSubmittedUrl] = useState(initialUrl);
  useEffect(() => { setUrl(initialUrl); setSubmittedUrl(initialUrl); }, [initialUrl]);

  const navigate = () => {
    const value =
      url.trim();

    if (!value) {
      return;
    }

    setSubmittedUrl(value);
  };

  return (
    <div className="mac-safari">
      <header className="mac-safari-toolbar">
        <div className="mac-safari-navigation">
          <button
            type="button"
            disabled
          >
            <ArrowLeft size={15} />
          </button>

          <button
            type="button"
            disabled
          >
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            onClick={() =>
              setSubmittedUrl(
                submittedUrl
              )
            }
          >
            <RotateCw size={14} />
          </button>
        </div>

        <div className="mac-safari-address">
          <ShieldCheck
            size={13}
          />

          <input
            value={url}
            onChange={(event) =>
              setUrl(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (
                event.key ===
                "Enter"
              ) {
                navigate();
              }
            }}
            aria-label="Address"
          />

          <Search size={13} />
        </div>

        <button
          type="button"
          className="mac-safari-new-tab"
        >
          <Plus size={15} />
        </button>
      </header>

      <main className="mac-safari-page">
        <div className="mac-safari-page-glow" />

        <span className="mac-safari-eyebrow">
          INNOXATION BROWSER
        </span>

        <h1>
          {submittedUrl ===
          "innoxation://home"
            ? "Welcome to Innoxation."
            : submittedUrl}
        </h1>

        <p>
          This is the Mac edition of
          your virtual browser.
        </p>

        <div className="mac-safari-cards">
          <div>
            <strong>
              TechID
            </strong>

            <span>
              One identity across
              Innoxation.
            </span>
          </div>

          <div>
            <strong>
              IIC
            </strong>

            <span>
              Connected Innoxation
              experiences.
            </span>
          </div>

          <div>
            <strong>
              Portfolio
            </strong>

            <span>
              Explore Jacob's work.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MacSafari;