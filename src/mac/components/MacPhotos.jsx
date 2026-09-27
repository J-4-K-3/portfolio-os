import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Sidebar,
  Heart,
  Image as ImageIcon,
  Folder,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";

import "./MacPhotos.css";

const albums = [
  {
    id: "library",
    name: "Library",
    icon: ImageIcon,
    count: 24,
  },
  {
    id: "favorites",
    name: "Favorites",
    icon: Heart,
    count: 8,
  },
  {
    id: "projects",
    name: "Projects",
    icon: Folder,
    count: 12,
  },
];

const media = [
  {
    id: 1,
    title: "Innoxation",
    type: "image",
    className: "photo-gradient-one",
  },
  {
    id: 2,
    title: "Auri",
    type: "image",
    className: "photo-gradient-two",
  },
  {
    id: 3,
    title: "Natter",
    type: "image",
    className: "photo-gradient-three",
  },
  {
    id: 4,
    title: "G.R.O.A",
    type: "image",
    className: "photo-gradient-four",
  },
  {
    id: 5,
    title: "Appgrade",
    type: "image",
    className: "photo-gradient-five",
  },
  {
    id: 6,
    title: "Moon",
    type: "image",
    className: "photo-gradient-six",
  },
  {
    id: 7,
    title: "Telvin",
    type: "image",
    className: "photo-gradient-seven",
  },
  {
    id: 8,
    title: "Innoxation Phone",
    type: "image",
    className: "photo-gradient-eight",
  },
];

function MacPhotos() {
  const [activeAlbum, setActiveAlbum] = useState("library");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const viewerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredMedia = media.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );
  const navigate = (delta) => {
    const index = media.findIndex((item) => item.id === selectedPhoto?.id);
    setSelectedPhoto(media[(index + delta + media.length) % media.length]);
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await viewerRef.current?.requestFullscreen();
    } catch { /* Fullscreen can be unavailable in embedded previews. */ }
  };
  useEffect(() => {
    const sync = () => setIsFullscreen(document.fullscreenElement === viewerRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  useEffect(() => {
    const keydown = (event) => {
      if (!selectedPhoto) return;
      if (event.key === "Escape") setSelectedPhoto(null);
      if (event.key === "ArrowRight") navigate(1);
      if (event.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [selectedPhoto]);

  return (
    <div className="mac-photos">
      <header className="mac-photos-toolbar">
        <div className="mac-photos-toolbar-left">
          <button
            className="mac-photos-toolbar-button"
            onClick={() => setSidebarOpen((value) => !value)}
          >
            <Sidebar size={17} />
          </button>

          <button className="mac-photos-navigation">
            <ChevronLeft size={17} />
          </button>

          <button className="mac-photos-navigation">
            <ChevronRight size={17} />
          </button>

          <span className="mac-photos-title">
            Photos
          </span>
        </div>

        <div className="mac-photos-search">
          <Search size={15} />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
          />
        </div>
      </header>

      <div className="mac-photos-body">
        {sidebarOpen && (
          <aside className="mac-photos-sidebar">
            <div className="mac-photos-sidebar-heading">
              LIBRARY
            </div>

            {albums.map((album) => {
              const Icon = album.icon;

              return (
                <button
                  key={album.id}
                  className={`mac-photos-album ${
                    activeAlbum === album.id ? "active" : ""
                  }`}
                  onClick={() => setActiveAlbum(album.id)}
                >
                  <Icon size={16} />

                  <span>{album.name}</span>

                  <small>{album.count}</small>
                </button>
              );
            })}
          </aside>
        )}

        <main className="mac-photos-content">
          <div className="mac-photos-heading">
            <div>
              <h1>
                {activeAlbum === "library"
                  ? "Library"
                  : albums.find(
                      (album) => album.id === activeAlbum
                    )?.name}
              </h1>

              <p>
                {filteredMedia.length} items
              </p>
            </div>
          </div>

          <div className="mac-photos-grid">
            {filteredMedia.map((item) => (
              <button
                key={item.id}
                className="mac-photo-card"
                onClick={() => setSelectedPhoto(item)}
              >
                <div
                  className={`mac-photo-preview ${item.className}`}
                >
                  <ImageIcon size={28} />
                </div>

                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </main>
      </div>

      {selectedPhoto && (
        <div
          ref={viewerRef}
          className="mac-photo-viewer"
          onClick={() => setSelectedPhoto(null)}
        >
          <header className="mac-photo-viewer-toolbar" onClick={(event) => event.stopPropagation()}>
            <div><strong>{selectedPhoto.title}</strong><small>{media.findIndex((item) => item.id === selectedPhoto.id) + 1} of {media.length}</small></div>
            <div><button type="button" onClick={() => navigate(-1)} aria-label="Previous photo"><ChevronLeft size={18} /></button><button type="button" onClick={() => navigate(1)} aria-label="Next photo"><ChevronRight size={18} /></button><button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>{isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}</button><button type="button" onClick={() => setSelectedPhoto(null)} aria-label="Close viewer"><X size={17} /></button></div>
          </header>
          <button type="button" className="mac-photo-viewer-arrow previous" onClick={(event) => { event.stopPropagation(); navigate(-1); }} aria-label="Previous photo"><ChevronLeft size={28} /></button>
          <div className={`mac-photo-viewer-image ${selectedPhoto.className}`} onClick={(event) => event.stopPropagation()}><ImageIcon size={72} /><span>{selectedPhoto.title}</span></div>
          <button type="button" className="mac-photo-viewer-arrow next" onClick={(event) => { event.stopPropagation(); navigate(1); }} aria-label="Next photo"><ChevronRight size={28} /></button>
        </div>
      )}
    </div>
  );
}

export default MacPhotos;