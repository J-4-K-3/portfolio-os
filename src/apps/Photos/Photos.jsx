import { useEffect, useMemo, useRef, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Info,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RotateCw,
  X,
} from "lucide-react";

import auriLogo from '../../assets/app_icons/auri_logo.png'
import natterLogo from '../../assets/app_icons/natter_logo.png'
import telvinLogo from '../../assets/app_icons/telvin_logo.png'

import "./Photos.css";

const photos = [
  {
    id: "portfolio-desktop",
    name: "Portfolio Desktop",
    type: "PNG Image",
    dimensions: "1920 × 1080",
    size: "2.4 MB",
    category: "Portfolio",
    path: "/Pictures/Portfolio Desktop.png",
    description:
      "Jacob's virtual Windows environment and interactive portfolio workspace.",
    src: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1920&q=90",
  },
  {
    id: "innoxation",
    name: "Innoxation",
    type: "PNG Image",
    dimensions: "1600 × 900",
    size: "1.8 MB",
    category: "Innoxation",
    path: "/Pictures/Innoxation.png",
    description:
      "Innoxation branding and technology ecosystem showcase.",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "auri",
    name: "Auri",
    type: "PNG Image",
    dimensions: "1600 × 1000",
    size: "1.6 MB",
    category: "Projects",
    path: "/Pictures/Auri.png",
    description:
      "Auri — a calm social and entertainment experience within the Innoxation ecosystem.",
    src: auriLogo,
  },
  {
    id: "natter",
    name: "Natter",
    type: "PNG Image",
    dimensions: "1600 × 1000",
    size: "1.9 MB",
    category: "Projects",
    path: "/Pictures/Natter.png",
    description:
      "Natter — a privacy-focused social platform built by Innoxation.",
    src: natterLogo,
  },
  {
    id: "groa",
    name: "G.R.O.A.",
    type: "PNG Image",
    dimensions: "1600 × 1000",
    size: "2.1 MB",
    category: "Projects",
    path: "/Pictures/GROA.png",
    description:
      "Global Risk Observation & Analysis interface.",
    src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "telvin",
    name: "Telvin",
    type: "PNG Image",
    dimensions: "1600 × 1000",
    size: "1.7 MB",
    category: "Projects",
    path: "/Pictures/Telvin.png",
    description:
      "Telvin — the official Innoxation artificial intelligence experience.",
    src: telvinLogo,
  },
];

