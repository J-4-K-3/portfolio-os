import React from "react";

import {
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(
    error
  ) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(
    error,
    errorInfo
  ) {
    console.error(
      "Innoxation OS error:",
      error,
      errorInfo
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (
      !this.state.hasError
    ) {
      return this.props.children;
    }

    return (
      <main
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          color: "#fff",
          fontFamily:
            "Inter, system-ui, sans-serif",
        }}
      >
        <section
          style={{
            width: "min(420px, calc(100vw - 40px))",
            padding: "34px",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: "16px",
            background: "rgba(255,255,255,.04)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              margin: "0 auto 18px",
              display: "grid",
              placeItems: "center",
              borderRadius: "12px",
              background:
                "rgba(255,255,255,.07)",
              color: "#aaa",
            }}
          >
            <AlertTriangle
              size={21}
            />
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Something went wrong.
          </h1>

          <p
            style={{
              margin:
                "10px 0 22px",
              color: "#777",
              fontSize: "11px",
              lineHeight: 1.6,
            }}
          >
            The virtual environment
            encountered an unexpected
            error.
          </p>

          <button
            type="button"
            onClick={
              this.handleReload
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding:
                "9px 14px",
              border: 0,
              borderRadius: "7px",
              background: "#fff",
              color: "#17171a",
              fontSize: "10px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RotateCcw
              size={13}
            />

            Restart environment
          </button>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;