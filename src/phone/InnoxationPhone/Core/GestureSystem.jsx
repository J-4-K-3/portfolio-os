import React, {
  useRef,
} from "react";

export default function GestureSystem({
  children,

  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,

  onBottomSwipeUp,

  threshold = 45,
  edgeThreshold = 90,
}) {
  const pointer = useRef(null);

  const handlePointerDown = (
    event
  ) => {
    /*
     * Only track the primary pointer.
     *
     * This prevents secondary mouse buttons
     * or additional touch points from
     * interfering with navigation.
     */
    if (
      event.isPrimary === false
    ) {
      return;
    }

    pointer.current = {
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),

      /*
       * Bottom-edge detection is based on
       * the viewport rather than a particular
       * component's dimensions.
       */
      startedAtBottom:
        event.currentTarget.getBoundingClientRect().bottom -
          event.clientY <=
        edgeThreshold,
    };
  };

  const handlePointerUp = (
    event
  ) => {
    if (!pointer.current) {
      return;
    }

    const start = pointer.current;

    pointer.current = null;

    const deltaX =
      event.clientX - start.x;

    const deltaY =
      event.clientY - start.y;

    const distance = Math.sqrt(
      deltaX * deltaX +
        deltaY * deltaY
    );

    const elapsed =
      performance.now() - start.time;

    /*
     * Ignore tiny movements and accidental
     * long presses.
     */
    if (
      distance < threshold ||
      elapsed > 1200
    ) {
      return;
    }

    /*
     * Determine the dominant axis.
     */
    const horizontal =
      Math.abs(deltaX) >
      Math.abs(deltaY);

    /*
     * Bottom-edge swipe takes priority.
     */
    if (
      start.startedAtBottom &&
      !horizontal &&
      deltaY < -threshold
    ) {
      onBottomSwipeUp?.();
      return;
    }

    if (horizontal) {
      if (deltaX < -threshold) {
        onSwipeLeft?.();
      } else if (
        deltaX > threshold
      ) {
        onSwipeRight?.();
      }

      return;
    }

    if (deltaY < -threshold) {
      onSwipeUp?.();
    } else if (
      deltaY > threshold
    ) {
      onSwipeDown?.();
    }
  };

  return (
    <div
      className="phone-gesture-system"
      onPointerDown={
        handlePointerDown
      }
      onPointerUp={
        handlePointerUp
      }
      onPointerCancel={() => {
        pointer.current = null;
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}