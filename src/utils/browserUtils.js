export function normalizeUrl(input) {
  const value = String(input || "").trim();
  if (!value) return "innoxation://newtab";
  if (value.startsWith("innoxation://")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  const internalAlias = value.match(/^(natter|auri|telvin|groa|appgrade)\.innoxation(?:\/.*)?$/i);
  if (internalAlias) return `innoxation://${internalAlias[1].toLowerCase()}`;
  if (/^(localhost|\d{1,3}(?:\.\d{1,3}){3})(:\d+)?(?:\/|$)/i.test(value) || /^(www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/:?#].*)?$/i.test(value)) return `https://${value}`;
  return `innoxation://search?q=${encodeURIComponent(value)}`;
}
export function isInternalUrl(url) { return typeof url === "string" && url.startsWith("innoxation://"); }
export function isExternalUrl(url) { return typeof url === "string" && /^https?:\/\//i.test(url); }
export function getDomain(url) {
  if (!url) return "";
  try { return new URL(url).hostname; } catch { return url.replace(/^innoxation:\/\//, "").split(/[/?#]/)[0]; }
}
export function canNavigateTo(url) { return isInternalUrl(url) || isExternalUrl(url); }
