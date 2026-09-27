import React, {
  useState,
} from "react";

import {
  useSurfaceManager,
} from "../Core/useSurfaceManager";

import auriLogo from "../../../assets/app_icons/auri_logo.png";
import natterLogo from "../../../assets/app_icons/natter_logo.png";
import appgradeLogo from "../../../assets/app_icons/appgrade_logo.png";
import telvinLogo from "../../../assets/app_icons/telvin_logo.png";
import auriPromo from "../../../assets/media/auri_promo.mp4";
import auriVid1 from "../../../assets/media/auri_vid_1.mp4";

import "./Photos.css";

/*
 * Gallery data.
 *
 * These use the real Innoxation app_icons and media files
 * rather than generated visual placeholders.
 */
const PHOTO_ITEMS = [
  {
    id: "auri",
    title: "Auri",
    category: "Projects",
    kind: "image",
    src: auriLogo,
    description: "Auri platform identity",
  },
  {
    id: "natter",
    title: "Natter",
    category: "Projects",
    kind: "image",
    src: natterLogo,
    description: "Natter identity",
  },
  {
    id: "appgrade",
    title: "Appgrade",
    category: "Projects",
    kind: "image",
    src: appgradeLogo,
    description: "Appgrade identity",
  },
  {
    id: "telvin",
    title: "Telvin",
    category: "AI",
    kind: "image",
    src: telvinLogo,
    description: "Telvin identity",
  },
  {
    id: "auri_promo",
    title: "Auri Promo",
    category: "Media",
    kind: "video",
    src: auriPromo,
    description: "Auri promotional video",
  },
  {
    id: "auri_vid_1",
    title: "Auri Video 1",
    category: "Media",
    kind: "video",
    src: auriVid1,
    description: "Auri feature video",
  },
];

const CATEGORIES = [
  "All",
  "Projects",
  "Media",
  "AI",
];

export default function Photos() {
  const {
    goBack,
  } = useSurfaceManager();

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("All");

  const [
    selectedPhoto,
    setSelectedPhoto,
  ] = useState(null);

  const visiblePhotos =
    activeCategory === "All"
      ? PHOTO_ITEMS
      : PHOTO_ITEMS.filter(
          (photo) =>
            photo.category ===
            activeCategory
        );

  const selectedIndex =
    selectedPhoto
      ? visiblePhotos.findIndex(
          (photo) =>
            photo.id === selectedPhoto.id
        )
      : -1;

  const closeViewer = () => {
    setSelectedPhoto(null);
  };

  const showPrevious = () => {
    if (selectedIndex < 0) {
      return;
    }

    const previous =
      visiblePhotos[
        (selectedIndex -
          1 +
          visiblePhotos.length) %
          visiblePhotos.length
      ];

    setSelectedPhoto(previous);
  };

  const showNext = () => {
    if (selectedIndex < 0) {
      return;
    }

    const next =
      visiblePhotos[
        (selectedIndex + 1) %
          visiblePhotos.length
      ];

    setSelectedPhoto(next);
  };

  return (
    <section className="phone-photos">
      <header className="phone-photos__header">
        <button
          type="button"
          className="phone-photos__back"
          onClick={goBack}
          aria-label="Go back"
        >
          ‹
        </button>

        <div>
          <h1>Google Photos</h1>
          <span>
            {visiblePhotos.length} items
          </span>
        </div>

        <span className="phone-photos__brand">
          GOOGLE
        </span>
      </header>

      <nav className="phone-photos__categories">
        {CATEGORIES.map(
          (category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory ===
                category
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                setActiveCategory(
                  category
                )
              }
            >
              {category}
            </button>
          )
        )}
      </nav>

      <main className="phone-photos__grid">
        {visiblePhotos.map(
          (photo, index) => (
            <button
              key={photo.id}
              type="button"
              className={[
                "phone-photos__photo",
                `phone-photos__photo--${index % 4}`,
              ].join(" ")}
              onClick={() =>
                setSelectedPhoto(photo)
              }
              aria-label={`Open ${photo.title}`}
            >
              <span className="phone-photos__visual">
                {photo.kind === "video" ? (
                  <video
                    src={photo.src}
                    muted
                    playsInline
                    preload="none"
                  />
                ) : (
                  <img
                    src={photo.src}
                    alt={photo.title}
                  />
                )}
              </span>

              <span className="phone-photos__caption">
                <strong>
                  {photo.title}
                </strong>

                <small>
                  {photo.category}
                </small>
              </span>
            </button>
          )
        )}
      </main>

      {selectedPhoto && (
        <div
          className="phone-photos__viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing ${selectedPhoto.title}`}
        >
          <button
            type="button"
            className="phone-photos__viewer-close"
            onClick={closeViewer}
            aria-label="Close photo"
          >
            ×
          </button>

          <div className="phone-photos__viewer-content">
            <div className="phone-photos__viewer-visual">
              {selectedPhoto.kind === "video" ? (
                <video
                  src={selectedPhoto.src}
                  controls
                  playsInline
                />
              ) : (
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                />
              )}
            </div>

            <div className="phone-photos__viewer-info">
              <strong>
                {selectedPhoto.title}
              </strong>

              <span>
                {selectedPhoto.description}
              </span>
            </div>
          </div>

          <div className="phone-photos__viewer-controls">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous photo"
            >
              ‹
            </button>

            <span>
              {selectedIndex + 1} /{" "}
              {visiblePhotos.length}
            </span>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next photo"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}