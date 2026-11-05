import { bunny } from "@/lib/brand/logo";
import { harmonizeGlow, harmonizeProfileBackground, LOGO_TONES, pickLogoTone, type LogoTone } from "./wallet-color";

/** Google-only design tokens; Apple and the 3D profile palette remain unchanged. */
export const GOOGLE_PASS_DESIGN = {
  background: "#111318",
  gold: "#d8bc7b",
  goldLight: "#fff0c4",
  goldShadow: "#6e542b",
  foreground: "#f5efdf",
  logoSize: 660,
  logoPadding: 0.175,
  heroWidth: 1032,
  heroHeight: 812,
  portraitWidth: 1032,
  portraitHeight: 812,
  stripWidth: 1200,
  stripHeight: 375,
} as const;

export type GoogleArtworkCard = {
  handle: string;
  space: "root" | "alias";
  displayName: string;
  sovereignId: string;
  accentHex?: string;
  /** Profile canvas colour (already mixed with the accent for Apple); harmonised again here. */
  hexBackgroundColor?: string;
  /** Verified root identity: adds the engraved check to the member seal. */
  verified?: boolean;
};
export type GoogleArtworkKind = "hero" | "portrait" | "strip";
const escapeXml = (value: string) => value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c] ?? c);

/** A design version is public artwork metadata, never an account ID or credential. */
export function googleArtworkVersion(card: GoogleArtworkCard): string {
  const data = JSON.stringify(["premium-v3", card.handle, card.space, card.displayName, card.sovereignId, card.accentHex, card.hexBackgroundColor ?? null, Boolean(card.verified)]);
  let hash = 2166136261;
  for (const char of data) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  return hash.toString(36);
}

/** Member initials for the seal: up to two letters from the display name, else the handle. */
export function walletMonogram(displayName: string, handle: string): string {
  const words = displayName.replace(/^@/, "").split(/[\s._-]+/u).map((w) => Array.from(w.replace(/[^\p{L}\p{N}]/gu, ""))[0]).filter(Boolean) as string[];
  const letters = words.length >= 2 ? [words[0]!, words[words.length - 1]!] : words.slice(0, 1);
  const out = letters.join("") || Array.from(handle.replace(/[^\p{L}\p{N}]/gu, ""))[0] || "R";
  return out.toLocaleUpperCase("nl-BE");
}

