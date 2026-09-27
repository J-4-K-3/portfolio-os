/*
import React, {
  useEffect,
} from "react";

import {
  useSurfaceManager,
} from "./useSurfaceManager";

import {
  useNotifications,
} from "./useNotifications";

//import { useSystemState } from "./SystemState";
import { useSystemState } from "./useSystemState";

import GestureSystem from "./GestureSystem";

import "./NavigationSystem.css";

export default function NavigationSystem() {
  const {
    openHome,
    openRecents,
    openNotifications,
    openPulse,
    openSettings,
    goBack,
  } = useSurfaceManager();

  const {
    notificationCount,
  } = useNotifications();

  const {
    systemState,
    setNavigationState,
  } = useSystemState();

  const {
    navigationVisible,
    navigationExpanded,
  } = systemState;

  /*
   * Hide navigation after five seconds.
   *
  useEffect(() => {
    if (!navigationVisible) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setNavigationState({
        visible: false,
        expanded: false,
      });
    }, 5000);

    return () =>
      clearTimeout(timer);
  }, [
    navigationVisible,
    setNavigationState,
  ]);

  const revealNavigation = () => {
    setNavigationState({
      visible: true,
      expanded: false,
    });
  };

  const expandNavigation = () => {
    setNavigationState({
      visible: true,
      expanded: true,
    });
  };

  const collapseNavigation = () => {
    setNavigationState({
      visible: true,
      expanded: false,
    });
  };

  const closeNavigation = () => {
    setNavigationState({
      visible: false,
      expanded: false,
    });
  };

  const handleBack = () => {
    goBack();
    closeNavigation();
  };

  const handleHome = () => {
    openHome();
    closeNavigation();
  };

  const handleRecents = () => {
    openRecents();
    closeNavigation();
  };

  const handleNotifications = () => {
    openNotifications();
    closeNavigation();
  };

  const handlePulse = () => {
    openPulse();
    closeNavigation();
  };

  const handleSettings = () => {
    openSettings();
    closeNavigation();
  };

  return (
    <GestureSystem
      onBottomSwipeUp={
        revealNavigation
      }
      onSwipeLeft={
        collapseNavigation
      }
      onSwipeRight={
        collapseNavigation
      }
    >
      <nav
        className={[
          "phone-navigation",

          navigationVisible
            ? "phone-navigation--visible"
            : "",

          navigationExpanded
            ? "phone-navigation--expanded"
            : "",
        ].join(" ")}
        aria-label="Phone navigation"
      >
        {navigationExpanded ? (
          <>
            <button
              type="button"
              className="phone-navigation__control phone-navigation__back"
              onClick={handleBack}
              aria-label="Back"
            >
              ‹
            </button>

            <button
              type="button"
              className="phone-navigation__control phone-navigation__home"
              onClick={handleHome}
              aria-label="Home"
            >
              ○
            </button>

            <button
              type="button"
              className="phone-navigation__control phone-navigation__recent"
              onClick={handleRecents}
              aria-label="Recent surfaces"
            >
              ›
            </button>

            <button
              type="button"
              className="phone-navigation__system"
              onClick={
                handleNotifications
              }
              aria-label="Notifications"
            >
              <span>●</span>

              {notificationCount >
                0 && (
                <strong>
                  {notificationCount >
                  99
                    ? "99+"
                    : notificationCount}
                </strong>
              )}
            </button>

            <button
              type="button"
              className="phone-navigation__system"
              onClick={handlePulse}
              aria-label="Pulse"
            >
              ◐
            </button>

            <button
              type="button"
              className="phone-navigation__system"
              onClick={handleSettings}
              aria-label="Settings"
            >
              ⚙
            </button>
          </>
        ) : (
          <button
            type="button"
            className="phone-navigation__peek"
            onClick={
              expandNavigation
            }
            aria-label="Expand navigation"
          >
            &lt;
          </button>
        )}
      </nav>
    </GestureSystem>
  );
}*/
import React, { useEffect } from "react";

import { useSurfaceManager } from "./useSurfaceManager";
import { useNotifications } from "./useNotifications";
import { useSystemState } from "./useSystemState";
import GestureSystem from "./GestureSystem";

import "./NavigationSystem.css";

export default function NavigationSystem() {
  const {
    systemState,
    setNavigationState,
  } = useSystemState();

  const {
    openHome,
    openRecents,
    openNotifications,
    openPulse,
    openSettings,
    goBack,
  } = useSurfaceManager();

  const { notificationCount } =
    useNotifications();

  const {
    navigationVisible,
    navigationExpanded,
  } = systemState;

  /*
   * Hide the navigation peek after inactivity.
   */
  useEffect(() => {
    if (!navigationVisible) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      setNavigationState({
        visible: false,
        expanded: false,
      });
    }, 5000);

    return () => clearTimeout(timeout);
  }, [
    navigationVisible,
    navigationExpanded,
    setNavigationState,
  ]);

  const revealNavigation = () => {
    setNavigationState({
      visible: true,
      expanded: false,
    });
  };

  const expandNavigation = () => {
    setNavigationState({
      visible: true,
      expanded: true,
    });
  };

  const collapseNavigation = () => {
    setNavigationState({
      visible: true,
      expanded: false,
    });
  };

  const handleHorizontalSwipe = () => {
    collapseNavigation();
  };

  return (
    <GestureSystem
      onBottomSwipeUp={revealNavigation}
      onSwipeLeft={handleHorizontalSwipe}
      onSwipeRight={handleHorizontalSwipe}
    >
      <nav
        className={[
          "phone-navigation",
          navigationVisible
            ? "phone-navigation--visible"
            : "",
          navigationExpanded
            ? "phone-navigation--expanded"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {!navigationExpanded ? (
          <button
            className="phone-navigation__peek"
            onClick={expandNavigation}
            aria-label="Expand navigation"
          >
            ‹
          </button>
        ) : (
          <div className="phone-navigation__controls">
            <button
              className="phone-navigation__control phone-navigation__back"
              onClick={goBack}
              aria-label="Back"
            >
              ‹
            </button>

            <button
              className="phone-navigation__control phone-navigation__home"
              onClick={openHome}
              aria-label="Home"
            >
              ○
            </button>

            <button
              className="phone-navigation__control phone-navigation__recent"
              onClick={openRecents}
              aria-label="Recent surfaces"
            >
              ›
            </button>

            <button
              className="phone-navigation__control phone-navigation__system"
              onClick={openNotifications}
              aria-label="Notifications"
            >
              ●

              {notificationCount > 0 && (
                <span className="phone-navigation__badge">
                  {notificationCount > 9
                    ? "9+"
                    : notificationCount}
                </span>
              )}
            </button>

            <button
              className="phone-navigation__control phone-navigation__system"
              onClick={openPulse}
              aria-label="Pulse"
            >
              ◐
            </button>

            <button
              className="phone-navigation__control phone-navigation__system"
              onClick={openSettings}
              aria-label="Settings"
            >
              ⚙
            </button>
          </div>
        )}
      </nav>
    </GestureSystem>
  );
}