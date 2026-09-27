/*
 * Compatibility exports for older phone OS modules.
 *
 * The active hook now lives in useSystemState.js and the
 * context lives in SystemStateContext.js.
 *
 * Keeping this file available lets older modules migrate
 * without forcing unrelated parts of the phone OS to change
 * at the same time.
 */

export { SystemStateContext } from "./SystemStateContext";
export { useSystemState } from "./useSystemState";