/** Engraved member seal (initials, optional verified check) drawn in vectors so it stays sharp at any size. */
function memberSealSvg(card: GoogleArtworkCard, cx: number, cy: number, r: number, bg: string): string {
  const d = GOOGLE_PASS_DESIGN;
  const initials = escapeXml(walletMonogram(card.displayName, card.handle));
  const fs = Math.round(r * (initials.length > 1 ? 0.78 : 0.95));
  let out = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${bg}" stroke="url(#metal)" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="${r * 0.84}" fill="none" stroke="${d.gold}" stroke-opacity=".45" stroke-width="1"/><text x="${cx}" y="${cy + fs * 0.35}" text-anchor="middle" font-family="Inter" font-size="${fs}" font-weight="700" letter-spacing="1" fill="url(#metal)">${initials}</text>`;
  if (card.verified) {
    const br = r * 0.36;
    const bx = cx + r * 0.72;
    const by = cy + r * 0.72;
    out += `<circle cx="${bx}" cy="${by}" r="${br}" fill="${d.gold}" stroke="${bg}" stroke-width="3"/><path d="M${bx - br * 0.45} ${by + br * 0.02}L${bx - br * 0.1} ${by + br * 0.38}L${bx + br * 0.5} ${by - br * 0.35}" fill="none" stroke="${bg}" stroke-width="${Math.max(2, br * 0.26)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return out;
}

/** Isolated R monogram: 660 square, 17.5% padding, no avatar or decorative rings. */
export function googlePremiumLogoSvg(bg: string = GOOGLE_PASS_DESIGN.background, tone: LogoTone = pickLogoTone(bg)): string {
  const d = GOOGLE_PASS_DESIGN;
  const inset = d.logoSize * d.logoPadding;
  const size = d.logoSize - 2 * inset;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="660" height="660" viewBox="0 0 660 660"><rect width="660" height="660" fill="${bg}"/><svg x="${inset}" y="${inset}" width="${size}" height="${size}" viewBox="0 0 100 100"><path fill="${LOGO_TONES[tone]}" d="M22 7h30c21 0 32 11 32 29 0 13-7 23-19 27l23 30H67L45 66h-5v27H22V7Zm18 17v25h11c10 0 15-4 15-13s-5-12-15-12H40Z"/></svg></svg>`;
}

/** Deterministic vector artwork is rasterised with the existing Worker-safe WASM renderer. */
export function googlePremiumArtworkSvg(card: GoogleArtworkCard, kind: GoogleArtworkKind = "hero"): string {
  const d = GOOGLE_PASS_DESIGN;
  const [w, h] = kind === "portrait" ? [d.portraitWidth, d.portraitHeight] : kind === "strip" ? [d.stripWidth, d.stripHeight] : [d.heroWidth, d.heroHeight];
  const bg = googlePassBackground(card);
  const accent = harmonizeGlow(card.accentHex);
  const portrait = kind !== "strip";
  const cx = portrait ? w / 2 : w * 0.79;
  const cy = portrait ? h * 0.42 : h * 0.5;
  const radius = portrait ? 210 : h * 0.34;
  const lines = Array.from({ length: 44 }, (_, i) => {
    const y = h * (i / 44);
    return `<path d="M0 ${y}Q${w * .5} ${y - Math.sin(i * .3) * h * .11} ${w} ${y}" fill="none" stroke="${d.gold}" stroke-opacity=".07" stroke-width="1"/>`;
  }).join("");
  const engraving = Array.from({ length: 96 }, (_, i) => {
    const a = i * Math.PI / 48;
    const r = radius * .9;
    return `<path d="M${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}L${cx + Math.cos(a) * radius} ${cy + Math.sin(a) * radius}" stroke="url(#metal)" stroke-width="${i % 4 ? 1 : 2}"/>`;
  }).join("");
  const name = Array.from(card.displayName).slice(0, 60).join("");
  const nameSize = Math.min(portrait ? 44 : 36, Math.max(14, Math.floor((portrait ? 830 : 580) / Math.max(1, Array.from(name).length * .65))));
  const tx = portrait ? w / 2 : 48;
  const ty = portrait ? 650 : h * .55;
  const align = portrait ? "middle" : "start";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><radialGradient id="ambient" cx="${portrait ? "50%" : "80%"}" cy="40%" r="60%"><stop stop-color="${accent}" stop-opacity=".22"/><stop offset="1" stop-color="${bg}" stop-opacity="0"/></radialGradient><linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${d.goldLight}"/><stop offset=".3" stop-color="${d.goldShadow}"/><stop offset=".5" stop-color="${d.goldLight}"/><stop offset=".72" stop-color="${d.gold}"/><stop offset="1" stop-color="${d.goldShadow}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="${bg}"/><rect width="${w}" height="${h}" fill="url(#ambient)"/>${lines}<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${bg}" stroke="url(#metal)" stroke-width="3"/>${engraving}<circle cx="${cx}" cy="${cy}" r="${radius * .82}" fill="none" stroke="url(#metal)" stroke-width="1"/>${bunny(cx - radius * .46, cy - radius * .52, radius * .92, "url(#metal)")}${portrait ? memberSealSvg(card, w - 92, 92, 50, bg) : memberSealSvg(card, w - 62, 58, 34, bg)}<text x="${portrait ? w / 2 : 48}" y="${portrait ? 75 : 59}" text-anchor="${align}" font-family="Inter" font-size="22" font-weight="600" fill="${d.gold}">ROUT / SOVEREIGN PROFILE HUB</text><text x="${tx}" y="${ty}" text-anchor="${align}" font-family="Inter" font-size="${nameSize}" font-weight="600" fill="${d.foreground}">${escapeXml(name)}</text><text x="${tx}" y="${ty + 38}" text-anchor="${align}" font-family="Inter" font-size="18" fill="${d.gold}">${escapeXml(card.sovereignId)}</text><text x="${tx}" y="${ty + 72}" text-anchor="${align}" font-family="Inter" font-size="16" fill="${d.foreground}">${escapeXml(`${card.space === "alias" ? "@u/" : "@"}${card.handle}`)}</text></svg>`;
}

/** Harmonised (OKLab-clamped) pass background derived from the member colour. */
export const googlePassBackground = (card: Pick<GoogleArtworkCard, "accentHex" | "hexBackgroundColor">) => harmonizeProfileBackground(card.hexBackgroundColor, card.accentHex);
