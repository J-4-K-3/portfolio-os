/**
 * Thin wrapper around @vercel/analytics.
 *
 * Vercel Web Analytics handles page views automatically.
 * These helpers fire the custom portfolio events the user
 * asked for so we can answer questions like:
 *
 *   "Someone came from Reddit — did they actually open Telvin?"
 */

import { track as vercelTrack } from "@vercel/analytics/react";

const ENABLED = true;

export function track(name, properties) {
  if (!ENABLED) return;
  try {
    vercelTrack(name, properties);
  } catch {
    /* Analytics is best-effort; never break the UI. */
  }
}

export function trackPortfolioEntered(source) {
  track("portfolio_entered", source ? { source } : undefined);
}

export function trackTelvinOpened() {
  track("telvin_opened");
}

export function trackResumeOpened() {
  track("resume_opened");
}

export function trackExternalClick(label, url) {
  track("external_click", { label, url });
}

export default {
  track,
  trackPortfolioEntered,
  trackTelvinOpened,
  trackResumeOpened,
  trackExternalClick,
};