
import  {
  useEffect,
  useRef,
  useState,
} from "react";
import { Battery, Signal, Wifi } from "lucide-react";

import { useSystemState } from "../Core/useSystemState";

import "./LockScreen.css";

export default function LockScreen({
  onUnlock,
}) {
  const {
    systemState,
    setLocked,
  } = useSystemState();

  const [time, setTime] =
    useState(new Date());
  const pointerStart = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  const hours = time
    .getHours()
    .toString()
    .padStart(2, "0");

  const minutes = time
    .getMinutes()
    .toString()
    .padStart(2, "0");

  const unlock = () => {
    setLocked(false);
    onUnlock?.();
  };

  const beginGesture = (event) => {
    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const finishGesture = (event) => {
    if (!pointerStart.current) return;
    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (deltaY < -48 && Math.abs(deltaY) > Math.abs(deltaX)) unlock();
  };

  return (
    <section
      className="series-e1-lock"
      onDoubleClick={unlock}
      onPointerDown={beginGesture}
      onPointerUp={finishGesture}
    >
      <div className="series-e1-lock__wallpaper">
        <div className="series-e1-lock__orb series-e1-lock__orb--one" />
        <div className="series-e1-lock__orb series-e1-lock__orb--two" />
        <div className="series-e1-lock__orb series-e1-lock__orb--three" />

        <div className="series-e1-lock__grain" />
      </div>

      <header className="series-e1-lock__status">
        <span className="series-e1-lock__carrier">Xiaomi</span>
        <span className="series-e1-lock__status-icons" aria-label="Mobile signal, Wi-Fi and battery"><span>5G</span><Signal size={13} /><Wifi size={13} /><span className="series-e1-lock__battery"><Battery size={13} />{systemState.battery}%</span></span>
      </header>


      <main className="series-e1-lock__content">
        <div className="series-e1-lock__clock">
          <div className="series-e1-lock__time-row"><span>{hours}</span><i>:</i><span>{minutes}</span></div>
          <div className="series-e1-lock__date">{time.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</div>
        </div>

        {systemState.notifications
          .length > 0 && (
          <button
            type="button"
            className="series-e1-lock__notification"
            onClick={unlock}
          >
            <span className="series-e1-lock__notification-icon">mi</span>

            <span>
              <strong>
                {
                  systemState
                    .notifications[0]
                    .title
                }
              </strong>

              <small>
                {
                  systemState
                    .notifications[0]
                    .message
                }
              </small>
            </span>
          </button>
        )}
      </main>

      <button
        type="button"
        className="series-e1-lock__unlock"
        onClick={unlock}
        aria-label="Unlock Xiaomi phone"
      >
        {""}
      </button>

      <div className="series-e1-lock__hint">
        Swipe up/tap to unlock
      </div>
    </section>
  );
}