import React, { useEffect, useRef, useState } from "react";
import "./BootScreen.css";

function BootScreen({ onComplete }) {
  const [phase, setPhase] = useState("x");
  const completedRef = useRef(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("forming"), 700),
      setTimeout(() => setPhase("brand"), 2000),
      setTimeout(() => setPhase("series"), 3000),
      setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      }, 4000),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div
      className={`series-e1-boot series-e1-boot--${phase}`}
      aria-label="Xiaomi HyperOS boot screen"
    >
      <div className="series-e1-boot__content">
        <div className="series-e1-boot__x">
          mi
        </div>

        <div className="series-e1-boot__brand">
          <span className="series-e1-boot__fragment series-e1-boot__fragment--left">Xia</span>

          <span className="series-e1-boot__fragment series-e1-boot__fragment--center">o</span>

          <span className="series-e1-boot__fragment series-e1-boot__fragment--right">mi</span>
        </div>

        <div className="series-e1-boot__series">
          <span>Xiaomi HyperOS</span>
        </div>
      </div>

      <div className="series-e1-boot__powered">POWERED BY XIAOMI HYPEROS</div>
    </div>
  );
}

export default BootScreen;