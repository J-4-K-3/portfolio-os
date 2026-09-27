import { useState } from "react";
import "./Demos.css";

import demo1 from "../../assets/media/auri_vid_1.mp4";
import demo2 from "../../assets/media/auri_promo.mp4";
import auriImg from "../../assets/app_icons/auri_logo.png";
import appgradeImg from "../../assets/app_icons/appgrade_logo.png";

function Demos() {
  const videos = [
    { id: 1, src: demo1, title: "Auri demo" },
    { id: 2, src: demo2, title: "Auri promo" },
  ];

  const screenshots = [
    { id: 1, src: auriImg, title: "Auri" },
    { id: 2, src: appgradeImg, title: "Appgrade" },
  ];

  const [playing, setPlaying] = useState(null);

  return (
    <section className="demos-app">
      <header className="demos-header">
        <h2>Video demos & screenshots</h2>
        <small>Selected project demos and screenshots</small>
      </header>

      <div className="demos-grid">
        <div className="demos-videos">
          <h3>Videos</h3>

          <div className="videos-list">
            {videos.map((v) => (
              <div key={v.id} className="video-item">
                <button onClick={() => setPlaying(v.src)}>
                  <video src={v.src} width={280} preload="metadata" />
                  <div className="video-title">{v.title}</div>
                </button>
              </div>
            ))}
          </div>

          {playing && (
            <div className="video-player">
              <video src={playing} controls autoPlay />
              <button onClick={() => setPlaying(null)}>Close</button>
            </div>
          )}
        </div>

        <div className="demos-screenshots">
          <h3>Screenshots</h3>

          <div className="screens-list">
            {screenshots.map((s) => (
              <div key={s.id} className="screenshot-item">
                <img src={s.src} alt={s.title} />
                <div className="screenshot-title">{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Demos;