function Photos({ initialFilePath }) {
  const [selectedId, setSelectedId] = useState(
    photos[0].id
  );

  const [viewerOpen, setViewerOpen] =
    useState(false);

  const [zoom, setZoom] = useState(1);

  const [showInfo, setShowInfo] =
    useState(false);
  const viewerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedPhoto = useMemo(
    () =>
      photos.find(
        (photo) =>
          photo.id === selectedId
      ) || photos[0],
    [selectedId]
  );

  useEffect(() => {
    if (!initialFilePath) {
      return;
    }

    const incomingName =
      initialFilePath
        .split("/")
        .pop()
        ?.toLowerCase();

    const matchingPhoto = photos.find(
      (photo) =>
        photo.name.toLowerCase() ===
        incomingName?.replace(/\.[^/.]+$/, "")
    );

    if (matchingPhoto) {
      setSelectedId(matchingPhoto.id);
      setViewerOpen(true);
    }
  }, [initialFilePath]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!viewerOpen) {
        return;
      }

      if (event.key === "Escape") {
        setViewerOpen(false);
      }

      if (event.key === "ArrowRight") {
        navigate(1);
      }

      if (event.key === "ArrowLeft") {
        navigate(-1);
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "="
      ) {
        event.preventDefault();
        setZoom((current) =>
          Math.min(current + 0.1, 2.5)
        );
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "-"
      ) {
        event.preventDefault();
        setZoom((current) =>
          Math.max(current - 0.1, 0.5)
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [viewerOpen, selectedId]);

  const navigate = (direction) => {
    const currentIndex =
      photos.findIndex(
        (photo) =>
          photo.id === selectedId
      );

    const nextIndex =
      (currentIndex + direction + photos.length) %
      photos.length;

    setSelectedId(
      photos[nextIndex].id
    );

    setZoom(1);
  };

  const openViewer = (id) => {
    setSelectedId(id);
    setZoom(1);
    setViewerOpen(true);
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await viewerRef.current?.requestFullscreen();
    } catch { /* Fullscreen can be unavailable in embedded previews. */ }
  };

  const closeViewer = async () => {
    if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} }
    setViewerOpen(false);
  };

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === viewerRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  return (
    <section className="photos-app">
      <header className="photos-toolbar">
        <div>
          <h2>Photos</h2>
          <span>
            {photos.length} items
          </span>
        </div>

        <div className="photos-toolbar-actions">
          <button
            type="button"
            onClick={() =>
              setShowInfo(
                (current) => !current
              )
            }
            className={
              showInfo
                ? "photos-tool active"
                : "photos-tool"
            }
            title="Information"
          >
            <Info size={17} />
          </button>

          <button
            type="button"
            className="photos-tool"
            title="More"
          >
            <MoreDots />
          </button>
        </div>
      </header>

      <div className="photos-body">
        <div className="photos-library">
          <div className="photos-section-title">
            <span>Collection</span>
            <span>{photos.length}</span>
          </div>

          <div className="photos-grid">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                className={
                  selectedId === photo.id
                    ? "photo-card selected"
                    : "photo-card"
                }
                onClick={() =>
                  setSelectedId(photo.id)
                }
                onDoubleClick={() =>
                  openViewer(photo.id)
                }
              >
                <div className="photo-thumbnail">
                  <img
                    src={photo.src}
                    alt={photo.name}
                  />
                </div>

                <div className="photo-card-name">
                  {photo.name}
                </div>

                <div className="photo-card-meta">
                  {photo.type}
                </div>
              </button>
            ))}
          </div>
        </div>

        {showInfo && (
          <aside className="photos-info">
            <div className="photos-info-image">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.name}
              />
            </div>

            <h3>
              {selectedPhoto.name}
            </h3>

            <p>
              {selectedPhoto.description}
            </p>

            <div className="photos-details">
              <Detail
                label="Type"
                value={selectedPhoto.type}
              />

              <Detail
                label="Dimensions"
                value={
                  selectedPhoto.dimensions
                }
              />

              <Detail
                label="Size"
                value={selectedPhoto.size}
              />

              <Detail
                label="Location"
                value={selectedPhoto.path}
              />
            </div>
          </aside>
        )}
      </div>

      {viewerOpen && (
        <div
          ref={viewerRef}
          className="photos-viewer"
          onClick={closeViewer}
        >
          <div
            className="viewer-topbar"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div>
              <strong>
                {selectedPhoto.name}
              </strong>

              <span>
                {selectedPhoto.dimensions}
              </span>
            </div>

            <div className="viewer-actions">
              <button
                type="button"
                onClick={() =>
                  setZoom((current) =>
                    Math.max(
                      current - 0.1,
                      0.5
                    )
                  )
                }
                title="Zoom out"
              >
                <Minus size={17} />
              </button>

              <span className="zoom-label">
                {Math.round(zoom * 100)}%
              </span>

              <button
                type="button"
                onClick={() =>
                  setZoom((current) =>
                    Math.min(
                      current + 0.1,
                      2.5
                    )
                  )
                }
                title="Zoom in"
              >
                <Plus size={17} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setZoom(1)
                }
                title="Reset zoom"
              >
                <RotateCw size={17} />
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              </button>

              <button
                type="button"
                onClick={closeViewer}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <button
            type="button"
            className="viewer-navigation viewer-prev"
            onClick={(event) => {
              event.stopPropagation();
              navigate(-1);
            }}
            title="Previous"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            className="viewer-canvas"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.name}
              style={{
                transform: `scale(${zoom})`,
              }}
            />
          </div>

          <button
            type="button"
            className="viewer-navigation viewer-next"
            onClick={(event) => {
              event.stopPropagation();
              navigate(1);
            }}
            title="Next"
          >
            <ChevronRight size={28} />
          </button>

          <div
            className="viewer-bottom"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <span>
              {photos.findIndex(
                (photo) =>
                  photo.id === selectedId
              ) + 1}{" "}
              of {photos.length}
            </span>

            <span>
              {selectedPhoto.category}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div className="photo-detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MoreDots() {
  return (
    <span className="more-dots">
      <i />
      <i />
      <i />
    </span>
  );
}

export default Photos;